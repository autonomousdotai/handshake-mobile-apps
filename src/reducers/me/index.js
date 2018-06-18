import Handshake from '@/models/Handshake';
import {
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_CC_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_STATUS_VALUE,
} from '@/constants';
import { ACTIONS } from './action';

function handlePreProcessForOfferStore(handshake) {
  const extraData = JSON.parse(handshake.extra_data);
  const { id } = handshake;
  const handledHandshake = Object.assign({}, handshake);

  if (extraData.items.BTC) {
    const extraDataBTC = { ...extraData, ...extraData.items.BTC };
    delete extraDataBTC.items;
    delete extraDataBTC.status;
    handledHandshake.extra_data = JSON.stringify(extraDataBTC);
    handledHandshake.id = `${id}_BTC`;
  }
  if (extraData.items.ETH) {
    const extraDataETH = { ...extraData, ...extraData.items.ETH };
    delete extraDataETH.items;
    delete extraDataETH.status;
    handledHandshake.extra_data = JSON.stringify(extraDataETH);
    handledHandshake.id = `${id}_ETH`;
  }

  return Handshake.handshake(handledHandshake);
}

const handleListPayload = (payload) => {
  const result = payload.map((handshake) => {
    if (handshake.offer_feed_type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
      return handlePreProcessForOfferStore(handshake);
    }
    return Handshake.handshake(handshake);
  });
  return result;
};


const handleDetailPayload = payload => Handshake.handshake(payload.data);

const meReducter = (
  state = {
    list: [],
    detail: {},
    isFetching: false,
  },
  action,
) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_MY_HANDSHAKE:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload.data.handshakes),
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };

    // Detail
    case ACTIONS.LOAD_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE_DETAIL}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload),
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE_DETAIL}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };
    case ACTIONS.FIREBASE_EXCHANGE_DATA_CHANGE: {
      const listOfferStatus = action.payload;
      const myList = state.list;
      let handledMylist = [];

      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = Object.assign({}, listOfferStatus[offerId]);
        handledMylist = myList.map((handshake) => {
          let status = '';
          let { id } = offer;
          const handledHandshake = handshake;

          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
            const values = offer.status.split('_');
            id = `${id}_${values[0].toUpperCase()}`;
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[values[1]];
          }

          if (handledHandshake.id.includes(id) && handledHandshake.status !== status) {
            handledHandshake.status = status;
          }
          return handledHandshake;
        });
      });

      return {
        ...state,
        list: handledMylist,
      };
    }
    case ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE: {
      const listOfferStatus = action.payload;
      const myList = state.list;
      let handledMylist = [];

      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = Object.assign({}, listOfferStatus[offerId]);
        handledMylist = myList.map((handshake) => {
          let status = '';
          let { id } = offer;
          const handledHandshake = handshake;

          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
            const values = offer.status.split('_');
            id = `${id}_${values[0].toUpperCase()}`;
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[values[1]];
          }

          if (handledHandshake.id.includes(id) && handledHandshake.status !== status) {
            handledHandshake.status = status;
          }
          return handledHandshake;
        });
      });

      return {
        ...state,
        list: handledMylist,
      };
    }

    case ACTIONS.FIREBASE_BETTING_DATA_CHANGE: {
      const listBettingStatus = action.payload;
      const myList = state.list;
      let handledMylist;

      Object.keys(listBettingStatus).forEach((key) => {
        const element = listBettingStatus[key];
        const { id, status_i: statusI, result_i: resultI } = element;
        console.log('New id, status, result:', id, statusI, resultI);

        handledMylist = myList.map((handshake) => {
          const handledHandshake = handshake;

          if (handledHandshake.id === id) {
            console.log('Found handshake', handshake);
            handledHandshake.status = statusI;
            handledHandshake.result = resultI;
          }
          return handledHandshake;
        });

        // const handshakeItem = myList.find(item => item.id === id);
        // handshakeItem.status = status_i;
        // handshakeItem.result = result_i;
        // //TO DO: delete record after update status
      });

      return {
        ...state,
        list: handledMylist,
      };
    }

    default:
      return state;
  }
};

export default meReducter;
