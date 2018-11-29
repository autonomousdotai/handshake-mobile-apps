export const referralCheck = (payload = {}) => {
  return {
    type: 'ME:REFERRAL_CHECK',
    ...payload
  };
};

export const putReferralCheck = (payload) => {
  return {
    type: 'ME:PUT_REFERRAL_CHECK',
    payload
  };
};

export const referralJoin = (payload = {}) => {
  return {
    type: 'ME:REFERRAL_JOIN',
    ...payload
  };
};
