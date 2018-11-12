import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { getEstimateGas } from '@/components/handshakes/betting/utils.js';
import { getMatchDetail, putMatchDetail, getGasPrice, putGasPrice } from './action';

export function* handleGetMatchDetail({ eventId }) {
  try {
    const data = yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${eventId}`,
      type: 'GET_MATCH_DETAIL',
      _path: 'guru',
      _key: 'matchDetail'
    });
    if (data) yield put(putMatchDetail(data));
  } catch (e) {
    console.error(e);
  }
}

export function* handleGetGasPrice() {
  try {
    const gasPrice = yield getEstimateGas();
    if (gasPrice) yield put(putGasPrice(gasPrice));
  } catch (e) {
    console.error(e);
  }
}

export default function* placeBetSaga() {
  yield takeLatest(getMatchDetail().type, handleGetMatchDetail);
  yield takeLatest(getGasPrice().type, handleGetGasPrice);
}
