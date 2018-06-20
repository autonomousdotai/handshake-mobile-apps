import React from 'react';
import { FormattedMessage } from 'react-intl';

export const APP = {
  HEADER_DEFAULT: 'Handshake',
  // store
  VERSION: 'app_version',
  LOCALE: 'app_locale',
  AUTH_TOKEN: 'auth_token',
  AUTH_PROFILE: 'auth_profile',
  WALLET_MASTER: 'wallet_master',
  WALLET_CACHE: 'wallet_cache',
  WALLET_DEFAULT: 'wallet_default',
  WALLET_LIST: 'wallet_list',
  IP_INFO: 'ip_info',
  EMAIL_NEED_VERIFY: 'email_need_verify',
  PHONE_NEED_VERIFY: 'phone_need_verify',
  COUNTRY_PHONE_NEED_VERIFY: 'country_phone_need_verify',
  REFERS: 'refers',
  OFFLINE_STATUS: 'offline_status',
};

export const UNSELECTED = 'UNSELECTED';

export const HANDSHAKE_ID = { // important
  PROMISE: 1,
  EXCHANGE: 2,
  BETTING: 3,
  SEED: 4,
  WALLET_TRANSFER: 5,
  EXCHANGE_LOCAL: 6,
  BETTING_EVENT: 7,
  WALLET_RECEIVE: 8,
};

export const HANDSHAKE_ID_DEFAULT = 3;

export const HANDSHAKE_NAME = {
  // [HANDSHAKE_ID.PROMISE]: { name: 'Promise', priority: 3 },
  [HANDSHAKE_ID.BETTING]: { name: 'Predict an outcome', priority: 1 },
  [HANDSHAKE_ID.BETTING_EVENT]: { name: 'Design a betting market', priority: 2 },
  // [HANDSHAKE_ID.SEED]: 'Seed',
  [HANDSHAKE_ID.WALLET_TRANSFER]: { name: 'Transfer coins', priority: 4 },
  [HANDSHAKE_ID.WALLET_RECEIVE]: { name: 'Receive coins', priority: 5 },
  [HANDSHAKE_ID.EXCHANGE]: { name: 'Manage your station', priority: 6 },
  // [HANDSHAKE_ID.EXCHANGE_LOCAL]: { name: 'Make swaps', priority: 7 },
  // UNSELECTED: { name: 'Create a prediction market', priority: 100 },
};

export const PRICE_DECIMAL = 0;
export const AMOUNT_DECIMAL = 6;

export const CRYPTO_CURRENCY = {
  ETH: 'ETH',
  BTC: 'BTC',
};

export const CRYPTO_CURRENCY_NAME = {
  [CRYPTO_CURRENCY.ETH]: 'ETH',
  [CRYPTO_CURRENCY.BTC]: 'BTC',
};

export const CRYPTO_CURRENCY_LIST = [
  { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH] },
  { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC] },
];
export const FIREBASE_PATH = {
  USERS: '/users',
};
export const CRYPTO_CURRENCY_DEFAULT = CRYPTO_CURRENCY.ETH;

export const EXCHANGE_ACTION = {
  BUY: 'buy',
  SELL: 'sell',
};

export const EXCHANGE_ACTION_NAME = {
  [EXCHANGE_ACTION.BUY]: <FormattedMessage id="ex.label.buy" />,
  [EXCHANGE_ACTION.SELL]: <FormattedMessage id="ex.label.sell" />,
};

export const EXCHANGE_ACTION_PAST_NAME = {
  [EXCHANGE_ACTION.BUY]: <FormattedMessage id="ex.label.bought" />,
  [EXCHANGE_ACTION.SELL]: <FormattedMessage id="ex.label.sold" />,
};

export const EXCHANGE_ACTION_PRESENT_NAME = {
  [EXCHANGE_ACTION.BUY]: <FormattedMessage id="ex.label.buying" />,
  [EXCHANGE_ACTION.SELL]: <FormattedMessage id="ex.label.selling" />,
};

export const EXCHANGE_ACTION_PERSON = {
  [EXCHANGE_ACTION.BUY]: <FormattedMessage id="ex.label.buyer" />,
  [EXCHANGE_ACTION.SELL]: <FormattedMessage id="ex.label.seller" />,
};

export const EXCHANGE_ACTION_LIST = [
  { value: EXCHANGE_ACTION.BUY, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY] },
  { value: EXCHANGE_ACTION.SELL, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] },
];

export const EXCHANGE_ACTION_DEFAULT = EXCHANGE_ACTION.BUY;

export const FIAT_CURRENCY = 'USD';
export const FIAT_CURRENCY_SYMBOL = '$';

export const SELL_PRICE_TYPE_DEFAULT = 'fix';

// path
export const API_URL = {
  CRYPTOSIGN: {
    INIT_HANDSHAKE: 'cryptosign/handshake/init',
    INIT_HANDSHAKE_FREE: 'cryptosign/handshake/create_free_bet',
    SHAKE: 'cryptosign/handshake/shake',
    LOAD_MATCHES: 'cryptosign/match',
    LOAD_HANDSHAKES: 'cryptosign/handshake',
    CHECK_FREE_AVAILABLE: 'cryptosign/handshake/check_free_bet',
    UNINIT_HANDSHAKE: 'cryptosign/handshake/uninit',
    COLLECT: 'cryptosign/handshake/collect',
    ROLLBACK: 'cryptosign/handshake/rollback',
    REFUND: 'cryptosign/handshake/refund',
    ADD_MATCH: 'cryptosign/match/add',
    ADD_OUTCOME: 'cryptosign/outcome/add',
    SAVE_TRANSACTION: 'cryptosign/tx/add',
  },
  DISCOVER: {
    INDEX: 'handshake/discover',
  },
  EXCHANGE: {
    GET_CRYPTO_PRICE: 'exchange/info/instant-buy/price', // {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: 'exchange/instant-buys', // {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: 'exchange/user/profile/cc-limit', // {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: 'exchange/info/cc-limits', // {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: 'exchange/user/profile', // {path: '/user/profile', method: 'get'},
    GET_OFFER_PRICE: 'exchange/info/crypto-quote', // {path: '/info/instant-buy/price', method: 'get'},
    GET_LIST_OFFER_PRICE: 'exchange/info/crypto-quotes', // {path: '/info/instant-buy/price', method: 'get'},
    GET_USER_TRANSACTION: 'exchange/user/transactions', // {path: '/user/transactions', method: 'get'},
    OFFERS: 'exchange/offers',
    SHAKE: 'shake',
    WITHDRAW: 'withdraw',
    IP_DOMAIN: 'https://ipfind.co/me',

    // Store
    OFFER_STORES: 'exchange/offer-stores',
    SHAKES: 'shakes',
    REVIEWS: 'reviews',
  },
  SEED: {
    BASE: 'seed',
  },
  ME: {
    BASE: 'handshake/me',
    SET_OFFLINE_STATUS: 'exchange/user/profile/offline',
  },
  HANDSHAKE: {
    INDEX: 'handshake', // id handshake
    CREATE: 'handshake/create',
    UPDATE: 'handshake/update',
    DELETE: 'handshake/delete',
  },
  COMMENT: {
    CREATE: 'comment/',
    LIST: 'comment/list',
    GET_COMMENT_COUNT: 'comment/count',
  },
  ADMIN: {
    BASE: 'admin/',
  },
};

export const HANDSHAKE_STATUS = {
  INITED: 0,
  SHAKED: 1,
  ACCEPTED: 2,
  REJECTED: 3,
  DONE: 4,
  CANCELLED: 5,
  PENDING: -1,
  TRANSACTION_FAILED: -2,
  NEW: -3,
  BLOCKCHAIN_PENDING: -4,
};

export const HANDSHAKE_STATUS_NAME = {
  [HANDSHAKE_STATUS.INITED]: 'Inited',
  [HANDSHAKE_STATUS.SHAKED]: 'Shaked',
  [HANDSHAKE_STATUS.ACCEPTED]: 'Accepted',
  [HANDSHAKE_STATUS.DONE]: 'Done',
  [HANDSHAKE_STATUS.CANCELLED]: 'Cancelled',
  [HANDSHAKE_STATUS.PENDING]: 'Pending',
  [HANDSHAKE_STATUS.TRANSACTION_FAILED]: 'Transaction Failed',
  [HANDSHAKE_STATUS.NEW]: 'New',
  [HANDSHAKE_STATUS.BLOCKCHAIN_PENDING]: 'Blockchain Pending',
};

export const HANDSHAKE_EXCHANGE_STATUS = {
  CREATED: 0,
  ACTIVE: 1,
  CLOSING: 2,
  CLOSED: 3,
  SHAKING: 4,
  SHAKE: 5,
  COMPLETING: 6,
  COMPLETED: 7,
  WITHDRAWING: 8,
  WITHDRAW: 9,
  REJECTING: 10,
  REJECTED: 11,
};

export const HANDSHAKE_EXCHANGE_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_STATUS.CREATED]: <FormattedMessage id="ex.exchange.status.created" />,
  [HANDSHAKE_EXCHANGE_STATUS.ACTIVE]: <FormattedMessage id="ex.exchange.status.active" />,
  [HANDSHAKE_EXCHANGE_STATUS.CLOSING]: <FormattedMessage id="ex.exchange.status.closing" />,
  [HANDSHAKE_EXCHANGE_STATUS.CLOSED]: <FormattedMessage id="ex.exchange.status.closed" />,
  [HANDSHAKE_EXCHANGE_STATUS.SHAKING]: <FormattedMessage id="ex.exchange.status.shaking" />,
  [HANDSHAKE_EXCHANGE_STATUS.SHAKE]: <FormattedMessage id="ex.exchange.status.shake" />,
  [HANDSHAKE_EXCHANGE_STATUS.COMPLETING]: <FormattedMessage id="ex.exchange.status.completing" />,
  [HANDSHAKE_EXCHANGE_STATUS.COMPLETED]: <FormattedMessage id="ex.exchange.status.completed" />,
  [HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING]: <FormattedMessage id="ex.exchange.status.withdrawing" />,
  [HANDSHAKE_EXCHANGE_STATUS.WITHDRAW]: <FormattedMessage id="ex.exchange.status.withdraw" />,
  [HANDSHAKE_EXCHANGE_STATUS.REJECTING]: <FormattedMessage id="ex.exchange.status.rejecting" />,
  [HANDSHAKE_EXCHANGE_STATUS.REJECTED]: <FormattedMessage id="ex.exchange.status.rejected" />,
};

export const HANDSHAKE_EXCHANGE_STATUS_VALUE = {
  created: HANDSHAKE_EXCHANGE_STATUS.CREATED,
  active: HANDSHAKE_EXCHANGE_STATUS.ACTIVE,
  closing: HANDSHAKE_EXCHANGE_STATUS.CLOSING,
  closed: HANDSHAKE_EXCHANGE_STATUS.CLOSED,
  shaking: HANDSHAKE_EXCHANGE_STATUS.SHAKING,
  shake: HANDSHAKE_EXCHANGE_STATUS.SHAKE,
  completing: HANDSHAKE_EXCHANGE_STATUS.COMPLETING,
  completed: HANDSHAKE_EXCHANGE_STATUS.COMPLETED,
  withdrawing: HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING,
  withdraw: HANDSHAKE_EXCHANGE_STATUS.WITHDRAW,
  rejecting: HANDSHAKE_EXCHANGE_STATUS.REJECTING,
  rejected: HANDSHAKE_EXCHANGE_STATUS.REJECTED,
};

export const HANDSHAKE_EXCHANGE_CC_STATUS = {
  PROCESSING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
};

export const HANDSHAKE_EXCHANGE_CC_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING]: <FormattedMessage id="ex.cc.status.processing" />,
  [HANDSHAKE_EXCHANGE_CC_STATUS.SUCCESS]: <FormattedMessage id="ex.cc.status.success" />,
  [HANDSHAKE_EXCHANGE_CC_STATUS.CANCELLED]: <FormattedMessage id="ex.cc.status.cancelled" />,
};

export const HANDSHAKE_EXCHANGE_CC_STATUS_VALUE = {
  processing: HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING,
  success: HANDSHAKE_EXCHANGE_CC_STATUS.SUCCESS,
  cancelled: HANDSHAKE_EXCHANGE_CC_STATUS.CANCELLED,
};

export const HANDSHAKE_USER = {
  NORMAL: 0,
  OWNER: 1,
  SHAKED: 2,
};

export const HANSHAKE_USER_NAME = {
  [HANDSHAKE_USER.NORMAL]: 'NORMAL',
  [HANDSHAKE_USER.OWNER]: 'OWNER',
  [HANDSHAKE_USER.SHAKED]: 'SHAKED',
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS = {
  CREATED: 0,
  ACTIVE: 1,
  CLOSING: 2,
  CLOSED: 3,
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED]: <FormattedMessage id="ex.shop.status.created" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE]: <FormattedMessage id="ex.shop.status.active" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING]: <FormattedMessage id="ex.shop.status.closing" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED]: <FormattedMessage id="ex.shop.status.closed" />,
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE = {
  created: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED,
  active: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE,
  closing: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING,
  closed: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED,
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS = {
  PRE_SHAKING: 0,
  PRE_SHAKE: 1,
  SHAKING: 2,
  SHAKE: 3,
  REJECTING: 4,
  REJECTED: 5,
  COMPLETING: 6,
  COMPLETED: 7,
  CANCELLING: 8,
  CANCELLED: 9,
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING]: <FormattedMessage id="ex.shop.shake.status.pre_shaking" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE]: <FormattedMessage id="ex.shop.shake.status.pre_shake" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING]: <FormattedMessage id="ex.shop.shake.status.shaking" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE]: <FormattedMessage id="ex.shop.shake.status.shake" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING]: <FormattedMessage id="ex.shop.shake.status.rejecting" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED]: <FormattedMessage id="ex.shop.shake.status.rejected" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING]: <FormattedMessage id="ex.shop.shake.status.completing" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED]: <FormattedMessage id="ex.shop.shake.status.completed" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING]: <FormattedMessage id="ex.shop.shake.status.cancelling" />,
  [HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED]: <FormattedMessage id="ex.shop.shake.status.cancelled" />,
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_VALUE = {
  pre_shaking: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING,
  pre_shake: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE,
  shaking: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING,
  shake: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE,
  rejecting: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING,
  rejected: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED,
  completing: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING,
  completed: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED,
  cancelling: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING,
  cancelled: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED,
};

export const DEFAULT_FEE = {
  ETH: 0,
  BTC: 0,
};

export const EXCHANGE_FEED_TYPE = {
  EXCHANGE: 'exchange',
  INSTANT: 'instant',
  OFFER_STORE: 'offer_store',
  OFFER_STORE_SHAKE: 'offer_store_shake',
};

export const EXCHANGE_METHOD_PAYMENT = {
  [EXCHANGE_FEED_TYPE.EXCHANGE]: 'cash',
  [EXCHANGE_FEED_TYPE.INSTANT]: 'credit card',
};

export const EXCHANGE_COOKIE_READ_INSTRUCTION = {
  name: 'exchange-read-instruction',
  option: { expires: 7 },
};

export const DISCOVER_GET_HANDSHAKE_RADIUS = 2000000;

export const APP_USER_NAME = 'Ninja';

export const MIN_AMOUNT = {
  [CRYPTO_CURRENCY.ETH]: 0.1,
  [CRYPTO_CURRENCY.BTC]: 0.01,
};


// API

export const BASE_API = {
  BASE_URL: process.env.BASE_API_URL,
  TIMEOUT: 10000,
};

export const URL = {
  INDEX: '/',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',
  HANDSHAKE_ME_PROFILE: '/me/profile',
  HANDSHAKE_ME_VERIRY_EMAIL: '/me/verify/email',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:slug',

  HANDSHAKE_CHAT: '/chat',
  HANDSHAKE_CHAT_INDEX: '/chat',
  HANDSHAKE_CHAT_DETAIL: '/chat/:username',

  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',

  TRANSACTION_LIST: '/transactions',
  TRANSACTION_LIST_INDEX: '/transactions',

  COMMENTS_BY_SHAKE: '/comments',
  COMMENTS_BY_SHAKE_INDEX: '/comments',

  LANDING_PAGE_SHURIKEN: '/shuriken',
  LANDING_PAGE_SHURIKEN_INDEX: '/shuriken',

  LANDING_PAGE_TRADE: '/coin-exchange',
  LANDING_PAGE_TRADE_INDEX: '/coin-exchange',

  FAQ: '/faq',
  FAQ_INDEX: '/faq',
};

