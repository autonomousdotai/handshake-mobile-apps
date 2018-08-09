import { BASE_API } from '@/constants';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
  INIT_HANDSHAKE_FREE: 'INIT_HANDSHAKE_FREE',
  SHAKE: 'SHAKE',
  UNINIT: 'UNINIT',
  UNINIT_FREE: 'UNINIT_FREE',
  COLLECT: 'COLLECT',
  COLLECT_FREE: 'COLLECT_FREE',
  REFUND: 'REFUND',
  REFUND_FREE: 'REFUND_FREE',
  ROLLBACK: 'ROLLBACK',
  SAVE_TRANSACTION: 'SAVE_TRANSACTION',
  DISPUTE: 'DISPUTE',
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
export const initFreeHandshake = createAPI(ACTIONS.INIT_HANDSHAKE_FREE);
export const shakeItem = createAPI(ACTIONS.SHAKE);
export const uninitItem = createAPI(ACTIONS.UNINIT);
export const uninitItemFree = createAPI(ACTIONS.UNINIT_FREE);
export const collect = createAPI(ACTIONS.COLLECT);
export const collectFree = createAPI(ACTIONS.COLLECT_FREE);
export const refundFree = createAPI(ACTIONS.REFUND_FREE);
export const refund = createAPI(ACTIONS.REFUND);
export const dispute = createAPI(ACTIONS.DISPUTE);
export const rollback = createAPI(ACTIONS.ROLLBACK);
export const saveTransaction = createAPI(ACTIONS.SAVE_TRANSACTION);

