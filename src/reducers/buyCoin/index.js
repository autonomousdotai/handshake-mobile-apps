/* eslint camelcase:0 */

import BuyCryptoCoinModel from '@/models/BuyCryptoCoin';
import { BUY_COIN_ACTIONS } from './action';

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
  basePrice: {},
  bankInfo: {},
  quoteReverse: {},
  packages: {},
  fiatAmountOverLimit: false,
  fiatLimit: 0,
};

const buyCoinReducter = (state = initialState, action) => {
  switch (action.type) {
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_COIN_INFO}_SUCCESS`:
      if (action?.payload?.data) {
        const coinInfo = BuyCryptoCoinModel.parseCoinInfo(action?.payload?.data);
        const fiatAmountOverLimit = isOverLimit({ amount: coinInfo.fiatLocalAmount, limit: coinInfo.limit });
        if (action.isGetBasePrice) {
          return {
            ...state,
            basePrice: {
              ...state.basePrice,
              [action.currencyId]: {
                amount: action.amount,
                currencyId: action.currencyId,
                fiatCurrencyId: action.fiatCurrencyId,
                fiatLocalAmount: coinInfo.fiatLocalAmount,
                fiatAmountInUsd: coinInfo.fiatAmount,
              },
            },
          };
        }

        return {
          ...state,
          coinInfo,
          fiatAmountOverLimit,
          fiatLimit: coinInfo.limit,
        };
      }
      break;
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_BANK_INFO}_SUCCESS`:
      return {
        ...state,
        bankInfo: {
          ...state.bankInfo,
          [action?.payload?.data[0]?.country]: { ...action?.payload?.data[0]?.information },
        },
      };
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_ORDER}_SUCCESS`:
      return {
        ...state,
        order: { ...BuyCryptoCoinModel.parseOrder(action?.payload?.data) },
      };
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_QUOTE_REVERSE}_SUCCESS`:
      if (action?.payload?.data) {
        const quoteReverse = BuyCryptoCoinModel.parseQuoteReverse(action?.payload?.data);
        const fiatAmountOverLimit = isOverLimit({ amount: quoteReverse.fiatLocalAmount, limit: quoteReverse.limit });
        return {
          ...state,
          quoteReverse,
          fiatAmountOverLimit,
          fiatLimit: quoteReverse.limit,
        };
      }
      break;
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_PACKAGE}_SUCCESS`:
      if (action?.payload?.data) {
        const name = action?.name;
        const quoteReverse = BuyCryptoCoinModel.parseQuoteReverse(action?.payload?.data);
        const fiatAmountOverLimit = isOverLimit({ amount: quoteReverse.fiatLocalAmount, limit: quoteReverse.limit });
        const show = {
          fiatAmount: quoteReverse.fiatLocalAmount || quoteReverse.fiatAmount,
          fiatCurrency: quoteReverse.fiatLocalCurrency || quoteReverse.fiatCurrency,
        };
        return {
          ...state,
          packages: {
            ...state.packages,
            [name]: {
              ...state.packages[name],
              [quoteReverse?.currency]: { ...quoteReverse, fiatAmountOverLimit, show },
            },
          },
        };
      }
      break;
    default:
      return state;
  }
  return null;
};
export default buyCoinReducter;

