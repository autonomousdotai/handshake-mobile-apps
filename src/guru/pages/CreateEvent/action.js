import { APIGetCreator, APIPostCreator, APIFormCreator } from '@/guru/stores/api';
import { API_URL } from '@/constants';

export const verifyEmailCode = APIPostCreator({
  type: 'API:VERIFY_EMAIL_CODE'
});

export const getEmailCode = APIPostCreator({
  type: 'API:GET_EMAIL_CODE',
  url: API_URL.CRYPTOSIGN.SUBSCRIBE_NOTIFICATION
});

export const apiLoadReports = APIGetCreator({
  type: 'API:LOAD_REPORT',
  url: API_URL.CRYPTOSIGN.LOAD_REPORTS
});

export const apiCreateEvent = APIFormCreator({
  type: 'API:ADD_EVENT_API',
  url: API_URL.CRYPTOSIGN.ADD_MATCH
});

export const apiCreateEventConstant = APIFormCreator({
  type: 'API:ADD_EVENT_CONSTANT_API',
  url: API_URL.CRYPTOSIGN.ADD_MATCH_CONSTANT
});

export const loadReports = (payload = {}) => {
  return {
    type: 'PEX:GET_REPORTS',
    payload
  };
};

export const updateReports = (payload = {}) => {
  return {
    type: 'PEX:UPDATE_REPORTS',
    payload
  };
};

export const shareEvent = (payload = {}) => {
  return {
    type: 'PEX:SHARE_EVENT',
    payload
  };
};

export const resetShareEvent = (payload = {}) => {
  return {
    type: 'PEX:RESET_SHARE_EVENT',
    payload
  };
};
