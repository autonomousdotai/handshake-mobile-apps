import { APP } from '@/constants';
import local from '@/services/localStore';
import Auth from '@/models/Auth';
import { ACTIONS } from './action';

const authReducter = (state = {
  token: local.get(APP.AUTH_TOKEN),
  profile: Auth.profile(local.get(APP.AUTH_PROFILE)) || Auth.profile({}),
  isLogged: false,
  offline: local.get(APP.OFFLINE_STATUS),
  updatedAt: Date.now(),
  fetching: false,
}, action) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.AUTH_TOKEN, action.payload.data.passpharse);
      return { ...state, token: action.payload.data.passpharse, isLogged: true };

    case `${ACTIONS.AUTH_FETCH}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state, profile: Auth.profile(action.payload.data), isLogged: true, updatedAt: Date.now(),
      };

    case `${ACTIONS.AUTH_UPDATE}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state, profile: Auth.profile(action.payload.data), isLogged: true, updatedAt: Date.now(),
      };
    case `${ACTIONS.SET_OFFLINE_STATUS}_SUCCESS`: {
      return { ...state, offline: state.offline ? 0 : 1 };
    }
    case `${ACTIONS.SUBMIT_EMAIL_SUBCRIBE}`: {
      return { ...state, fetching: true };
    }
    case `${ACTIONS.SUBMIT_EMAIL_SUBCRIBE}_SUCCESS`: {
      return { ...state, fetching: false };
    }
    case `${ACTIONS.SUBMIT_EMAIL_SUBCRIBE}_FAILED`: {
      return { ...state, fetching: false };
    }

    default:
      return state;
  }
};

export default authReducter;
