import Handshake from '@/models/Handshake';
import { APP, HANDSHAKE_EXCHANGE_STATUS_VALUE } from '@/constants';
import { handShakeList } from '@/data/shake';
import { ACTIONS } from './action';
import local from '@/services/localStore';
import OfferShop from '@/models/OfferShop';
import CashStore from "@/models/CashStore";

// const handleListPayload = payload => payload.map(handshake => Handshake.handshake(handshake));
const handleDetailPayload = () => Handshake.handshake(handShakeList.data[1]);

const isEmptyBalance = (item) => {
  const actionActive = local.get(APP.EXCHANGE_ACTION);
  const { buyAmount, sellAmount } = item;
  if (actionActive.includes('buy')) {
    return sellAmount <= 0;
  }
  return buyAmount <= 0;
};

const handleListPayload = (payload) => {
  console.log('handleListPayload', payload);
  const result = [];
  const offers = [];

  const currencyActive = local.get(APP.EXCHANGE_CURRENCY);
  payload.map((handshake) => {
    const hs = Handshake.handshake(handshake);
    const offer = CashStore.cashStore(JSON.parse(hs.extraData));
    const { id } = hs;
    const { businessType } = offer;

    result.push(hs);
    offers.push(offer);

    return null;
  });

  result.updatedAt = Date.now();

  return { list: result, offers };
};

const initList = [];
initList.updatedAt = Date.now();

const discoverReducter = (state = {
  list: initList,
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
      const { list, offers } = handleListPayload(action.payload.data.handshakes);
      return {
        ...state,
        isFetching: false,
        list,
        offers,
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
