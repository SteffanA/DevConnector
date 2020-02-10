import React, { Fragment, useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Alert from './components/layout/Alert'
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/dashboard'
import PrivateRoute from './components/routing/PrivateRoute'

// Redux imports
import { Provider } from 'react-redux'
import store from './store'


import './App.css';
import { loadUser } from './actions/auth';

// Try to set the token if it exists on first page load
if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {

  // Try to load user on first load.
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
