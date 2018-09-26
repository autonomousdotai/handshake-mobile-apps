import React from 'react';
import $http from '@/services/api';
import IpInfo from '@/models/IpInfo';
import axios from 'axios';
import { API_URL, APP, Country, LOCATION_METHODS } from '@/constants';
import local from '@/services/localStore';
import COUNTRIES_BLACKLIST_PREDICTION from '@/data/country-blacklist-betting';
import COUNTRIES_BLACKLIST_CASH from '@/data/country-blacklist-exchange';
import { authUpdate, fetchProfile, getFreeETH, signUp } from '@/reducers/auth/action';
import { getListOfferPrice, getUserProfile } from '@/reducers/exchange/action';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import BrowserDetect from '@/services/browser-detect';

export const APP_ACTION = {

  SHOW_CONFIRM: 'SHOW_CONFIRM',
  HIDE_CONFIRM: 'SHOW_CONFIRM',

  SHOW_SCAN_QRCODE: 'SHOW_SCAN_QRCODE',
  HIDE_SCAN_QRCODE: 'HIDE_SCAN_QRCODE',

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
  UPDATE_MODAL: 'UPDATE_MODAL',

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

  SET_FIREBASE_USER: 'SET_FIREBASE_USER',
};

// confirm passcode:
export const newPasscode = config => ({ type: APP_ACTION.SHOW_CONFIRM, payload: { isShow: true, type: 1, ...config } });
export const requestWalletPasscode = config => ({ type: APP_ACTION.SHOW_CONFIRM, payload: { isShow: true, type: 2, ...config } });
export const updatePasscode = config => ({ type: APP_ACTION.HIDE_CONFIRM, payload: { isShow: true, type: 3, ...config } });
export const hidePasscode = config => ({ type: APP_ACTION.HIDE_CONFIRM, payload: { isShow: false, type: 4, ...config } });

// scan qrcode:
export const showScanQRCode = config => ({ type: APP_ACTION.SHOW_SCAN_QRCODE, payload: { isShow: true, ...config } });
export const hideScanQRCode = config => ({ type: APP_ACTION.HIDE_SCAN_QRCODE, payload: { isShow: false, ...config } });

// Loading
export const showLoading = config => ({ type: APP_ACTION.LOADING, payload: { ...config } });
export const hideLoading = () => ({ type: APP_ACTION.LOADED });

// Modal
export const showModal = modalContent => ({ type: APP_ACTION.MODAL, modalContent });
export const hideModal = () => ({ type: APP_ACTION.CLOSE_MODAL });
export const updateModal = (payload) => ({ type: APP_ACTION.UPDATE_MODAL, payload });

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
  token, resolve, reject, dispatch, ipInfo, isSignup,
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
          dispatch(getUserProfile({ PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE }));
          dispatch(getListOfferPrice({
            PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
            // qs: { fiat_currency: ipInfo?.currency },
            errorFn(e) {
              console.log('coins - getListOfferPrice - redux - error', e);
            },
          }));
          // wallet          
          const listWallet = MasterWallet.getMasterWallet();          
          if (listWallet === false) {
            MasterWallet.createMasterWallets();
            console.log('create wallet success');
          } else {
            // const shuriWallet = MasterWallet.getShuriWallet();
            // if (shuriWallet === false) {
            //   MasterWallet.createShuriWallet();
            // }
          }

          let ethAddress = "";
          if(listWallet && listWallet.length > 0){
            ethAddress = listWallet[0].address;
          }
          //const shuriWallet = MasterWallet.getShuriWallet();
          const data = new FormData();
          //data.append('reward_wallet_addresses', MasterWallet.convertToJsonETH(shuriWallet));
          data.append("wallet_addresses", MasterWallet.getListWalletAddressJson());
          if (isSignup) {
            // update address to username:
            ///data.append('username', shuriWallet.address);
            if(ethAddress)
              data.append('username', ethAddress);
          }

          dispatch(authUpdate({
            PATH_URL: 'user/profile',
            data,
            METHOD: 'POST',
            successFn: (res) => {
              // console.log('app - handle - wallet - success - ', res);
              if (isSignup && process.env.isDojo && !process.env.isLive) {
                // console.log('call request free eth ...');
                dispatch(getFreeETH({
                  PATH_URL: `/user/free-rinkeby-eth?address=${ethAddress}`,
                  METHOD: 'POST',
                  successFn(e) {
                    console.log('request free eth success', e);
                  },
                  errorFn: (e) => {
                    // console.log('app - handle - getFreeETH - wallet - error - ', e);
                  },
                }));
              }
            },
            errorFn: (e) => {
              // console.log('app - handle - wallet - error - ', e);
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
      resolve, token, dispatch, ipInfo, isSignup: false,
    });
  } else {
    dispatch(signUp({
      PATH_URL: `user/sign-up${ref ? `?ref=${ref}` : ''}`,
      METHOD: 'POST',
      successFn: (res) => {
        const signUpToken = res.data.passpharse;
        console.log('signUpToken', signUpToken);
        tokenHandle({
          resolve, token: signUpToken, dispatch, ipInfo, isSignup: true,
        });
      },
      errorFn: () => {
        tokenHandle({ reject, token, dispatch });
      },
    }));
  }
});

function getCountry(addrComponents) {
  for (let i = 0; i < addrComponents.length; i++) {
    if (addrComponents[i].types[0] == 'country') {
      return addrComponents[i].short_name;
    }
    if (addrComponents[i].types.length == 2) {
      if (addrComponents[i].types[0] == 'political') {
        return addrComponents[i].short_name;
      }
    }
  }
  return false;
}

export const getUserLocation = ({ successFn, errorFn }) => (dispatch) => {
  $http({
    url: 'https://ipapi.co/json',
    qs: { key: process.env.ipapiKey },
  }).then((res) => {
    const { data } = res;

    const ipInfo = IpInfo.ipInfo(data);
    ipInfo.locationMethod = LOCATION_METHODS.IP;
    // get currency base on GPS
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location;
      ipInfo.latitude = latitude;
      ipInfo.longitude = longitude;
      ipInfo.locationMethod = LOCATION_METHODS.GPS;
      console.log(`------------GPS-------------${latitude}`);

      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`).then((response) => {
        if (response.data.results[0] && response.data.results[0].address_components) {
          const country = getCountry(response.data.results[0].address_components);

          ipInfo.addressDefault = response.data.results[0].formatted_address;

          if (country && Country[country]) {
            ipInfo.currency = Country[country];
            console.log(`------------GPS-------------${ipInfo.currency}`);
          }
        }
        dispatch(setIpInfo(ipInfo));
      });
      if (successFn) {
        successFn(ipInfo);
      }
    }, () => {
      // console.log('zon')// fallback
      if (successFn) {
        successFn(ipInfo);
      }
    });

    dispatch(setIpInfo(ipInfo));
  }).catch((e) => {
    // TO-DO: handle error
    console.log(e);
    if (errorFn) {
      errorFn(e);
    }
  });
};

function processGPS(ipInfo, dispatch) {
// get currency base on GPS
  navigator.geolocation.getCurrentPosition((location) => {
    const {coords: {latitude, longitude}} = location;
    ipInfo.latitude = latitude;
    ipInfo.longitude = longitude;
    console.log(`------------GPS-------------${latitude}`);

    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true`).then((response) => {
      if (response.data.results[0] && response.data.results[0].address_components) {
        const country = getCountry(response.data.results[0].address_components);

        ipInfo.addressDefault = response.data.results[0].formatted_address;

        if (country && Country[country]) {
          ipInfo.currency = Country[country];
          console.log(`------------GPS-------------${ipInfo.currency}`);
        }
      }
      dispatch(setIpInfo(ipInfo));
    });
  }, () => {
    // console.log('zon')// fallback
  });
}

// show popup to get GPS permission
export const showPopupGetGPSPermission = () => (dispatch) => {
  const ipInfo = local.get(APP.IP_INFO);
  if (!BrowserDetect.isDesktop) {
    if (!local.get(APP.ALLOW_LOCATION_ACCESS)) {
      dispatch(updateModal({
        show: true,
        title: null,
        body: (
          <div>
            <div className="d-table w-100">
              <div className="d-table-cell pr-2 align-top">
                <span className="icon-location" style={{ fontSize: '42px' }} />
              </div>
              <div className="d-table-cell align-top">
                <div><FormattedHTMLMessage id="askLocationPermission.label.1" /></div>
                <div className="mt-1"><FormattedHTMLMessage id="askLocationPermission.label.2" /></div>
              </div>
            </div>
            <div className="mt-3 float-right">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  local.save(APP.ALLOW_LOCATION_ACCESS, 'deny');
                  dispatch(updateModal({ show: false }));
                }}
              >
                <FormattedMessage id="askLocationPermission.btn.dontAllow" />
              </button>
              <button
                className="ml-2 btn btn-primary"
                style={{ minWidth: '123px' }}
                onClick={() => {
                  local.save(APP.ALLOW_LOCATION_ACCESS, 'allow');
                  dispatch(updateModal({ show: false }));

                  processGPS(ipInfo, dispatch);
                }}
              >
                <FormattedMessage id="askLocationPermission.btn.allow" />
              </button>
            </div>
          </div>
        ),
      }));
    } else if (local.get(APP.ALLOW_LOCATION_ACCESS) === 'allow') {
      processGPS(ipInfo, dispatch);
    }
  }
}

// |-- init
export const initApp = (language, ref) => (dispatch) => {
  $http({
    url: 'https://ipapi.co/json',
    qs: { key: process.env.ipapiKey },
  }).then((res) => {
    const { data } = res;
    const ipInfo = IpInfo.ipInfo(data);

    // show popup to get GPS permission
    // if (!BrowserDetect.isDesktop) {
    //   if (!local.get(APP.ALLOW_LOCATION_ACCESS)) {
    //
    //     dispatch(updateModal({
    //       show: true,
    //       title: null,
    //       body: (
    //         <div>
    //           <div className="d-table w-100">
    //             <div className="d-table-cell pr-2 align-top">
    //               <span className="icon-location" style={{ fontSize: '42px' }} />
    //             </div>
    //             <div className="d-table-cell align-top">
    //               <div><FormattedHTMLMessage id="askLocationPermission.label.1" /></div>
    //               <div className="mt-1"><FormattedHTMLMessage id="askLocationPermission.label.2" /></div>
    //             </div>
    //           </div>
    //           <div className="mt-3 float-right">
    //             <button
    //               className="btn btn-outline-primary"
    //               onClick={() => {
    //                 local.save(APP.ALLOW_LOCATION_ACCESS, 'deny');
    //                 dispatch(updateModal({ show: false }));
    //               }}
    //             >
    //               <FormattedMessage id="askLocationPermission.btn.dontAllow" />
    //             </button>
    //             <button
    //               className="ml-2 btn btn-primary"
    //               style={{ minWidth: '123px' }}
    //               onClick={() => {
    //                 local.save(APP.ALLOW_LOCATION_ACCESS, 'allow');
    //                 dispatch(updateModal({ show: false }));
    //
    //                 processGPS(ipInfo, dispatch);
    //               }}
    //             >
    //               <FormattedMessage id="askLocationPermission.btn.allow" />
    //             </button>
    //           </div>
    //         </div>
    //       )
    //     }));
    //   } else if (local.get(APP.ALLOW_LOCATION_ACCESS) === 'allow') {
    //     processGPS(ipInfo, dispatch);
    //   }
    // }

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

