
export const APP_ACTION = {
  NETWORK_ERROR: 'NETWORK_ERROR',

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

  CHANGE_LOCALE: 'CHANGE_LOCALE',

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

export const changeLocale = (data, autoDetect) => ({ type: APP_ACTION.CHANGE_LOCALE, payload: data, autoDetect });
export const setBannedCash = () => ({ type: APP_ACTION.BAN_CASH });
export const setBannedPrediction = () => ({ type: APP_ACTION.BAN_PREDICTION });
export const setCheckBanned = () => ({ type: APP_ACTION.BAN_CHECKED });

// Chat
export const setFirechat = (payload) => ({ type: APP_ACTION.SET_FIRECHAT, payload });
export const setFirebaseUser = (payload) => ({ type: APP_ACTION.SET_FIREBASE_USER, payload });
