import local from '@/services/localStore';
import { APP } from '@/constants';
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
  headerTitle: APP.HEADER_DEFAULT,
  headerBack: false,
  isNotFound: false,
  headerRightContent: null,
  configAlert: {
    isShow: false,
    message: '',
  },

}, action) {
  switch (action.type) {
    case APP_ACTION.HEADER_TITLE_SET:
      return {
        ...state,
        headerTitle: action.payload,
      };

    case APP_ACTION.HEADER_BACK_SET:
      return {
        ...state,
        headerBack: true,
      };

    case APP_ACTION.HEADER_BACK_CLICK:
      return {
        ...state,
        headerBack: false,
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


    case APP_ACTION.NOT_FOUND_SET:
      return {
        ...state,
        isNotFound: true,
      };

    case APP_ACTION.NOT_FOUND_REMOVE:
      return {
        ...state,
        isNotFound: false,
      };


    case APP_ACTION.HEADER_RIGHT_SET:
      return {
        ...state,
        headerRightContent: action.payload,
      };

    case APP_ACTION.HEADER_RIGHT_REMOVE:
      return {
        ...state,
        headerRightContent: null,
      };

    case APP_ACTION.SHOW_ALERT:
      return {
        ...state,
        configAlert: { ...action.payload },
      };

    case APP_ACTION.HIDE_ALERT:
      return {
        ...state,
        configAlert: { ...action.payload },
      };

    default:
      return state;
  }
}

export default appReducter;
