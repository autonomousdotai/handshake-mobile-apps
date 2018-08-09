import _ from 'lodash';

export const hasEmail = (state) => {
  if (_.isEmpty(state.auth.profile)) return null;
  return !!state.auth.profile.email;
};

export const eventSelector = (state) => state.prediction.events;

export const reportSelector = (state) => state.reports.list || [];

export const shareEventSelector = (state) => state.ui.shareEvent;

export const isLoading = (state) => state.ui.isCreateEventLoading;
