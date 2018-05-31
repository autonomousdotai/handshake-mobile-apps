// import { Trans } from 'react-i18next'
import { required } from '@/components/core/form/validation';

export const validate = (values, state, props) => {
  // console.log('values111', values, state, props)
  const { cc_number, cc_expired, cc_cvc } = values;
  const errors = {};
  const { userProfile } = props;
  const { isNewCCOpen } = state;
  const isCCExisting = userProfile && userProfile.credit_card.cc_number.trim().length > 0;

  if (!isCCExisting
    || (isNewCCOpen && `${cc_number || ''}${cc_expired || ''}${cc_cvc || ''}`)
  ) {
    errors.cc_number = required(cc_number);
    errors.cc_expired = required(cc_expired);
    errors.cc_cvc = required(cc_cvc);
  }

  return errors;
};
