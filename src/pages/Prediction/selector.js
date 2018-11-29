import qs from 'querystring';
import { isEmpty } from '@/utils/is';

export const queryStringSelector = (state) => {
  return state.router.location.search;
};

export const urlParamsSelector = (state) => {
  const queryString = queryStringSelector(state);
  return qs.parse(queryString.slice(1));
};

export const matchParamSelector = (state) => (urlParamsSelector(state).match);

export const referParamSelector = (state) => (urlParamsSelector(state).refer);

export const eventSelector = (state) => {
  const { match, refer } = urlParamsSelector(state);
  const { events } = state.prediction;
  if (!events || !events.length) return [];
  if (isEmpty(urlParamsSelector(state)) || isEmpty(events) || refer) {
    return state.prediction.events;
  }
  return events.filter(event => (event.id === parseInt(match, 10)));
};

export const relevantEventSelector = (state) => {
  return state.prediction.relevantEvents;
};

export const countReportSelector = (state) => {
  const { countReport } = state.ui;
  return countReport || 0;
};
export const checkRedeemCodeSelector = (state) => {
  const { isRedeemAvailable = 0 } = state.ui;
  return isRedeemAvailable;
};

export const isSharePage = (state) => {
  const queryString = queryStringSelector(state);
  const urlParams = qs.parse(queryString.slice(1));
  return urlParams.match || false;
};

export const isLoading = (state) => {
  if (!state.prediction._meta) return false;
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
  return isExistEmail;
};

export const totalBetsSelector = (state) => {
  return (1000 - state.ui.totalBets || 0);
};
