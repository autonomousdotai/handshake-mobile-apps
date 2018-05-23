import CONSTANTS from '@/constants';
import { APP_ACTION } from './action';

const close = {
  isError: false,
  isWarning: false,
  isAlert: false,
  isAlertContent: false,
  isModal: false,
  isModalContent: false,
  overlay: false,
};

function appReducter(state = {

  isCalling: false,
  isLoading: false,
  isModal: false,
  isModalContent: null,
  isAlert: false,
  isAlertContent: null,
  isError: false,
  isWarning: false,
  overlay: false,
  headerTitle: CONSTANTS.APP.HEADER_DEFAULT,

}, action) {
  switch (action.type) {
    case APP_ACTION.SET_HEADER_TITLE:
      return {
        ...state,
        headerTitle: action.payload,
      };

    case APP_ACTION.NETWORK_ERROR:
      return {
        ...state,
        overlay: true,
        isAlert: true,
        isError: true,
        isAlertContent: null,
      };


    case APP_ACTION.CALLING:
      return {
        ...state,
        isCalling: true,
      };
    case APP_ACTION.CALLED:
      return {
        ...state,
        isCalling: false,
      };


    case APP_ACTION.LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case APP_ACTION.LOADED:
      return {
        ...state,
        isLoading: false,
      };


    case APP_ACTION.ALERT:
      return {
        ...state,
        overlay: true,
        isAlert: true,
        isError: action.isError || false,
        isWarning: action.isWarning || false,
        isAlertContent: action.isAlertContent || null,
      };
    case APP_ACTION.CLOSE_ALERT:
      return {
        ...state,
        ...close,
      };


    case APP_ACTION.MODAL:
      return {
        ...state,
        overlay: true,
        showModal: true,
        modalContent: action.modalContent || null,
      };

    case APP_ACTION.CLOSE_MODAL:
      return {
        ...state,
        ...close,
      };

    default:
      return state;
  }
}

export default appReducter;
