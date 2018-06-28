import $http from '@/services/api';
import IpInfo from '@/models/IpInfo';
import axios from 'axios';
import { APP, API_URL, Country } from '@/constants';
import local from '@/services/localStore';
import COUNTRIES_BLACKLIST_PREDICTION from '@/data/country-blacklist-betting';
import COUNTRIES_BLACKLIST_CASH from '@/data/country-blacklist-exchange';
import { signUp, fetchProfile, authUpdate } from '@/reducers/auth/action';
import { getListOfferPrice, getUserProfile } from '@/reducers/exchange/action';
import { MasterWallet } from '@/models/MasterWallet';

export const APP_ACTION = {
  NETWORK_ERROR: 'NETWORK_ERROR',

  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_ROOT_LOADING: 'SET_ROOT_LOADING',

  CALLING: 'CALLING',
  CALLED: 'CALLED',

  LOADING: 'LOADING',
  LOADED: 'LOADED',

  ALERT: 'ALERT',
  CLOSE_ALERT: 'CLOSE_ALERT',
  SHOW_ALERT: 'SHOW_ALERT',
  HIDE_ALERT: 'HIDE_ALERT',

  MODAL: 'MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',

  NOT_FOUND_SET: 'NOT_FOUND_SET',
  NOT_FOUND_REMOVE: 'NOT_FOUND_REMOVE',

  HEADER_TITLE_SET: 'HEADER_TITLE_SET',
  HEADER_BACK_SET: 'HEADER_BACK_SET',
  HEADER_BACK_CLICK: 'HEADER_BACK_CLICK',
  HEADER_RIGHT_SET: 'HEADER_RIGHT_SET',
  HEADER_RIGHT_REMOVE: 'HEADER_RIGHT_REMOVE',
  HEADER_LEFT_SET: 'HEADER_LEFT_SET',
  HEADER_LEFT_REMOVE: 'HEADER_LEFT_REMOVE',
  HEADER_HIDE: 'HEADER_HIDE',
  HEADER_SHOW: 'HEADER_SHOW',

  IP_INFO: 'IP_INFO',

  BAN_CASH: 'BAN_CASH',
  BAN_PREDICTION: 'BAN_PREDICTION',
  BAN_CHECKED: 'BAN_CHECKED',

  SET_FIRECHAT: 'SET_FIRECHAT',
  SET_FIREBASE_USER: 'SET_FIREBASE_USER',
};

// Loading
export const showLoading = config => ({ type: APP_ACTION.LOADING, payload: { ...config } });
export const hideLoading = () => ({ type: APP_ACTION.LOADED });

// Modal
export const showModal = modalContent => ({ type: APP_ACTION.MODAL, modalContent });
export const hideModal = () => ({ type: APP_ACTION.CLOSE_MODAL });

// Alert
export const showAlert = config => ({ type: APP_ACTION.SHOW_ALERT, payload: { isShow: true, ...config } });
export const hideAlert = config => ({ type: APP_ACTION.HIDE_ALERT, payload: { isShow: false, ...config } });

// Header
export const setHeaderTitle = title => ({ type: APP_ACTION.HEADER_TITLE_SET, payload: title });
export const setHeaderCanBack = () => ({ type: APP_ACTION.HEADER_BACK_SET });
export const clickHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const clearHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const setHeaderRight = data => ({ type: APP_ACTION.HEADER_RIGHT_SET, payload: data });
export const clearHeaderRight = () => ({ type: APP_ACTION.HEADER_RIGHT_REMOVE });
export const setHeaderLeft = data => ({ type: APP_ACTION.HEADER_LEFT_SET, payload: data });
export const clearHeaderLeft = () => ({ type: APP_ACTION.HEADER_LEFT_REMOVE });
export const hideHeader = () => ({ type: APP_ACTION.HEADER_HIDE });
export const showHeader = () => ({ type: APP_ACTION.HEADER_SHOW });

// Not Found
export const setNotFound = () => ({ type: APP_ACTION.NOT_FOUND_SET });
export const clearNotFound = () => ({ type: APP_ACTION.NOT_FOUND_REMOVE });

// IP
export const setIpInfo = data => ({ type: APP_ACTION.IP_INFO, payload: data });

export const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

export const setBannedCash = () => ({ type: APP_ACTION.BAN_CASH });
export const setBannedPrediction = () => ({ type: APP_ACTION.BAN_PREDICTION });
export const setCheckBanned = () => ({ type: APP_ACTION.BAN_CHECKED });

// Chat
export const setFirechat = payload => ({ type: APP_ACTION.SET_FIRECHAT, payload });
export const setFirebaseUser = payload => ({ type: APP_ACTION.SET_FIREBASE_USER, payload });

// App
// |-- language
export const setLanguage = (data, autoDetect = true) => ({
  type: APP_ACTION.SET_LANGUAGE,
  payload: data,
  autoDetect,
});
// |-- loading
export const setRootLoading = bool => ({ type: APP_ACTION.SET_ROOT_LOADING, payload: bool });

const tokenHandle = ({
  token, resolve, reject, dispatch, ipInfo,
}) => {
  if (resolve) {
    if (token) {
      dispatch(fetchProfile({
        PATH_URL: 'user/profile',
        errorFn: (res) => {
          if (!process.env.isProduction) {
            if (res.message === 'Invalid user.') {
              local.remove(APP.AUTH_TOKEN);
              window.location.reload();
            }
          } else {
            dispatch(showAlert({
              message: 'Have something wrong with your profile, please contact supporters',
              timeOut: false,
              isShowClose: true,
              type: 'danger',
              callBack: () => {},
            }));
          }
        },
        successFn: () => {
          // success
          console.log('coins - getListOfferPrice - ipInfo', ipInfo);
          dispatch(getUserProfile({ PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE }));
          dispatch(getListOfferPrice({
            PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
            qs: { fiat_currency: ipInfo?.currency },
            errorFn(e) {
              console.log('coins - getListOfferPrice - redux - error', e);
            },
          }));
          // wallet
          const listWallet = MasterWallet.getMasterWallet();
          if (listWallet === false) {
            MasterWallet.createMasterWallets();
          } else {
            const shuriWallet = MasterWallet.getShurikenWalletJson();
            if (shuriWallet === false) {
              MasterWallet.createShuriWallet();
            }
          }
          const walletReward = MasterWallet.getShurikenWalletJson();
          const data = new FormData();
          data.append('reward_wallet_addresses', walletReward);
          dispatch(authUpdate({
            PATH_URL: 'user/profile',
            data,
            METHOD: 'POST',
            successFn: (res) => {
              console.log('app - handle - wallet - success - ', res);
            },
            errorFn: (e) => {
              console.log('app - handle - wallet - error - ', e);
            },
          }));
          resolve(true);
        },
      }));
    } else {
      // error
      reject(true);
    }
  } else {
    // error
    reject(true);
  }
};

const auth = ({ ref, dispatch, ipInfo }) => new Promise((resolve, reject) => {
  const token = local.get(APP.AUTH_TOKEN);
  if (token) {
    tokenHandle({
      resolve, token, dispatch, ipInfo,
    });
  } else {
    dispatch(signUp({
      PATH_URL: `user/sign-up${ref ? `?ref=${ref}` : ''}`,
      METHOD: 'POST',
      successFn: (res) => {
        const signUpToken = res.data.passpharse;
        console.log('signUpToken', signUpToken);
        tokenHandle({
          resolve, token: signUpToken, dispatch, ipInfo,
        });
      },
      errorFn: () => {
        tokenHandle({ reject, token, dispatch });
      },
    }));
  }
});

function getCountry(addrComponents) {
  for (var i = 0; i < addrComponents.length; i++) {
    if (addrComponents[i].types[0] == "country") {
      return addrComponents[i].short_name;
    }
    if (addrComponents[i].types.length == 2) {
      if (addrComponents[i].types[0] == "political") {
        return addrComponents[i].short_name;
      }
    }
  }
  return false;
}

// |-- init
export const initApp = (language, ref) => (dispatch) => {
  $http({
    url: 'https://ipapi.co/json',
    qs: { key: process.env.ipapiKey },
  }).then((res) => {
    const { data } = res;

    var ipInfo = IpInfo.ipInfo(data);
    //get currency base on GPS
    navigator.geolocation.getCurrentPosition((location) => {
      const {coords: {latitude, longitude}} = location;

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`).then((response) => {

        if (response.data.results[0] && response.data.results[0].address_components){
          var country = getCountry(response.data.results[0].address_components);
          if(country && Country[country]){
            ipInfo.currency = Country[country];
            console.log('------------GPS-------------' + ipInfo.currency);

          }
        }
      });
    });
    dispatch(setIpInfo(ipInfo));

    const ipInfoRes = { language: 'en', bannedPrediction: false, bannedCash: false };
    const languageSaved = local.get(APP.LOCALE);

    if (!languageSaved) {
      ipInfoRes.language = data.languages.split(',')?.[0] || 'en';
    } else {
      ipInfoRes.language = languageSaved;
    }

    const completedLanguage = language || ipInfoRes.language;

    if (APP.isSupportedLanguages.indexOf(completedLanguage) >= 0) {
      dispatch(setLanguage(completedLanguage, !language));
    }

    if (process.env.isProduction) {
      // should use country code: .country ISO 3166-1 alpha-2
      // https://ipapi.co/api/#complete-location
      if (COUNTRIES_BLACKLIST_PREDICTION.indexOf(data.country_name) !== -1) {
        ipInfoRes.bannedPrediction = true;
        dispatch(setBannedPrediction());
      }
      if (COUNTRIES_BLACKLIST_CASH.indexOf(data.country_name) !== -1) {
        ipInfoRes.bannedCash = true;
        dispatch(setBannedCash());
      }
    }

    auth({ ref, dispatch, ipInfo })
      .then(() => {
        dispatch(setRootLoading(false));
      })
      .catch(() => {
        // TO-DO: handle error
        dispatch(setRootLoading(false));
      });
  }).catch((e) => {
    // TO-DO: handle error
    console.log(e);
    dispatch(setRootLoading(false));
  });
};

