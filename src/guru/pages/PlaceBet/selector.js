import qs from 'querystring';
import { isEmpty } from '@/utils/is';

export const queryStringSelector = (state) => (state.router.location.search);

export const eventSelector = (state) => {
  const queryString = queryStringSelector(state);
  const urlParams = qs.parse(queryString.slice(1));
  const { match } = urlParams;
  const { events } = state.prediction;
  if (!events || !events.length) return [];
  if (isEmpty(urlParams) || isEmpty(events)) {
    return state.prediction.events;
  }
  return events.filter(event => (event.id === parseInt(match, 10)));
};

export const matchDetailSelector = (state) => (state.guru.matchDetail);

export const gasPriceSelector = (state) => (parseFloat(state.guru.gasPrice));

export const matchOddsSelector = (state) => (state.guru.matchDetail.odds);

export const handShakesSelector = (state) => (state.guru.handShakes);

