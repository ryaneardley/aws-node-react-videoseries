// @flow

import React from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reducers from './reducers/reducers';
import Routing from './components/Routing';

const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
  applyMiddleware(middleware),
);

export default () => {
  return <Provider store={store}>
    <ConnectedRouter  history={history}>
      <Routing />
    </ConnectedRouter>
  </Provider>
}
