import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FETCH: 'AUTH_FETCH',
};

export const fetchProfile = createAPI(ACTIONS.AUTH_FETCH);
export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
