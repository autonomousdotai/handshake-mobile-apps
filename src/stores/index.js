import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import thunk from 'redux-thunk';
import reducers from '@/reducers';
import { firebaseStateReducer, reactReduxFirebase } from 'react-redux-firebase';
import configs from '@/configs';
import firebase from 'firebase';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

firebase.initializeApp(configs.firebase);
const reducersApp = combineReducers({
  firebase: firebaseStateReducer,
  app: appReducer,
  auth: authReducer,
  router: routerReducer,
  ...reducers,
});

const store = createStore(
  reducersApp,
  configs.firebase.apiKey
    ? compose(
      reactReduxFirebase(firebase, configs.firebase),
      composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
    )
    : composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
);

// const store = compose(reactReduxFirebase(configs.firebase, {}),createStore(
//   reducersApp,
//   composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
// ));

export default store;
