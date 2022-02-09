const {
  FETCH_USER_CLASS_DETAILS,
  CLEAR_USER_CLASS_DETAILS,
  FECTH_CURRENT_CLASSROOM_DETAILS,
  CLEAR_CURRENT_CLASSROOM_DETAILS,
  GET_EARLIER_MESSAGES,
    CLEAR_EARLIER_MESSAGES,
    UPDATE_CHAT_MESSAGE,
  // UPDATE_POSTS,
  ADD_POST,
  ADD_COMMENT,
  // UPDATE_POST_LIKE,
  // UPDATE_COMMENT_LIKE,
    FETCH_UNREAD_MESSAGE_COUNT
} = require("../actions/actionTypes");

const initialClassroomState = {
  classesCreated: [],
  classesJoined: [],
  students: [],
  teachers: [],
  announcements: [],
  posts: [],
  ClassMeetLink: '',
  messageArray: [],
  unreadMessageCount:[],
  ID:"",
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
        ClassMeetLink: action.ClassMeetLink,
        ID:action.classroomId,
      };
    case ADD_POST:
    case ADD_COMMENT:
      return{
        ...state,
        posts: action.posts
      };
    case CLEAR_CURRENT_CLASSROOM_DETAILS:
      return {
        ...state,
        // students: [],
        // teachers: [],
        // announcements: [],
        // posts: []
      }
    case GET_EARLIER_MESSAGES: 
      return{
        ...state,
        messageArray: action.messageArray
      };
    case CLEAR_EARLIER_MESSAGES:
      return {
        ...state,
        messageArray: []
      };
      case UPDATE_CHAT_MESSAGE:
        return {
          ...state,
          messageArray: [...state.messageArray,action.newMessage]
        };
    case FETCH_UNREAD_MESSAGE_COUNT:
      return  {
        ...state,
        unreadMessageCount:action.unreadMessageCount
      }
    default:
      return state;
  }
}
