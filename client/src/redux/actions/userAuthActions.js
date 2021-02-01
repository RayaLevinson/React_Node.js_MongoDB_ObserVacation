import { setAlert } from './alertsActions';
import { BASE_URL } from '../../config/constants';
import { SOMETHING_WRONG, DANGER } from '../../config/constants';
import { OK, CREATED } from '../../config/httpStatusCodes';
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
} from './types';

// Register user - add user to the database.
export const registerUser = newUser => async dispatch => {
  dispatch(setLoading());
  const url = `${BASE_URL}/api/users`;
  const config = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  }
  try {
    const res = await fetch(url, config);  
    const response = await res.json();

    if (res.status === OK || res.status === CREATED) {
      dispatch({
        type: REGISTER_SUCCESS
      });
      dispatch(loadUser());
    } 
    else {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type:  REGISTER_FAIL
      });        
    }    
  } catch(err) {
      dispatch(setAlert(SOMETHING_WRONG, DANGER));
      dispatch({
        type:  REGISTER_FAIL
      });
  }
}

// Log in user
export const login = formData => async dispatch => {
  dispatch(setLoading());
  const url = `${BASE_URL}/api/users/auth/login`;
  const config = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  }

  try {
    const res = await fetch(url, config);
    const response = await res.json();
   
    if (res.status === OK) {
      dispatch({
        type: LOGIN_SUCCESS
      });

      dispatch(loadUser());
    } 
    else {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type:  LOGIN_FAIL 
      });        
    }    
  } catch(err) {
      dispatch(setAlert(SOMETHING_WRONG, DANGER));
      dispatch({
        type:  LOGIN_FAIL
      });
  }
}

// Get current user from the backend
export const loadUser = () => async dispatch => {
  dispatch(setLoading());  
  const url = `${BASE_URL}/api/users/auth/current`;
  const config = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await fetch(url, config); 
    const resData = await res.json();

    if (res.status === OK) {
      const user = resData.data;
      if (user.role === 'user') {
        dispatch({
          type: USER_LOADED,
          payload: user 
        });
      } else {
          if (user.role === 'admin') {
            dispatch({
              type: ADMIN_LOADED,
              payload: user 
            });
          }
      }
    } else {
      dispatch({
        type:  AUTH_ERROR
      });
    }
  } catch(err) {
      dispatch({
        type:  AUTH_ERROR
      });
  }
}

// Logout user
export const logout = () => async dispatch => {
  const url = `${BASE_URL}/api/users/auth/logout`;
  const config = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }
  try {
    const res = await fetch(url, config);
    if (res.status === OK) {     
      dispatch({
        type: LOGOUT_SUCCESS
      });
    }
    else {
      const response = await res.json();
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type:  LOGIN_FAIL 
      });        
    }    
  } catch(err) {
      dispatch(setAlert(SOMETHING_WRONG, DANGER));
      dispatch({
        type:  LOGOUT_FAIL
      });
  }
}

// Set loading to true
export const setLoading = () => {
  return {
    type: SET_USER_LOADING
  }
}
