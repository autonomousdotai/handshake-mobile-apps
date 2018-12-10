import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { initApp } from '@/app/action';
import Router from '@/components/Router/Router';
import I18n from '@/components/App/I18n';
import Navigation from '@/components/core/controls/Navigation/Navigation';

import '@/styles/main';
import '@/styles/custom-icons/styles.css';
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

  renderNavigationBar = () => {
    if (BrowserDetect.isDesktop) return null;
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
