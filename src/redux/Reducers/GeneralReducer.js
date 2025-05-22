import ActionTypes from '../Actions/ActionTypes';

let initialState = {
  showAlert: false,
  alertOptions: null,
  loading: false,
  lightTheme: false
};

const GeneralReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_ALERT:
      state = {...state, showAlert: true, alertOptions: action.payload};
      break;

    case ActionTypes.HIDE_ALERT:
      state = {...state, showAlert: false, alertOptions: null};
      break;

    case ActionTypes.SHOW_LOADING:
      state = {...state, loading: true};
      break;

    case ActionTypes.HIDE_LOADING:
      state = {...state, loading: false};
      break;

      case ActionTypes.UPDATE_THEME:
        state = {...state, lightTheme: action.payload};
        break;

    default:
      break;
  }
  return state;
};

export default GeneralReducer;
