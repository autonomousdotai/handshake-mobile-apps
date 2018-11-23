import { APIPostCreator } from '@/guru/stores/api';
import { API_URL } from '@/constants';

export const verifyEmailCode = APIPostCreator({
  type: 'API:VERIFY_EMAIL_CODE'
});

export const getEmailCode = APIPostCreator({
  type: 'API:GET_EMAIL_CODE',
  url: API_URL.CRYPTOSIGN.SUBSCRIBE_NOTIFICATION
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

export const createEvent = (payload = {}) => {
  return {
    type: 'PEX:CREATE_EVENT',
    ...payload
  };
};

export const sendEmailCode = (payload = {}) => {
  return {
    type: 'PEX:SEND_EMAIL_CODE',
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
