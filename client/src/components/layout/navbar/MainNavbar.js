import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../../redux/actions/userAuthActions';
import { clearCurrentVacation, clearDoneSuccessfully } from '../../../redux/actions/vacationActions';
import { PROJECT_NAME } from '../../../config/constants';

const MainNavbar = ({ user, logout, clearCurrentVacation, clearDoneSuccessfully }) => {
  const { isAuthenticated, isAdmin, currentUser, isLoading } = user; // isAuthenticated = authenticated user
  const history = useHistory();

  // Clear Current vacation (in case update action was not finished and Add vacation was chosen after that);
  const addVacationHandle = () => {
    clearCurrentVacation();
    clearDoneSuccessfully();
    history.push('/admin/add-vacation')
  }

  const authUserLinks = (
    <span className="d-md-flex align-items-center">
      <div className="mx-1">
        {isAuthenticated && 
           <span>Hello, <span className="text-success">{currentUser.firstName} </span></span>
        }
      </div> 
      <div>
        <Link to="#!" className="nav-link text-dark" onClick={logout}>      
            {' '}<i className="fas fa-sign-out-alt"></i> Logout
        </Link>
      </div>
    </span>
  );

  const guestLinks = (
    <>
      <Link to='/login' className="nav-link">
        <i className="fas fa-sign-in-alt"></i>{' '}<span>Login</span>            
      </Link>
      <Link to='/register' className="nav-link">
        <i className="fas fa-user-plus"></i>{' '}<span>Register</span>
      </Link>
    </>
  );
 
  const adminLinks = (
    <span className="d-md-flex align-items-center">
      <span>
        {isAdmin && <span className="nav-link">Hello, <span className="text-success">{currentUser.firstName}</span></span>}     
      </span>
      <Link to='#!' className="nav-link text-dark" onClick={addVacationHandle}>Add Vacation</Link>
      <Link to='/admin/report' className="nav-link text-dark">Report</Link>
      <Link to="#!" className="nav-link text-dark" onClick={logout}>{' '}<i className="fas fa-sign-out-alt"></i>{' '} Logout</Link>
    </span>
  );

  const guestMainLink = (
    <Link className="navbar-brand text-success" to="/">{PROJECT_NAME}</Link>
  );

  const userMainlink = (
    <Link className="navbar-brand text-success" to="/vacations">{PROJECT_NAME}</Link>
  )

  const adminMainlink = (
    <Link className="navbar-brand text-success" to="/admin/vacations">{PROJECT_NAME}</Link>
  )

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light d-print mb-5">
      <div className="container">
          { isAuthenticated ? userMainlink 
              : isAdmin ? adminMainlink : guestMainLink }          
          <div>
              <div className="navbar-nav ml-auto">
              {!isLoading &&  
                <>
                  { isAuthenticated ? authUserLinks 
                      : isAdmin ? adminLinks : guestLinks }
                </>
              }
              </div>
          </div>
      </div>
    </nav>
  )
}

MainNavbar.propTypes = {
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  clearCurrentVacation: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user: state.userAuth
});

export default connect(mapStateToProps, { logout, clearCurrentVacation, clearDoneSuccessfully })(MainNavbar);
