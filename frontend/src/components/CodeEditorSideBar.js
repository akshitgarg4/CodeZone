import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import ChatWindow from "./ChatWindow";
import { Link } from 'react-router-dom';
import { useEffect} from "react";
import {useDispatch,connect} from "react-redux";
import {createNewCodeEditor } from "../actions/classroom";
import { fetchUnreadMessageCount } from "../actions/classroom";


//Material UI
import { Grid} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Paper} from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import VisibilityIcon from '@mui/icons-material/Visibility';



function CodeEditorSideBar(props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false
  });
  const {students,user,labId,classroomId,teachers} = props;
  let unreadMessageCount= props.classroom.unreadMessageCount;
  
    const dispatch = useDispatch();
    
    
    useEffect(() => {
        dispatch(fetchUnreadMessageCount(props.classroomId));
        let timer = setInterval(() => {
            dispatch(fetchUnreadMessageCount(props.classroomId));
            // console.log(props.classroom.unreadMessageCount,"XX");
            
            
        }, 5000);
        
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
            // console.log("cleared",timer);
            clearInterval(timer);
        }
    }, [dispatch,props])
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: "center",
  }));
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 500 }}
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      //onKeyDown={toggleDrawer(anchor, false)}
    >
    <Grid>
    <Grid item m={12} xs={3}>
            <Paper elevation={4}>
            <Card sx={{ minWidth: 360 }}>
            <Div >Enrolled List</Div>
            <CardContent>
            {/* iterate over teachers and then  students list here */}
            <List sx={{ width: '100%', maxWidth: 360}}>
            {students.map((value) => (
                <ListItem
                key={value._id}
                secondaryAction={
                  <div>
                    <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                        <ChatWindow self={user} other={value} classroomId={classroomId}/>
                        {(user.role==='Teacher' && value._id) && <Link to={`/code-editor/${value._id}/${labId}`} onClick={()=>{
                          //fetch this code-editor's details using row_id
                          props.dispatch(createNewCodeEditor(value._id,labId));
                        }}>
                          <VisibilityIcon/>  
                        </Link>
                        }
                        
                    </Grid>
                  </div>
                }
                >
                <ListItemButton>
                <ListItemAvatar>
                    <Avatar src={value?.avatar}></Avatar>
                </ListItemAvatar>
                    {( value._id == user.id) && <ListItemText primary={`${value.name}-${value.SID}`}   />}
                    {( value._id != user.id) && <ListItemText primary={`${value.name}-${value.SID}`} secondary={`Unread: ${unreadMessageCount[value._id]}`}  />}
                </ListItemButton>
                <Divider />
                </ListItem>
            ))}
                {teachers.map((value) => (
                    <ListItem
                        key={value._id}
                        secondaryAction={
                            <div>
                                <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                    <ChatWindow self={user} other={value} classroomId={classroomId}/>
                                    {(user.role==='Teacher' && value._id) && <Link to={`/code-editor/${value._id}/${labId}`} onClick={()=>{
                                        //fetch this code-editor's details using row_id
                                        props.dispatch(createNewCodeEditor(value._id,labId));
                                    }}>
                                        <VisibilityIcon/>
                                    </Link>
                                    }
                    
                                </Grid>
                            </div>
                        }
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar src={value?.avatar}></Avatar>
                            </ListItemAvatar>
                            {( value._id == user.id) && <ListItemText primary={`${value.name}`}  />}
                            {( value._id != user.id) && <ListItemText primary={`${value.name}`} secondary={`Unread: ${unreadMessageCount[value._id]}`}  />}
                        </ListItemButton>
                        <Divider />
                    </ListItem>
                ))}
            </List>
            </CardContent>
            </Card>
        </Paper>
        <Grid item m={12} xs={3}>
            <Fab variant="extended">
              <Button onClick={toggleDrawer(anchor, false)}>Close Sidebar</Button>
            </Fab>
        </Grid>
        </Grid> </Grid>
    </Box>
  );


  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>Student List</Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            //onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
function mapStateToProps(state) {
    return {
        classroom: state.classroom,
    };
}

export default connect(mapStateToProps)(CodeEditorSideBar);
