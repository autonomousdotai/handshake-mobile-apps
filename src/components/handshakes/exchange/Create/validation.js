import { minValue } from '@/components/core/form/validation';
import {
  MIN_AMOUNT,
  CRYPTO_CURRENCY,
} from '@/constants';

export const minValueETH = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.ETH]);
export const minValueBTC = minValue(MIN_AMOUNT[CRYPTO_CURRENCY.BTC]);

export const validate = (values, isUpdate) => {
  const { amountBuy, amountSell, currency } = values;
  const errors = {};

  const amountBuyFloat = parseFloat(amountBuy, 10);
  const amountSellFloat = parseFloat(amountSell, 10);
  const wantToBuy = amountBuyFloat && amountBuyFloat > 0;
  const wantToSell = amountSellFloat && amountSellFloat > 0;
  if (!isUpdate && !wantToBuy && !wantToSell) {
    errors.amountBuy = 'You need to fill in one of these!';
    errors.amountSell = 'You need to fill in one of these!';
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

export const addressValidation = (address = '') => {
  if (address.length < 3) {
    return 'Wrong address';
  }
  return null;
};
