
export const APP_ACTION = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  CALLING: 'CALLING',
  CALLED: 'CALLED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ALERT: 'ALERT',
  CLOSE_ALERT: 'CLOSE_ALERT',
  MODAL: 'MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  HEADER_TITLE_SET: 'HEADER_TITLE_SET',
  HEADER_BACK_SET: 'HEADER_BACK_SET',
  HEADER_BACK_CLICK: 'HEADER_BACK_CLICK',
  NOT_FOUND_SET: 'NOT_FOUND_SET',
  NOT_FOUND_REMOVE: 'NOT_FOUND_REMOVE',
  HEADER_RIGHT_SET: 'HEADER_RIGHT_SET',
  HEADER_RIGHT_REMOVE: 'HEADER_RIGHT_REMOVE',
};

// Loading
export const showLoading = () => ({ type: APP_ACTION.LOADING });
export const hideLoading = () => ({ type: APP_ACTION.LOADED });

// Modal
export const showModal = modalContent => ({
  type: APP_ACTION.MODAL,
  modalContent,
});
export const hideModal = () => ({ type: APP_ACTION.CLOSE_MODAL });

// Alert

// Header
export const setHeaderTitle = title => ({ type: APP_ACTION.HEADER_TITLE_SET, payload: title });
export const setHeaderCanBack = () => ({ type: APP_ACTION.HEADER_BACK_SET });
export const clickHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const clearHeaderBack = () => ({ type: APP_ACTION.HEADER_BACK_CLICK });
export const setNotFound = () => ({ type: APP_ACTION.NOT_FOUND_SET });
export const clearNotFound = () => ({ type: APP_ACTION.NOT_FOUND_REMOVE });
export const setHeaderRight = data => ({ type: APP_ACTION.HEADER_RIGHT_SET, payload: data });
export const clearHeaderRight = () => ({ type: APP_ACTION.HEADER_RIGHT_REMOVE });
