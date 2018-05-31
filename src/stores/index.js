import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import thunk from 'redux-thunk';
import reducers from '@/reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const reducersApp = combineReducers({
  app: appReducer,
  auth: authReducer,
  router: routerReducer,
  ...reducers,
});

const store = createStore(
  reducersApp,
  composeWithDevTools(applyMiddleware(
    routerMiddleware(history),
    thunk,
  )),
);

export default store;
