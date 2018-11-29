import { takeLatest, put } from 'redux-saga/effects';
import { apiSaga } from '@/guru/stores/api';
import {
  apiLoadReports,
  loadReports,
  updateReports,
} from './action';

function* handleLoadReports() {
  try {
    const { data } = yield apiSaga(apiLoadReports());
    yield put(updateReports({ data }));
  } catch (e) {
    console.error(e);
  }
}

export default function* createEventSaga() {
  yield takeLatest(loadReports().type, handleLoadReports);
}
