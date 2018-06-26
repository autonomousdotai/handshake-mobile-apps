import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'querystring';
// contants
import { API_URL, APP, HANDSHAKE_ID, URL } from '@/constants';
// actions
import { changeLocale, setBannedCash, setBannedPrediction, setCheckBanned, setIpInfo } from '@/reducers/app/action';
// services
import $http from '@/services/api';
import { createDynamicImport } from '@/services/app';
import local from '@/services/localStore';
import BrowserDetect from '@/services/browser-detect';
// components
import Handle from '@/components/App/Handle';
import Loading from '@/components/core/presentation/Loading';

import IpInfo from '@/models/IpInfo';
import COUNTRIES_BLACKLIST_PREDICTION from '@/data/country-blacklist-betting';
import COUNTRIES_BLACKLIST_CASH from '@/data/country-blacklist-exchange';
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
const LandingPageWhitePaper = createDynamicImport(() => import('@/pages/LandingPage/WhitePaper'), Loading);
const LandingPageIntroNjnjaCash = createDynamicImport(() => import('@/pages/LandingPage/IntroducingNinjaCash'), Loading);
const LandingPageFAQ = createDynamicImport(() => import('@/pages/FAQ/FAQ'), Loading);
const MobileOrTablet = createDynamicImport(() => import('@/components/MobileOrTablet'), Loading);

class Root extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    changeLocale: PropTypes.func.isRequired,
    //
    setBannedPrediction: PropTypes.func.isRequired,
    setBannedCash: PropTypes.func.isRequired,
    setCheckBanned: PropTypes.func.isRequired,
    //
    setIpInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      messages,
      app: this.props.app,
      isLoading: true,
    };

    this.setLanguage = ::this.setLanguage;
    this.ipInfo = ::this.ipInfo;

    this.isSupportedLanguages = ['en', 'zh', 'fr', 'de', 'ja', 'ko', 'ru', 'es'];

    const currentLanguage = local.get(APP.LOCALE);
    if (currentLanguage && this.isSupportedLanguages.indexOf(currentLanguage) < 0) {
      local.remove(APP.LOCALE);
    }

    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { language, ref } = this.querystringParsed;
    if (language) this.setLanguage(language, false);
    if (ref) this.refer = ref;

    // IP info - locale
    this.ipInfo();
    this.timeOutInterval = setInterval(() => this.ipInfo(), 30 * 60 * 1000); // 30'
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

  ipInfo() {
    //console.log('app - handle - ipinfo');
    $http({
      url: 'https://ipapi.co/json',
      qs: {
        key: process.env.ipapiKey,
      },
    }).then((res) => {
      const { data } = res;
      // ipInfo
      const ipInfo = IpInfo.ipInfo(data);
      this.props.setIpInfo(ipInfo);
      local.save(APP.IP_INFO, ipInfo);

      // locale
      if (!local.get(APP.LOCALE)) {
        const firstLanguage = data.languages.split(',')[0];
        this.setLanguage(firstLanguage);
      }

      if (process.env.isProduction) {
        // should use country code: .country ISO 3166-1 alpha-2
        // https://ipapi.co/api/#complete-location
        if (COUNTRIES_BLACKLIST_PREDICTION.indexOf(data.country_name) !== -1) {
          this.props.setBannedPrediction();
        }
        if (COUNTRIES_BLACKLIST_CASH.indexOf(data.country_name) !== -1) {
          this.props.setBannedCash();
        }
      }
      this.props.setCheckBanned();
      this.setState({ isLoading: false });
      // /locale
    });
  }

  preRender() {
    if (window.location.pathname === URL.LANDING_PAGE_SHURIKEN) return <LandingPage />;
    if (window.location.pathname === URL.LANDING_PAGE_TRADE) return <LandingPageTrade />;
    if (window.location.pathname === URL.FAQ) return <LandingPageFAQ />;
    if (window.location.pathname === URL.WHITE_PAPER) return <LandingPageWhitePaper />;
    if (window.location.pathname === URL.INTRODUCING_NINJA_CASH) return <LandingPageIntroNjnjaCash />;
    if (BrowserDetect.isDesktop) return <MobileOrTablet />;
    return <Handle setLanguage={this.setLanguage} refer={this.refer} />;
  }

  render() {
    return (
      <IntlProvider
        locale={this.state.app.locale}
        messages={this.state.messages[this.state.app.locale]}
      >
        <div className="root">
          {
            this.state.isLoading
            ? <Loading style={{ height: '100vh' }} />
            : this.preRender()
          }
        </div>
      </IntlProvider>
    );
  }
}

export default connect(state => ({
  app: state.app,
}), {
  changeLocale,
  setIpInfo,
  setBannedPrediction,
  setBannedCash,
  setCheckBanned,
})(Root);

