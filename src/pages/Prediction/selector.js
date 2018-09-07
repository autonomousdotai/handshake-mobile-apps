// import { createSelector } from 'reselect';
import qs from 'querystring';
import _ from 'lodash';

export const queryStringSelector = (state) => {
  return state.router.location.search;
};

export const eventSelector = (state) => {
  const queryString = queryStringSelector(state);
  const urlParams = qs.parse(queryString.slice(1));
  const { match } = urlParams;
  const { events } = state.prediction;
  if (_.isEmpty(urlParams) || _.isEmpty(events)) {
    return state.prediction.events;
  }
  return events.filter(event => (event.id === _.toInteger(match)));
};

export const countReportSelector = (state) => {
  const { countReport } = state.ui;
  return countReport || 0;
};
export const checkFreeBetSelector = (state) => {

  const { freeBet = {} } = state.ui;
  return freeBet;
};

export const isSharePage = (state) => {
  const queryString = queryStringSelector(state);
  const urlParams = qs.parse(queryString.slice(1));
  return !!urlParams.match;
};

export const isLoading = (state) => {
  if (!state.prediction._meta) return true;
  return state.prediction._meta.isFetching;
};

export const showedLuckyPoolSelector = (state) => {
  return state.ui.showedLuckyPool;
};

export const checkExistSubcribeEmailSelector = (state) => {
  /*
  const { matches = [] } = state.ui;
  return matches.length || 0;
  */
  const { isExistEmail = false } = state.ui;
  console.log('isExistEmail');
  return isExistEmail;
};

