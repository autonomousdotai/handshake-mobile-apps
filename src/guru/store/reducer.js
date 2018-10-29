import produce from 'immer';

const initialState = {
  events: {},
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    // switch (action.type) {
    //   case 'GET_EVENTS_SUCCESS':
    // }
  });
};

export default guruReducer;

