import { takeLatest, call, put } from 'redux-saga/effects';
import { apiPost } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { predictionStatistics, predictionStatisticsPut } from './action';

function* handlePredictionStatistics({ outcomeId, ...payload }) {
  try {
    const statistics = yield call(apiPost, {
      PATH_URL: API_URL.CRYPTOSIGN.PREDICTION_STATISTICS,
      type: 'PREDICTION_STATISTICS',
      data: outcomeId,
      ...payload,
    });
    yield put(predictionStatisticsPut(statistics.data));
  } catch (e) {
    console.error('handlePredictionStatistics', e);
  }
}

export default function* orderPlaceSaga() {
  yield takeLatest(predictionStatistics().type, handlePredictionStatistics);
}
