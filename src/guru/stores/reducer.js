/* eslint-disable no-param-reassign */
import produce from 'immer';

const initialState = {
  events: [],
  userEvents: [],
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GURU:UPDATE_EVENTS':
        draft.events = action.events;
        break;
      case 'GURU:UPDATE_USER_EVENTS':
        console.log('GURU:UPDATE_USER_EVENTS:', action);
        draft.userEvents = action.userEvents;
        break;
      default:
        break;
    }
  });
};

export default guruReducer;

