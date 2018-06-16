import { BASE_API } from '@/constants';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
  INIT_HANDSHAKE_FREE: 'INIT_HANDSHAKE_FREE',
  SHAKE: 'SHAKE',
  UNINIT: 'UNINIT',
  COLLECT: 'COLLECT',
  REFUND: 'REFUND',
  ROLLBACK: 'ROLLBACK',
  SAVE_TRANSACTION: 'SAVE_TRANSACTION'
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
export const initFreeHandshake = createAPI(ACTIONS.INIT_HANDSHAKE_FREE);
export const shakeItem = createAPI(ACTIONS.SHAKE);
export const uninitItem = createAPI(ACTIONS.UNINIT);
export const collect = createAPI(ACTIONS.COLLECT);
export const refund = createAPI(ACTIONS.REFUND);
export const rollback = createAPI(ACTIONS.ROLLBACK);
export const saveTransaction = createAPI(ACTIONS.SAVE_TRANSACTION);



