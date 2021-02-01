import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addFollowerToVacation, removeFollowerFromVacation } from '../../../redux/actions/vacationActions';

const VacationItemForUsers = props => {
  const { vacation, currentUser, addFollowerToVacation, removeFollowerFromVacation } = props;
  const { title, destination, imageURL, price, dateFrom, dateTo, followers } = vacation;
  
  const [isFollowing, setIsFollowing] = useState(false);

  // Used when admin updates vacation
  useEffect(() => {
    if (followers.includes(currentUser._id)) {
      vacation.isSelected = true;
      setIsFollowing(true);
    }
  // eslint-disable-next-line     
  }, [vacation])

  const addFollower = () => {
    vacation.isSelected = true;
    setIsFollowing(true);
    addFollowerToVacation(vacation, currentUser._id);
  }

  const removeFollower = () => {
    vacation.isSelected = false;
    setIsFollowing(false);
    removeFollowerFromVacation(vacation, currentUser._id);
  }

  return (
    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 my-1">
      <div className="card card-vacation">
        <div>
          <img src={imageURL} className="card-img-top img-fluid" alt="" />
          <div className="card-img-overlay d-flex justify-content-end">
            <div className="d-flex flex-column justify-content-between">
              {isFollowing
                ? 
                  <span style={followerStyle} onClick={removeFollower}><i className="fas fa-heart"></i></span>
                :
                  <span onClick={addFollower}><i className="far fa-heart"></i></span>
              }
              <div className="following-number">{followers.length}</div>
            </div>
          </div>
        </div>
        <div className="card-body card-body-vacation">
          <p className="text-center text-success"><strong>{title}</strong></p>
          <p className="text-center text-success">{destination}</p>
          <p className="text-center">{new Intl.DateTimeFormat('en-GB').format(new Date(dateFrom))} - { new Intl.DateTimeFormat('en-GB').format(new Date(dateTo))}</p>
          <p style={{marginLeft: '0.45rem'}}>Price: ₪{price}</p>
        </div>
      </div>
    </div>      
  )
}

const followerStyle = {
  color: 'red'
}

VacationItemForUsers.propTypes = {
  vacation: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  addFollowerToVacation: PropTypes.func.isRequired,
  removeFollowerFromVacation: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  currentUser: state.userAuth.currentUser
});

export default connect(mapStateToProps, { addFollowerToVacation, removeFollowerFromVacation })(VacationItemForUsers);
