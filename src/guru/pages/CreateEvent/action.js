export const loadReports = (payload = {}) => {
  return {
    type: 'GURU:GET_REPORTS',
    payload
  };
};

export const updateReports = (payload = {}) => {
  return {
    type: 'GURU:UPDATE_REPORTS',
    payload
  };
}
