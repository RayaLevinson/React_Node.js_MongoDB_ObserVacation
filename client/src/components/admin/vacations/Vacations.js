import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getVacations } from '../../../redux/actions/vacationActions';
import VacationItem from './VacationItem';
import Loader from '../../layout/loader/Loader';

const Vacations = ({ vacation, getVacations }) => {
  const {vacations, isLoading} = vacation;

  useEffect(() => {
    getVacations();
    // eslint-disable-next-line    
  }, []);

  return (
    <div className="row mb-5">
      { isLoading 
          ? <Loader />
          : <>
              { vacations && vacations.length > 0 
                  ?
                    vacations.map(vacation => <VacationItem key={vacation._id} vacation={vacation} />)
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

Vacations.propTypes = {  
  getVacations: PropTypes.func.isRequired,
  vacation: PropTypes.object
}

const mapStateToProps = state => ({
  vacation: state.vacation
});

export default connect(mapStateToProps, { getVacations })(Vacations);