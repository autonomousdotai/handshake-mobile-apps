import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import qs from 'querystring';
import axios from 'axios';
// contants
import { APP, API_URL } from '@/constants';
// services
import local from '@/services/localStore';
// actions
import { setIpInfo, showAlert, changeLocale, setBannedPrediction, setBannedCash, setCheckBanned } from '@/reducers/app/action';
import { signUp, fetchProfile, authUpdate, getFreeETH } from '@/reducers/auth/action';
import { getUserProfile, getListOfferPrice } from '@/reducers/exchange/action';
import { createMasterWallets } from '@/reducers/wallet/action';
// components
import { MasterWallet } from '@/models/MasterWallet';
import IpInfo from '@/models/IpInfo';
import COUNTRIES_BLACKLIST_PREDICTION from '@/data/country-blacklist-betting';
import COUNTRIES_BLACKLIST_CASH from '@/data/country-blacklist-exchange';
import Loading from '@/components/core/presentation/Loading';
import Router from '@/components/Router/Router';

class Handle extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    //
    firebase: PropTypes.object.isRequired,
    //
    showAlert: PropTypes.func.isRequired,
    //
    signUp: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    authUpdate: PropTypes.func.isRequired,
    getUserProfile: PropTypes.func.isRequired,
    //
    setBannedPrediction: PropTypes.func.isRequired,
    setBannedCash: PropTypes.func.isRequired,
    setCheckBanned: PropTypes.func.isRequired,
    //
    getListOfferPrice: PropTypes.func.isRequired,
    getFreeETH: PropTypes.func.isRequired,
    changeLocale: PropTypes.func.isRequired,
    setIpInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.checkRegistry = ::this.checkRegistry;
    this.authSuccess = ::this.authSuccess;
    this.firebase = ::this.firebase;
    this.notification = ::this.notification;

    this.state = {
      auth: this.props.auth,
    };

    this.isSupportedLanguages = ['en', 'zh', 'fr', 'de', 'ja', 'ko', 'ru', 'es'];

    const currentLanguage = local.get(APP.LOCALE);
    if (currentLanguage && this.isSupportedLanguages.indexOf(currentLanguage) < 0) {
      local.remove(APP.LOCALE);
    }
  }

  componentDidMount() {
    this.checkRegistry();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  getListOfferPrice = () => {
    this.props.getListOfferPrice({
      PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
      qs: { fiat_currency: this.props?.app?.ipInfo?.currency },
    });
  }

  setLanguage(language, autoDetect = true) {
    if (this.isSupportedLanguages.indexOf(language) >= 0) {
      this.props.changeLocale(language, autoDetect);
    }
  }

  ipInfo() {
    const url = `https://ipapi.co/json${process.env.ipapiKey ? `?key=${process.env.ipapiKey}` : ''}`;
    axios.get(url).then((res) => {
      const { data } = res;
      console.log('ipInfo', data);

      const ipInfo = IpInfo.ipInfo(data);
      this.props.setIpInfo(ipInfo);

      local.save(APP.IP_INFO, ipInfo);
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
    });
  }

  checkRegistry() {
    const querystring = window.location.search.replace('?', '');
    const { language, ref } = qs.parse(querystring);
    if (language) this.setLanguage(language, false);
    const token = local.get(APP.AUTH_TOKEN);

    if (token) {
      this.authSuccess();
    } else {
      this.props.signUp({
        PATH_URL: `user/sign-up${ref ? `?ref=${ref}` : ''}`,
        METHOD: 'POST',
        successFn: () => {
          this.authSuccess();
        },
      });
    }
  }

  authSuccess() {
    // basic profile
    this.props.fetchProfile({
      PATH_URL: 'user/profile',
      errorFn: (res) => {
        if (!process.env.isProduction) {
          if (res.message === 'Invalid user.') {
            local.remove(APP.AUTH_TOKEN);
            this.checkRegistry();
          }
        } else {
          this.props.showAlert({
            message: (
              <div className="text-center">
                Have something wrong with your profile, please contact supporters
              </div>
            ),
            timeOut: false,
            isShowClose: true,
            type: 'danger',
            callBack: () => {},
          });
        }
      },
      // end error fn
      successFn: () => {
        // exchange profile
        this.props.getUserProfile({
          PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE,
        });

        // GET IP INFO
        this.ipInfo();
        this.timeOutInterval = setInterval(() => {
          this.ipInfo();
        }, 30 * 60 * 1000); // 30'

        // GET PRICE
        this.getListOfferPrice();
        this.timeOutGetPrice = setInterval(() => {
          this.getListOfferPrice();
        }, 2 * 60 * 1000); // 2'

        // wallet handle
        let listWallet = MasterWallet.getMasterWallet();

        if (listWallet === false) {
          this.setState({ loadingText: 'Creating your local wallets' });
          listWallet = createMasterWallets().then(() => {
            this.setState({ isLoading: false, loadingText: '' });
            if (!process.env.isProduction) {
              const wallet = MasterWallet.getWalletDefault('ETH');
              this.props.getFreeETH({
                PATH_URL: `/user/free-rinkeby-eth?address=${wallet.address}`,
                METHOD: 'POST',
              });
            }
          });
        } else {
          this.setState({ isLoading: false });
        }
        this.firebase();
      },
      // end success fn
    });
  }

  firebase() {
    this.notification();
    this.props.firebase.watchEvent('value', `/users/${this.state.auth.profile.id}`);
    this.props.firebase.watchEvent('value', `/config`);
  }

  notification() {
    try {
      const messaging = this.props.firebase.messaging();
      messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .catch(e => console.log(e))
        .then((notificationToken) => {
          const params = new URLSearchParams();
          params.append('fcm_token', notificationToken);
          this.props.authUpdate({
            PATH_URL: 'user/profile',
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            METHOD: 'POST',
          });
        })
        .catch(e => console.log(e));
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loading message={this.state.loadingText} />;
    }
    return (
      <Router />
    );
  }
}

export default compose(withFirebase, connect(state => ({
  auth: state.auth,
  app: state.app,
}), {
  showAlert,
  signUp,
  fetchProfile,
  authUpdate,
  getUserProfile,
  getFreeETH,
  getListOfferPrice,
  setIpInfo,
  changeLocale,
  setBannedPrediction,
  setBannedCash,
  setCheckBanned,
}))(Handle);
