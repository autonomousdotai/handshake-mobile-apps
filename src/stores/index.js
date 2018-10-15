import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { firebaseReducer, reactReduxFirebase } from 'react-redux-firebase';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import dataReducer from '@/stores/data-reducer';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import reducers from '@/reducers';
import rootSaga from '@/stores/root-saga';
import defaultStore from '@/stores/default-store';

firebase.initializeApp(process.env.firebase);

/*
 * Reduce multiple reducers into a single reducer from left to right.
 * make sure that the first reducer in the list defines the initial state
 */
export function reduceReducers(...reducersList) {
  return (store, action) => {
    return reducersList.reduce((result, reducer) => reducer(result, action), store);
  };
}

const reducerList = {
  app: appReducer,
  auth: authReducer,
  firebase: firebaseReducer,
  ...reducers,
};
const defaultReducer = (s = {}) => s;
const AppReducers = combineReducers(
  Object.keys(defaultStore).reduce((result, key) => {
    return Object.assign({}, result, {
      [key]: reducers[key] ? reducers[key] : defaultReducer,
    });
  }, reducerList),
);

const sagaMiddleware = createSagaMiddleware();

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, process.env.firebase),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk, sagaMiddleware)),
)(createStore);

const rootReducer = reduceReducers(AppReducers, dataReducer);
const store = createStoreWithFirebase(connectRouter(history)(rootReducer), defaultStore);

sagaMiddleware.run(rootSaga);

export default store;
