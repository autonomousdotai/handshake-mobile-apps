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
  SET_HEADER_TITLE: 'SET_HEADER_TITLE',
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
export const setHeaderTitle = title => ({ type: APP_ACTION.SET_HEADER_TITLE, payload: title });
