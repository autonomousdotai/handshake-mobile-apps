import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { getEstimateGas } from '@/components/handshakes/betting/utils.js';
import {
  getMatchDetail,
  putMatchDetail,
  getMatchOdd,
  putMatchOdd,
  getGasPrice,
  putGasPrice,
  initHandShake
} from './action';

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

export function* handleGetMatchOdd({ outcomeId }) {
  try {
    const { data } = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.MATCH_ODD}`,
      type: 'GET_MATCH_ODD',
      data: {
        outcome_id: outcomeId
      }
    });
    if (data) yield put(putMatchOdd(data));
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

export function* handleInitHandShake({ payload }) {
  try {
    const data = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.INIT_HANDSHAKE}`,
      type: 'INIT_HANDSHAKE',
      data: payload
    });
    console.log('INITHANDSHAKE', data);
  } catch (e) {
    console.error(e);
  }
}

export default function* placeBetSaga() {
  yield takeLatest(getMatchDetail().type, handleGetMatchDetail);
  yield takeLatest(getGasPrice().type, handleGetGasPrice);
  yield takeLatest(getMatchOdd().type, handleGetMatchOdd);
  yield takeLatest(initHandShake().type, handleInitHandShake);
}
