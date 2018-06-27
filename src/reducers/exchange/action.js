// import { BASE_API } from '@/constants';
import { createAPI } from '@/reducers/action';

export const EXCHANGE_ACTIONS = {
  GET_CRYPTO_PRICE: 'GET_CRYPTO_PRICE',
  CREATE_CC_ORDER: 'CREATE_CC_ORDER',
  GET_USER_CC_LIMIT: 'GET_USER_CC_LIMIT',
  GET_CC_LIMITS: 'GET_CC_LIMITS',
  GET_USER_PROFILE: 'GET_USER_PROFILE',
  GET_OFFER_PRICE: 'GET_OFFER_PRICE',
  GET_LIST_OFFER_PRICE: 'GET_LIST_OFFER_PRICE',
  GET_USER_TRANSACTION: 'GET_USER_TRANSACTION',
  CREATE_OFFER: 'CREATE_OFFER',
  GET_LIST_OFFERS: 'GET_LIST_OFFERS',
  GET_OFFER: 'GET_OFFER',
  CLOSE_OFFER: 'CLOSE_OFFER',
  SHAKE_OFFER: 'SHAKE_OFFER',
  COMPLETE_SHAKE_OFFER: 'COMPLETE_SHAKE_OFFER',
  CANCEL_SHAKE_OFFER: 'CANCEL_SHAKE_OFFER',
  WITHDRAW_SHAKE_OFFER: 'WITHDRAW_SHAKE_OFFER',
  ACCEPT_OFFER: 'ACCEPT_OFFER',
  CANCEL_OFFER: 'CANCEL_OFFER',

  GET_IP_INFORM: 'GET_IP_INFORM',

  // Store
  CREATE_OFFER_STORES: 'CREATE_OFFER_STORES',
  ADD_OFFER_ITEM: 'ADD_OFFER_ITEM',
  DELETE_OFFER_ITEM: 'DELETE_OFFER_ITEM',
  SHAKE_OFFER_ITEM: 'SHAKE_OFFER_ITEM',
  ACCEPT_OFFER_ITEM: 'ACCEPT_OFFER_ITEM',
  REJECT_OFFER_ITEM: 'REJECT_OFFER_ITEM',
  COMPLETE_OFFER_ITEM: 'COMPLETE_OFFER_ITEM',
  CANCEL_OFFER_ITEM: 'CANCEL_OFFER_ITEM',
  GET_OFFER_STORES: 'GET_OFFER_STORES',
  REVIEW_OFFER: 'REVIEW_OFFER',

  GET_FREE_START_INFO: 'GET_FREE_START_INFO',
};

export const getCryptoPrice = createAPI(EXCHANGE_ACTIONS.GET_CRYPTO_PRICE);

export const createCCOrder = createAPI(EXCHANGE_ACTIONS.CREATE_CC_ORDER);

export const getUserCcLimit = createAPI(EXCHANGE_ACTIONS.GET_USER_CC_LIMIT);

export const getCcLimits = createAPI(EXCHANGE_ACTIONS.GET_CC_LIMITS);

export const getUserProfile = createAPI(EXCHANGE_ACTIONS.GET_USER_PROFILE);

export const getOfferPrice = createAPI(EXCHANGE_ACTIONS.GET_OFFER_PRICE);

export const getListOfferPrice = createAPI(EXCHANGE_ACTIONS.GET_LIST_OFFER_PRICE);

export const getUserTransaction = createAPI(EXCHANGE_ACTIONS.GET_USER_TRANSACTION);

export const createOffer = createAPI(EXCHANGE_ACTIONS.CREATE_OFFER);

export const getListOffers = createAPI(EXCHANGE_ACTIONS.GET_LIST_OFFERS);

export const getOffer = createAPI(EXCHANGE_ACTIONS.GET_OFFER);

export const shakeOffer = createAPI(EXCHANGE_ACTIONS.SHAKE_OFFER);

export const closeOffer = createAPI(EXCHANGE_ACTIONS.CREATE_OFFER);

export const completeShakedOffer = createAPI(EXCHANGE_ACTIONS.COMPLETE_SHAKE_OFFER);

export const cancelShakedOffer = createAPI(EXCHANGE_ACTIONS.CANCEL_SHAKE_OFFER);

export const withdrawShakedOffer = createAPI(EXCHANGE_ACTIONS.WITHDRAW_SHAKE_OFFER);

export const acceptOffer = createAPI(EXCHANGE_ACTIONS.ACCEPT_OFFER);
export const cancelOffer = createAPI(EXCHANGE_ACTIONS.CANCEL_OFFER);

// Store
export const createOfferStores = createAPI(EXCHANGE_ACTIONS.CREATE_OFFER_STORES);
export const addOfferItem = createAPI(EXCHANGE_ACTIONS.ADD_OFFER_ITEM);
export const deleteOfferItem = createAPI(EXCHANGE_ACTIONS.DELETE_OFFER_ITEM);
export const shakeOfferItem = createAPI(EXCHANGE_ACTIONS.SHAKE_OFFER_ITEM);
export const acceptOfferItem = createAPI(EXCHANGE_ACTIONS.ACCEPT_OFFER_ITEM);
export const rejectOfferItem = createAPI(EXCHANGE_ACTIONS.REJECT_OFFER_ITEM);
export const completeOfferItem = createAPI(EXCHANGE_ACTIONS.COMPLETE_OFFER_ITEM);
export const cancelOfferItem = createAPI(EXCHANGE_ACTIONS.CANCEL_OFFER_ITEM);
export const getOfferStores = createAPI(EXCHANGE_ACTIONS.GET_OFFER_STORES);
export const reviewOffer = createAPI(EXCHANGE_ACTIONS.REVIEW_OFFER);

export const getFreeStartInfo = createAPI(EXCHANGE_ACTIONS.GET_FREE_START_INFO);

