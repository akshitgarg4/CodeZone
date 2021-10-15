import React from "react";
import { connect } from "react-redux";
import Page404 from "./Page404";
import CodeEditor from "./CodeEditor";
import Nav from "./Nav";
import Login from "./Login";
import SignUp from "./SignUp";
// @ts-ignore
//to decode the token
import jwt_decode from "jwt-decode";
import { authenticateUser } from "../actions/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends React.Component {
  componentDidMount() {
    //check if token already present else wwe would place it
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt_decode(token);
      console.log("user", user);
      this.props.dispatch(
        authenticateUser({
          email: user.email,
          _id: user._id,
          name: user.name,
        })
      );
    }
  }
  render() {
    return (
      <Router>
        <Nav />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="/codeEditor" component={CodeEditor} />
          <Route component={Page404} />
        </Switch>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(App);
