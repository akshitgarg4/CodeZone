import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchUserClassDetails,clearUserClassDetails } from "../actions/classroom";
import TeacherClassCards from './TeacherClassCards';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

class TeacherDashboard extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUserClassDetails());
  }
  componentWillUnmount() {
    this.props.dispatch(clearUserClassDetails());
  }
  render() {
    //create the details of the classes joined and created by the user
    const { classesCreated,classesJoined } = this.props.classroom;

    return (
      <div>
        <Grid container direction="column">
          <Grid
            m={4}
            item
            container
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Typography variant="h4" id="class-list">CLASSES</Typography>
          </Grid>
          <Grid
            item
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >{
            (classesCreated?.length < 1 && classesJoined?.length < 1) && <Typography variant="h6">No classes to display!!!</Typography>
          }
            {classesCreated.map((classroom) => (
              <div>
                <TeacherClassCards classroom={classroom} />
              </div>
            ))}
            {classesJoined.map((classroom) => (
              <div>
                <TeacherClassCards classroom={classroom} />
              </div>
            ))}
          </Grid>
        </Grid>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    classroom: state.classroom,
  };
}

export default connect(mapStateToProps)(TeacherDashboard);