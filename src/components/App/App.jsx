import React from 'react';
// redux
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
// app
import Root from '@/components/App/Root';
// store
import store from '@/stores';
import history from '@/services/history';
// styles
import '@/styles/main';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Root />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
