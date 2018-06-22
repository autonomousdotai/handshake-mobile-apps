
import Handshake from '@/models/Handshake';
import { CHAT_ACTIONS } from './action';
import Match from '@/models/Match';

const chatReducter = (state = {
  userName: '',
  isFetching: false,
}, action) => {
  switch (action.type) {
    // Initial Handshake
    case CHAT_ACTIONS.GET_USER_NAME:
      return {
        ...state,
        isFetching: true,
      };
    case `${CHAT_ACTIONS.GET_USER_NAME}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
      };
    case `${CHAT_ACTIONS.GET_USER_NAME}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default chatReducter;
