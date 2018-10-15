import React from 'react';
// redux
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

// app
import Root from '@/components/App/Root';
// store
import store from '@/stores';
import history from '@/services/history';

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
