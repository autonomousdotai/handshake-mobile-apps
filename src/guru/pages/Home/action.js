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
