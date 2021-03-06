import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerActions, routerMiddleware} from 'react-router-redux';
import {UserAuthWrapper} from 'redux-auth-wrapper';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './store/configureStore';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const initialState = {};

const router = routerMiddleware(browserHistory);
const store = configureStore(initialState, router);
const history = syncHistoryWithStore(browserHistory, store);
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: (state) => state.login.endpoint,
  redirectActions: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

import App from './containers/App';

import Applications from './containers/Applications';
import Devices from './containers/Devices';
import Profiles from './containers/Profiles';
import Workflows from './containers/Workflows';
import WorkflowPage from './containers/WorkflowPage';
import DevicePage from './containers/DevicePage';
import LoginDialog from './containers/LoginDialog';

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <Route path='/login' component={LoginDialog} />
        <Route path='/devices' component={UserIsAuthenticated(Devices)} />
        <Route path='/devices/:uuid' component={UserIsAuthenticated(DevicePage)} />
        <Route path='/applications' component={UserIsAuthenticated(Applications)} />
        <Route path='/profiles' component={UserIsAuthenticated(Profiles)} />
        <Route path='/workflows' component={UserIsAuthenticated(Workflows)} />
        <Route path='/workflows/add' component={UserIsAuthenticated(WorkflowPage)} />
        <Route path='/workflows/edit/:uuid' component={UserIsAuthenticated(WorkflowPage)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
