import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_MY_HANDSHAKE: 'LOAD_MY_HANDSHAKE',
  LOAD_MY_HANDSHAKE_DETAIL: 'LOAD_MY_HANDSHAKE_DETAIL',
  FIREBASE_BETTING_DATA_CHANGE: 'FIREBASE_BETTING_DATA_CHANGE',
  FIREBASE_EXCHANGE_DATA_CHANGE: 'FIREBASE_EXCHANGE_DATA_CHANGE',
  RESPONSE_EXCHANGE_DATA_CHANGE: 'RESPONSE_EXCHANGE_DATA_CHANGE',
};

export const loadMyHandshakeList = createAPI(ACTIONS.LOAD_MY_HANDSHAKE);
export const loadMyHandshakeDetail = createAPI(ACTIONS.LOAD_MY_HANDSHAKE_DETAIL);
export const success = data => ({
  type: `${ACTIONS.LOAD_MY_HANDSHAKE}_SUCCESS`,
  payload: data,
});
export const fireBaseBettingChange = data => ({
  type: ACTIONS.FIREBASE_BETTING_DATA_CHANGE,
  payload: data,
});

export const fireBaseExchangeDataChange = data => ({
  type: ACTIONS.FIREBASE_EXCHANGE_DATA_CHANGE,
  payload: data,
});

export const responseExchangeDataChange = data => ({
  type: ACTIONS.RESPONSE_EXCHANGE_DATA_CHANGE,
  payload: data,
});
