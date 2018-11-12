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

export const updateUserEvents = (events) => {
  return {
    type: 'GURU:UPDATE_USER_EVENTS',
    userEvents: events,
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
export const updateLoading = (loading) => {
  return {
    type: 'GURU:UPDATE_LOADING',
    isFetching: loading
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
