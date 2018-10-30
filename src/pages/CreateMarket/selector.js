import { isEmpty } from '@/utils/is';

export const hasEmail = (state) => {
  if (isEmpty(state.auth.profile)) return null;
  return state.auth.profile.email;
};

export const uId = (state) => {
  if (isEmpty(state.auth.profile)) return null;
  return state.auth.profile.id;
};

export const isEmailVerified = (state) => {
  if (isEmpty(state.auth.profile)) return null;
  return state.auth.profile.verified;
}

export const eventDetailSelector = (state, props) => {
  const { eventId } = props.match.params;
  return state.predictionDetail[eventId] || {};
};

export const reportSelector = (state) => {
  return (state.reports.list || []).map(r => {
    return Object.assign({}, r, {
      value: r.id.toString(),
      label: r.url,
    });
  });
};
export const categorySelector = (state) => {
  return (state.categories.list || []).map(c => Object.assign({}, c, {
    value: c.id,
    label: c.name,
  }));
};

export const insufficientGas = (state) => state.blockChain.insufficientGas;

export const shareEventSelector = (state) => state.ui.shareEvent;

export const isLoading = (state) => state.ui.isCreateEventLoading;

export const isValidEmailCode = (state) => state.ui.isValidEmailCode;
