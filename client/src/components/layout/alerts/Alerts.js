import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alerts = ({ alerts }) => {
  return (
    <div>
      { alerts && alerts.length > 0 && 
          alerts.map(alert => <div key={alert.id} className={`alert alert-${alert.alertType}`} role="alert">
            {alert.msg}
          </div>
          )
      }
    </div>
  )
}

Alerts.propTypes = {
  alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alerts);
