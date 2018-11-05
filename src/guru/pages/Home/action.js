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
export const loadUserEvents = (payload = {}) => {
  return {
    type: 'GURU:LOAD_USER_EVENTS',
    ...payload,
  };
};
export const updateUserEvents = (events) => {
  return {
    type: 'GURU:UPDATE_USER_EVENTS',
    userEvents: events,
  };
};
