import React from 'react';
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteVacation, setCurrentVacation, clearDoneSuccessfully } from '../../../redux/actions/vacationActions';

const VacationItem = props => {
  const { vacation, deleteVacation, setCurrentVacation, clearDoneSuccessfully } = props;
  
  const { title, destination, imageURL, price, dateFrom, dateTo, _id } = vacation;
  const history = useHistory();
  
  const editVacationClicked = () => {
    setCurrentVacation(vacation);
    clearDoneSuccessfully();
    history.push("/admin/add-vacation");
  }

  const deleteCurrentVacation = () => {
    deleteVacation(_id);
  }   

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 ">
      <div className="card card-vacation">
        <div>
          <img src={imageURL} className="card-img-top img-fluid" alt="" />
          <div className="card-img-overlay d-flex justify-content-end">
            <div className="d-flex flex-column">
              <div style={{height: '2rem'}} onClick={deleteCurrentVacation}><i className="fas fa-trash"></i></div>              
              <div onClick={editVacationClicked}><i className="fas fa-pencil-alt"></i></div>
            </div>
          </div>
        </div>
        <div className="card-body text-center card-body-vacation">
          <p className="text-success"><strong>{title}</strong></p>
          <p className="text-success">{destination}</p>
          <p>{new Intl.DateTimeFormat('en-GB').format(new Date(dateFrom))} - { new Intl.DateTimeFormat('en-GB').format(new Date(dateTo))}</p>
          <p>Price: ₪{price}</p>
        </div>
      </div>
    </div>
  )
}

VacationItem.propTypes = {
  vacation: PropTypes.object.isRequired,
  setCurrentVacation: PropTypes.func.isRequired,
  deleteVacation: PropTypes.func.isRequired,
  clearDoneSuccessfully: PropTypes.func.isRequired
}

export default connect(null, { setCurrentVacation, deleteVacation, clearDoneSuccessfully })(VacationItem);
