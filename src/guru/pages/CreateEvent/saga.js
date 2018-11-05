import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import { API_URL } from '@/constants';
import { apiGet } from '@/guru/stores/api';
import { loadReports, updateReports } from './action';

function* handleLoadReports() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_REPORTS,
      type: 'API:LOAD_REPORTS'
    });
    if (response.status) {
      yield put(updateReports({ data: response.data }));
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* createEventSaga() {
  yield takeLatest(loadReports().type, handleLoadReports);
}
