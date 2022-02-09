import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import ChatBox from './ChatBox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import DialogTitle from '@mui/material/DialogTitle';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const {self,other,classroomId,messageArray,avatar} = props;

  let disable;
  if(self && other){
  if(self.id === other._id){
    disable = true;
  }
  else{
    disable = false;
  }
  }
  return (
    <div>
      <IconButton
        variant="outlined"
        onClick={handleClickOpen}
        disabled={disable}
      >
        <CommentIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        disableEnforceFocus
        hideBackdrop
        PaperProps={{
          sx: {
            width: "100%",
            minHeight: 450,
            minWidth: 400,
          },
        }}
        style={{
          top: "45%", // Position however you like
          left: "65%",
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Chat Window
        </DialogTitle>
        <DialogContent>
          <ChatBox
            classroomId={classroomId}
            self_details={self}
            other_details={other}
            messageArray={messageArray}
            avatar = {avatar}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}