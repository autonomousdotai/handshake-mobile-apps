import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// contants
import { URL } from '@/constants';
// services
import { createDynamicImport } from '@/services/app';
import BrowserDetect from '@/services/browser-detect';
// components
import Handle from '@/components/App/Handle';
import Loading from '@/components/core/presentation/Loading';
// languages
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import zh from 'react-intl/locale-data/zh';
import de from 'react-intl/locale-data/de';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import ru from 'react-intl/locale-data/ru';
import es from 'react-intl/locale-data/es';
import messages from '@/locals';

addLocaleData([...en, ...fr, ...zh, ...de, ...ja, ...ko, ...ru, ...es]);

// pages
const LandingPage = createDynamicImport(() => import('@/pages/LandingPage/LandingPage'), Loading);
const LandingPageTrade = createDynamicImport(() => import('@/pages/LandingPage/Trade'), Loading);
const LandingPageFAQ = createDynamicImport(() => import('@/pages/FAQ/FAQ'), Loading);
const MobileOrTablet = createDynamicImport(() => import('@/components/MobileOrTablet'), Loading);

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      messages,
      app: this.props.app,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.app.locale !== prevState.app.locale) {
      return { app: nextProps.app };
    }
    return null;
  }

  preRender() {
    if (window.location.pathname === URL.LANDING_PAGE_SHURIKEN) return <LandingPage />;
    if (window.location.pathname === URL.LANDING_PAGE_TRADE) return <LandingPageTrade />;
    if (window.location.pathname === URL.FAQ) return <LandingPageFAQ />;
    if (process.env.isProduction && BrowserDetect.isDesktop) return <MobileOrTablet />;
    return <Handle />;
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.app.locale}
        messages={this.state.messages[this.state.app.locale]}
      >
        <div className="root">
          {this.preRender()}
        </div>
      </IntlProvider>
    );
  }
}

export default connect(state => ({
  app: state.app,
}))(Root);

