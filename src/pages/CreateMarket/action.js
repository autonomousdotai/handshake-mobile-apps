import { SET_DATA } from '@/stores/data-action';

export const updateEmailPut = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:UPDATE_EMAIL_PUT',
    _path: 'auth.profile.email',
    _value: value,
  });
};

export const updateEmailFetch = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:UPDATE_EMAIL_FETCH',
    ...payload,
  };
};

export const sendEmailCode = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:SEND_EMAIL_CODE',
    ...payload,
  };
};

export const verifyEmail = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:VERIFY_EMAIL',
    ...payload,
  };
};

export const updateCreateEventLoading = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:LOADING',
    _path: 'ui.isCreateEventLoading',
    _value: value,
  });
};

export const shareEvent = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:SHARE_EVENT',
    _path: 'ui.shareEvent',
    _value: value,
  });
};

export const loadCreateEventData = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:HANDLE_CREATE_EVENT_DATA',
    ...payload,
  };
};

export const generateShareLink = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:GENERATE_SHARE_LINK',
    ...payload,
  };
};

export const createEvent = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:CREATE_EVENT',
    ...payload,
  };
};

