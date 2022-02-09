import React, { Component } from "react";
import { connect } from "react-redux";
import { clearAuth } from "../actions/auth";
import { joinClassroom, clearClassCode} from "../actions/createClassroom";
import { fetchUserClassDetails } from "../actions/classroom";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class JoinClassPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
    };
  }

  state = {
      dialogOpen:true
  }

  dialogOpen = () => {
    this.setState({ open: true });
  };

  dialogClose = () => {
    this.setState({ open: false });
    this.props.dispatch(clearClassCode());
    this.props.dispatch(fetchUserClassDetails());
  };

  //to clear the error if it comes on reload or whenever the user shifts from this page
  componentWillUnmount() {
    this.props.dispatch(clearAuth());
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    const { code } = this.state;
    if (code) {
      this.props.dispatch(joinClassroom(code));
    }
  };

  handleCode = (e) => {
    this.setState({
      code: e.target.value,
    });
  };

  render() {
    const { inProgress, error } = this.props.auth;
    const { code } = this.props.createClassroom;
    return (
    <div>
    <Button variant="contained" onClick={this.dialogOpen} id="join-class">
        Join
    </Button>
      <Dialog open={this.state.open} onClose={this.dialogClose}>
        <DialogTitle>
            {error && <div className="alert error-dailog">{error}</div>}
            {code && (
              <div className="alert success-dailog">
                <p>Classroom joined successfully!!</p>
              </div>
            )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
                Join a new classroom using private code
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <TextField
                autoFocus
                margin="dense"
                type="text"
                placeholder="Enter ClassRoom Code"
                required
                onChange={this.handleCode}
                fullWidth
                variant="standard"
            />
            <Button onClick={this.handleSubmitForm} disabled={inProgress} >
                Join Classroom
            </Button>
        </DialogActions>
      </Dialog> 
    </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    auth: state.auth,
    createClassroom: state.createClassroom,
  };
}
export default connect(mapStateToProps)(JoinClassPopUp);

