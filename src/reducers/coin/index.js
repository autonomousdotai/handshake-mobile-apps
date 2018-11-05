/* eslint camelcase:0 */

import SellCryptoCoinModel from '@/models/SellCryptoCoin';
import BuyCryptoCoinModel from '@/models/BuyCryptoCoin';
import { COIN_ACTIONS } from './action';

const initialState = {
  sellPrice: {},
  buyPrice: {},
};

const coinReducter = (state = initialState, action) => {
  switch (action.type) {
    case `${COIN_ACTIONS.GET_BUY_PRICE}_SUCCESS`:
      if (action?.payload?.data) {
        const coinInfo = BuyCryptoCoinModel.parseCoinInfo(action?.payload?.data);
        return {
          ...state,
          buyPrice: {
            ...state.buyPrice,
            [action?.name]: coinInfo,
          },
        };
      }
      break;
    case `${COIN_ACTIONS.GET_SELL_PRICE}_SUCCESS`:
      if (action?.payload?.data) {
        const coinInfo = SellCryptoCoinModel.parseCoinInfo(action?.payload?.data);
        return {
          ...state,
          sellPrice: {
            ...state.sellPrice,
            [action?.name]: coinInfo,
          },
        };
      }
      break;
    default:
      return state;
  }
  return null;
};
export default coinReducter;

