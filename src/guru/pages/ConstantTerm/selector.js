export const currentContractSelector = (state) => {
  return (state.guru.currentContract);
};

export const constantTokenSelector = (state) => {
  return state.guru.constantToken;
};
