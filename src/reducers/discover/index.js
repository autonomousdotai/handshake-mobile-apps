import Handshake from '@/models/Handshake';
import { HANDSHAKE_EXCHANGE_STATUS_VALUE } from '@/constants';
import { handShakeList } from '@/data/shake';
import { ACTIONS } from './action';

const handleListPayload = payload => payload.map(handshake => Handshake.handshake(handshake));
const handleDetailPayload = () => Handshake.handshake(handShakeList.data[1]);

const discoverReducter = (state = {
  list: [],
  detail: {},
  isFetching: false,
}, action) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_DISCOVER:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_DISCOVER}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload.data.handshakes),
      };
    case `${ACTIONS.LOAD_DISCOVER}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };

    // Detail
    case ACTIONS.LOAD_DISCOVER_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_DISCOVER_DETAIL}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload),
      };
    case `${ACTIONS.LOAD_DISCOVER_DETAIL}_FAILED`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload), // temp, will delete when has API
      };
    case ACTIONS.UPDATE_OFFER_STATUS: {
      const listOfferStatus = action.payload;
      const myList = state.list;

      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = listOfferStatus[offerId];

        myList.map((handshake) => {
          const status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          const handledHandshake = handshake;

          if (handshake.id.includes(offer.id) && handshake.status !== status) {
            handledHandshake.status = status;
          }

          return handledHandshake;
        });
      });

      return {
        ...state,
        list: myList,
      };
    }
    default:
      return state;
  }
};

export default discoverReducter;
