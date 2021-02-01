import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from '../components/layout/loader/Loader';

const PrivateUserRoute = ({ component: Component, user, ...rest }) => {
  const { isAuthenticated, isLoading } = user;

  return (
    <Route
      {...rest}
      render={props => 
        isLoading 
          ? ( <Loader /> )
          : isAuthenticated 
              ? ( <Component {...props} />)
              : ( <Redirect to={
                    {
                      pathname: `/login`,
                      state: {
                        from: props.location
                      }
                    } 
                  }
                /> )
        }      
    />      
  )
}

PrivateUserRoute.propTypes = {
  component: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.userAuth
});

export default connect(mapStateToProps)(PrivateUserRoute);
