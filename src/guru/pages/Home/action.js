export const loadMatches = (payload = {}) => {
  return {
    type: 'GURU:LOAD_MATCHES',
    ...payload
  };
};

export const updateEvents = (payload = {}) => {
  return {
    type: 'GURU:UPDATE_EVENTS',
    payload
  };
};

export const loadRelatedMatches = (payload = {}) => {
  return {
    type: 'GURU:LOAD_RELATED_MATCHES',
    ...payload
  };
};

export const putRelatedMatches = (payload) => {
  return {
    type: 'GURU:PUT_RELATED_MATCHES',
    payload
  };
};

export const getReportCount = (payload = {}) => {
  return {
    type: 'GURU:COUNT_REPORT',
    ...payload
  };
};

export const removeExpiredEvent = (payload = {}) => {
  return {
    type: 'GURU:REMOVE_EXPIRED_EVENT',
    ...payload
  };
};

export const updateCountReport = (payload) => {
  return {
    type: 'GURU:CHECK_REPORT',
    payload
  };
};

export const checkRedeemCode = (payload = {}) => {
  return {
    type: 'GURU:CHECK_REDEEM_CODE',
    ...payload
  };
};

export const emailSubscriber = (payload = {}) => {
  return {
    type: 'GURU:SUBCRIBE_EMAIL_PREDICTION',
    ...payload
  };
};

export const putUserSubscribe = (payload) => {
  return {
    type: 'GURU:PUT_USER_SUBSCRIBE',
    payload
  };
};

export const putStatusEmailSubscribe = (payload) => {
  return {
    type: 'GURU:PUT_STATUS_EMAIL_SUBSCRIBE',
    payload
  };
};

// Move to Reputation
export const updateUserEvents = (events, loadMore, page) => {
  return {
    type: 'GURU:UPDATE_USER_EVENTS',
    userEvents: events,
    loadMore,
    page
  };
};

export const updateNewUserEvents = (events, loadMore, page) => {
  return {
    type: 'GURU:UPDATE_NEW_USER_EVENTS',
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
