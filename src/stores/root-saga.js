import { spawn } from 'redux-saga/effects';
import predictionSaga from '@/pages/Prediction/saga';
import createMarketSaga from '@/pages/CreateMarket/saga';
import PexExtensionSaga from '@/pages/PexExtension/saga';
import orderPlaceSaga from '@/components/handshakes/betting/Feed/OrderPlace/saga';

export default function* rootSaga() {
  yield spawn(predictionSaga);
  yield spawn(createMarketSaga);
  yield spawn(PexExtensionSaga);
  yield spawn(orderPlaceSaga);
}
