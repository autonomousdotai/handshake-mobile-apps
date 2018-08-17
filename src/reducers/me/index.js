import Handshake from '@/models/Handshake';
import {
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_CC_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_STATUS_VALUE,
} from '@/constants';
import { ACTIONS } from './action';
import { BET_BLOCKCHAIN_STATUS } from '@/components/handshakes/betting/constants';
import { findUserBet, isShakeUser, parseJsonString } from '@/components/handshakes/betting/utils.js';

const TAG = 'MeReducer';
// function handlePreProcessForOfferStore(handshake) {
//   const extraData = JSON.parse(handshake.extra_data);
//   const { id } = handshake;
//   const result = [];
//
//   if (extraData.items.BTC) {
//     const handledHandshake = Object.assign({}, handshake);
//     const extraDataBTC = { ...extraData, ...extraData.items.BTC };
//     delete extraDataBTC.items;
//     handledHandshake.extra_data = JSON.stringify(extraDataBTC);
//     handledHandshake.id = `${id}_BTC`;
//
//     result.push(Handshake.handshake(handledHandshake));
//   }
//
//   if (extraData.items.ETH) {
//     const handledHandshake = Object.assign({}, handshake);
//     const extraDataETH = { ...extraData, ...extraData.items.ETH };
//     delete extraDataETH.items;
//     handledHandshake.extra_data = JSON.stringify(extraDataETH);
//     handledHandshake.id = `${id}_ETH`;
//
//     result.push(Handshake.handshake(handledHandshake));
//   }
//
//   return result;
// }

const foundCancelHanshake = (handshake, item) => {

  const handledHandshake = handshake;
  if (handledHandshake.id === item.id) {
    console.log(TAG, 'foundCancelHanshake:','handledHandshake', handledHandshake);
    handledHandshake.status = item.status;
  }
  return handledHandshake;


};
const foundRefundHanshake = (handshake, item, hid) => {
  console.log(TAG, 'foundRefundHanshake', 'hid:', hid, 'item hid', item.hid);
  const handledHandshake = handshake;
  if (hid === item.hid) {
    console.log(TAG, 'foundRefundHanshake:','handledHandshake', handledHandshake);
    handledHandshake.status = item.status;
  }
  return handledHandshake;

};

const foundWithdrawHanshake = (handshake, item, hid) => {
  const handledHandshake = handshake;

  console.log(TAG, 'foundWithdrawHanshake', 'hid:', hid, 'item hid', item.hid, 'side', handledHandshake.side, 'item side', item.side);

  if (hid === item.hid && handledHandshake.side === item.side) {
    console.log(TAG, 'foundWithdrawHanshake:','handledHandshake', handledHandshake);
    handledHandshake.status = item.status;
  }
  return handledHandshake;
};


const handleListPayload = (payload) => {
  const result = [];
  payload.map((handshake) => {
    if (handshake.offer_feed_type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
      // result.push(...handlePreProcessForOfferStore(handshake));
    } else {
      result.push(Handshake.handshake(handshake));
    }
    return null;
  });

  return result;
};

const handleDashboardPayload = (payload) => {
  const result = [];
  payload.map((handshake) => {
    if (handshake.offer_feed_type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
      result.push(Handshake.handshake(handshake));
    }
    return null;
  });

  return result;
};

const handleDetailPayload = payload => Handshake.handshake(payload.data);

const initList = [];
initList.updateAt = Date.now();

const meReducter = (
  state = {
    list: initList,
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
      const list = handleListPayload(action.payload.data.handshakes);
      list.updatedAt = Date.now();
      return {
        ...state,
        isFetching: false,
        list,
        listDashboard: handleDashboardPayload(action.payload.data.handshakes),
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
          const extraData = JSON.parse(handshake.extraData);

          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status =
              HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          // } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
          //   const values = offer.status.split('_');
          //   id = `${id}_${values[0].toUpperCase()}`;
          //   status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[values[1]];
          }

          if (
            handledHandshake.id.includes(id) &&
            (handledHandshake.status !== status || (extraData.sub_status !== offer.sub_status))
          ) {
            handledHandshake.status = status;
            extraData.sub_status = offer.sub_status;
            handledHandshake.extraData = JSON.stringify(extraData);
            handledHandshake.lastUpdateAt = Date.now() / 1000;
          }
          return handledHandshake;
        });
      });

      const myListDashboard = state.listDashboard;
      let handledMylistDashboard = [];
      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = Object.assign({}, listOfferStatus[offerId]);
        handledMylistDashboard = myListDashboard.map((handshake) => {
          const { id } = offer;
          const handledHandshake = handshake;

          if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE
            || offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_ITEM) {
            const values = offer.status.split('_');
            // id = `${id}_${values[0].toUpperCase()}`;
            const currency = values[0].toUpperCase();
            const status = values[1];

            const offerStore = JSON.parse(handledHandshake.extraData);
            if (handledHandshake.id.includes(id)) {
              for (let item of Object.values(offerStore.items)) {
                if (item.currency === currency) {
                  if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
                    item.status = status;
                  } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_ITEM) {
                    item.subStatus = status;
                  }

                  item.updateAt = Date.now() / 1000;
                  handledHandshake.extraData = JSON.stringify(offerStore);
                  break;
                }
              }
            }
          }

          return handledHandshake;
        });
      });

      return {
        ...state,
        list: handledMylist,
        listDashboard: handledMylistDashboard,
      };
    }
    case ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE: {
      const listOfferStatus = action.payload;
      console.log('listOfferStatus', listOfferStatus);
      const myList = state.list;
      let handledMylist = [];

      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = Object.assign({}, listOfferStatus[offerId]);
        handledMylist = myList.map((handshake) => {
          let status = '';
          const { id } = offer;
          const handledHandshake = handshake;
          const extraData = JSON.parse(handshake.extraData);

          if (offer.type === EXCHANGE_FEED_TYPE.INSTANT) {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.EXCHANGE) {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE) {
            status =
              HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE[offer.status];
          }

          if (
            handledHandshake.id.includes(id) &&
            (handledHandshake.status !== status || (extraData.sub_status !== offer.sub_status))
          ) {
            handledHandshake.status = status;
            extraData.sub_status = offer.sub_status;
            handledHandshake.extraData = JSON.stringify(extraData);
            handledHandshake.lastUpdateAt = Date.now() / 1000;
          }
          return handledHandshake;
        });
      });

      // console.log('handledMylist', handledMylist);

      const myListDashboard = state.listDashboard;
      let handledMylistDashboard = [];
      Object.keys(listOfferStatus).forEach((offerId) => {
        const offer = Object.assign({}, listOfferStatus[offerId]);
        handledMylistDashboard = myListDashboard.map((handshake) => {
          const { id } = offer;
          const handledHandshake = handshake;

          if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE
            || offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_ITEM) {
            const values = offer.status.split('_');
            // id = `${id}_${values[0].toUpperCase()}`;
            const currency = values[0].toUpperCase();
            const status = values[1];

            const offerStore = JSON.parse(handledHandshake.extraData);
            if (handledHandshake.id.includes(id)) {
              for (let item of Object.values(offerStore.items)) {
                if (item.currency === currency) {
                  if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE) {
                    item.status = status;
                  } else if (offer.type === EXCHANGE_FEED_TYPE.OFFER_STORE_ITEM) {
                    item.subStatus = status;
                  }
                  item.updateAt = Date.now() / 1000;
                  handledHandshake.extraData = JSON.stringify(offerStore);
                  break;
                }
              }
            }
          }

          return handledHandshake;
        });
      });

      // console.log('handledMylistDashboard', handledMylistDashboard);

      return {
        ...state,
        list: handledMylist,
        listDashboard: handledMylistDashboard,
      };
    }

    case ACTIONS.FIREBASE_BETTING_DATA_CHANGE: {
      const listBettingStatus = action.payload;
      const myList = state.list;
      let handledMylist;
      console.log(TAG, 'FIREBASE_BETTING_DATA_CHANGE action.payload =', action.payload);
      Object.keys(listBettingStatus).forEach((key) => {
        const element = listBettingStatus[key];
        const { id, status_i: statusI, result_i: resultI } = element;


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
      //STATUS_MAKER_UNINIT_PENDING
      //STATUS_REFUND_PENDING
      //STATUS_COLLECT_PENDING

      const item = action.payload;
      console.log('Item changed:', item);
      const { status } = item;
      const myList = state.list;
      const handledMylist = myList.map((handshake) => {
        const { shakeUserIds, shakers = '[]', hid  } = handshake;
        let handledHandshake = handshake;
        const isUserShake = isShakeUser(shakeUserIds);
        if (!isUserShake) {
          switch (status) {
            case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING:
              handledHandshake = foundCancelHanshake(handledHandshake, item);
              break;
            case BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING:
              handledHandshake = foundRefundHanshake(handledHandshake, item, hid);
              break;
            case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING:
              handledHandshake = foundWithdrawHanshake(handledHandshake, item, hid);
              break;
            default:
              break;
          }
        } else {
          const shakerArr = parseJsonString(shakers) || [];
          if (shakerArr && shakerArr.length > 0) {
            const newShakers = shakerArr.map((shakerItem) => {
              let handleShaker = shakerItem;
              switch (status) {
                case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING:
                  handleShaker = foundCancelHanshake(handleShaker, item);
                  break;
                case BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING:
                  handleShaker = foundRefundHanshake(handleShaker, item, hid);
                  break;
                case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING:
                  handleShaker = foundWithdrawHanshake(handleShaker, item, hid);
                  break;
                default:
                  break;
              }
              return handleShaker;
            });
            handledHandshake.shakers = JSON.stringify(newShakers);
          }
        }
        return handledHandshake;
      });
      console.log(TAG, 'handledMylist:', handledMylist.length);

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

