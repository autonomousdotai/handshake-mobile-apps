import { APP } from '@/constants';
import local from '@/services/localStore';
import { ACTIONS } from './action';

const authReducter = (state = {}, action) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.TOKEN, action.payload.data.passpharse);
      return { state };

    default:
      return state;
  }
};

export default authReducter;
