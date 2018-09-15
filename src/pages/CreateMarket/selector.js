import _ from 'lodash';

export const hasEmail = (state) => {
  if (_.isEmpty(state.auth.profile)) return null;
  return state.auth.profile.email;
};

export const eventSelector = (state) => state.prediction.events;

export const reportSelector = (state) => {
  return (state.reports.list || []).map(r => {
    return Object.assign({}, r, {
      value: r.id,
      label: `${r.name} - ${r.url}`,
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
