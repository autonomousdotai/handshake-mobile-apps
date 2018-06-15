import Handshake from '@/models/Handshake';
import {
  EXCHANGE_FEED_TYPE,
  FIREBASE_PATH,
  HANDSHAKE_EXCHANGE_CC_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_STATUS_VALUE,
} from '@/constants';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/messaging';
import {ACTIONS} from './action';

function handlePreProcessForOfferStore(handshake, result) {
  let extraData = JSON.parse(handshake.extra_data);
  const id = handshake.id;
  if (extraData.items.BTC) {
    let extraDataBTC = {...extraData, ...extraData.items.BTC};
    delete extraDataBTC.items;
    // delete extraDataBTC.status;
    handshake.extra_data = JSON.stringify(extraDataBTC);
    handshake.id = id + '_BTC';

    result.push(Handshake.handshake(handshake));
  }

  if (extraData.items.ETH) {
    let extraDataETH = {...extraData, ...extraData.items.ETH};
    delete extraDataETH.items;
    // delete extraDataETH.status;
    handshake.extra_data = JSON.stringify(extraDataETH);
    handshake.id = id + '_ETH';

    result.push(Handshake.handshake(handshake));
  }
}

const handleListPayload = payload => {
  let result = [];

  for (let handshake of payload) {
    if (handshake.offer_feed_type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
      handlePreProcessForOfferStore(handshake, result);

    } else {
      result.push(Handshake.handshake(handshake));
    }
  }

  // console.log('handleListPayload result', result);

  return result;
}


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

      const userProfile = action.profile;
      const rootPathFirebase = `${FIREBASE_PATH.USERS}/${String(userProfile.id || -1)}`;
      const firebaseExchange = firebase
        ?.database()
        ?.ref(rootPathFirebase)
        ?.child('offers');

      Object.keys(listOfferStatus).forEach((offer_id) => {
        const offer = listOfferStatus[offer_id];
        for (const handshake of myList) {
          let status = '';
          let id = offer.id;
          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
            const values = offer.status.split('_');
            id = id + '_' + values[0].toUpperCase();
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[values[1]];
          }

          if (handshake.id.includes(id) && handshake.status !== status) {
            handshake.status = status;
            break;
          }
        }
      });

      firebaseExchange?.remove();

      return {
        ...state,
        list: myList,
      };
    }
    case ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE: {
      const listOfferStatus = action.payload;
      const myList = state.list;

      console.log('ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE', listOfferStatus);
      console.log('ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE', myList);

      Object.keys(listOfferStatus).forEach((offer_id) => {
        const offer = listOfferStatus[offer_id];
        for (const handshake of myList) {
          let status = '';
          let id = offer.id;
          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
            const values = offer.status.split('_');
            id = id + '_' + values[0].toUpperCase();
            status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[values[1]];
          }

          if (handshake.id.includes(id) && handshake.status !== status) {
            handshake.status = status;
            break;
          }
        }
      });

      return {
        ...state,
        list: myList,
      };
    }

    case ACTIONS.FIREBASE_BETTING_DATA_CHANGE: {
      const listBettingStatus = action.payload;
      const myList = state.list;
      const userProfile = action.profile;
      const rootPathFirebase = `${FIREBASE_PATH.USERS}/${String(userProfile.id || -1)}`;
      const firebaseBetting = firebase
        ?.database()
        ?.ref(rootPathFirebase)
        ?.child('betting');
      Object.keys(listBettingStatus).forEach((key) => {
        const element = listBettingStatus[key];
        const { id, status_i, result_i } = element;
        console.log('New id, status, result:', id, status_i, result_i);
        for (const handshake of myList) {
          if (handshake.id === id) {
            console.log('Found handshake', handshake);
            handshake.status = status_i;
            handshake.result = result_i;
            break;
          }
        }
        // const handshakeItem = myList.find(item => item.id === id);
        // handshakeItem.status = status_i;
        // handshakeItem.result = result_i;
        // //TO DO: delete record after update status
      });
      firebaseBetting?.remove();

      return {
        ...state,
        list: myList,
      };
    }

    default:
      return state;
  }
};

export default meReducter;
