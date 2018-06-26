import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'querystring';

import { initApp } from '@/reducers/app/action';
import I18n from '@/components/App/I18n';
import Splash from '@/components/App/Splash';
import Handle from '@/components/App/Handle';
import { createDynamicImport } from '@/services/app';
import BrowserDetect from '@/services/browser-detect';

// styles
import '@/styles/main';

// pages
const LandingPage = createDynamicImport(() => import('@/pages/LandingPage/LandingPage'), Splash);
const LandingPageTrade = createDynamicImport(() => import('@/pages/LandingPage/Trade'), Splash);
const LandingPageWhitePaper = createDynamicImport(() => import('@/pages/LandingPage/WhitePaper'), Splash);
const IntroNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/IntroducingNinjaCash'), Splash);
const LandingPageFAQ = createDynamicImport(() => import('@/pages/FAQ/FAQ'), Splash);
const MobileOrTablet = createDynamicImport(() => import('@/components/MobileOrTablet'), Splash);

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    initApp: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      rootLoading: this.props.app.rootLoading,
    };
  }


  componentDidMount() {
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { language, ref } = querystringParsed;
    this.props.initApp(language, ref);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.app.rootLoading !== prevState.rootLoading) {
      return { rootLoading: nextProps.rootLoading };
    }
    return null;
  }

  preRender() {
    switch (window.location.pathname) {
      case URL.LANDING_PAGE_SHURIKEN:
        return <LandingPage />;
      case URL.LANDING_PAGE_TRADE:
        return <LandingPageTrade />;
      case URL.FAQ:
        return <LandingPageFAQ />;
      case URL.WHITE_PAPER:
        return <LandingPageWhitePaper />;
      case URL.INTRODUCING_NINJA_CASH:
        return <IntroNjnjaCash />;
      default:
        // code
    }
    if (BrowserDetect.isDesktop) {
      return <MobileOrTablet />;
    }
    return <Handle setLanguage={this.setLanguage} refer={this.refer} />;
  }

  render() {
    return (
      <I18n>
        <div className="root">
          {
            this.state.rootLoading
            ? <Splash />
            : null
          }
          {
            !this.state.rootLoading
            ? this.preRender()
            : null
          }
        </div>
      </I18n>
    );
  }
}

export default connect(state => ({ app: state.app }), ({ initApp }))(Root);
