// import { Trans } from 'react-i18next'
import { minValue, required } from '@/components/core/form/validation';
import { CRYPTO_CURRENCY, MIN_AMOUNT } from '@/constants';

export const validate = (values, state, props) => {
  const {
    cc_number, cc_expired, cc_cvc, currency, amount,
  } = values;
  const errors = {};
  // const { userProfile } = props;
  // const { isNewCCOpen } = state;
  // const isCCExisting = userProfile && userProfile.creditCard.ccNumber.length > 0;

  // errors.amount = minValue(currency === CRYPTO_CURRENCY.BTC ? MIN_AMOUNT[CRYPTO_CURRENCY.BTC] : MIN_AMOUNT[CRYPTO_CURRENCY.ETH])(amount);

  // if (!isCCExisting || (isNewCCOpen && `${cc_number || ''}${cc_expired || ''}${cc_cvc || ''}`)
  //   errors.cc_number = required(cc_number);
  //   errors.cc_expired = required(cc_expired);
  //   errors.cc_cvc = required(cc_cvc);
  // }

  errors.cc_number = required(cc_number);
  errors.cc_expired = required(cc_expired);
  errors.cc_cvc = required(cc_cvc);

  return errors;
};

export const validateSpecificAmount = (values, state, props) => {
  const {
    amount,
  } = values;
  const { currency } = state;
  const errors = {};

  errors.amount = minValue(currency === CRYPTO_CURRENCY.BTC ? MIN_AMOUNT[CRYPTO_CURRENCY.BTC] : MIN_AMOUNT[CRYPTO_CURRENCY.ETH])(amount);

  return errors;
};
