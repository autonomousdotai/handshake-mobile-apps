/* eslint-disable no-param-reassign */
import produce from 'immer';

const initialState = {
  events: [],
  userEvents: [],
  reputation: {},
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
      default:
        break;
    }
  });
};

export default guruReducer;

