import { combineReducers } from 'redux';
import alertReducer from './alertsReducer';
import userAuthReducer from './userAuthReducer';
import vacationReducer from './vacationReducer';

export default combineReducers({
  userAuth: userAuthReducer,
  vacation: vacationReducer,
  alert: alertReducer
});
