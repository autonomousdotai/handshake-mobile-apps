/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  updateReports
} from '@/guru/pages/CreateEvent/action';

const initialState = {
  events: [],
  userEvents: [],
  reputation: {},
  ui: {},
  authCoinBase: {},
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GURU:UPDATE_EVENTS':
        draft.events = action.events;
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
      default:
        break;
    }
  });
};

export default guruReducer;
