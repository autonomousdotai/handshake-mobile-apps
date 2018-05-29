import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
