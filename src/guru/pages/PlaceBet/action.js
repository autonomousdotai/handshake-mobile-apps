export const getMatchDetail = (payload = {}) => {
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

export const getGasPrice = () => {
  return {
    type: 'GURU:GET_GAS_PRICE'
  };
};

export const putGasPrice = (payload) => {
  return {
    type: 'GURU:PUT_GAS_PRICE',
    payload
  };
};
