import { APP } from '@/constants';
import local from '@/services/localStore';
import { ACTIONS } from './action';

const authReducter = (state = {
  token: local.get(APP.AUTH_TOKEN),
  profile: local.get(APP.AUTH_PROFILE) || {},
  isLogged: false,
  profileUpdatedAt: Date.now(),
}, action) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.AUTH_TOKEN, action.payload.data.passpharse);
      return { ...state, token: action.payload.data.passpharse, isLogged: true };

    case `${ACTIONS.AUTH_FETCH}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state, profile: action.payload.data, isLogged: true, profileUpdatedAt: Date.now(),
      };
    default:
      return state;
  }
};

export default authReducter;
