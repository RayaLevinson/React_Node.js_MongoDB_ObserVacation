import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateUserRoute from './PrivateUserRoute';
import PrivateAdminRoute from './PrivateAdminRoute';
import Login from '../components/users/auth/Login';
import Register from '../components/users/auth/Register';
import Alerts from '../components/layout/alerts/Alerts';
import NotFound from '../pages/404/NotFound';
import Vacations from '../components/admin/vacations/Vacations';
import VacationForm from '../components/admin/vacations/VacationForm';
import VacationsForUsers from '../components/users/vacations/VacationsForUsers';
import Report from '../components/admin/report/Report';

// Putting several routes in the separate component solves issue where Landing page is outside of the Switch (because it's not in the container), and as a result NotFound Component appears right under the Landing Page.
const Routes = () => {
  return (
    <div className="container">
      <Alerts />
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <PrivateUserRoute  exact path='/vacations' component={VacationsForUsers} />
        <PrivateAdminRoute exact path='/admin/vacations' component={Vacations} />
        <PrivateAdminRoute exact path='/admin/add-vacation' component={VacationForm} />
        <PrivateAdminRoute exact path='/admin/report' component={Report} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}

export default Routes;