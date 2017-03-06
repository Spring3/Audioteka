import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import DBConnectionView from './components/views/DBConnView';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={DBConnectionView}>
      <IndexRoute component={DBConnectionView}></IndexRoute>
    </Route>
  </Router>
  , document.getElementById('view'));
