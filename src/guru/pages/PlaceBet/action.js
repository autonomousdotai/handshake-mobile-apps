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

export const getMatchOdd = (payload = {}) => {
  return {
    type: 'GURU:GET_MATCH_ODD',
    ...payload
  };
};

export const putMatchOdd = (payload = {}) => {
  return {
    type: 'GURU:PUT_MATCH_ODD',
    payload
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

export const initHandShake = (payload = {}) => {
  return {
    type: 'GURU:INIT_HANDSHAKE',
    payload
  };
};

export const putHandShake = (payload) => {
  return {
    type: 'GURU:PUT_HANDSHAKE',
    payload
  };
};
