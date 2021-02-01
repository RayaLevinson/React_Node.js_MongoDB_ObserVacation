import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateAdminRoute = ({ component: Component, user, ...rest }) => {
  const { isAdmin, isLoading } = user;

  return (
    <Route
      {...rest}
      render={props => 
          !isAdmin && !isLoading
          ?
            <Redirect to={
              {
                pathname: `/login`,
                state: {
                  from: props.location
                }
              }
            } />
          :
            <Component {...props} />
        }      
    />      
  )
}

PrivateAdminRoute.propTypes = {
  component: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.userAuth
});

export default connect(mapStateToProps)(PrivateAdminRoute);