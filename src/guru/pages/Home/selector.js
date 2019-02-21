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
  const { events } = state.guru;
  if (!events || !events.length) return [];
  if (isEmpty(urlParamsSelector(state)) || isEmpty(events) || refer) {
    return state.guru.events;
  }
  return events.filter(event => (event.id === parseInt(match, 10)));
};

export const relatedMatchesSelector = (state) => (state.guru.relatedMatches);

export const statusSubscribeSelector = (state) => {
  return (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.status);
};

export const isRedeemSelector = (state) => {
  return (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.redeem);
};

export const isSubscribeSelector = (state) => {
  return (state.guru.ui.userSubscribe && state.guru.ui.userSubscribe.is_subscribe);
};

export const countReportSelector = (state) => {
  return state.guru.ui.countReport || 0;
};

// Move to Reputation
export const userEventsSelector = (state) => {
  return state.guru.userEvents;
};
export const userReputationSelector = (state) => {
  return state.guru.reputation;
};

export const authCoinbaseSelector = (state) => {
  return state.guru.authCoinBase;
};
export const isLoading = (state) => {
  if (!state.guru) return false;
  return state.guru.isFetching;
};

export const isPermissionConstSelector = (state) => {
  return (state.guru.ui.permissionConst);
};
