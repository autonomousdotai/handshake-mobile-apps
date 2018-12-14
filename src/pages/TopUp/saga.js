import { takeLatest, put } from 'redux-saga/effects';
import { putMetaMaskInfo } from './action';

export function* handleMetaMaskInfo({ payload }) {
  try {
    yield put(putMetaMaskInfo(payload));
  } catch (e) {
    console.error(e);
  }
}

export default function* topUpSaga() {
  yield takeLatest(putMetaMaskInfo().type, handleMetaMaskInfo);
}
