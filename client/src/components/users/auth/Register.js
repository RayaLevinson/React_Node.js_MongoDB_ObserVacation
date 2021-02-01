import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';    
import { registerUser } from '../../../redux/actions/userAuthActions';
import { setAlert } from '../../../redux/actions/alertsActions';
import Loader from '../../layout/loader/Loader';
import { isRegistrationInputValid } from '../../../utils/validation/userValidation';

const Register = ({ user, registerUser, setAlert }) => {    
  const { isAuthenticated, isAdmin, isLoading } = user; 
  const [ isSubmitButtonEnabled, setIsSubmitButtonEnabled ] = useState(false);

  const [ formData, setFormData ] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    confirmPassword: ''
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });    
  }

  // Used in order to enable / disable submit button (Register)
  useEffect(() => {
    setIsSubmitButtonEnabled(!isLoading && isCurrentStageValid());
  // eslint-disable-next-line    
  }, [firstName, lastName, email, password, confirmPassword, isLoading]);

  const onSubmit = e => {
    e.preventDefault();
    if (isFinalFormValid()) {
      // Attempt to register
      registerUser(formData);  
    }
  }

  const isCurrentStageValid = () => {
    let isValid = false;
    
    if (firstName !== '' && lastName !== '' &&
        email !== '' && password !== '' && confirmPassword !== '') {
        isValid = true;      
    } 
    return isValid;
  }

  const isFinalFormValid = () => {
    const inputValues = { firstName, lastName, email, password, confirmPassword };
    const errors = [];

    if (isRegistrationInputValid(inputValues, errors)) {
      return true;
    } else {
        if (errors) {
          errors.forEach(error => setAlert(error, 'danger'))          
        }
        return false;
    }
  }

  if (isAuthenticated) { // Redirect if authenticated user
    return <Redirect to="/vacations" />
  } else if (isAdmin) {  // Redirect if admin
    return <Redirect to="/admin/vacations" />
  }

  return (
    <div className="row mx-3 mb-5">      
      <div className="card col-sm-12 col-md-8 col-lg-6 mx-auto mb-5">
        <div className="card-body">
          <form onSubmit={onSubmit} noValidate>  
            <h1 className="text-center text-success mb-3"><i className="fas fa-user-plus"></i>  Register</h1>
            <h5 className="text-center">Create Your Account</h5>

            <div className="form-group">
              <label>First Name *</label>
              <input className="form-control"
                type="text" 
                name="firstName" 
                value={firstName}
                onChange={onChange} 
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input className="form-control"
                type="text" 
                name="lastName" 
                value={lastName} 
                onChange={onChange} 
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input className="form-control"
                type="email" 
                name="email"
                value={email} 
                onChange={onChange} 
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input className="form-control" 
                type="password" 
                name="password" 
                value={password}
                onChange={onChange} 
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input className="form-control"
                type="password" 
                name="confirmPassword" 
                value={confirmPassword} 
                onChange={onChange} 
              />
            </div>

            <button className="btn btn-success btn-block" type="submit" disabled={!isSubmitButtonEnabled}>Register</button>
            { isLoading && <Loader /> }
        </form>      
          <p className="lead mt-4">Have An Account? {' '}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

Register.propTypes = {
  user:         PropTypes.object,
  setAlert:     PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user: state.userAuth
})

export default connect(mapStateToProps, { registerUser, setAlert })(Register);
