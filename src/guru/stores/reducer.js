/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  updateReports,
  isEmailCodeValid
} from '@/guru/pages/CreateEvent/action';

const initialState = {
  events: [],
  userEvents: [],
  reputation: {},
  ui: {}
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
      case updateReports().type:
        draft.reports = action.payload.data;
        break;
      case isEmailCodeValid().type:
        draft.ui.isEmailCodeValid = action.payload.status;
        break;
      default:
        break;
    }
  });
};

export default guruReducer;
