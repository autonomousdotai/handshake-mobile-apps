import React from 'react';
import { FormattedMessage } from 'react-intl';
import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';

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
  CHAT_ENCRYPTION_KEYPAIR: 'chat_encryption_keypair',
  REFERS: 'refers',
  SETTING: 'setting',
  OFFLINE_STATUS: 'offline_status',
  ALLOW_LOCATION_ACCESS: 'allow_location_access',
  isSupportedLanguages: ['en', 'zh', 'fr', 'de', 'ja', 'ko', 'ru', 'es'],
  CC_SOURCE: 'cc_source',
  CC_PRICE: 'cc_price',
  CC_ADDRESS: 'cc_address',
  CC_TOKEN: 'cc_token',
  CC_EMAIL: 'cc_email',
  EXCHANGE_ACTION: 'exchange_action',
  EXCHANGE_CURRENCY: 'exchange_currency',
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
  CREATE_EVENT: 9,
  CREDIT: 10,
  NINJA_COIN: 22,
};

export const HANDSHAKE_ID_DEFAULT = HANDSHAKE_ID.BETTING;

export const HANDSHAKE_NAME = {
  // [HANDSHAKE_ID.PROMISE]: { name: 'Promise', priority: 3 },
  // [HANDSHAKE_ID.BETTING]: { name: 'Predict an outcome', priority: 1 },
  // [HANDSHAKE_ID.BETTING_EVENT]: { name: 'Design a betting market', priority: 2 },
  // [HANDSHAKE_ID.SEED]: 'Seed',
  [HANDSHAKE_ID.WALLET_TRANSFER]: { name: 'Transfer coins', priority: 4 },
  [HANDSHAKE_ID.WALLET_RECEIVE]: { name: 'Receive coins', priority: 5 },
  [HANDSHAKE_ID.EXCHANGE]: { name: 'Manage your ATM', priority: 6 },
  [HANDSHAKE_ID.CREATE_EVENT]: { name: 'Create your own market', priority: 7 },
  // [HANDSHAKE_ID.EXCHANGE_LOCAL]: { name: 'Make swaps', priority: 7 },
  // UNSELECTED: { name: 'Create a prediction market', priority: 100 },
};

export const CASH_SORTING_CRITERIA = {
  DISTANCE: 0,
  PRICE: 1,
  RATING: 2,
};

export const CASH_SORTING_LIST = [{
  value: CASH_SORTING_CRITERIA.DISTANCE,
  text: <FormattedMessage id="ex.sort.distance" />,
},
// {
//   value: CASH_SORTING_CRITERIA.PRICE,
//   text: <FormattedMessage id="ex.sort.price" />,
// },
{
  value: CASH_SORTING_CRITERIA.RATING,
  text: <FormattedMessage id="ex.sort.rating" />,
},
];

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
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
  BCH: 'BCH',
};

export const CRYPTO_CURRENCY_LIST = Object.values(CRYPTO_CURRENCY).map((item) => {
  return { value: item, text: CRYPTO_CURRENCY_NAME[item] };
});

export const CRYPTO_CURRENCY_COLORS = {
  [CRYPTO_CURRENCY.ETH]: { color: 'linear-gradient(-135deg, #D772FF 0%, #9B10F2 45%, #9E53E1 100%)', icon: iconEth },
  [CRYPTO_CURRENCY.BTC]: { color: 'linear-gradient(45deg, #FF8006 0%, #FFA733 51%, #FFC349 100%)', icon: iconBtc },
};

export const FIAT_CURRENCY = {
  RUB: 'RUB',
  VND: 'VND',
  PHP: 'PHP',
  CAD: 'CAD',
  USD: 'USD',
  EUR: 'EUR',
  HKD: 'HKD',
};

export const FIAT_CURRENCY_NAME = {
  [FIAT_CURRENCY.RUB]: 'RUB',
  [FIAT_CURRENCY.VND]: 'VND',
  [FIAT_CURRENCY.PHP]: 'PHP',
  [FIAT_CURRENCY.CAD]: 'CAD',
  [FIAT_CURRENCY.USD]: 'USD',
  [FIAT_CURRENCY.EUR]: 'EUR',
  [FIAT_CURRENCY.HKD]: 'HKD',
};

export const FIAT_CURRENCY_LIST = [
  { id: FIAT_CURRENCY.RUB, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.RUB] },
  { id: FIAT_CURRENCY.VND, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.VND] },
  { id: FIAT_CURRENCY.PHP, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.PHP] },
  { id: FIAT_CURRENCY.CAD, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.CAD] },
  { id: FIAT_CURRENCY.USD, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD] },
  { id: FIAT_CURRENCY.EUR, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.EUR] },
  { id: FIAT_CURRENCY.HKD, text: FIAT_CURRENCY_NAME[FIAT_CURRENCY.HKD] },
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

export const EXCHANGE_ACTION_ORDER = {
  [EXCHANGE_ACTION.BUY]: <FormattedMessage id="ex.label.purchase" />,
  [EXCHANGE_ACTION.SELL]: <FormattedMessage id="ex.label.sale" />,
};

export const EXCHANGE_ACTION_LIST = [
  { value: EXCHANGE_ACTION.BUY, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY] },
  { value: EXCHANGE_ACTION.SELL, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] },
];

export const EXCHANGE_ACTION_DEFAULT = EXCHANGE_ACTION.BUY;

export const EXCHANGE_ACTION_COLORS = {
  [EXCHANGE_ACTION.BUY]: { color: '#4CD964' },
  [EXCHANGE_ACTION.SELL]: { color: '#F86C4F' },
};

export const FIAT_CURRENCY_SYMBOL = '$';

export const SELL_PRICE_TYPE_DEFAULT = 'fix';

// path
export const API_URL = {
  CRYPTOSIGN: {
    ADMIN_AUTH: '/cryptosign/auth',
    INIT_HANDSHAKE: 'cryptosign/handshake/init',
    INIT_HANDSHAKE_FREE: 'cryptosign/handshake/create_free_bet',
    SHAKE: 'cryptosign/handshake/shake',
    LOAD_MATCHES: 'cryptosign/match',
    LOAD_MATCHES_DETAIL: 'cryptosign/match',
    RELEVANT_EVENTS: 'cryptosign/match/relevant-event',
    MATCHES_REPORT: 'cryptosign/match/report',
    COUNT_REPORT: 'cryptosign/match/report',
    ADMIN_MATCHES: 'cryptosign/admin/match/report',
    ADMIN_RESOLVE: 'cryptosign/admin/match/resolve',
    LOAD_HANDSHAKES: 'cryptosign/handshake',
    LOAD_REPORTS: 'cryptosign/source',
    LOAD_CATEGORIES: 'cryptosign/category',
    CHECK_FREE_AVAILABLE: 'cryptosign/handshake/check_free_bet',
    UNINIT_HANDSHAKE: 'cryptosign/handshake/uninit',
    UNINIT_HANDSHAKE_FREE: 'cryptosign/handshake/uninit_free_bet',
    COLLECT: 'cryptosign/handshake/collect',
    COLLECT_FREE: 'cryptosign/handshake/collect_free_bet',
    ROLLBACK: 'cryptosign/handshake/rollback',
    REFUND: 'cryptosign/handshake/refund',
    REFUND_FREE: 'cryptosign/handshake/refund_free_bet',
    DISPUTE: 'cryptosign/handshake/dispute',
    DISPUTE_FREE: 'cryptosign/handshake/dispute_free_bet',
    ADD_MATCH: 'cryptosign/match/add',
    ADD_OUTCOME: 'cryptosign/outcome/add',
    SAVE_TRANSACTION: 'cryptosign/tx/add',
    GENERATE_LINK: 'cryptosign/outcome/generate-link',
    PREDICTION_STATISTICS: 'cryptosign/outcome/ninja-predict',
    SUBCRIBE_EMAIL_PREDICTION: 'cryptosign/subscribe',
    SUBSCRIBE_EMAIL_EXTENSION: 'user/subscribe',

  },
  DISCOVER: {
    INDEX: 'handshake/discover',
  },
  EXCHANGE: {
    GET_FIAT_CURRENCY: 'exchange/info/crypto-price',
    GET_CRYPTO_PRICE: 'exchange/info/instant-buy/price', // {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: 'exchange/instant-buys', // {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: 'exchange/user/profile/cc-limit', // {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: 'exchange/info/cc-limits', // {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: 'exchange/user/profile', // {path: '/user/profile', method: 'get'},
    GET_OFFER_PRICE: 'exchange/info/crypto-quote', // {path: '/info/instant-buy/price', method: 'get'},
    GET_LIST_OFFER_PRICE: 'exchange/info/crypto-quotes', // {path: '/info/instant-buy/price', method: 'get'},
    GET_LIST_OFFER_PRICE_CASH_ATM: 'exchange/cash/quotes', // {path: '/info/instant-buy/price', method: 'get'},
    GET_USER_TRANSACTION: 'exchange/user/transactions', // {path: '/user/transactions', method: 'get'},
    OFFERS: 'exchange/offers',
    SHAKE: 'shake',
    WITHDRAW: 'withdraw',
    IP_DOMAIN: 'https://ipfind.co/me',

    // Store
    OFFER_STORES: 'exchange/offer-stores',
    SHAKES: 'shakes',
    REVIEWS: 'reviews',
    GET_DASHBOARD_INFO: 'exchange/user/transaction-counts',
    DEPOSIT_CREDIT_ATM: 'exchange/credit/deposit',
    CREDIT_ATM: 'exchange/credit',
    CREDIT_ATM_TRANSFER: 'exchange/credit/tracking',
    WITHDRAW_CASH_DEPOSIT_ATM: 'exchange/credit/withdraw',
    CASH_ATM: 'exchange/cash',
    CASH_STORE_ATM: 'exchange/cash/store',
    CRYPTO_TO_CASH: 'exchange/cash/price', // GET /cash/price?amount=1&currency=ETH
    SEND_ATM_CASH_TRANSFER: 'exchange/cash/order',
    CANCEL_ATM_CASH_TRANSFER: 'exchange/cash/order', // DELETE /cash/order/{id}
    GET_CASH_CENTER_BANK: 'exchange/cash/center', // GET /cash/center/HK (HK === country code)
    BUY_CRYPTO_ORDER: 'exchange/coin/order', // POST /coin/order
    BUY_CRYPTO_GET_COIN_INFO: 'exchange/coin/quote', // GET /coin/quote?amount=0.1&currency=ETH&fiat_currency=VND
    BUY_CRYPTO_GET_BANK_INFO: 'exchange/coin/center', // GET /coin/center/XX
    BUY_CRYPTO_SAVE_RECEIPT: 'exchange/coin/order', // POST /coin/{id}
    BUY_CRYPTO_QUOTE_REVERSE: 'exchange/coin/quote-reverse', // GET /coin/quote-reverse?fiat_amount=20000000&currency=ETH&fiat_currency=VND&type=cod
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
  CHAT: {
    GET_USER_NAME: 'user/username',
  },
  USER: {
    PROFILE: 'user/profile',
    CHECK_EXIST_EMAIL: 'user/check-email-exist',
    ID_VERIFICATION: 'user/id_verification',
  },
  INTERNAL: {
    GET_WITHDRAW_LIST: 'exchange/internal/credit/withdraw',
    COMPLETE_WITHDRAW: 'exchange/internal/credit/withdraw',
    GET_CASH_ORDER: 'exchange/cash/order', // `GET /cash/order?status=processing|tranferring|success`
    GET_COIN_ORDER: 'exchange/coin/order', // `GET /cash/order?status=processing|tranferring|success`
    REVIEW_COIN_ORDER: 'exchange/coin/review', // `GET /cash/order?status=processing|tranferring|success`
  },
  ID_VERIFICATION: {
    LIST_DOCUMENTS: 'id_verification/list',
    UPDATE_STATUS: 'id_verification/update',
    GET_DOCUMENT: 'id_verification/get',
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
  PRE_SHAKING: 8,
  PRE_SHAKE: 9,
  REJECTING: 10,
  REJECTED: 11,
  CANCELLING: 12,
  CANCELLED: 13,
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
  [HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKING]: <FormattedMessage id="ex.exchange.status.pre_shaking" />,
  [HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE]: <FormattedMessage id="ex.exchange.status.pre_shake" />,
  [HANDSHAKE_EXCHANGE_STATUS.REJECTING]: <FormattedMessage id="ex.exchange.status.rejecting" />,
  [HANDSHAKE_EXCHANGE_STATUS.REJECTED]: <FormattedMessage id="ex.exchange.status.rejected" />,
  [HANDSHAKE_EXCHANGE_STATUS.CANCELLING]: <FormattedMessage id="ex.exchange.status.cancelling" />,
  [HANDSHAKE_EXCHANGE_STATUS.CANCELLED]: <FormattedMessage id="ex.exchange.status.cancelled" />,
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
  pre_shaking: HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKING,
  pre_shake: HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE,
  rejecting: HANDSHAKE_EXCHANGE_STATUS.REJECTING,
  rejected: HANDSHAKE_EXCHANGE_STATUS.REJECTED,
  cancelling: HANDSHAKE_EXCHANGE_STATUS.CANCELLING,
  cancelled: HANDSHAKE_EXCHANGE_STATUS.CANCELLED,
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

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_SUB_STATUS = {
  refilling: 'refilling',
  refilled: 'refilled',
  undo_refill: 'undo_refill',
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
  OFFER_STORE_ITEM: 'offer_store_item',
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
  [CRYPTO_CURRENCY.ETH]: 0.01,
  [CRYPTO_CURRENCY.BTC]: 0.001,
  BCH: 0.001,
};

export const LOCATION_METHODS = {
  GPS: 'G',
  IP: 'I',
};

export const ATM_TYPE = {
  STORE: 'store',
  PERSONAL: 'personal',
};

export const ATM_STATUS = {
  OPEN: 'open',
  CLOSE: 'close',
};

export const TIME_FORMAT = 'HH:mm';
export const TIME_FORMAT_AM_PM = 'hh:mm a';

// API
export const BASE_API = {
  BASE_URL: process.env.BASE_API_URL,
  TIMEOUT: 10000,
};

export const API_ENDPOINT = process.env.PUBLIC_URL;

export const URL = {
  INDEX: '/',

  ADMIN: '/admin',
  ADMIN_ID_VERIFICATION: '/admin/id-verification',
  REPORT: '/report',
  RESOLVE: '/resolve',
  LUCKY_POOL: '/lucky',
  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',
  HANDSHAKE_ME_PROFILE: '/me/profile',
  HANDSHAKE_ME_VERIRY_EMAIL: '/me/verify/email',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:slug',

  HANDSHAKE_PREDICTION: '/prediction',
  HANDSHAKE_PEX: '/pex',
  PEX_EXTENSION: '/pex-extension',
  HANDSHAKE_PEX_CREATOR: '/create-pex',
  HANDSHAKE_PEX_UPDATER: '/create-pex/:eventId?',

  HANDSHAKE_CASH: '/cash',
  HANDSHAKE_CASH_INDEX: '/cash',
  HANDSHAKE_CASH_DETAIL: '/cash/:slug',

  HANDSHAKE_ATM: '/atm',
  HANDSHAKE_ATM_INDEX: '/atm',
  HANDSHAKE_ATM_DETAIL: '/atm/:slug',

  HANDSHAKE_CHAT: '/whisper',
  HANDSHAKE_CHAT_INDEX: '/whisper',
  HANDSHAKE_CHAT_DETAIL: '/whisper/:userId',
  HANDSHAKE_CHAT_ROOM_DETAIL: '/whisper/room/:roomId',

  WALLET_EXTENSION: '/wallet-extension',
  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_PAYMENT_TRANSFER: '/payment/transfer',
  HANDSHAKE_PAYMENT_TRANSFER_INDEX: '/payment/transfer',

  HANDSHAKE_PAYMENT: '/payment',
  HANDSHAKE_PAYMENT_INDEX: '/payment',



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

  WHITE_PAPER: '/whitepaper',
  WHITE_PAPER_INDEX: '/whitepaper',

  // ABOUT_NINJA_CASH: '/about-ninja-cash',

  // PRODUCT_URL: '/product',
  // RESEARCH_URL: '/research',

  PRODUCT_CASH_URL: '/cash',
  PRODUCT_ATM_URL: '/atm',
  CASH_FOR_BUSINESS: '/cash-for-business',
  ATM_FOR_BUSINESS: '/atm-for-business',
  PRODUCT_PREDICTION_URL: '/prediction',
  PEX_INSTRUCTION_URL: '/pex/instructions',
  PEX_LUCKY_DRAW_MECHANIC_URL: '/pex/luckydraw',
  PRODUCT_WALLET_URL: '/wallet',
  PRODUCT_PAYFORSTORES_URL: '/pay-for-stores',
  PRODUCT_PAYFORDEVS_URL: '/pay-for-devs',
  PRODUCT_PAYFORDEVS_GETSTARTED_URL: '/pay-for-devs-get-started',
  RESEARCH_INTERNET_CASH_URL: '/internet-cash',
  PRODUCT_DAD_URL: '/dad',
  PRODUCT_DAD_URL_SUBDOMAIN: 'https://dad.ninja.org/',
  RESEARCH_UNCOMMONS_URL: '/uncommons',
  PRODUCT_WHISPER_URL: '/whisper',
  PRODUCT_FUND_URL: 'https://ninja.org/fund/',

  RECRUITING: '/recruiting',
  RECRUITING_JOB_DETAIL: '/recruiting/:slug',

  CC_PAYMENT_URL: '/cc-payment',
  BUY_BY_CC_URL: '/buy-by-credit-card',
  BUY_COIN_URL: '/coin',
  BUY_COIN_FAQ_URL: '/coin/faq',

  ESCROW_WITHDRAW_SUCCESS: '/escrow/withdraw/success',

  SHOP_URL: '/shop',
  SHOP_URL_INDEX: '/shop',
  SHOP_URL_CONFIRM: '/shop/confirm',
  SHOP_URL_DETAIL: '/shop/:slug',

  INTERNAL_WITHDRAW_URL: '/d2l0aGRyYXdfZm9yX2dvZA/:superKey',
  INTERNAL_ADMIN_URL: '/admin/coin/:type',
  CASH_STORE_URL: '/cash_store',
  LANDING_BECOME_ATM: '/become-atm',
  INTERNAL_ADMIN_DASHBOARD_URL: '/internal-admin-dashboard',
};

export const LANDING_PAGE_TYPE = {
  product: {
    text: 'Product',
    url: '/product',
  },
  research: {
    text: 'Research',
    url: '/research',
  },
  landing: {
    text: '',
    url: '',
  },
};

export const RECRUITING_SLACK_CHANNEL = 'https://hooks.slack.com/services/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';

export const NB_BLOCKS = 20;

export const blockchainNetworks = {
  rinkeby: {
    type: 'ERC20',
    endpoint: 'https://rinkeby.infura.io/LLJy74SjotuIMxZJMUvf',
    name: 'Rinkeby',
    isTest: true,
    unit: 'ETH',
    chainId: 4,
    contracts: {
      predictionHandshakeAddress: '0x6f25814d49bcf8345f8afd2a3bf9d5fd95079f84',
      predictionHandshakeDevAddress: '0x6f25814d49bcf8345f8afd2a3bf9d5fd95079f84',
      exchangeHandshakeAddress: '0x6d86cf435978cb75aecc43d0a4e3a379af7667d8',
      exchangeCashAddress: '0x8b52cf985f6814662acdc07ecdfadd1a41afd8b8',
      shurikenTokenAddress: '0xc2f227834af7b44a11a9286f1771cade7ecd316c',
    },
    contractFiles: {
      basic: 'BasicHandshake',
      prediction: 'PredictionHandshake',
      exchange: 'ExchangeHandshake',
    },
  },
  ethereum: {
    type:
    'ERC20',
    endpoint: 'https://mainnet.infura.io/',
    name: 'Ethereum',
    unit: 'ETH',
    chainId: 1,
    contracts: {
      predictionHandshakeAddress: '0x2730da6188a35a5a384f4a3127036bb90f3721b5',
      predictionHandshakeDevAddress: '0x6f25814d49bcf8345f8afd2a3bf9d5fd95079f84',
      exchangeHandshakeAddress: '0x5fa2e0d96dbe664beb502407bf46ea85b131fb86',
      exchangeCashAddress: '0x72b0ba8b3e039153b557e4e15fa11fd6a79b7498',
      shurikenTokenAddress: '0xca0fed76b5807557ce38e65cab83be3373cc2e7d',
    },
    contractFiles: {
      basic: 'BasicHandshake',
      prediction: 'PredictionHandshake',
      exchange: 'ExchangeHandshake',
    },
  },
  bitcoin: {
    type: 'BTC',
    endpoint: 'https://insight.bitpay.com/api',
    name: 'Bitcoin',
    unit: 'BTC',
  },
  bitcoinTest: {
    type: 'BTC',
    endpoint: 'https://test-insight.bitpay.com/api',
    name: 'Bitcoin Test',
    isTest: true,
    unit: 'BTC',
  },
};

export const Country = {
  AD: 'EUR',
  AE: 'AED',
  AF: 'AFN',
  AG: 'XCD',
  AI: 'XCD',
  AL: 'ALL',
  AM: 'AMD',
  AO: 'AOA',
  AQ: '',
  AR: 'ARS',
  AS: 'USD',
  AT: 'EUR',
  AU: 'AUD',
  AW: 'AWG',
  AX: 'EUR',
  AZ: 'AZN',
  BA: 'BAM',
  BB: 'BBD',
  BD: 'BDT',
  BE: 'EUR',
  BF: 'XOF',
  BG: 'BGN',
  BH: 'BHD',
  BI: 'BIF',
  BJ: 'XOF',
  BL: 'EUR',
  BM: 'BMD',
  BN: 'BND',
  BO: 'BOB',
  BQ: 'USD',
  BR: 'BRL',
  BS: 'BSD',
  BT: 'BTN',
  BV: 'NOK',
  BW: 'BWP',
  BY: 'BYN',
  BZ: 'BZD',
  CA: 'CAD',
  CC: 'AUD',
  CD: 'CDF',
  CF: 'XAF',
  CG: 'XAF',
  CH: 'CHF',
  CI: 'XOF',
  CK: 'NZD',
  CL: 'CLP',
  CM: 'XAF',
  CN: 'CNY',
  CO: 'COP',
  CR: 'CRC',
  CU: 'CUP',
  CV: 'CVE',
  CW: 'ANG',
  CX: 'AUD',
  CY: 'EUR',
  CZ: 'CZK',
  DE: 'EUR',
  DJ: 'DJF',
  DK: 'DKK',
  DM: 'XCD',
  DO: 'DOP',
  DZ: 'DZD',
  EC: 'USD',
  EE: 'EUR',
  EG: 'EGP',
  EH: 'MAD',
  ER: 'ERN',
  ES: 'EUR',
  ET: 'ETB',
  FI: 'EUR',
  FJ: 'FJD',
  FK: 'FKP',
  FM: 'USD',
  FO: 'DKK',
  FR: 'EUR',
  GA: 'XAF',
  GB: 'GBP',
  GD: 'XCD',
  GE: 'GEL',
  GF: 'EUR',
  GG: 'GBP',
  GH: 'GHS',
  GI: 'GIP',
  GL: 'DKK',
  GM: 'GMD',
  GN: 'GNF',
  GP: 'EUR',
  GQ: 'XAF',
  GR: 'EUR',
  GS: 'GBP',
  GT: 'GTQ',
  GU: 'USD',
  GW: 'XOF',
  GY: 'GYD',
  HK: 'HKD',
  HM: 'AUD',
  HN: 'HNL',
  HR: 'HRK',
  HT: 'HTG',
  HU: 'HUF',
  ID: 'IDR',
  IE: 'EUR',
  IL: 'ILS',
  IM: 'GBP',
  IN: 'INR',
  IO: 'USD',
  IQ: 'IQD',
  IR: 'IRR',
  IS: 'ISK',
  IT: 'EUR',
  JE: 'GBP',
  JM: 'JMD',
  JO: 'JOD',
  JP: 'JPY',
  KE: 'KES',
  KG: 'KGS',
  KH: 'KHR',
  KI: 'AUD',
  KM: 'KMF',
  KN: 'XCD',
  KP: 'KPW',
  KR: 'KRW',
  XK: 'EUR',
  KW: 'KWD',
  KY: 'KYD',
  KZ: 'KZT',
  LA: 'LAK',
  LB: 'LBP',
  LC: 'XCD',
  LI: 'CHF',
  LK: 'LKR',
  LR: 'LRD',
  LS: 'LSL',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  LY: 'LYD',
  MA: 'MAD',
  MC: 'EUR',
  MD: 'MDL',
  ME: 'EUR',
  MF: 'EUR',
  MG: 'MGA',
  MH: 'USD',
  MK: 'MKD',
  ML: 'XOF',
  MM: 'MMK',
  MN: 'MNT',
  MO: 'MOP',
  MP: 'USD',
  MQ: 'EUR',
  MR: 'MRO',
  MS: 'XCD',
  MT: 'EUR',
  MU: 'MUR',
  MV: 'MVR',
  MW: 'MWK',
  MX: 'MXN',
  MY: 'MYR',
  MZ: 'MZN',
  NA: 'NAD',
  NC: 'XPF',
  NE: 'XOF',
  NF: 'AUD',
  NG: 'NGN',
  NI: 'NIO',
  NL: 'EUR',
  NO: 'NOK',
  NP: 'NPR',
  NR: 'AUD',
  NU: 'NZD',
  NZ: 'NZD',
  OM: 'OMR',
  PA: 'PAB',
  PE: 'PEN',
  PF: 'XPF',
  PG: 'PGK',
  PH: 'PHP',
  PK: 'PKR',
  PL: 'PLN',
  PM: 'EUR',
  PN: 'NZD',
  PR: 'USD',
  PS: 'ILS',
  PT: 'EUR',
  PW: 'USD',
  PY: 'PYG',
  QA: 'QAR',
  RE: 'EUR',
  RO: 'RON',
  RS: 'RSD',
  RU: 'RUB',
  RW: 'RWF',
  SA: 'SAR',
  SB: 'SBD',
  SC: 'SCR',
  SD: 'SDG',
  SS: 'SSP',
  SE: 'SEK',
  SG: 'SGD',
  SH: 'SHP',
  SI: 'EUR',
  SJ: 'NOK',
  SK: 'EUR',
  SL: 'SLL',
  SM: 'EUR',
  SN: 'XOF',
  SO: 'SOS',
  SR: 'SRD',
  ST: 'STD',
  SV: 'USD',
  SX: 'ANG',
  SY: 'SYP',
  SZ: 'SZL',
  TC: 'USD',
  TD: 'XAF',
  TF: 'EUR',
  TG: 'XOF',
  TH: 'THB',
  TJ: 'TJS',
  TK: 'NZD',
  TL: 'USD',
  TM: 'TMT',
  TN: 'TND',
  TO: 'TOP',
  TR: 'TRY',
  TT: 'TTD',
  TV: 'AUD',
  TW: 'TWD',
  TZ: 'TZS',
  UA: 'UAH',
  UG: 'UGX',
  UM: 'USD',
  US: 'USD',
  UY: 'UYU',
  UZ: 'UZS',
  VA: 'EUR',
  VC: 'XCD',
  VE: 'VEF',
  VG: 'USD',
  VI: 'USD',
  VN: 'VND',
  VU: 'VUV',
  WF: 'XPF',
  WS: 'WST',
  YE: 'YER',
  YT: 'EUR',
  ZA: 'ZAR',
  ZM: 'ZMW',
  ZW: 'ZWL',
  CS: 'RSD',
  AN: 'ANG',
};

export const PAYMENT_REMIND = 'payment_remind';
export const CUSTOMER_ADDRESS_INFO = 'CUSTOMER_ADDRESS_INFO';
export const AUTONOMOUS_END_POINT = {
  BASE: 'https://www.autonomous.ai/api-v2',
  PRODUCT_INFO: '/product-api/product-info',
  PRODUCT_SPEC: '/product-api/product-spec',
  PRODUCT_QUESTIONS: '/product-api/product-questions',
  PRODUCT_REVIEWS: '/product-api/product-reviews',
  CHECKOUT: '/order-api/order/cart/checkout',
  PRODUCTS: '/product-api/v2/products',
  PRODUCT: '/product-api/product',
  CURRENT_COUNTRY: '/common-api/current-country',
  CHANGE_COUNTRY: '/common-api/change-country',
};
export const COUNTRY_LIST = {
  "AD": "AD - Andorra",
  "AE": "AE - UAE",
  "AF": "AF - Afghanistan",
  "AG": "AG - Antigua & Barbuda",
  "AI": "AI - Anguilla",
  "AL": "AL - Albania",
  "AM": "AM - Armenia",
  "AN": "AN - Netherland Antilles",
  "AO": "AO - Angola",
  "AR": "AR - Argentina",
  "AS": "AS - American Samoa",
  "AT": "AT - Austria",
  "AU": "AU - Australia",
  "AW": "AW - Aruba",
  "AZ": "AZ - Azerbaijan",
  "BA": "BA - Bosnia & Herzegovina",
  "BB": "BB - Barbados",
  "BC": "BC - BIOT",
  "BD": "BD - Bangladesh",
  "BE": "BE - Belgium",
  "BF": "BF - Burkina Faso",
  "BG": "BG - Bulgaria",
  "BH": "BH - Bahrain",
  "BI": "BI - Burundi",
  "BJ": "BJ - Benin",
  "BL": "BL - Bonaire",
  "BM": "BM - Bermuda",
  "BN": "BN - Brunei",
  "BO": "BO - Bolivia",
  "BR": "BR - Brazil",
  "BS": "BS - Bahamas",
  "BT": "BT - Bhutan",
  "BW": "BW - Botswana",
  "BY": "BY - Belarus",
  "BZ": "BZ - Belize",
  "CA": "CA - Canada",
  "CB": "CB - Curacao",
  "CC": "CC - Cocos Island",
  "CD": "CD - Channel Islands",
  "CF": "CF - CAR",
  "CG": "CG - Congo",
  "CH": "CH - Switzerland",
  "CI": "CI - Cote D\"Ivoire",
  "CK": "CK - Cook Islands",
  "CL": "CL - Chile",
  "CM": "CM - Cameroon",
  "CN": "CN - China",
  "CO": "CO - Colombia",
  "CR": "CR - Costa Rica",
  "CU": "CU - Cuba",
  "CV": "CV - Cape Verde",
  "CX": "CX - Christmas Island",
  "CY": "CY - Cyprus",
  "CZ": "CZ - Czech Republic",
  "DE": "DE - Germany",
  "DJ": "DJ - Djibouti",
  "DK": "DK - Denmark",
  "DM": "DM - Dominica",
  "DO": "DO - Dominican Republic",
  "DZ": "DZ - Algeria",
  "EC": "EC - Ecuador",
  "EE": "EE - Estonia",
  "EG": "EG - Egypt",
  "ER": "ER - Eritrea",
  "ES": "ES - Spain",
  "ET": "ET - Ethiopia",
  "EU": "EU - St Eustatius",
  "FI": "FI - Finland",
  "FJ": "FJ - Fiji",
  "FK": "FK - Falkland Islands",
  "FO": "FO - Faroe Islands",
  "FR": "FR - France",
  "GA": "GA - Gabon",
  "GB": "GB - United Kingdom",
  "GD": "GD - Grenada",
  "GE": "GE - Georgia",
  "GF": "GF - French Guiana",
  "GH": "GH - Ghana",
  "GI": "GI - Gibraltar",
  "GL": "GL - Greenland",
  "GM": "GM - Gambia",
  "GN": "GN - Guinea",
  "GP": "GP - Guadeloupe",
  "GQ": "GQ - Equatorial Guinea",
  "GR": "GR - Greece",
  "GT": "GT - Guatemala",
  "GU": "GU - Guam",
  "GY": "GY - Guyana",
  "HE": "HE - St Helena",
  "HK": "HK - Hong Kong",
  "HN": "HN - Honduras",
  "HR": "HR - Croatia",
  "HT": "HT - Haiti",
  "HU": "HU - Hungary",
  "HW": "HW - Hawaii",
  "IA": "IA - Iran",
  "IC": "IC - Canary Islands",
  "ID": "ID - Indonesia",
  "IL": "IL - Israel",
  "IM": "IM - Isle of Man",
  "IN": "IN - India",
  "IQ": "IQ - Iraq",
  "IR": "IR - Ireland",
  "IS": "IS - Iceland",
  "IT": "IT - Italy",
  "JM": "JM - Jamaica",
  "JO": "JO - Jordan",
  "JP": "JP - Japan",
  "KE": "KE - Kenya",
  "KG": "KG - Kyrgyzstan",
  "KH": "KH - Cambodia",
  "KI": "KI - Kiribati",
  "KM": "KM - Comoros",
  "KN": "KN - St Kitts-Nevis",
  "KS": "KS - Korea South",
  "KW": "KW - Kuwait",
  "KY": "KY - Cayman Islands",
  "KZ": "KZ - Kazakhstan",
  "LA": "LA - Laos",
  "LB": "LB - Lebanon",
  "LC": "LC - St Lucia",
  "LI": "LI - Liechtenstein",
  "LK": "LK - Sri Lanka",
  "LR": "LR - Liberia",
  "LS": "LS - Lesotho",
  "LT": "LT - Lithuania",
  "LU": "LU - Luxembourg",
  "LV": "LV - Latvia",
  "LY": "LY - Libya",
  "MA": "MA - Morocco",
  "MB": "MB - St Maarten",
  "MC": "MC - Monaco",
  "MD": "MD - Moldova",
  "ME": "ME - Montenegro",
  "MG": "MG - Madagascar",
  "MH": "MH - Marshall Islands",
  "MI": "MI - Midway Islands",
  "MK": "MK - Macedonia",
  "ML": "ML - Mali",
  "MM": "MM - Myanmar",
  "MN": "MN - Mongolia",
  "MO": "MO - Macau",
  "MQ": "MQ - Martinique",
  "MR": "MR - Mauritania",
  "MS": "MS - Montserrat",
  "MT": "MT - Malta",
  "MU": "MU - Mauritius",
  "MV": "MV - Maldives",
  "MW": "MW - Malawi",
  "MX": "MX - Mexico",
  "MY": "MY - Malaysia",
  "MZ": "MZ - Mozambique",
  "NA": "NA - Nambia",
  "NC": "NC - New Caledonia",
  "NE": "NE - Niger",
  "NF": "NF - Norfolk Island",
  "NG": "NG - Nigeria",
  "NI": "NI - Nicaragua",
  "NK": "NK - Korea North",
  "NL": "NL - Netherlands",
  "NO": "NO - Norway",
  "NP": "NP - Nepal",
  "NT": "NT - St Barthelemy",
  "NU": "NU - Nauru",
  "NV": "NV - Nevis",
  "NW": "NW - Niue",
  "NZ": "NZ - New Zealand",
  "OI": "OI - Somalia",
  "OM": "OM - Oman",
  "PA": "PA - Panama",
  "PE": "PE - Peru",
  "PF": "PF - French Polynesia",
  "PG": "PG - Papua New Guinea",
  "PH": "PH - Philippines",
  "PK": "PK - Pakistan",
  "PL": "PL - Poland",
  "PM": "PM - St Pierre",
  "PO": "PO - Pitcairn Island",
  "PR": "PR - Puerto Rico",
  "PS": "PS - Palestine",
  "PT": "PT - Portugal",
  "PW": "PW - Palau Island",
  "PY": "PY - Paraguay",
  "QA": "QA - Qatar",
  "RE": "RE - Reunion",
  "RO": "RO - Romania",
  "RS": "RS - Serbia",
  "RW": "RW - Rwanda",
  "SA": "SA - Saudi Arabia",
  "SB": "SB - Solomon Islands",
  "SC": "SC - Seychelles",
  "SD": "SD - Sudan",
  "SE": "SE - Sweden",
  "SG": "SG - Singapore",
  "SI": "SI - Slovenia",
  "SK": "SK - Slovakia",
  "SL": "SL - Sierra Leone",
  "SM": "SM - San Marino",
  "SN": "SN - Senegal",
  "SP": "SP - Saipan",
  "SR": "SR - Suriname",
  "ST": "ST - Sao Tome",
  "SV": "SV - El Salvador",
  "SY": "SY - Syria",
  "SZ": "SZ - Swaziland",
  "TA": "TA - Tahiti",
  "TC": "TC - Turks & Caicos Is",
  "TD": "TD - Chad",
  "TF": "TF - French Southern Ter",
  "TG": "TG - Togo",
  "TH": "TH - Thailand",
  "TJ": "TJ - Tajikistan",
  "TK": "TK - Tokelau",
  "TM": "TM - East Timor",
  "TN": "TN - Tunisia",
  "TO": "TO - Tonga",
  "TR": "TR - Turkey",
  "TT": "TT - Trinidad & Tobago",
  "TU": "TU - Turkmenistan",
  "TV": "TV - Tuvalu",
  "TW": "TW - Taiwan",
  "TZ": "TZ - Tanzania",
  "UA": "UA - Ukraine",
  "UG": "UG - Uganda",
  "US": "US - U.S.",
  "USAL": "USAL - U.S - Alaska",
  "USH": "USH - U.S - Hawaii",
  "USPR": "USPR - U.S - Puerto Rico",
  "UY": "UY - Uruguay",
  "UZ": "UZ - Uzbekistan",
  "VA": "VA - Virgin Islands (USA)",
  "VB": "VB - Virgin Islands (Brit)",
  "VC": "VC - St Vincent",
  "VE": "VE - Venezuela",
  "VN": "VN - Vietnam",
  "VS": "VS - Vatican City State",
  "VU": "VU - Vanuatu",
  "WF": "WF - Wallis & Futana Is",
  "WK": "WK - Wake Island",
  "WS": "WS - Samoa",
  "YE": "YE - Yemen",
  "YT": "YT - Mayotte",
  "ZA": "ZA - South Africa",
  "ZM": "ZM - Zambia",
  "ZR": "ZR - Zaire",
  "ZW": "ZW - Zimbabwe"
}

export const EXT = {
  URL: 'https://chrome.google.com/webstore/detail/ninja-prediction/lmbfnjfjefcjgbddmaijlmkkpfipbjhb',
  CLIP_SOURCE: 'https://www.youtube.com/embed/Cpswr7hGtiA?rel=0&amp;autoplay=1&amp;loop=1&playlist=Cpswr7hGtiA'
}
