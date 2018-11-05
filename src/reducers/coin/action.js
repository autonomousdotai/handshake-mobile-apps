import { createAPI } from '@/reducers/action';

export const COIN_ACTIONS = {
  GET_SELL_PRICE: 'GET_SELL_PRICE',
  GET_BUY_PRICE: 'GET_BUY_PRICE',
};

export const coinGetSellPrice = createAPI(COIN_ACTIONS.GET_SELL_PRICE);
export const coinGetBuyPrice = createAPI(COIN_ACTIONS.GET_BUY_PRICE);
