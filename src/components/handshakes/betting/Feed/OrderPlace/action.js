import { SET_DATA } from '@/stores/data-action';

export const updateSide = (val) => {
  return SET_DATA({
    type: 'PREDICTION:UPDATE_SIDE',
    _path: 'ui.side',
    _value: val,
  });
};

export const predictionStatistics = (payload = {}) => {
  return {
    type: 'ORDER_PLACE:PREDICTION_STATISTICS',
    ...payload,
  };
};

export const predictionStatisticsPut = (value) => {
  return SET_DATA({
    type: 'ORDER_PLACE:PREDICTION_STATISTICS_PUT',
    _path: 'orderPlace.statistics',
    _value: value,
  });
};
