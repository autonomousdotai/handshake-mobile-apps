/* eslint-disable no-param-reassign */
import produce from 'immer';
import { updateReports } from '@/guru/pages/CreateEvent/action';

const initialState = {
  events: [],
  matchDetail: {},
  gasPrice: '',
  userEvents: [],
  reputation: {},
  ui: {},
  authCoinBase: {},
  isFetching: false
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GURU:UPDATE_EVENTS':
        draft.events = action.events;
        break;
      case 'GURU:PUT_MATCH_DETAIL':
        draft.matchDetail = action.data;
        break;
      case 'GURU:PUT_GAS_PRICE':
        draft.gasPrice = action.payload;
        break;
      case 'GURU:UPDATE_USER_EVENTS':
        draft.userEvents = action.userEvents;
        break;
      case 'GURU:UPDATE_USER_REPUTATION':
        draft.reputation = action.reputation;
        break;
      case 'GURU:UPDATE_AUTH_COINBASE':
        draft.authCoinBase = action.authCoinBase;
        break;
      case updateReports().type:
        draft.reports = action.payload.data;
        break;
      case 'GURU:UPDATE_LOADING':
        draft.isFetching = action.isFetching;
        break;
      default:
        break;
    }
  });
};

export default guruReducer;
