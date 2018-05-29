import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_MY_HANDSHAKE: 'LOAD_MY_HANDSHAKE',
  LOAD_MY_HANDSHAKE_DETAIL: 'LOAD_MY_HANDSHAKE_DETAIL',
};

export const loadMyHandshakeList = createAPI(ACTIONS.LOAD_MY_HANDSHAKE);
export const loadMyHandshakeDetail = createAPI(ACTIONS.LOAD_MY_HANDSHAKE_DETAIL);
export const success = data => ({ type: `${ACTIONS.LOAD_MY_HANDSHAKE}_SUCCESS`, payload: data });
