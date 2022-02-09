const SECRET = require("./SECRET_KEYS");
var request = require("request");
var Compiler = require("../../models/compiler");
var CodeEditor = require("../../models/codeEditor");
var Lab = require("../../models/labs");
var User = require("../../models/user");
var Class = require("../../models/class");

const languageCodes = {
  "Python 3": "python3",
  Python: "python3",
  "Python ": "python3",
  python: "python3",
  "Python 2": "python2",
  Java: "java",
  C: "c",
  "C-99": "c99",
  "C++": "cpp",
  "c++": "cpp",
  "C++14": "cpp14",
  "C++17": "cpp17",
};
//to create a new compiler request
module.exports.compile = async function (req, res) {
  // console.log(req.body.code);
  var editor = await CodeEditor.findById(req.body.code);
  // console.log(editor);
  var program = {
    script: editor.content.ops[0].insert,
    language: languageCodes[req.body.language],
    clientId: SECRET.CLIENT_ID,
    clientSecret: SECRET.CLIENT_SECRET_KEY,
    stdin: req.body.input,
  };
  if (req.body.languageVersion) {
    program.versionIndex = req.body.languageVersion;
  }
  let newCompileRequest = await Compiler.create({
    code: program.script,
    language: req.body.language,
    user: req.user._id,
    languageVersion: req.body.languageVersion,
    input: req.body.input,
    lab: req.body.lab,
  });

  // if object created
  if (newCompileRequest) {
    newCompileRequest = await newCompileRequest.save();
    request(
      {
        url: "https://api.jdoodle.com/v1/execute",
        method: "POST",
        json: program,
      },
      async function (error, response, body) {
        // console.log(error,response,body);
        newCompileRequest.statusCode = body.statusCode;
        newCompileRequest.output = body.output;
        newCompileRequest.CPUTime = body.cpuTime;
        newCompileRequest.memory = body.memory;
        newCompileRequest = await newCompileRequest.save();
        newCompileRequest.input = req.body.input;
        if (response.statusCode == 200) {
          return res.status(201).json({
            message: "API request successfull",
            success: true,
            data: newCompileRequest,
          });
        } else {
          return res.status(400).json({
            message: "API request unsuccessfull",
            success: false,
            data: newCompileRequest,
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      success: false,
      message: "Error in calling API",
      data: newCompileRequest,
    });
  }
};

module.exports.submitCode = async function (req, res) {
  let uniqueCode = req.body.code;
  let codeEditorExist = await CodeEditor.findOne({ code: uniqueCode });
  let id = req.body.id;
  var editor = await CodeEditor.findById(id);
  let textInput = "";
  if (
    editor &&
    editor.content &&
    editor.content.ops &&
    editor.content.ops[0].insert
  ) {
    textInput = editor.content.ops[0].insert;
  }

  if (codeEditorExist) {
    codeEditorExist.contentSaved = textInput;
    codeEditorExist.submittedAt = req.body.submittedAt;
    codeEditorExist.finalSubmit = req.body.finalSubmit;
    codeEditorExist.save();
    return res.status(200).json({
      message: "Lab Work submitted Successfully!!",
      success: true,
    });
  } else {
    return res.json(422, {
      message: "Error while submitting code!!",
    });
  }
};

module.exports.fetchLabDetails = async function (req, res) {
  let userId = req.body.userId;
  let labId = req.body.labId;
  let classroomId = req.body.classroomId;
  if (labId && userId && classroomId) {
    let user = await User.findById(userId);
    let classDetails = await Class.findById(classroomId).populate(
      "students",
      "name SID id email avatar"
    );
    let lab = await Lab.findById(labId)
      .populate(
        "codeEditor",
        "code lab owner contentSaved finalSubmit submittedAt"
      )
      .populate({
        path: "codeEditor",
        populate: {
          path: "owner",
          select: "SID name email role avatar",
        },
      });
    if (user && lab && user.role === "Teacher") {
      let students = classDetails.students;
      let codeEditorDetails = lab.codeEditor;
      let finalResult = [];
      // traverse over students for each student check the status of its codeEditorDetails and return that.
      for (let counter = 0; counter < students.length; counter++) {
        let student = students[counter];
        let finalAnswerType = {
          name: "",
          sid: "",
          email: "",
          submitted: null,
          submittedAt: "",
          code: "",
          marks: "",
          id: "",
          maxMarks: "",
        };
        let flag = false;
        for (let count = 0; count < codeEditorDetails.length; count++) {
          let codeEditor = codeEditorDetails[count];
          finalAnswerType.maxMarks = codeEditor.maxMarks;
          if (
            codeEditor.owner &&
            codeEditor.owner._id &&
            student._id &&
            student._id.toString() === codeEditor.owner._id.toString()
          ) {
            flag = true;
            finalAnswerType.name = student.name;
            finalAnswerType.sid = student.SID;
            finalAnswerType.email = student.email;
            finalAnswerType.id = codeEditor._id;
            if (codeEditor.finalSubmit == true) {
              finalAnswerType.submitted = true;
              finalAnswerType.submittedAt = codeEditor.submittedAt;
              finalAnswerType.code = codeEditor.contentSaved;
              finalAnswerType.marks = codeEditor.marksObtained;
            }
          }
        }
        if (!flag) {
          finalAnswerType.name = student.name;
          finalAnswerType.sid = student.SID;
          finalAnswerType.email = student.email;
        }
        finalResult = [...finalResult, finalAnswerType];
      }
      finalResult.sort((a, b) => (a.sid > b.sid ? 1 : b.sid > a.sid ? -1 : 0));
      console.log(finalResult);

      return res.status(200).json({
        message: "Lab Details Fetched Successfully!!",
        success: true,
        data: finalResult,
      });
    }
  }
  return res.json(422, {
    message: "Error while Fetching Details!",
  });
};

// to download the report
module.exports.downloadReport = async function (req, res) {
  let customInput = req.body.customInput;
  let customOutput = req.body.customOutput;
  let data = JSON.parse(req.body.data);
  let finalAnswer = [];
  for (let counter = 0; counter < data.length; counter++) {
    let row = data[counter];
    if (row.id) {
      let codeEditorExist = await CodeEditor.findById(row.id);
      //evaluate and update maxMarks of codeEditorExist and also for row.maxMarks and append that in finalAnswer
      if (codeEditorExist) {
        var program = {
          script: row.code,
          language: languageCodes[codeEditorExist.languageSelected],
          clientId: SECRET.CLIENT_ID,
          clientSecret: SECRET.CLIENT_SECRET_KEY,
          stdin: customInput,
          versionIndex: "4",
        };
        let newCompileRequest = await Compiler.create({
          code: row.code,
          language: languageCodes[codeEditorExist.languageSelected],
          user: row.id,
          languageVersion: "4",
          input: customInput,
          lab: row.id,
        });
        if (newCompileRequest) {
          newCompileRequest = await newCompileRequest.save();
          await request(
            {
              url: "https://api.jdoodle.com/v1/execute",
              method: "POST",
              json: program,
            },
            async function (error, response, body) {
              newCompileRequest.statusCode = body.statusCode;
              newCompileRequest.output = body.output;
              newCompileRequest.CPUTime = body.cpuTime;
              newCompileRequest.memory = body.memory;
              newCompileRequest = await newCompileRequest.save();
              if (body.output === customOutput) {
                codeEditorExist.marksObtained = codeEditorExist.maxMarks;
                codeEditorExist.save();
                row.marks = codeEditorExist.maxMarks;
                finalAnswer = [...finalAnswer, row];
              } else {
                codeEditorExist.marksObtained = 0;
                codeEditorExist.save();
                row.marks = 0;
                finalAnswer = [...finalAnswer, row];
              }

            }
          );
        }
      }
    } else {
      finalAnswer = [...finalAnswer, row];
    }
  }
  setTimeout(() => {
    finalAnswer.sort((a, b) => (a.sid > b.sid ? 1 : b.sid > a.sid ? -1 : 0));
    console.log(finalAnswer);
    return res.status(200).json({
      message: "Lab Details Fetched Successfully!!",
      success: true,
      data: finalAnswer,
    });
  }, 8000);
};
