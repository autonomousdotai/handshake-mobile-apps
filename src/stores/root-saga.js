import { spawn } from 'redux-saga/effects';
import predictionSaga from '@/pages/Prediction/saga';
import createMarketSaga from '@/pages/CreateMarket/saga';

export default function* rootSaga() {
  yield spawn(predictionSaga);
  yield spawn(createMarketSaga);
}
