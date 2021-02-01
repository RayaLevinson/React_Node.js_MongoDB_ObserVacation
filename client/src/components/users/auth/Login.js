import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login } from '../../../redux/actions/userAuthActions';
import { setAlert } from '../../../redux/actions/alertsActions';
import Loader from '../../layout/loader/Loader';
import { isLoginInputValid } from '../../../utils/validation/userValidation';


const Login = props => {
  const { login, user, setAlert } = props;  
  const { isAuthenticated, isAdmin, isLoading } = user;
  const [ isSubmitButtonEnabled, setIsSubmitButtonEnabled ] = useState(false);
  
  const [ formData, setFormData ] = useState({
    email:     '',
    password:  ''
  });
  const { email, password } = formData;

  const onChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }
  
  const onSubmit = e => {
    e.preventDefault();

    if (isFinalFormValid()) {
      // Attempt to login
      login(formData);
    }
  }  

   // Used in order to enable / disable submit button (Login)
  useEffect(() => {
    setIsSubmitButtonEnabled(!isLoading && isCurrentStageValid());
  // eslint-disable-next-line    
  }, [email, password, isLoading]);

  const isCurrentStageValid = () => {
    let isValid = false;

    if (email !== '' && password !== '') {
      isValid = true;      
    }
    return isValid;
  }

  const isFinalFormValid = () => {
    const inputValues = { email, password };
    const errors = [];

    if (isLoginInputValid(inputValues, errors)) {
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
            <h1 className="text-center text-success mb-3"><i className="fas fa-sign-in-alt"></i>  Login</h1>
            <h5 className="text-center">Login into Your Account</h5>
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
            <button className="btn btn-success btn-block" type="submit" disabled={!isSubmitButtonEnabled}>Login</button>
            { isLoading && <Loader /> }
          </form>      
          <p className="lead mt-4">No account? {' '}
              <Link to="/register">Register</Link>
          </p>
        </div>
      </div>        
    </div>
  )
}

Login.propTypes = {
  user:     PropTypes.object,
  login:    PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user: state.userAuth
});

export default connect(mapStateToProps, { login, setAlert })(Login);