import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getVacationsForUsers } from '../../../redux/actions/vacationActions';
import VacationItemForUsers from './VacationItemForUsers';
import Loader from '../../layout/loader/Loader';
import './VacationItemForUser.css';

const VacationsForUsers = ({ vacation, getVacationsForUsers, currentUser }) => {
  const {vacations, isLoading} = vacation;

  useEffect(() => {
    let currUserId = currentUser !== null ? currentUser._id : null;
    getVacationsForUsers(currUserId);
    // eslint-disable-next-line    
  }, []);

  return (
    <div className="row mb-5">
      { isLoading 
          ? <Loader />
          : <>        
              { vacations && vacations.length > 0 
                  ?
                    vacations.map(vacation => <VacationItemForUsers key={vacation._id} vacation={vacation} />)
                  : 
                    <div className="col text-center">
                      <p>There are no vacations in the database.</p>
                    </div>
              }
            </>
      }
    </div>
  )
}

VacationsForUsers.propTypes = {  
  getVacationsForUsers: PropTypes.func.isRequired,
  vacation: PropTypes.object,
  currentUser: PropTypes.object
}

const mapStateToProps = state => ({
  vacation: state.vacation,
  currentUser: state.userAuth.currentUser
});

export default connect(mapStateToProps, { getVacationsForUsers })(VacationsForUsers);