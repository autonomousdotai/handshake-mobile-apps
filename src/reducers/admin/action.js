import { createAPI } from '@/reducers/action';

export const ADMIN_ACTIONS = {
  AUTH: 'AUTH',
};

export const userAuthenticate = createAPI(ADMIN_ACTIONS.AUTH);

