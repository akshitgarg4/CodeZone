const {
  FETCH_USER_CLASS_DETAILS,
  CLEAR_USER_CLASS_DETAILS,
  FECTH_CURRENT_CLASSROOM_DETAILS,
  CLEAR_CURRENT_CLASSROOM_DETAILS,
  // UPDATE_POSTS,
  ADD_POST,
  ADD_COMMENT,
  // UPDATE_POST_LIKE,
  // UPDATE_COMMENT_LIKE,
} = require("../actions/actionTypes");

const initialClassroomState = {
  classesCreated: [],
  classesJoined: [],
  students: [],
  teachers: [],
  announcements: [],
  posts: [],
  ClassMeetLink: ''
};
export default function auth(state = initialClassroomState, action) {
  switch (action.type) {
    case FETCH_USER_CLASS_DETAILS:
      return {
        ...state,
        classesCreated: action.userDetails.classesCreated,
        classesJoined: action.userDetails.classesJoined,
      };
    case CLEAR_USER_CLASS_DETAILS:
      return {
        ...state,
        classesCreated: [],
        classesJoined: [],
      };
    case FECTH_CURRENT_CLASSROOM_DETAILS:
      return {
        ...state,
        students: action.students,
        teachers: action.teachers,
        announcements: action.announcements,
        posts: action.posts,
        ClassMeetLink: action.ClassMeetLink
      }
    case ADD_POST:
    case ADD_COMMENT:
      return{
        ...state,
        posts: action.posts
      }
    case CLEAR_CURRENT_CLASSROOM_DETAILS:
      return {
        ...state,
        // students: [],
        // teachers: [],
        // announcements: [],
        // posts: []
      }
    default:
      return state;
  }
}
