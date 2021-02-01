import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR, 
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  ADMIN_LOADED,
  SET_USER_LOADING
} from '../actions/types';

const initialState = {
  isLoading: false,
  isAuthenticated: null,    // for regular user
  isAdmin: null,            // for admin
  currentUser: null
}

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch(type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,      
        isLoading: false
      }
    case USER_LOADED: 
      return {
        ...state,
        currentUser: payload,
        isAuthenticated: true,
        isAdmin: false,
        isLoading: false
      }
    case ADMIN_LOADED:
      return {
        ...state,
        currentUser: payload,
        isAdmin: true,
        isAuthenticated: false,
        isLoading: false
      }         
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case LOGOUT_FAIL:
      return {
        ...state,
        isLoading: false,
        currentUser: null,
        isAuthenticated: false,
        isAdmin: false
      }
    case SET_USER_LOADING:
      return {
        ...state,
        isLoading: true
      }       
    default:      
      return state;
  }
}