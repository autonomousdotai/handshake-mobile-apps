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
  let result = [];

  if (extraData.items.BTC) {
    const handledHandshake = Object.assign({}, handshake);
    const extraDataBTC = { ...extraData, ...extraData.items.BTC };
    delete extraDataBTC.items;
    handledHandshake.extra_data = JSON.stringify(extraDataBTC);
    handledHandshake.id = `${id}_BTC`;

    result.push(Handshake.handshake(handledHandshake));
  }

  if (extraData.items.ETH) {
    const handledHandshake = Object.assign({}, handshake);
    const extraDataETH = { ...extraData, ...extraData.items.ETH };
    delete extraDataETH.items;
    handledHandshake.extra_data = JSON.stringify(extraDataETH);
    handledHandshake.id = `${id}_ETH`;

    result.push(Handshake.handshake(handledHandshake));
  }

  return result;
}

const handleListPayload = (payload) => {
  const result = [];
  payload.map((handshake) => {
    if (handshake.offer_feed_type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
      result.push(...handlePreProcessForOfferStore(handshake));
    } else {
      result.push(Handshake.handshake(handshake));
    }
    return null;
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
    case ACTIONS.UPDATE_BETTING_DATA_CHANGE: {
      const item = action.payload;
      console.log('Item changed:', item);
      const myList = state.list;
      let handledMylist;
      handledMylist = myList.map((handshake) => {
        const handledHandshake = handshake;

        if (handledHandshake.id === item.id) {
          handledHandshake.status = item.status;
          //handledHandshake.result = resultI;
        }
        return handledHandshake;
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
