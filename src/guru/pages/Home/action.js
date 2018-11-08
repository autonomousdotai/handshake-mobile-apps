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
