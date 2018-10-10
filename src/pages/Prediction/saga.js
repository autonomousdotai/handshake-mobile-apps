import { takeLatest, call, select, put } from 'redux-saga/effects';
import { apiGet } from '@/stores/api-saga';
import { REMOVE_DATA } from '@/stores/data-action';
import { API_URL } from '@/constants';
import {
  loadMatches, getReportCount, removeExpiredEvent,
  checkFreeBet, updateFreeBet, checkExistSubcribeEmail,
  updateCountReport, updateExistEmail,
  loadRelevantEvents, updateRelevantEvents, updateEvents,
} from './action';
import { eventSelector, relevantEventSelector } from './selector';

export function* handleLoadMatchDetail({ eventId }) {
  try {
    yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${eventId}`,
      type: 'LOAD_MATCH_DETAIL',
      _key: eventId,
      _path: 'predictionDetail',
    });
  } catch (e) {
    console.error(e);
  }
}

export function* handleLoadMatches({ isDetail, source }) {
  try {
    if (isDetail) {
      const { data } = yield call(apiGet, {
        PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${isDetail}`,
        type: 'LOAD_MATCH_DETAIL_SHARE',
        // _key: 'events',
        _path: 'prediction',
      });
      if (data) {
        yield put(updateEvents([data]));
      }
    } else {
      const PATH_URL = source ? `${API_URL.CRYPTOSIGN.LOAD_MATCHES}?source=${source}` : API_URL.CRYPTOSIGN.LOAD_MATCHES;
      yield call(apiGet, {
        PATH_URL,
        type: 'LOAD_MATCHES',
        _key: 'events',
        _path: 'prediction',
      });
    }
  } catch (e) {
    console.error('handleLoadMachesSaga', e);
  }
}

export function* handleLoadRelevantEvents({ cache = true, eventId }) {
  try {
    if (cache) {
      const events = yield select(relevantEventSelector);
      if (events && events.length) {
        return events;
      }
    }
    const PATH_URL = `${API_URL.CRYPTOSIGN.RELEVANT_EVENTS}?match=${eventId}`;
    const response = yield call(apiGet, {
      PATH_URL,
      type: 'LOAD_RELEVANT_EVENTS',
    });
    yield put(updateRelevantEvents(response.data));
  } catch (e) {
    console.error('handleLoadRelevantMachesSaga', e);
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
    yield put(updateCountReport(response.data.length));
  } catch (e) {
    console.error(e);
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
  yield takeLatest(loadRelevantEvents().type, handleLoadRelevantEvents);
  yield takeLatest(getReportCount().type, handleCountReport);
  yield takeLatest(removeExpiredEvent().type, handleRemoveEvent);
  yield takeLatest(checkFreeBet().type, handleFreeBet);
  yield takeLatest(checkExistSubcribeEmail().type, handleCheckExistEmail);
}
