export const loadMatches = (payload = {}) => {
  return {
    type: 'GURU:LOAD_MATCHES',
    ...payload,
  };
};

export const updateEvents = (events) => {
  return {
    type: 'GURU:UPDATE_EVENTS',
    events,
  };
};

export const updateUserEvents = (events, loadMore, page) => {
  return {
    type: 'GURU:UPDATE_USER_EVENTS',
    userEvents: events,
    loadMore,
    page
  };
};

export const loadUserReputation = (payload = {}) => {
  return {
    type: 'GURU:LOAD_USER_REPUTATION',
    ...payload,
  };
};

export const updateUserReputation = (reputation) => {
  return {
    type: 'GURU:UPDATE_USER_REPUTATION',
    reputation,
  };
};

export const loginCoinbase = (payload = {}) => {
  return {
    type: 'GURU:LOGIN_COIN_BASE',
    ...payload,
  };
};

export const updateAuthCoinbase = (authCoinBase) => {
  return {
    type: 'GURU:UPDATE_AUTH_COINBASE',
    authCoinBase
  };
};

export const loginMetaMask = (payload = {}) => {
  return {
    type: 'GURU:LOGIN_META_MASK',
    ...payload,
  };
};

export const updateAuthMetaMask = (authMetaMask) => {
  return {
    type: 'GURU:UPDATE_AUTH_META_MASK',
    authMetaMask
  };
};
