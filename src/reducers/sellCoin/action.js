import { createAPI } from '@/reducers/action';

export const SELL_COIN_ACTIONS = {
  SELL_COIN_GET_COIN_INFO: 'SELL_COIN_GET_COIN_INFO',
  SELL_COIN_ORDER: 'SELL_COIN_ORDER',
};

export const sellCryptoOrder = createAPI(SELL_COIN_ACTIONS.SELL_COIN_ORDER);
export const sellCryptoGetCoinInfo = createAPI(SELL_COIN_ACTIONS.SELL_COIN_GET_COIN_INFO);

