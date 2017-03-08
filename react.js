import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import DBConnectionView from './components/views/DBConnView';
import AboutView from './components/views/AboutView';
import MainView from './components/views/MainView';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={DBConnectionView}>
      <IndexRoute component={DBConnectionView}></IndexRoute>
    </Route>
    <Route path='/about' component={AboutView}></Route>
    <Route path='/main' component={MainView}></Route>
  </Router>
  , document.getElementById('view'));
