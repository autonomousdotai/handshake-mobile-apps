export const APP = {
  HEADER_DEFAULT: 'Handshake',
  // store
  AUTH_TOKEN: 'auth_token',
  AUTH_PROFILE: 'auth_profile',
  WALLET_MASTER: 'wallet_master',
  WALLET_CACHE: 'wallet_cache',
  WALLET_DEFAULT: 'wallet_default',
  WALLET_LIST: 'wallet_list',
};

export const HANDSHAKE_ID = {
  PROMISE: 1,
  EXCHANGE: 2,
  BETTING: 3,
  SEED: 4,
  EXCHANGE_SELL: 5,
  EXCHANGE_BUY: 6,
};

export const HANDSHAKE_ID_DEFAULT = 2;

export const HANDSHAKE_NAME = {
  [HANDSHAKE_ID.PROMISE]: 'Promise',
  [HANDSHAKE_ID.EXCHANGE]: 'Exchange',
  [HANDSHAKE_ID.BETTING]: 'Betting',
  [HANDSHAKE_ID.SEED]: 'Seed',
};

export const PRICE_DECIMAL = 2;
export const AMOUNT_DECIMAL = 6;

export const CRYPTO_CURRENCY = [
  { value: 'ETH', text: 'ETH' },
  { value: 'BTC', text: 'BTC' },
];

export const CRYPTO_CURRENCY_DEFAULT = 'ETH';

export const EXCHANGE_ACTION = [
  { value: 'buy', text: 'Buy' },
  { value: 'sell', text: 'Sell' },
];

export const EXCHANGE_ACTION_DEFAULT = 'buy';

export const FIAT_CURRENCY = 'USD';
export const FIAT_CURRENCY_SYMBOL = '$';

export const SELL_PRICE_TYPE = [
  { value: 'fix', text: 'Fix' },
  { value: 'flexible', text: 'Flexible' },
];

export const SELL_PRICE_TYPE_DEFAULT = 'fix';

// path
export const API_URL = {
  CRYPTOSIGN: {
    BASE: 'cryptosign',
  },
  EXCHANGE: {
    BASE: 'https://stag-handshake.autonomous.ai/api/exchange',
    GET_CRYPTO_PRICE: 'info/instant-buy/price', // {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: 'instant-buys', // {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: 'user/profile/cc-limit', // {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: 'info/cc-limits', // {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: 'user/profile', // {path: '/user/profile', method: 'get'},
    GET_OFFER_PRICE: 'info/crypto-quote', // {path: '/info/instant-buy/price', method: 'get'},
    GET_USER_TRANSACTION: 'user/transactions', // {path: '/user/transactions', method: 'get'},
    OFFER: 'offers',
    SHAKE: 'shake',
  },
  SEED: {
    BASE: 'seed',
  },
};
