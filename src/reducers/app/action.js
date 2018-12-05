import React from 'react';
import $http from '@/services/api';
import IpInfo from '@/models/IpInfo';
import { API_URL, APP, Country, LOCATION_METHODS } from '@/constants';
import local from '@/services/localStore';
import COUNTRIES_BLACKLIST_PREDICTION from '@/data/country-blacklist-betting';
import {
  authUpdate,
  fetchProfile,
  getFreeETH,
  signUp
} from '@/reducers/auth/action';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

export const APP_ACTION = {
  SHOW_CONFIRM: 'SHOW_CONFIRM',
  HIDE_CONFIRM: 'SHOW_CONFIRM',

  SHOW_SCAN_QRCODE: 'SHOW_SCAN_QRCODE',
  HIDE_SCAN_QRCODE: 'HIDE_SCAN_QRCODE',

  SHOW_QRCODE_CONTENT: 'SHOW_QRCODE_CONTENT',
  HIDE_QRCODE_CONTENT: 'HIDE_QRCODE_CONTENT',

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

  SET_FIREBASE_USER: 'SET_FIREBASE_USER'
};

// confirm passcode:
export const newPasscode = config => ({
  type: APP_ACTION.SHOW_CONFIRM,
  payload: { isShow: true, type: 1, ...config }
});
export const requestWalletPasscode = config => ({
  type: APP_ACTION.SHOW_CONFIRM,
  payload: { isShow: true, type: 2, ...config }
});
export const updatePasscode = config => ({
  type: APP_ACTION.HIDE_CONFIRM,
  payload: { isShow: true, type: 3, ...config }
});
export const hidePasscode = config => ({
  type: APP_ACTION.HIDE_CONFIRM,
  payload: { isShow: false, type: 4, ...config }
});

// scan qrcode:
export const showScanQRCode = config => ({
  type: APP_ACTION.SHOW_SCAN_QRCODE,
  payload: { isShow: true, ...config }
});
export const hideScanQRCode = config => ({
  type: APP_ACTION.HIDE_SCAN_QRCODE,
  payload: { isShow: false, ...config }
});

// qrcode content
export const showQRCodeContent = config => ({
  type: APP_ACTION.SHOW_QRCODE_CONTENT,
  payload: { isShow: true, ...config }
});
export const hideQRCodeContent = config => ({
  type: APP_ACTION.HIDE_QRCODE_CONTENT,
  payload: { isShow: false, ...config }
});

// Loading
export const showLoading = config => ({
  type: APP_ACTION.LOADING,
  payload: { ...config }
});
export const hideLoading = () => ({ type: APP_ACTION.LOADED });

// Modal
export const updateModal = payload => ({
  type: APP_ACTION.UPDATE_MODAL,
  payload
});

// Alert
export const showAlert = config => ({
  type: APP_ACTION.SHOW_ALERT,
  payload: { isShow: true, ...config }
});
export const hideAlert = config => ({
  type: APP_ACTION.HIDE_ALERT,
  payload: { isShow: false, ...config }
});

// Header
export const setHeaderTitle = title => ({
  type: APP_ACTION.HEADER_TITLE_SET,
  payload: title
});
export const setHeaderCanBack = () => ({ type: APP_ACTION.HEADER_BACK_SET });
export const clickHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const clearHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const setHeaderRight = data => ({
  type: APP_ACTION.HEADER_RIGHT_SET,
  payload: data
});
export const clearHeaderRight = () => ({
  type: APP_ACTION.HEADER_RIGHT_REMOVE
});
export const clearHeaderLeft = () => ({ type: APP_ACTION.HEADER_LEFT_REMOVE });
export const hideHeader = () => ({ type: APP_ACTION.HEADER_HIDE });
export const showHeader = () => ({ type: APP_ACTION.HEADER_SHOW });

// Not Found
export const setNotFound = () => ({ type: APP_ACTION.NOT_FOUND_SET });
export const clearNotFound = () => ({ type: APP_ACTION.NOT_FOUND_REMOVE });

// IP
export const setIpInfo = data => ({ type: APP_ACTION.IP_INFO, payload: data });

export const setBannedCash = () => ({ type: APP_ACTION.BAN_CASH });
export const setBannedPrediction = () => ({ type: APP_ACTION.BAN_PREDICTION });

// Chat
export const setFirebaseUser = payload => ({
  type: APP_ACTION.SET_FIREBASE_USER,
  payload
});

// App
// |-- language
export const setLanguage = (data, autoDetect = true) => ({
  type: APP_ACTION.SET_LANGUAGE,
  payload: data,
  autoDetect
});
// |-- loading
export const setRootLoading = bool => ({
  type: APP_ACTION.SET_ROOT_LOADING,
  payload: bool
});

const tokenHandle = ({
  token,
  resolve,
  reject,
  dispatch,
  ipInfo,
  isSignup
}) => {
  if (resolve) {
    if (token) {
      dispatch(
        fetchProfile({
          PATH_URL: 'user/profile',
          errorFn: res => {
            if (!process.env.isProduction) {
              if (res.message === 'Invalid user.') {
                local.remove(APP.AUTH_TOKEN);
                window.location.reload();
              }
            } else {
              dispatch(
                showAlert({
                  message:
                    'Have something wrong with your profile, please contact supporters',
                  timeOut: false,
                  isShowClose: true,
                  type: 'danger',
                  callBack: () => {}
                })
              );
            }
          },
          successFn: () => {
            // wallet
            const listWallet = MasterWallet.getMasterWallet();
            if (listWallet === false) {
              try {
                MasterWallet.createMasterWallets();
              } catch (e) {
                alert(e.message);
              }
              console.log('create wallet success');
            } else {
            }

            let ethAddress = '';
            if (listWallet && listWallet.length > 0) {
              ethAddress = listWallet[0].address;
            }
            const data = new FormData();
            data.append(
              'wallet_addresses',
              MasterWallet.getListWalletAddressJson()
            );
            if (isSignup) {
              // update address to username:
              if (ethAddress) data.append('username', ethAddress);
            }

            dispatch(
              authUpdate({
                PATH_URL: 'user/profile',
                data,
                METHOD: 'POST',
                successFn: res => {
                  // console.log('app - handle - wallet - success - ', res);
                  if (isSignup && process.env.isDojo && !process.env.isLive) {
                    // console.log('call request free eth ...');
                    dispatch(
                      getFreeETH({
                        PATH_URL: `/user/free-rinkeby-eth?address=${ethAddress}`,
                        METHOD: 'POST',
                        successFn(e) {
                          console.log('request free eth success', e);
                        },
                        errorFn: e => {
                          // console.log('app - handle - getFreeETH - wallet - error - ', e);
                        }
                      })
                    );
                  }
                },
                errorFn: e => {
                  // console.log('app - handle - wallet - error - ', e);
                }
              })
            );
            resolve(true);
          }
        })
      );
    } else {
      // error
      reject(true);
    }
  } else {
    // error
    reject(true);
  }
};

const auth = ({ ref, dispatch, ipInfo }) =>
  new Promise((resolve, reject) => {
    const token = local.get(APP.AUTH_TOKEN);
    if (token) {
      tokenHandle({
        resolve,
        token,
        dispatch,
        ipInfo,
        isSignup: false
      });
    } else {
      dispatch(
        signUp({
          PATH_URL: `user/sign-up${ref ? `?ref=${ref}` : ''}`,
          METHOD: 'POST',
          successFn: res => {
            const signUpToken = res.data.passpharse;
            console.log('signUpToken', signUpToken);
            tokenHandle({
              resolve,
              token: signUpToken,
              dispatch,
              ipInfo,
              isSignup: true
            });
          },
          errorFn: () => {
            tokenHandle({ reject, token, dispatch });
          }
        })
      );
    }
  });

// show popup to get GPS permission
const continueAfterInitApp = (language, ref, dispatch, data) => {
  const ipInfoRes = {
    language: 'en',
    bannedPrediction: false,
    bannedCash: false
  };
  const languageSaved = local.get(APP.LOCALE);

  if (!languageSaved) {
    ipInfoRes.language = 'en';
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
  }

  auth({ ref, dispatch })
    .then(() => {
      dispatch(setRootLoading(false));
    })
    .catch(() => {
      // TO-DO: handle error
      dispatch(setRootLoading(false));
    });
};

// |-- init
export const initApp = (language, ref) => dispatch => {
  $http({
    url: 'https://ipfind.co/me',
    qs: { auth: process.env.ipfindKey },
    headers: { 'Content-Type': 'text/plain' }
  })
    .then(res => {
      const { data } = res;
      const ipInfo = IpInfo.ipFind(data);
      dispatch(setIpInfo(ipInfo));
      continueAfterInitApp(language, ref, dispatch, data);
    })
    .catch(e => {
      // TO-DO: handle error
      continueAfterInitApp(language, ref, dispatch, {});
      console.error(e);
    });
};
