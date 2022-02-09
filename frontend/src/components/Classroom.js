import React , { Component } from "react";
import { connect } from "react-redux";
import DiscussionPortal from "./DiscussionPortal";
import StudentsList from "./StudentsList";
import NoticeBoard from "./NoticeBoard";

//Material UI
import { Grid } from '@mui/material';
import { clearClassroomDetails , fetchClassroomDetails } from "../actions/classroom";

class Classroom extends Component {
    componentDidMount () {
        const { match } = this.props;
        
        if ( match.params.classroomID ) {
            this.props.dispatch ( fetchClassroomDetails ( match.params.classroomID ) );
            this.timer = setInterval ( () => {
                this.props.dispatch ( fetchClassroomDetails ( match.params.classroomID ) );
            } , 5000 );
        }
    }
    
    componentDidUpdate ( prevProps ) {
        const {
            match : { params : prevParams } ,
        } = prevProps;
        const {
            match : { params : currentParams } ,
        } = this.props;
        if ( prevParams && currentParams && currentParams !== prevParams ) {
            //fetch new classroom  details
            this.props.dispatch ( fetchClassroomDetails ( currentParams.classroomID ) );
        }
    }
    
    
    componentWillUnmount () {
        clearInterval ( this.timer );
        this.props.dispatch ( clearClassroomDetails () );
    }
    
    render () {
        const { match } = this.props;
        // return <div>{match.params.classroomID}</div>;
        return ( <Grid container direction="row" justifyContent="space-evenly">
            <Grid
                item
                xs={6}
                m={2}
                style={{ maxHeight: "150vh", overflow: "auto" }}
            >
                {" "}
                <DiscussionPortal classroomId={match.params.classroomID} />
            </Grid>
            <Grid
                item
                xs={4}
                m={2}
                container
                direction="column"
                alignItems="stretch"
            >
                <Grid item m={2}>
                    <NoticeBoard classroomId={match.params.classroomID} />{" "}
                </Grid>
                <Grid item m={2}>
                    <StudentsList classroomId={match.params.classroomID} />
                </Grid>
            </Grid>
        </Grid>
        );
    }
}

function mapStateToProps ( state ) {
    return {
        auth : state.auth , createClassroom : state.createClassroom ,
    };
}

export default connect ( mapStateToProps ) ( Classroom );