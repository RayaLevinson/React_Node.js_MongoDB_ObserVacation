import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addVacation, editVacation } from '../../../redux/actions/vacationActions';
import { setAlert } from '../../../redux/actions/alertsActions';
import { isVacationExceptImageValid } from '../../../utils/validation/vacationValidation';
import { isImageValid } from '../../../utils/validation/imageValidation';
import { CHOOSE_FILE } from '../../../utils/validation/constants';
import Loader from '../../layout/loader/Loader';

const VacationForm = props => {
  const { vacation, addVacation, editVacation, setAlert } = props;

  const initialVacationState = {
    title: '',
    image: null,
    fileName: CHOOSE_FILE,
    commentOnFile: 'Please use .jpeg, .jpg, .png, .gif files only.',
    destination: '',
    price: '',
    dateFrom: '', 
    dateTo: '',
    keyToClearFileNameInInput: uuidv4()
  }
  const { isLoading, doneSuccessfully, currentVacation } = vacation;
  
  const [ isSubmitButtonEnabled, setIsSubmitButtonEnabled ] = useState(false);
  const [vacationInForm, setVacation] = useState(initialVacationState);

  const history = useHistory();

  const onChange = e => {
    if (e.target.files && e.target.files[0]) {
      setVacation({
        ...vacationInForm,
        image: e.target.files[0],
        fileName: e.target.files[0].name
      });
    } else {
        const {name, value} = e.target;
        setVacation({
          ...vacationInForm,
          [name]: value
        });
    }
  }

  useEffect(() => {
    if (currentVacation) {
      let date1 = currentVacation.dateFrom;
      let date2 = currentVacation.dateTo;

      setVacation({
        title: currentVacation.title,
        destination: currentVacation.destination,
        price: currentVacation.price,
        dateFrom: new Date(new Date(date1) - (new Date(date1).getTimezoneOffset() * 60000 )).toISOString().slice(0,10),
        dateTo: new Date(new Date(date2) - (new Date(date2).getTimezoneOffset() * 60000 )).toISOString().slice(0,10),
        fileName: CHOOSE_FILE,        
        commentOnFile: 'Please use .jpeg, .jpg, .png, .gif files only. Current image will be used if new would not be supplied.',
        keyToClearFileNameInInput: uuidv4()
      });      
    } else {  // user choose to update, but after that 'Add Vacation' option was selected.
        setVacation(initialVacationState);
    }
    // eslint-disable-next-line  
  }, [currentVacation]);

  let { title, destination, price, dateFrom, dateTo, fileName, image, commentOnFile, keyToClearFileNameInInput } = vacationInForm;

  const onSubmit = async e => {
    e.preventDefault();
    dateFrom = new Date(dateFrom).setHours(0,0,0,0);
    dateTo = new Date(dateTo).setHours(0,0,0,0);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('destination', destination);
    formData.append('price', price);
    formData.append('dateFrom', dateFrom);
    formData.append('dateTo', dateTo);

    if (image) {
      formData.append('image', image);  // 'image' is what specified in the server file 
    }
    // formData will be empty in console.log(formData) because browser cannot understand formData

    if (isFinalFormValid()) {    
      if (!currentVacation) {
        // Add vacation attempt
        addVacation(formData);      
      } else {
          // Edit vacation attempt
          editVacation(formData, currentVacation._id);   
      }
    }
  }

  // Clean form data and redirect only if result is successfull
  useEffect(() => {
    if (doneSuccessfully === true) {
      setVacation(initialVacationState);
      history.push("/admin/vacations");      
    }
    // eslint-disable-next-line  
  }, [doneSuccessfully]);

  // Used in order to enable / disable submit button (Save)
  useEffect(() => {
    setIsSubmitButtonEnabled(!isLoading && isCurrentStageValid());
    // eslint-disable-next-line    
  }, [title, destination, price, dateFrom, dateTo, fileName, isLoading]);
  
  const isCurrentStageValid = () => {
    if (title !== '' && destination !== '' && price !== '' && dateFrom !== '' && dateTo !== '') {
      if (!currentVacation) { // new vacation
        if (fileName !== CHOOSE_FILE) {
          return true;
        }
      } else {  // updating vacation
          return true;
      }
    }
    return false;
  }

  const isFinalFormValid = () => {
    const errors = [];
    const inputValues = { title, destination, price, dateFrom, dateTo }
    
    if (!currentVacation) { // new vacation
      if ((isVacationExceptImageValid(inputValues, errors)) && (isImageValid({ fileName, image }, errors))) {
        return true;
      }       
    } else { // updating existed vacation
        if (isVacationExceptImageValid(inputValues, errors)) {
          if (fileName !== CHOOSE_FILE) {
            if (isImageValid({ fileName, image }, errors)) {
              return true;
            }
          } else {
              return true;
          }
        } 
      }
    if (errors) {
      errors.forEach(error => setAlert(error, 'danger'))          
    }
    return false;
  }

  return (
    <div className="row mx-3 mb-5">
    <div className="card col-sm-12 col-md-8 col-lg-6 mx-auto mb-5">
    <div className="card-body">
      <div className="text-center text-success">
        { currentVacation ? <h2>Edit Vacation</h2> : <h2>Add A New Vacation</h2>}      
      </div>
      { isLoading && <Loader />}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input className="form-control"
            type="text" 
            name="title" 
            value={title}
            onChange={onChange} 
          />
        </div>
        <div className="form-group">
          <label>Destination *</label>
          <input className="form-control"
            type="text" 
            name="destination" 
            value={destination}
            onChange={onChange} 
          />
        </div>          
        <div className="form-group">
          <div className="custom-file">
            <label>Choose Image of the Vacation *</label>
            <input 
              type="file"
              name="image"
              accept=".jpeg,.jpg,.png,.gif"  // Prefilter these files types only
              onChange={onChange}
              key={keyToClearFileNameInInput}
              id="customFile"
              />
              <p><small>{commentOnFile}</small></p>
          </div>
        </div>
        <div className="form-group">
          <label>Price in ₪ *</label>
          <input className="form-control" 
            type="number"
            name="price"
            value={price}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Starts on *</label>
          <input className="form-control" 
            type="date"
            name="dateFrom"
            value={dateFrom}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Ends on *</label>
          <input className="form-control" 
            type="date"
            name="dateTo"
            value={dateTo}
            onChange={onChange}
          />
        </div>        
        <button type="submit" disabled={!isSubmitButtonEnabled} className="btn btn-success btn-block">Save</button>
      </form>
    </div>
    </div>
    </div>
  )
}

VacationForm.propTypes = {  
  addVacation: PropTypes.func.isRequired,
  editVacation: PropTypes.func.isRequired,
  vacation: PropTypes.object
}

const mapStateToProps = state => ({
  vacation: state.vacation
});

export default connect(mapStateToProps, { addVacation, editVacation, setAlert })(VacationForm);
