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
  REMOVE_FOLLOWER_FROM_VACATION
}
from '../actions/types';

import {
  BASE_URL, MY_DOMAIN
} from '../../config/constants';

const initialState = {
  vacations: null,
  isLoading: false,
  doneSuccessfully: null,  // used in form
  currentVacation: null,
  chartData: {}
}

export default (state = initialState, action) => {
  const { vacations } = state;
  const { type, payload } = action;
  let currVacation;

  switch(type) {
    case GET_VACATIONS: 
      const allVacations = action.payload;

      // Used for Report
      const vacationsTitle = allVacations.filter(vacation => vacation.followers.length > 0).map(vacation => vacation.title);

      const vacationsFollowersNumArr = allVacations.filter(vacation => 
        vacation.followers.length > 0).map(vacation => vacation.followers.length);                
      // ./ Used for Report 

      return {
        ...state,        
        vacations: payload,
        isLoading: false,
        chartData: {
          labels: vacationsTitle,  // vacations names
          datasets: [{
            label: 'Number of Followers of Vacations',
            data:  vacationsFollowersNumArr,  // number of followers    
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        }
    }
    case GET_VACATIONS_FOR_USER:
      const tmpVacations = payload.vacations.map(vacation => {
        if (vacation.followers.includes(payload.currentUserId)) {
          vacation.isSelected = true;
        } else {
          vacation.isSelected = false;
        }
        return vacation;
      })
      return {
        ...state,        
        vacations: [...tmpVacations.filter(vacation => vacation.isSelected === true), 
                    ...tmpVacations.filter(vacation => vacation.isSelected === false)],
        isLoading: false
    }
    case ADD_VACATION: 
      return {
        ...state,        
        vacations: vacations ? [...vacations, payload] : [payload],
        isLoading: false,
        doneSuccessfully: true
      }
    case EDIT_VACATION:
      return {
        ...state,
        vacations: vacations.map(vacation => vacation._id === payload._id 
                              ? { ...payload, imageURL: `${MY_DOMAIN}${BASE_URL}/${payload.imageURL}` }
                              : vacation),
        isLoading: false,
        doneSuccessfully: true
      }
    case DELETE_VACATION: 
      return {
        ...state,        
        vacations: vacations.filter(vacation => vacation._id !== payload),
        isLoading: false
      }
    case SET_LOADING:
      return {
        ...state,
        isLoading: true,
        doneSuccessfully: null
      }
    case SET_CURRENT_VACATION:
      return {
        ...state,
        currentVacation: payload,
        isLoading: false
      }
    case CLEAR_CURRENT_VACATION: 
      return {
        ...state,
        currentVacation: null,
        isLoading: false
      }
    case CLEAR_DONE_SUCCESSFULLY: 
      return {
        ...state,
        doneSuccessfully: null,
        isLoading: false
      }
    case VACATIONS_ERROR:
      return {
        ...state,
        isLoading: false,
        doneSuccessfully: false
      }
    case ADD_FOLLOWER_TO_VACATION:
      currVacation = payload.vacation;
      currVacation.followers.push(payload.followerId);
      return {
        ...state,
        vacations: [currVacation, ...vacations.filter(vacation => vacation._id !== currVacation._id)],
        isLoading: false
      }
    case REMOVE_FOLLOWER_FROM_VACATION:
      currVacation = payload.vacation;      
      currVacation.followers.splice(currVacation.followers.indexOf(payload.followerId), 1);
      return {
        ...state,
        vacations: [...vacations.filter(vacation => vacation._id !== currVacation._id), currVacation],
        isLoading: false
      } 
    default:
      return state;
  }
}