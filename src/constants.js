
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
  isSupportedLanguages: ['en', 'zh', 'fr', 'de', 'ja', 'ko', 'ru', 'es', 'vi'],
  CC_SOURCE: 'cc_source',
  CC_PRICE: 'cc_price',
  CC_ADDRESS: 'cc_address',
  CC_TOKEN: 'cc_token',
  CC_EMAIL: 'cc_email',
  EXCHANGE_ACTION: 'exchange_action',
  EXCHANGE_CURRENCY: 'exchange_currency'
};

export const HANDSHAKE_ID = {
  // important
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
  NINJA_COIN: 22
};

export const HANDSHAKE_ID_DEFAULT = HANDSHAKE_ID.BETTING;

// path
export const API_URL = {
  CRYPTOSIGN: {
    ADMIN_AUTH: 'cryptosign/auth',
    INIT_HANDSHAKE: 'cryptosign/handshake/init',
    INIT_HANDSHAKE_FREE: 'cryptosign/handshake/create_free_bet',
    SHAKE: 'cryptosign/handshake/shake',
    MATCH_ODD: 'cryptosign/handshake',
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
    CHECK_REDEEM_CODE: 'cryptosign/handshake/check_redeem_code',
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
    GET_EVENTS_USER: 'cryptosign/reputation/user/{{userId}}/match',
    GET_REPUTATION_USER: 'cryptosign/reputation',
    SUBSCRIBE_NOTIFICATION: 'cryptosign/subscribe-notification',
    COMPARE_REDEEM_CODE: 'cryptosign/redeem/check',
    USER_HABIT: 'cryptosign/user/habit',
    REFERRAL_CHECK: 'cryptosign/referral/check',
    REFERRAL_JOIN: 'cryptosign/referral/join'
  },
  DISCOVER: {
    INDEX: 'handshake/discover'
  },
  SEED: {
    BASE: 'seed'
  },
  ME: {
    BASE: 'handshake/me',
    SET_OFFLINE_STATUS: 'exchange/user/profile/offline'
  },
  HANDSHAKE: {
    INDEX: 'handshake', // id handshake
    CREATE: 'handshake/create',
    UPDATE: 'handshake/update',
    DELETE: 'handshake/delete'
  },
  COMMENT: {
    CREATE: 'comment/',
    LIST: 'comment/list',
    GET_COMMENT_COUNT: 'comment/count'
  },
  ADMIN: {
    BASE: 'admin/'
  },
  CHAT: {
    GET_USER_NAME: 'user/username'
  },
  USER: {
    PROFILE: 'user/profile',
    CHECK_EXIST_EMAIL: 'user/check-email-exist',
    ID_VERIFICATION: 'user/id_verification',
    LOGIN: 'user/login',
    SIGNUP: 'user/sign-up'
  },
  ID_VERIFICATION: {
    LIST_DOCUMENTS: 'id_verification/list',
    UPDATE_STATUS: 'id_verification/update',
    GET_DOCUMENT: 'id_verification/get'
  },

  ADMIN_MANAGER: {
    USER: {
      LIST: 'admin/user/list',
      UPDATE: 'admin/user/update'
    }
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
    SELL_COIN_GET_COIN_INFO: 'exchange/coin/quote', // GET /coin/quote?amount=0.1&currency=ETH&fiat_currency=VND&direction=sell
    SELL_COIN_ORDER: 'exchange/coin/selling-order', // POST /coin/selling-order
    SELL_COIN_GENERATE_ADDRESS: 'exchange/coin/generate-address', // POST /coin/generate-address?currency=BTC
    SELL_COIN_GET_BANK_LIST: 'exchange/coin/bank', // GET /coin/bank/{country}
  }
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
  CANCELLED: 13
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
  cancelled: HANDSHAKE_EXCHANGE_STATUS.CANCELLED
};

export const HANDSHAKE_EXCHANGE_CC_STATUS = {
  PROCESSING: 0,
  SUCCESS: 1,
  CANCELLED: 2
};

export const HANDSHAKE_EXCHANGE_CC_STATUS_VALUE = {
  processing: HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING,
  success: HANDSHAKE_EXCHANGE_CC_STATUS.SUCCESS,
  cancelled: HANDSHAKE_EXCHANGE_CC_STATUS.CANCELLED
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS = {
  CREATED: 0,
  ACTIVE: 1,
  CLOSING: 2,
  CLOSED: 3
};

export const HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE = {
  created: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED,
  active: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE,
  closing: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING,
  closed: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED
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
  CANCELLED: 9
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
  cancelled: HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED
};

export const EXCHANGE_FEED_TYPE = {
  EXCHANGE: 'exchange',
  INSTANT: 'instant',
  OFFER_STORE: 'offer_store',
  OFFER_STORE_SHAKE: 'offer_store_shake',
  OFFER_STORE_ITEM: 'offer_store_item'
};

export const APP_USER_NAME = 'Ninja';

// API
export const BASE_API = {
  BASE_URL: process.env.BASE_API_URL,
  TIMEOUT: 10000
};

export const SOCIAL = {
  FACEBOOK: 'https://www.facebook.com/ninjadotorg',
  TWITTER: 'https://twitter.com/ninjadotorg',
  LINKEDIN: 'https://linkedin.com/company/ninjadotorg',
  GITHUB: 'https://github.com/ninjadotorg/handshake-app',
  TELEGRAM: 'https://t.me/ninja_org'
};

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

  // Refactor
  CHROME_EXTENSION: '/chrome-extension',
  FEEDBACK: '/feedback',

  // Guru
  HANDSHAKE_GURU: '/guru',
  CREATE_EVENT: '/create-event',
  GURU_PLACE_BET: '/place-bet',
  HANDSHAKE_REPUTATION: '/reputation',
  HANDSHAKE_COINBASE_WALLET: '/wallet-coin',
  HANDSHAKE_COINBASE_AUTH: '/auth/callback',

  HANDSHAKE_PREDICTION: '/prediction',
  HANDSHAKE_PEX: '/pex',
  PEX_EXTENSION: '/pex-extension',
  HANDSHAKE_PEX_CREATOR: '/create-pex',
  HANDSHAKE_PEX_UPDATER: '/create-pex/:eventId?',

  WALLET_EXTENSION: '/wallet-extension',
  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_PAYMENT: '/payment',
  HANDSHAKE_PAYMENT_INDEX: '/payment',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',

  TRANSACTION_LIST: '/transactions',
  TRANSACTION_LIST_INDEX: '/transactions',

  COMMENTS: '/comments',

  WHITE_PAPER: '/whitepaper',
  WHITE_PAPER_INDEX: '/whitepaper',

  PREDICTION: '/prediction',
  PEX_INSTRUCTION_URL: '/pex/instructions',
  PRODUCT_WALLET_URL: '/wallet'
};

export const LANDING_PAGE_TYPE = {
  product: {
    text: 'Product',
    url: '/product'
  },
  research: {
    text: 'Research',
    url: '/research'
  },
  landing: {
    text: '',
    url: ''
  }
};

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
      predictionHandshakeDevAddress:
        '0x6f25814d49bcf8345f8afd2a3bf9d5fd95079f84',
      exchangeHandshakeAddress: '0x6d86cf435978cb75aecc43d0a4e3a379af7667d8',
      exchangeCashAddress: '0x8b52cf985f6814662acdc07ecdfadd1a41afd8b8',
      constantTokenAddress: '0xa8829b240c212b82279353207b48073155911553'  //TO DO: change address constant
    },
    contractFiles: {
      basic: 'BasicHandshake',
      prediction: 'PredictionHandshake',
      exchange: 'ExchangeHandshake'
    }
  },
  ethereum: {
    type: 'ERC20',
    endpoint: 'https://mainnet.infura.io/',
    name: 'Ethereum',
    unit: 'ETH',
    chainId: 1,
    contracts: {
      predictionHandshakeAddress: '0x2730da6188a35a5a384f4a3127036bb90f3721b5',
      predictionHandshakeDevAddress:
        '0x6f25814d49bcf8345f8afd2a3bf9d5fd95079f84',
      exchangeHandshakeAddress: '0x5fa2e0d96dbe664beb502407bf46ea85b131fb86',
      exchangeCashAddress: '0x72b0ba8b3e039153b557e4e15fa11fd6a79b7498',
      constantTokenAddress: '0xca0fed76b5807557ce38e65cab83be3373cc2e7d'  //TO DO: change address constant
    },
    contractFiles: {
      basic: 'BasicHandshake',
      prediction: 'PredictionHandshake',
      exchange: 'ExchangeHandshake'
    }
  },
  bitcoin: {
    type: 'BTC',
    endpoint: 'https://insight.bitpay.com/api',
    name: 'Bitcoin',
    unit: 'BTC'
  },
  bitcoinTest: {
    type: 'BTC',
    endpoint: 'https://test-insight.bitpay.com/api',
    name: 'Bitcoin Test',
    isTest: true,
    unit: 'BTC'
  }
};

export const PAYMENT_REMIND = 'payment_remind';

export const EXT = {
  URL:
    'https://chrome.google.com/webstore/detail/ninja-prediction/lmbfnjfjefcjgbddmaijlmkkpfipbjhb',
  CLIP_SOURCE:
    'https://www.youtube.com/embed/eZuN9414UOo?rel=0&amp;autoplay=1&amp;loop=1&playlist=eZuN9414UOo'
};
