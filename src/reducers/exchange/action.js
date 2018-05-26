// import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const EXCHANGE_ACTIONS = {
  GET_CRYPTO_PRICE: 'GET_CRYPTO_PRICE',

  CREATE_CC_ORDER: 'CREATE_CC_ORDER',

  GET_USER_CC_LIMIT: 'GET_USER_CC_LIMIT',

  GET_CC_LIMITS: 'GET_CC_LIMITS',

  GET_USER_PROFILE: 'GET_USER_PROFILE',

  GET_USER_TRANSACTION: 'GET_USER_TRANSACTION',
};

export const getCryptoPrice = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_CRYPTO_PRICE,
});

export const createCCOrder = createAPI({
  INIT: EXCHANGE_ACTIONS.CREATE_CC_ORDER,
});

export const getUserCcLimit = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_CC_LIMIT,
});

export const getCcLimits = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_CC_LIMITS,
});

export const getUserProfile = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_PROFILE,
});

export const getUserTransaction = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_TRANSACTION,
});

