import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { getMatchDetail, putMatchDetail } from './action';

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

export default function* placeBetSaga() {
  yield takeLatest(getMatchDetail().type, handleGetMatchDetail);
}
