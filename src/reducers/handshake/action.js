import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
export const success = data => ({ type: `${ACTIONS.LOAD_DISCOVER}_SUCCESS`, payload: data });
export const failed = data => ({ type: `${ACTIONS.LOAD_DISCOVER}_FAILED`, payload: data });
