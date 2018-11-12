export const getMatchDetail = (payload = {}) => {
  console.log('GETMATCHDETAIL');
  return {
    type: 'GURU:GET_MATCH_DETAIL',
    ...payload
  };
};

export const putMatchDetail = (payload = {}) => {
  return {
    type: 'GURU:PUT_MATCH_DETAIL',
    ...payload
  };
};
