export const APP = {
  HEADER_DEFAULT: 'Handshake',
  TOKEN: 'token',
};

export const HANDSHAKE_ID = {
  PROMISE: 1,
  EXCHANGE: 2,
  BETTING: 3,
  SEED: 4,
};

export const HANDSHAKE_ID_DEFAULT = 1;

export const HANDSHAKE_NAME = {
  [HANDSHAKE_ID.PROMISE]: 'Promise',
  [HANDSHAKE_ID.EXCHANGE]: 'Exchange',
  [HANDSHAKE_ID.BETTING]: 'Betting',
  [HANDSHAKE_ID.SEED]: 'Seed',
};

// path
export const API_URL = {
  CRYPTOSIGN: {
    BASE: 'cryptosign',
  },
  EXCHANGE: {
    BASE: 'exchange'
  },
  SEED: {
    BASE: 'seed'
  },
};
