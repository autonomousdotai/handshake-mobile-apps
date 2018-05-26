import Handshake from '@/models/Handshake';
import { ACTIONS } from './action';

const initHandshakePayload = payload => payload.data.map(handshake => Handshake.handshake(handshake));
const handshakeReducter = (state = {
    handshake: {},
    isFetching: false,
  }, action) => {
    switch (action.type) {
        //Initial Handshake
        case ACTIONS.INIT_HANDSHAKE:
            return {
                ...state,
                isFetching: true,
            };
        case `${ACTIONS.INIT_HANDSHAKE}_SUCCESS`:
        return {
            ...state,
            isFetching: false,
            handshake: initHandshakePayload(action.payload),
          };
        case `${ACTIONS.INIT_HANDSHAKE}_FAILED`:
            return {
            ...state,
            isFetching: false,
            };
        default:
        return state;
    }
};

export default handshakeReducter;
