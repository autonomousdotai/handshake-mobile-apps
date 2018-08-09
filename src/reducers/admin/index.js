import { ADMIN_ACTIONS } from './action';

const TAG = 'ADMIN_REDUCER';
const adminReducter = (state = {
  login: false,
}, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.AUTH:
      return {
        ...state,
        isFetching: true,
      };
    case `${ADMIN_ACTIONS.AUTH}_SUCCESS`:
      console.log(TAG, action.payload);
      return {
        ...state,
        isFetching: false,
        login: action.payload.status === 1,
      };
    default:
      return state;
  }
};
export default adminReducter;

