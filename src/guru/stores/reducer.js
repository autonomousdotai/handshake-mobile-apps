/* eslint-disable no-param-reassign */
import produce from 'immer';
import { updateReports } from '@/guru/pages/CreateEvent/action';

const initialState = {
  events: [],
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GURU:UPDATE_EVENTS':
        draft.events = action.events;
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

