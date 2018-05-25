import { ACTIONS } from './action';
import localStore from '@/services/localStore';
import Handshake from '@/models/Handshake';

const handleListPayload = (payload) => {
  return payload.data.map(handshake => {
    return Handshake.handshake(handshake);
  });
}

const handleDetailPayload = (payload) => {
  return Handshake.handshake(payload.data);
}

const discoverReducter = (state = {
  list: [],
  detail: {},
  isFetching: false
}, action) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_DISCOVER:
      return {
        ...state,
        isFetching: true
      };
    case `${ACTIONS.LOAD_DISCOVER}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload)
      };
    case `${ACTIONS.LOAD_DISCOVER}_FAILED`:
      return {
        ...state,
        isFetching: false
      };

    // Detail
    case ACTIONS.LOAD_DETAIL:
      return {
        ...state,
        isFetching: true
      };
    case `${ACTIONS.LOAD_DISCOVER_DETAIL}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload)
      };
    case`${ACTIONS.LOAD_DISCOVER_DETAIL}_FAILED`:
      return {
        ...state,
        isFetching: false
      };

    default:
      return state;
  }
}

export default discoverReducter;
