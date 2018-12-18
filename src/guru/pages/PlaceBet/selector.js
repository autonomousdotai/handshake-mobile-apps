export const queryStringSelector = (state) => (state.router.location.search);

export const eventSelector = (state) => (state.guru.events);

export const matchDetailSelector = (state) => (state.guru.matchDetail);

export const gasPriceSelector = (state) => (parseFloat(state.guru.gasPrice));

export const matchOddsSelector = (state) => (state.guru.matchDetail.odds);

export const handShakesSelector = (state) => (state.guru.handShakes);

export const isRedeemSelector = (state) => {
  return (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.redeem);
};

export const isSubscribeSelector = (state) => {
  return (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.is_subscribe);
};
