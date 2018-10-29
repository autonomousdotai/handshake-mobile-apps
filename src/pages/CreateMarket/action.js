import { SET_DATA, REMOVE_DATA } from '@/stores/data-action';
import { ACTIONS } from '@/reducers/auth/action';

export const updateProfile = (payload) => {
  return {
    type: `${ACTIONS.AUTH_FETCH}_SUCCESS`,
    payload,
  };
}

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

export const verifyEmailCodePut = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:VERIFY_EMAIL_CODE_PUT',
    _path: 'ui.isValidEmailCode',
    _value: value,
  });
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

export const removeShareEvent = (keys) => {
  return REMOVE_DATA({
    type: 'CREATE_MARKET:REMOVE_SHARE_EVENT',
    _path: 'ui',
    _value: keys,
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

