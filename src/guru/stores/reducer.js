import produce from 'immer';

const initialState = {
  events: {},
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'GURU:UPDATE_EVENTS':
        if (draft.guru) {
          draft.guru.events = action.events;
        }
        break;
      default:
        break;
    }
  });
};

export default guruReducer;

