import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FETCH: 'AUTH_FETCH',
  AUTH_UPDATE: 'AUTH_UPDATE',
  SET_OFFLINE_STATUS: 'SET_OFFLINE_STATUS',
  GET_VERIFY_PHONE_CODE: 'GET_VERIFY_PHONE_CODE',
  VERIFY_PHONE: 'VERIFY_PHONE',
  SUBMIT_PHONE: 'SUBMIT_PHONE',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  VERIFY_ID: 'VERIFY_ID',
  SUBMIT_EMAIL: 'SUBMIT_EMAIL',
  CHECK_USERNAME: 'CHECK_USERNAME',
  GET_FREE_ETH: 'GET_FREE_ETH',
  CHECK_JOIN_TELEGRAM: 'CHECK_JOIN_TELEGRAM',
  CHECK_FOLLOW_TWITTER: 'CHECK_FOLLOW_TWITTER',
  REFERRED_INFO: 'REFERRED_INFO',
  COMPLETE_PROFILE: 'COMPLETE_PROFILE',
  SUBMIT_EMAIL_SUBCRIBE: 'SUBMIT_EMAIL_SUBCRIBE',
  VERIFY_REDEEM_CODE: 'VERIFY_REDEEM_CODE',
  GET_ID_VERIFICATION: 'GET_ID_VERIFICATION',
};

export const fetchProfile = createAPI(ACTIONS.AUTH_FETCH);
export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
export const authUpdate = createAPI(ACTIONS.AUTH_UPDATE);
export const setOfflineStatus = createAPI(ACTIONS.SET_OFFLINE_STATUS);
// profile
export const getVerifyPhoneCode = createAPI(ACTIONS.GET_VERIFY_PHONE_CODE);
export const verifyPhone = createAPI(ACTIONS.VERIFY_PHONE);
export const submitPhone = createAPI(ACTIONS.SUBMIT_PHONE);
export const verifyEmail = createAPI(ACTIONS.VERIFY_EMAIL);
export const verifyID = createAPI(ACTIONS.VERIFY_ID);
export const submitEmail = createAPI(ACTIONS.SUBMIT_EMAIL);
export const checkUsernameExist = createAPI(ACTIONS.CHECK_USERNAME);
export const submitEmailSubcribe = createAPI(ACTIONS.SUBMIT_EMAIL_SUBCRIBE);
export const getIdVerification = createAPI(ACTIONS.GET_ID_VERIFICATION);

// wallet:
export const getFreeETH = createAPI(ACTIONS.GET_FREE_ETH);
export const checkJoinTelegram = createAPI(ACTIONS.CHECK_JOIN_TELEGRAM);
export const checkFollowTwitter = createAPI(ACTIONS.CHECK_FOLLOW_TWITTER);

export const referredInfo = createAPI(ACTIONS.REFERRED_INFO);
export const completeProfile = createAPI(ACTIONS.COMPLETE_PROFILE);
export const verifyRedeemCode = createAPI(ACTIONS.VERIFY_REDEEM_CODE);
