/* eslint camelcase:0 */

import SellCryptoCoinModel from '@/models/SellCryptoCoin';
import { SELL_COIN_ACTIONS } from './action';

export const isOverLimit = (data = {}) => {
  const amountInUsd = Number.parseFloat(data.amount);
  const limit = Number.parseFloat(data.limit);
  if (Number.isNaN(amountInUsd + limit)) {
    throw new TypeError('Amount & limit must be a number');
  }
  return amountInUsd > limit;
};

const initialState = {
  coinInfo: {},
  fiatAmountOverLimit: false,
  orderInfo: {},
};

const sellCoinReducter = (state = initialState, action) => {
  switch (action.type) {
    case `${SELL_COIN_ACTIONS.SELL_COIN_GET_COIN_INFO}_SUCCESS`:
      if (action?.payload?.data) {
        const coinInfo = SellCryptoCoinModel.parseCoinInfo(action?.payload?.data);
        const fiatAmountOverLimit = isOverLimit({ amount: coinInfo.fiatLocalAmount, limit: coinInfo.limit });
        return {
          ...state,
          coinInfo,
          fiatAmountOverLimit,
        };
      }
      break;
    case `${SELL_COIN_ACTIONS.SELL_COIN_GET_COIN_INFO}_FAILED`:
      return initialState;
    case `${SELL_COIN_ACTIONS.SELL_COIN_ORDER}_SUCCESS`:
      if (action?.payload?.data) {
        const orderInfo = SellCryptoCoinModel.parseOrderResponse(action?.payload?.data);
        return {
          ...state,
          orderInfo,
        };
      }
      break;
    case `${SELL_COIN_ACTIONS.SELL_COIN_ORDER}_FAILED`:
      return {
        ...state,
        orderInfo: {},
      };
    default:
      return state;
  }
  return null;
};
export default sellCoinReducter;

