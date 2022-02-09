import React from "react";
import { connect } from "react-redux";
import TextEditor from "./TextEditor";
import LanguageSelector from "./LanguageSelector";
import CodeEditorSideBar from "./CodeEditorSideBar";
import { executeCode, clearExecution } from "../actions/execute";

//Material UI
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Fab from "@mui/material/Fab";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { FlexRow } from "@mui-treasury/component-flex";
import { Item } from "@mui-treasury/component-flex";
import { Typography } from "@mui/material";

const Div = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "center",
}));

class CodeEditorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customInput: "",
      customOutput: "",
      statusCode: "",
      memory: "",
      cpuTime: "",
      successMessage: "",
      errorMessage: "",
      showFinalSubmit: false,
    };
  }
  componentWillUnmount() {
    this.props.dispatch(clearExecution());
  }
  handleCustomInput = (e) => {
    this.setState({
      customInput: e.target.value,
    });
  };
  getFormBody = (params) => {
    let FormBody = [];
    for (let property in params) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(params[property]);
      FormBody.push(encodedKey + "=" + encodedValue);
    }
    return FormBody.join("&");
  };
  handleSubmitCode = (e) => {
    e.preventDefault();
    const id = this.props.labDetails.codeEditorDetails._id;
    const { code, finalSubmit, evaluateLab } =
      this.props.labDetails.codeEditorDetails;
    if (code && finalSubmit === false && evaluateLab === true) {
      let date = new Date();
      const url = "/api/editor/submitCode";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: this.getFormBody({
          code,
          id,
          finalSubmit: true,
          submittedAt: date.toLocaleString(),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            this.setState({
              successMessage: data.message,
              showFinalSubmit: true,
            });
            setTimeout(() => {
              this.setState({
                successMessage: "",
              });
            }, 3000);
          } else {
            this.setState({
              errorMessage: data.message,
            });
            setTimeout(() => {
              this.setState({
                errorMessage: "",
              });
            }, 3000);
          }
        });
    }
  };
  handleExecuteCode = (e) => {
    e.preventDefault();
    const lab = this.props.labDetails.codeEditorDetails.lab;
    const code = this.props.labDetails.codeEditorDetails._id;
    const currentLanguage = this.props.language.editorLanguage; //"C++";
    const languageVersion = "4";
    const input = this.state.customInput;
    this.props.dispatch(
      executeCode(code, currentLanguage, lab, input, languageVersion)
    );
  };
  render() {
  
    // console.log(this.props,this.state,"YYYYY");
    let {students,teachers} = this.props.classroom;
    const classroomId = this.props.classroom.ID;
    const {user} = this.props.auth;
    const {executionStarted,customOutput,memory,cpuTime} = this.props.execute;
    const { userId,labId} = this.props.match.params;
    const {editorLabDetails} = this.props.labDetails;
    const {finalSubmit, evaluateLab} = this.props.labDetails.codeEditorDetails;
    // console.log(students,teachers,classroomId,"CES");
  
    // console.log("this.state.finalSubmit",this.state.showFinalSubmit,"finalSubmit",finalSubmit);
    return (
      <div>
        <Div>{editorLabDetails.description}</Div>
        <Grid
          spacing={2}
          container
          direction="row"
          justifyContent="space-between"
        >
          <Grid
            item
            xs={12}
            md={3}
            m={3}
            container
            direction="column"
            alignItems="stretch"
          >
            <Grid item m={2}>
              <Paper>
                <Card
                  sx={{
                    minHeight: "50vh",
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#272727" : "#fff",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "unset"
                        : "0 8px 16px 0 #BDC9D7",
                  }}
                >
                  <FlexRow
                    alignItems="center"
                    p={2}
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#2f3c50" : "#fff",
                    }}
                  >
                    <Item grow mr={1}>
                      <Typography variant="h6" align="center">
                        <b>Question</b>
                      </Typography>
                    </Item>
                  </FlexRow>
                  <CardContent>{editorLabDetails.question}</CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item m={11}>
              <Fab variant="extended">
                <CodeEditorSideBar
                  students={students}
                  teachers={teachers}
                  classroomId={classroomId}
                  user={user}
                  labId={labId}
                  editorLabDetails={editorLabDetails}
                  dispatch={this.props.dispatch}
                />
              </Fab>
            </Grid>
          </Grid>
          <Grid item xs={12} md={8} m={3}>
            <LanguageSelector />
            <Paper>
              <Card
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#272727" : "#fff",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "unset"
                      : "0 8px 16px 0 #BDC9D7",
                }}
              >
                <CardContent>
                  {!userId && !labId && (
                    <p> Error !! Please Refresh the Page</p>
                  )}
                  {userId && labId && (
                    <TextEditor documentId={`${userId}+${labId}`} />
                  )}
                </CardContent>
              </Card>
            </Paper>
            <Grid container direction="row" justifyContent="space-evenly">
              <Grid item xs={3} m={2}>
                <Paper>
                  <Card
                    sx={{
                      minHeight: 150,
                      maxHeight: 150,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#272727" : "#fff",
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "unset"
                          : "0 8px 16px 0 #BDC9D7",
                    }}
                  >
                    <FlexRow
                      alignItems="center"
                      p={2}
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "#2f3c50" : "#fff",
                      }}
                    >
                      <Item grow mr={1}>
                        <Typography variant="h12" align="center">
                          <b>Code Custom Input</b>
                        </Typography>
                      </Item>
                    </FlexRow>
                    <CardContent>
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Custom Input"
                        inputProps={{ "aria-label": "search google maps" }}
                        value={this.state.customInput}
                        onChange={this.handleCustomInput}
                      />
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={3} m={2}>
                <Paper>
                  <Card
                    sx={{
                      minHeight: 150,
                      maxHeight: 150,
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#272727" : "#fff",
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "unset"
                          : "0 8px 16px 0 #BDC9D7",
                    }}
                  >
                    <FlexRow
                      alignItems="center"
                      p={2}
                      sx={{
                        minHeight: 50,
                        maxHeight: 70,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "#2f3c50" : "#fff",
                      }}
                    >
                      <Item grow mr={1}>
                        <Typography variant="h12" align="center">
                          <b>Code Custom Output</b>
                        </Typography>
                      </Item>
                    </FlexRow>
                    <CardContent>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        {customOutput}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        Memory: {memory} kB
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                      >
                        CPU Time :{cpuTime} seconds
                      </Typography>
                    </CardContent>
                  </Card>
                </Paper>
              </Grid>
              <Grid item xs={3} m={2}>
                <Fab
                  variant="extended"
                  onClick={this.handleExecuteCode}
                  disabled={executionStarted}
                >
                  <PlayCircleIcon sx={{ mr: 1 }} color="primary" />
                  Execute Code
                </Fab>
                {evaluateLab === true && (
                  <Grid item xs={8} m={0.5}>
                    <Fab
                      variant="extended"
                      onClick={this.handleSubmitCode}
                      disabled={this.state.showFinalSubmit || finalSubmit}
                    >
                      <PlayCircleIcon sx={{ mr: 1 }} color="primary" />
                      Final Submit
                    </Fab>
                  </Grid>
                )}
                {this.state.successMessage && (
                  <Snackbar open={true} autoHideDuration={2000}>
                    <Alert severity="success" sx={{ width: "100%" }}>
                      {this.state.successMessage}
                    </Alert>
                  </Snackbar>
                )}
                {this.state.errorMessage && (
                  <Snackbar open={true} autoHideDuration={2000}>
                    <Alert severity="error" sx={{ width: "100%" }}>
                      {this.state.errorMessage}
                    </Alert>
                  </Snackbar>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    darkModetheme: state.theme,
    labDetails: state.labDetails,
    classroom: state.classroom,
    execute: state.execute,
    language: state.language,
  };
}
export default connect(mapStateToProps)(CodeEditorScreen);
