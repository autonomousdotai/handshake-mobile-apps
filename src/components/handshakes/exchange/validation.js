// import { Trans } from 'react-i18next'
import { required, minValue } from '@/components/core/form/validation';

export const validate = (values, state, props) => {
  const { cc_number, cc_expired, cc_cvc, currency, amount } = values;
  const errors = {};
  const { userProfile } = props;
  const { isNewCCOpen } = state;
  const isCCExisting = userProfile && userProfile.creditCard.ccNumber.length > 0;

  errors.amount = minValue(currency === 'BTC' ? 0.01 : 0.1)(amount);

  if (!isCCExisting
    || (isNewCCOpen && `${cc_number || ''}${cc_expired || ''}${cc_cvc || ''}`)
  ) {
    errors.cc_number = required(cc_number);
    errors.cc_expired = required(cc_expired);
    errors.cc_cvc = required(cc_cvc);
  }

  return errors;
};
