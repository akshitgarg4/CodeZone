import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/auth";
import { switchTheme } from "../actions/theme";
import Avatar from '@mui/material/Avatar';
import logo from "../static/logo.png";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Grid } from "@mui/material";
import JoinClassDialog from "./JoinClassDialog";
import CreateClassDialog from "./CreateClassDialog";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import { Paper } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

class Nav extends React.Component {
  state = {
    create: false,
    join: false,
  };
  logout = () => {
    localStorage.removeItem("token");
    this.props.dispatch(logoutUser());
  };
  toggleCreateButton = () => {
    this.setState({
      create: !this.state.create,
    });
  };
  toggleJoinButton = () => {
    this.setState({
      join: !this.state.join,
    });
  };
  switchTheme = () => {
    this.props.dispatch(switchTheme());
  };

  render() {
    const { auth } = this.props;
    const { darkModetheme } = this.props;
    return (
      <Paper elevation={7}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{ background: "#0053A7" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/">
                  <img src={logo} alt="logo" width="150" height="50" />
                </Link>
              </Typography>
              {auth.isLoggedIn && auth.user.role === "Teacher" && (
                <div>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Grid item m={2}>
                      <JoinClassDialog />
                    </Grid>
                    <Grid item m={2}>
                      <CreateClassDialog />
                    </Grid>
                  </Grid>
                </div>
              )}

              {auth.isLoggedIn && auth.user.role === "Student" && (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                >
                  <Grid item m={2}>
                    <JoinClassDialog />
                  </Grid>
                </Grid>
              )}

              {auth.isLoggedIn && (
                <div>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                  >
                    <Grid item m={0.25}>
                      <Link to="/settings">
                        <Avatar src={auth?.user?.avatar} sx={{ width: 35, height: 35 }}>
                    </Avatar>
                      </Link>
                    </Grid>
                    {auth.user.name}
                  </Grid>
                </div>
              )}
              {!auth.isLoggedIn && (
                <Button>
                  <Link to="/login">
                    <Typography color="common.white">Login</Typography>
                  </Link>
                </Button>
              )}
              {auth.isLoggedIn && (
                <Button onClick={this.logout}>
                  <Link to="/">
                    <Typography color="common.white">Logout</Typography>
                  </Link>
                </Button>
              )}
              {!auth.isLoggedIn && (
                <Button>
                  <Link to="/signup">
                    <Typography color="common.white">Register</Typography>
                  </Link>
                </Button>
              )}
              <Button onClick={this.switchTheme}>
                {!darkModetheme.darkMode === true && (
                  <ModeNightIcon color="secondary" />
                )}
                {!darkModetheme.darkMode === false && (
                  <WbSunnyIcon color="secondary" />
                )}
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </Paper>
    );
  }
}


function mapStateToProps(state) {
  return {
    auth: state.auth,
    darkModetheme: state.theme,
  };
}

export default connect(mapStateToProps)(Nav);
