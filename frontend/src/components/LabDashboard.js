import React, { Component } from 'react';
import { connect } from "react-redux";
import CodeEditorSideBar from "./CodeEditorSideBar";
import XLSX from 'xlsx';
//Material UI
import CircularProgress from '@mui/material/CircularProgress';
import { Grid} from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { Paper} from '@mui/material';
import InputBase from "@mui/material/InputBase";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Fab from '@mui/material/Fab';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadIcon from '@mui/icons-material/Download';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  textAlign: "center",
}));
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
class LabDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading2: false,
            data: [],
            customInput: "",
            customOutput: "",
            error:"",
            success:"",
            downloadButton: false,
            open:null,
        };
    };
    handleCustomInput = (e) => {
        this.setState({
            customInput: e.target.value,
        });
    };
    handleCustomOutput = (e) => {
      this.setState({
          customOutput: e.target.value,
      });
  };
  handleOpen = (e) => ()=>{
    this.setState({
      open: e,
    })
  }
  handleClose = (e) =>{
    this.setState({
      open: null,
    })
  }
    getFormBody =(params) => {
        let FormBody = [];
        for (let property in params) {
          let encodedKey = encodeURIComponent(property);
          let encodedValue = encodeURIComponent(params[property]);
          FormBody.push(encodedKey + "=" + encodedValue);
        }
        return FormBody.join("&");
      }
    componentDidMount(){
        const {labId,userId,classroomId} = this.props.match.params;
        if(labId && userId ){
            const url = "/api/editor/fetchLabDetails";
            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: this.getFormBody({labId,userId,classroomId}),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    this.setState({
                        loading: false,
                        data: data.data
                    })
                }
                else{
                    this.setState({
                        loading: false,
                    })
                }
            });
        }

    }
    handleSort = (e) => ()=>{
      if(e==='sid'){
        this.setState({
          data: this.state.data.sort((a,b) => (a.sid > b.sid) ? 1 : ((b.sid > a.sid) ? -1 : 0))
        })
      }
      if(e==='email'){
        this.setState({
          data: this.state.data.sort((a,b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0))
        })

      }
      if(e==='marks'){
        this.setState({
          data: this.state.data.sort((a,b) => (a.marks > b.marks) ? 1 : ((b.marks > a.marks) ? -1 : 0))
        })

      }
      if(e==='submittedAt'){
        this.setState({
          data: this.state.data.sort((a,b) => (a.submittedAt > b.submittedAt) ? 1 : ((b.submittedAt > a.submittedAt) ? -1 : 0))
        })
      }
      if(e==='name'){
        this.setState({
          data: this.state.data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
        })

      }
    }
    handleDownload = (e) =>{
      e.preventDefault();
      const { editorLabDetails } = this.props.labDetails;
      let newData1 = this.state.data;
      let newData = newData1?.map(row =>{
        delete row.id
        return row
      })
      const workSheet = XLSX.utils.json_to_sheet(newData);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workBook,
        workSheet,
        editorLabDetails.description
      );
      // eslint-disable-next-line
      let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
      XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(workBook, "StudentData.xlsx");
    }
    
    handleSubmitCode = (e) => {
        e.preventDefault();
        if( !this.state.customOutput && !this.state.customInput){
          this.setState({
            error:"Please Fill Custom Input and Output to evaluate!!",
        })
        setTimeout(()=>{
            this.setState({
                error: ""
            })
        },6000)
        }
        else{
          const {customInput, customOutput, data} = this.state;
          if(customInput && customOutput && data){
            const url = "/api/editor/downloadReport";
            this.setState({
              loading2:true,
            })
            fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: this.getFormBody({ customInput, customOutput, data:JSON.stringify(data)}),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                  this.setState({
                    loading2: false,
                    data: data.data,
                    downloadButton: true,
                })
                }
            });
          }

        }      
    };
    render() {
        const {classroomId} = this.props.match.params;
        // console.log(classroomId,"Teacher");
      let { students,teachers } = this.props.classroom;
      const { user } = this.props.auth;
      const { labId } = this.props.match.params;
      const { editorLabDetails } = this.props.labDetails;
      return (
        <>
          {this.state.loading && (
            <>
              <Grid
                spacing={2}
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress disableShrink />
              </Grid>
            </>
          )}
          {!this.state.loading && (
            <>
              <Div>{editorLabDetails && <>{editorLabDetails.description}</>}</Div>
              <Grid
                spacing={2}
                container
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
              >
                <Grid
                  spacing={4}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={5} m={2}>
                    <Paper elevation={4}>
                      <Card sx={{ minWidth: 300, minHeight: 150 }}>
                        <Div>Question</Div>
                        <CardContent>
                          {editorLabDetails && <>{editorLabDetails.question}</>}
                        </CardContent>
                      </Card>
                    </Paper>
                  </Grid>
                  <Grid item xs={3} m={2}>
                    <Paper elevation={4}>
                      <Card sx={{ minWidth: 300, minHeight: 150 }}>
                        <Div>Custom Input For Evaluation</Div>
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
                    <Paper elevation={4}>
                      <Card sx={{ minWidth: 300, minHeight: 150 }}>
                        <Div>Custom Output For Evaluation</Div>
                        <CardContent>
                          <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Custom Input"
                            inputProps={{ "aria-label": "search google maps" }}
                            value={this.state.customOutput}
                            onChange={this.handleCustomOutput}
                          />
                        </CardContent>
                      </Card>
                    </Paper>
                    
                  </Grid>
                  <Fab variant="extended" m={4}>
                    <CodeEditorSideBar
                      students={students}
                      teachers={teachers}
                      user={user}
                      classroomId={classroomId}
                      labId={labId}
                      editorLabDetails={editorLabDetails}
                      dispatch={this.props.dispatch}
                    />
                  </Fab>
                  <Fab variant="extended" onClick={this.handleSubmitCode}>
                    <PlayCircleIcon sx={{ mr: 3 }} color="primary" />
                    Evaluate and Download Report
                  </Fab>
                  {this.state.loading2 && (
                    <>
                       Evaluating ....
                        <CircularProgress disableShrink />
                      
                    </>
                  )}
                  {this.state.downloadButton && (
                    <>
                      Evaluated..
                      <IconButton>
                        <DownloadIcon onClick={this.handleDownload} />
                      </IconButton>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} ml={32} mt={4} >
                  {/* table will come here*/}
                  {this.state.data.length && <>
                    <TableContainer component={Paper}>
                      <Table aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Name
                            <IconButton>
                              <SortIcon onClick={this.handleSort('name')} />
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="right">SID
                              <IconButton>
                              <SortIcon onClick={this.handleSort('sid')} />
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="right">Email
                            <IconButton>
                                <SortIcon onClick={this.handleSort('email')} />
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align="right">View Code</StyledTableCell>
                            <StyledTableCell align="right">Marks
                            <IconButton>
                            <SortIcon onClick={this.handleSort('marks')} />
                            </IconButton></StyledTableCell>
                            <StyledTableCell align="right">Submitted At
                            <IconButton>
                            <SortIcon onClick={this.handleSort('submittedAt')} />
                              </IconButton>
                            </StyledTableCell>                            
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.state.data.map((row) => (
                            <StyledTableRow key={row.name}>
                              <StyledTableCell component="th" scope="row">
                                {row.name}
                              </StyledTableCell>
                              <StyledTableCell align="right">{row.sid}</StyledTableCell>
                              <StyledTableCell align="right">{row.email}</StyledTableCell>
                              <StyledTableCell align="right">
                                <Button onClick={this.handleOpen(row.sid)}>View Code</Button>
                                {this.state.open === row.sid && <Modal
                                    open={true}
                                    onClose={this.handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Code Submitted
                                      </Typography>
                                      {row.code}
                                    </Box>
                                  </Modal>}
                              </StyledTableCell>
                              <StyledTableCell align="right">{row.marks}</StyledTableCell>
                              <StyledTableCell align="right">{row.submittedAt}</StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>}
                </Grid>
                {this.state.error && <Snackbar open={true} autoHideDuration={2000}>
                        <Alert severity="error" sx={{ width: '100%' }}>
                        {this.state.error}
                        </Alert>
                    </Snackbar>}
              </Grid>
            </>
          )}
        </>
      );
    }
}
function mapStateToProps(state) {
    return {
      auth: state.auth,
      darkModetheme: state.theme,
      createClassroom: state.createClassroom,
      labDetails: state.labDetails,
      classroom: state.classroom,
    };
  }
  
  export default connect(mapStateToProps)(LabDashboard);