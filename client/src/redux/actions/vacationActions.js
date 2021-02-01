import { setAlert } from './alertsActions';
import io from "socket.io-client";
import { BASE_URL, MY_DOMAIN } from '../../config/constants';
import { SOMETHING_WRONG, DANGER } from '../../config/constants';
import { OK, CREATED } from '../../config/httpStatusCodes';
import { 
  GET_VACATIONS,
  ADD_VACATION,
  EDIT_VACATION,
  DELETE_VACATION,
  SET_LOADING,
  SET_CURRENT_VACATION,
  CLEAR_CURRENT_VACATION,
  CLEAR_DONE_SUCCESSFULLY,
  VACATIONS_ERROR,
  GET_VACATIONS_FOR_USER,
  ADD_FOLLOWER_TO_VACATION,
  REMOVE_FOLLOWER_FROM_VACATION,
}
from './types';

// Get vacations for admin.
export const getVacations = () => async dispatch => { 
  dispatch(setLoading());
  const url = `${BASE_URL}/api/admin/vacations`; 
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
    const response = await res.json();
    
    if (res.status === OK) {
      const vacations = response.data;
      vacations.forEach(vacation => vacation.imageURL = `${MY_DOMAIN}${BASE_URL}/${vacation.imageURL}`)
         
      dispatch({
        type: GET_VACATIONS,
        payload: vacations
      });
    } else {
        if (response.error) {
          dispatch(setAlert(response.error, DANGER));
        }

        dispatch({
          type: VACATIONS_ERROR
        }); 
    }
  } 
  catch(err) {
    dispatch(setAlert(SOMETHING_WRONG, DANGER));
    dispatch({
      type:  VACATIONS_ERROR
    });
  }
}

// Add vacation. Used by admin
export const addVacation = formData => async dispatch => {
  dispatch(setLoading());
  const url = `${BASE_URL}/api/admin/vacations`;
  const config = {
      method: 'POST',
      body: formData    
  }
  try {
    // text and binary data
    const res = await fetch(url, config);
    const response = await res.json();
    if ((res.status === OK) || (res.status === CREATED)) {

      const vacation = response.data;

      dispatch({
        type: ADD_VACATION,
        payload: vacation
      });
      dispatch(setAlert('Vacation was added.', 'success', 3000));
    } else {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type: VACATIONS_ERROR
      }); 
    }
  } catch (err) {
      dispatch({
        type: VACATIONS_ERROR
      }); 
  }
}

// Edit vacation. Used by admin.
export const editVacation = (formData, _id) => async dispatch => {
  dispatch(setLoading());
  const url = `${BASE_URL}/api/admin/vacations/${_id}`;
  const config = {
      method: 'PUT',
      body: formData    
  }
  try {
    // text and binary data
    const res = await fetch(url, config);
    const response = await res.json();
    if (res.status === OK) {

      const vacation = response.data;

      dispatch({
        type: EDIT_VACATION,
        payload: vacation
      });
      dispatch(clearCurrentVacation());
      dispatch(setAlert('Vacation was edited.', 'success', 3000));
    } else {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type: VACATIONS_ERROR
      }); 
    }
  } catch (err) {
      dispatch({
        type: VACATIONS_ERROR
      }); 
  }
}

// Delete a vacation. Used by admin. 
export const deleteVacation = vacationId => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
  const url = `${BASE_URL}/api/admin/vacations/${vacationId}`;
    const config = {
      method: 'DELETE'
    }
    try {
      const res = await fetch(url, config);
      const response = await res.json();
      
      if (res.status === OK) {    
        dispatch({
          type: DELETE_VACATION,
          payload: vacationId
        });
        dispatch(setAlert('Vacation was permanently deleted.', 'success', 3000));
      } else {
          if (response.error) {
            dispatch(setAlert(response.error, DANGER));
          }

          dispatch({
            type: VACATIONS_ERROR
          });
      }
    } catch(err) {
        dispatch(setAlert(SOMETHING_WRONG, DANGER));
        dispatch({
          type:  VACATIONS_ERROR
        });
      }
    }
}

// Get vacations for user.
export const getVacationsForUsers = currentUserId => async dispatch => { 
  dispatch(setLoading());
  const url = `${BASE_URL}/api/vacations`; 
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
    const response = await res.json();
    
    if (res.status === OK) {
      const vacations = response.data;
      vacations.forEach(vacation => vacation.imageURL = `${MY_DOMAIN}${BASE_URL}/${vacation.imageURL}`)
         
      dispatch({
        type: GET_VACATIONS_FOR_USER,
        payload: {vacations, currentUserId}
      });
    
    const socket = io.connect(MY_DOMAIN, {path: `${BASE_URL}/socket.io`});   
    socket.on('vacations', data => {
      if (data.action === 'create') {
        dispatch({
          type: ADD_VACATION,
          payload: data.vacation
        });
      } 
        else {
          if (data.action === 'update') {
            dispatch({
              type: EDIT_VACATION,
              payload: data.vacation
            });


          } else {
            if (data.action === 'delete') {
              dispatch({
                type: DELETE_VACATION,
                payload: data.vacationId
              });   
            }
          }
      }
    })      
      
    } else {
        if (response.error) {
          dispatch(setAlert(response.error, DANGER));
        }

        dispatch({
          type: VACATIONS_ERROR
        }); 
    }
  } 
  catch(err) {
    dispatch(setAlert(SOMETHING_WRONG, DANGER));
    dispatch({
      type:  VACATIONS_ERROR
    });
  }
}

// Add follower to vacation.
export const addFollowerToVacation = (vacation, followerId) => async dispatch => {
  dispatch({
    type: ADD_FOLLOWER_TO_VACATION,   
    payload: {vacation, followerId}  
  });
  const url = `${BASE_URL}/api/vacations/like/${vacation._id}`;
  const config = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({followerId})    
  }
  try {    
    const res = await fetch(url, config);
    const response = await res.json();
    if (res.status !== OK) {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type: VACATIONS_ERROR
      }); 
    }
  } catch (err) {
      dispatch({
        type: VACATIONS_ERROR
      }); 
  }
}

// Remove follower from vacation.
export const removeFollowerFromVacation = (vacation, followerId) => async dispatch => {
  dispatch({
    type: REMOVE_FOLLOWER_FROM_VACATION,
    payload: {vacation, followerId}
  });
  const url = `${BASE_URL}/api/vacations/unlike/${vacation._id}`;
  const config = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({followerId})    
  }
  try {
    const res = await fetch(url, config);
    const response = await res.json();
    if (res.status !== OK) {
      if (response.error) {
        dispatch(setAlert(response.error, DANGER));
      }

      dispatch({
        type: VACATIONS_ERROR
      }); 
    }
  } catch (err) {
      dispatch({
        type: VACATIONS_ERROR
      }); 
  }
}

// Set current vacation
export const setCurrentVacation = vacation => {
  return {
    type: SET_CURRENT_VACATION,
    payload: vacation
  }
}

// Clear current vacation
export const clearCurrentVacation = () => {
  return {
    type: CLEAR_CURRENT_VACATION    
  }
}

// Set loading to true
export const setLoading = () => {  
  return {
    type: SET_LOADING
  };
}

export const clearDoneSuccessfully = () => {
  return {
    type: CLEAR_DONE_SUCCESSFULLY
  };
}
