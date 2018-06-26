import { minValue } from '@/components/core/form/validation';
import {
  MIN_AMOUNT,
  CRYPTO_CURRENCY,
} from '@/constants';

export const minValueETH = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.ETH]);
export const minValueBTC = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.BTC]);

export const validate = (values) => {
  const { amountBuy, amountSell, currency } = values;
  const errors = {};

  const amountBuyFloat = parseFloat(amountBuy, 10);
  const amountSellFloat = parseFloat(amountSell, 10);
  const wantToBuy = amountBuyFloat && amountBuyFloat > 0;
  const wantToSell = amountSellFloat && amountSellFloat > 0;
  if (!wantToBuy && !wantToSell) {
    errors.amountBuy = errors.amountSell = 'You need to fill in one of these!';
  } else {
    const validateMin = currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH;
    if (wantToBuy) {
      errors.amountBuy = validateMin(amountBuy);
    }
    if (wantToSell) {
      errors.amountSell = validateMin(amountSell);
    }
  }

  return errors;
};
