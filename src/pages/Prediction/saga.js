import { takeLatest, call, select, put } from 'redux-saga/effects';
import { apiGet } from '@/stores/api-saga';
import { REMOVE_DATA, SET_DATA } from '@/stores/data-action';
import { API_URL } from '@/constants';
import { loadMatches, getReportCount, removeExpiredEvent, checkFreeBet, updateFreeBet, checkExistSubcribeEmail, updateCountReport, updateExistEmail } from './action';
import { eventSelector } from './selector';

export function* handleLoadMatches({ cache = true }) {
  try {
    if (cache) {
      const events = yield select(eventSelector);
      if (events && events.length) {
        return events;
      }
    }

    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
      type: 'LOAD_MATCHES',
      _key: 'events',
      _path: 'prediction',
    });
  } catch (e) {
    return console.error('handleLoadMachesSaga', e);
  }
}

export function* handleRemoveEvent({ eventId }) {
  try {
    const events = yield select(eventSelector);
    if (events && events.length) {
      const index = events.findIndex((item) => item.id === eventId);
      if (index >= 0) {
        yield put(REMOVE_DATA({
          _path: 'prediction.events',
          _value: [index],
        }));
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export function* handleCountReport() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.COUNT_REPORT,
      type: 'COUNT_REPORT',
    });
    //console.log('handleCountReport', response.data);
    yield put(updateCountReport(response.data.length));
  } catch (e) {
    console.log(e);
    //return console.error('handleCountReport', e);
  }
}

export function* handleFreeBet() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_FREE_AVAILABLE,
      type: 'CHECK_FREE_AVAILABLE',
    });
    yield put(updateFreeBet(response.data));
  } catch (e) {
    console.error('handleFreeBet', e);
  }
}

export function* handleCheckExistEmail() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: API_URL.USER.CHECK_EXIST_EMAIL,
      type: 'CHECK_EXIST_EMAIL',
    });
    console.log('Response Data:', response.data);
    if (response.data) {
      const { email_existed: emailExist } = response.data;

      yield put(updateExistEmail(emailExist));
    }


  } catch (e) {
    console.error('handleFreeBet', e);
  }
}


export default function* predictionSaga() {
  yield takeLatest(loadMatches().type, handleLoadMatches);
  yield takeLatest(getReportCount().type, handleCountReport);
  yield takeLatest(removeExpiredEvent().type, handleRemoveEvent);
  yield takeLatest(removeExpiredEvent().type, handleRemoveEvent);
  yield takeLatest(checkFreeBet().type, handleFreeBet);
  yield takeLatest(checkExistSubcribeEmail().type, handleCheckExistEmail);

}
