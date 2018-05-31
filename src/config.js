export const BASE_API = {
  BASE_URL: process.env.BASE_URL,
  TIMEOUT: 10000,
};

export const URL = {
  INDEX: '/',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:id',

  HANDSHAKE_CHAT: '/chat',
  HANDSHAKE_CHAT_INDEX: '/chat',

  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',

  TRANSACTION_LIST: '/transactions',
  TRANSACTION_LIST_INDEX: '/transactions',
};
