import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchUserClassDetails } from "../actions/classroom";


class TeacherDashboard extends Component {
  componentDidMount() {
    this.props.dispatch(fetchUserClassDetails());
  }
  render() {
    //create the details of the classes joined and created by the user
    const { classesCreated,classesJoined } = this.props.classroom;

    return (
      <div>
        <b>TeacherDashboard</b><br></br><br></br>
        <b>Classes Joined</b><br></br>
        {classesJoined.map((classroom) => (
          <div className='classroom' key={classroom._id}>
            Subject - {classroom.subject}<br></br>
            Batch  - {classroom.batch}<br></br>
            Description - {classroom.description}<br></br>
            Classroom code - {classroom.code}<br></br>
            CreatedBy - {classroom.creator.name}<br></br>
            Students Enrolled - {classroom.students.length}<br></br>
            <div className="field"><button> Enter Classroom</button></div>

          </div>
        ))}
        <br></br>
        <b>Classes Created</b><br></br>
        {classesCreated.map((classroom) => (
          <div className='classroom' key={classroom._id}>
            Subject - {classroom.subject}<br></br>
            Batch  - {classroom.batch}<br></br>
            Description - {classroom.description}<br></br>
            Classroom code - {classroom.code}<br></br>
            Students Enrolled - {classroom.students.length}<br></br>
            <div className="field"><button> Enter Classroom</button></div>

          </div>
        ))}
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