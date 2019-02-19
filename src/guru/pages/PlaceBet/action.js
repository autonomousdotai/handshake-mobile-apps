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

export const initHandShakeFree = (payload = {}) => {
  return {
    type: 'GURU:INIT_HANDSHAKE_FREE',
    payload
  };
};

export const putHandShake = (payload) => {
  return {
    type: 'GURU:PUT_HANDSHAKE',
    payload
  };
};

export const checkCompareRedeemCode = (payload = {}) => {
  return {
    type: 'GURU:COMPARE_REDEEM_CODE',
    payload
  };
};

export const putRedeemCode = (payload) => {
  return {
    type: 'GURU:PUT_REDEEM_CODE',
    payload
  };
};

export const removeRedeemCode = () => {
  return {
    type: 'GURU:REMOVE_REDEEM_CODE'
  };
};

export const checkPermissionConstant = (payload) => {
  return {
    type: 'GURU:CHECK_PERMISSION_CONSTANT',
    payload
  };
};

export const updatePermissionConstant = (payload) => {
  return {
    type: 'GURU:UPDATE_PERMISSION_CONSTANT',
    payload
  };
};

export const updateCurrentContract = (payload) => {
  return {
    type: 'GURU:UPDATE_CURRENT_CONTRACT',
    payload
  };
};

export const updateApproveConstant = (payload) => {
  return {
    type: 'GURU:UPDATE_APPROVE_CONSTANT',
    payload
  };
};
