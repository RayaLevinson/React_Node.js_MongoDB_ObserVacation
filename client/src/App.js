import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Provider } from 'react-redux'; // Redux
import store from './redux/store';      // Redux
import { loadUser } from './redux/actions/userAuthActions';
import MainNavbar from './components/layout/navbar/MainNavbar';
import Footer from './components/layout/footer/Footer';
import Landing from './pages/landing/Landing';
import Routes from './routing/Routes';
import './App.css';

export const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL
});

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());    
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <MainNavbar />
        <div className="container">
          <Switch>
            <Route exact path='/' component={Landing} />        
            <Route component={Routes} />
          </Switch>
        </div>
        <Footer />
      </Router>
    </Provider>
  )
}

export default App;
