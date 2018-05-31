import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
};

export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
