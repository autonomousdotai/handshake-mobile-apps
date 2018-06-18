import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'querystring';
// contants
import { URL, APP } from '@/constants';
// actions
import { changeLocale } from '@/reducers/app/action';
// services
import { createDynamicImport } from '@/services/app';
import local from '@/services/localStore';
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
    changeLocale: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      messages,
      app: this.props.app,
    };

    this.setLanguage = ::this.setLanguage;

    this.isSupportedLanguages = ['en', 'zh', 'fr', 'de', 'ja', 'ko', 'ru', 'es'];

    const currentLanguage = local.get(APP.LOCALE);
    if (currentLanguage && this.isSupportedLanguages.indexOf(currentLanguage) < 0) {
      local.remove(APP.LOCALE);
    }

    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { language, ref } = this.querystringParsed;
    if (language) this.setLanguage(language, false);
    if (ref) this.ref = ref;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.app.locale !== prevState.app.locale) {
      return { app: nextProps.app };
    }
    return null;
  }

  // locale
  setLanguage(language, autoDetect = true) {
    if (this.isSupportedLanguages.indexOf(language) >= 0) {
      this.props.changeLocale(language, autoDetect);
    }
  }
  // /locale

  preRender() {
    if (window.location.pathname === URL.LANDING_PAGE_SHURIKEN) return <LandingPage />;
    if (window.location.pathname === URL.LANDING_PAGE_TRADE) return <LandingPageTrade />;
    if (window.location.pathname === URL.FAQ) return <LandingPageFAQ />;
    if (BrowserDetect.isDesktop) return <MobileOrTablet />;
    return <Handle setLanguage={this.setLanguage} ref={this.ref} />;
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
}), {
  changeLocale,
})(Root);

