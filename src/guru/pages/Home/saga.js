import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { loadMatches, updateEvents, updateUserEvents, loadUserReputation, updateUserReputation } from './action';

export function* handleLoadMatches({ isDetail, source }) {
  try {
    if (isDetail) {
      const { data } = yield call(apiGet, {
        PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${isDetail}`,
        type: 'LOAD_MATCH_DETAIL_SHARE',
        // _key: 'events',
        _path: 'guru',
      });
      if (data) {
        //yield put(updateEvents([data]));
      }
    } else {
      const PATH_URL = source ? `${API_URL.CRYPTOSIGN.LOAD_MATCHES}?source=${source}` : API_URL.CRYPTOSIGN.LOAD_MATCHES;
      const { data } = yield call(apiGet, {
        PATH_URL,
        type: 'LOAD_MATCHES',
        // _key: 'events',
        // _path: 'guru',
      });
      if (data) {
        yield put(updateEvents(data));
      }
    }
  } catch (e) {
    console.error('handleLoadMachesSaga', e);
  }
}

export function* handleLoadReputation({ userId }) {
  try {
    const PATH_URL = `${API_URL.CRYPTOSIGN.GET_REPUTATION_USER}/${userId}`;
    const { data } = yield call(apiGet, {
      PATH_URL,
      type: 'LOAD_USER_REPUTATION',
    });

    if (data) {
      const { matches } = data;
      yield put(updateUserEvents(matches));
      yield put(updateUserReputation(data));
    }
  } catch (e) {
    console.error('handleLoadReputation', e);
  }
}

export default function* homeSaga() {
  yield takeLatest(loadMatches().type, handleLoadMatches);
  yield takeLatest(loadUserReputation().type, handleLoadReputation);
}
