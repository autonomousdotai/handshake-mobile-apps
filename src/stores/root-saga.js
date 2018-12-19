import { spawn } from 'redux-saga/effects';
import predictionSaga from '@/pages/Prediction/saga';
import PexExtensionSaga from '@/pages/PexExtension/saga';
import guruSaga from '@/guru/stores/saga';

export default function* rootSaga() {
  yield spawn(predictionSaga);
  yield spawn(PexExtensionSaga);
  yield spawn(guruSaga);
}
