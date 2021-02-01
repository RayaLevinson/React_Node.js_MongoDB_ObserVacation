import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getVacations } from '../../../redux/actions/vacationActions';
import Chart from './chart/Chart';
import Loader from '../../layout/loader/Loader';

const Report = ({ vacation, getVacations }) => {
  const { vacations, isLoading, chartData } = vacation;

  useEffect(() => {
    getVacations();
    // eslint-disable-next-line 
  }, []); 

  return (
    <div className="mb-3">
      {
        isLoading
        ?
          <Loader />
        :  
          vacations && (vacations.length > 0) 
            ?            
              chartData && chartData.labels && (chartData.labels.length > 0)
                ?
                  <Chart chartData={chartData} />
                :
                  <div className='text-center'>
                    <p>There are no vacations with followers.</p>
                  </div>                                      
            : 
              <div className='text-center'>
                <p>There are no vacations in the database.</p>
              </div>
      }
    </div>
  )
}

Report.propTypes = {
  vacation: PropTypes.object.isRequired,
  getVacations: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  vacation: state.vacation
})

export default connect(mapStateToProps, { getVacations })(Report);
