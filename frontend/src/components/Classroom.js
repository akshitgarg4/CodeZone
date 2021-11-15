import React, { Component } from "react";
import DiscussionPortal from "./DiscussionPortal";
import StudentsList from "./StudentsList";
import NoticeBoard from "./NoticeBoard";

class Classroom extends Component {
  componentDidMount() {
    const { match } = this.props;

    if (match.params.classroomID) {
      // dispatch an action to fetch classroom details
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match: { params: prevParams },
    } = prevProps;
    const {
      match: { params: currentParams },
    } = this.props;
    if (prevParams && currentParams && currentParams !== prevParams) {
      //fetch new classroom  details
    }
  }
  render() {
    const { match } = this.props;
    // return <div>{match.params.classroomID}</div>;
    return (
      <div className="class-dashboard">
        <StudentsList/>
        <DiscussionPortal/>
        <NoticeBoard/>


        
      </div>
    )
  }
}

export default Classroom;