import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { firebaseReducer, reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import firebase from 'firebase';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import reducers from '@/reducers';
import configs from '@/configs';

firebase.initializeApp(configs.firebase);

const AppReducers = combineReducers({
  firebase: firebaseReducer,
  app: appReducer,
  auth: authReducer,
  router: routerReducer,
  ...reducers,
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, configs.firebase),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
)(createStore);

const store = createStoreWithFirebase(AppReducers);

export default store;
