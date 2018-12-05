import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { ConnectedRouter } from 'connected-react-router';

import App from '@/components/App/App';
import store from '@/stores';
import history from '@/services/history';

import { getGasPrice } from '@/utils/gasPrice.js';

window.gasPrice = 64;
getGasPrice();

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Component />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

// webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('@/components/App/App', () => {
    render(App);
  });
}
