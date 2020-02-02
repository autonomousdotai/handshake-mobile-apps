import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { initApp } from '@/app/action';
import Router from '@/components/Router/Router';
import I18n from '@/components/App/I18n';
import Alert from '@/components/Alert/Alert';
import Navigation from '@/components/core/controls/Navigation/Navigation';

// TODO: For Extension [will be combined with the main header of website]
import HeaderBar from '@/modules/HeaderBar/HeaderBar';

import '@/styles/main';
// import '@/styles/custom-icons/styles.css';
import BrowserDetect from '@/services/browser-detect';
import Loading from '@/components/Loading';

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

  // TODO: For Extension
  renderHeaderBar = () => {
    if (window.top === window.self) return null;
    return (<HeaderBar titleBar="Prediction" className="HeaderBarContainer" />);
  }

  renderNavigationBar = () => {
    if (BrowserDetect.isDesktop || window.top !== window.self) return null;
    return <Navigation />;
  }

  render() {
    if (this.props.isBlockedIP) {
      return 'Sorry, but your country ip isn\'t supported at the moment';
    }
    if (!this.state.loaded) return null;
    return (
      <Suspense fallback={<Loading isLoading />}>
        <I18n>
          <div className="root">
            <Alert />
            {this.renderHeaderBar()}
            <Router />
            {this.renderNavigationBar()}
          </div>
        </I18n>
      </Suspense>
    );
  }
}

export default connect((state) => {
  return {
    router: state.router,
    isBlockedIP: state.app.ipInfo.isBlock
  };
}, { initApp })(App);
