import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { initApp } from '@/app/action';
import Router from '@/components/Router/Router';
import I18n from '@/components/App/I18n';

import '@/styles/main';
import '@/styles/custom-icons/styles.css';

class App extends React.Component {
  static propTypes = {
    initApp: PropTypes.func.isRequired,
    isBlockedIP: PropTypes.bool.isRequired
  };

  state = {
    loaded: false
  };

  componentDidMount() {
    this.props.initApp().finally(() => {
      this.setState({ loaded: true });
    });
  }

  render() {
    if (this.props.isBlockedIP) {
      return 'Sorry, but your country ip isn\'t supported at the moment';
    }
    if (!this.state.loaded) return null;
    return (
      <I18n>
        <div className="root">
          <Router />
        </div>
      </I18n>
    );
  }
}

export default connect((state) => {
  return {
    router: state.router,
    isBlockedIP: state.app.ipInfo.isBlock
  };
}, { initApp })(App);
