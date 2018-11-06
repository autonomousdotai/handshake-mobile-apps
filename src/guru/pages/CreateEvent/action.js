export const loadReports = (payload = {}) => {
  return {
    type: 'PEX:GET_REPORTS',
    payload
  };
};

export const updateReports = (payload = {}) => {
  return {
    type: 'PEX:UPDATE_REPORTS',
    payload
  };
}

export const createEvent = (payload = {}) => {
  return {
    type: 'PEX:CREATE_EVENT',
    ...payload
  };
};
