import { takeLatest, call, put } from 'redux-saga/effects';
import { API_URL, URL } from '@/constants';
import { apiGet, apiPost, apiPostForm } from '@/guru/stores/api';
import { getAddress } from '@/components/handshakes/betting/utils';
import {
  loadReports,
  updateReports,
  createEvent,
  sendEmailCode,
  shareEvent
} from './action';

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

function* handleGenerateShareLink({ matchId, eventName }) {
  try {
    const link = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.GENERATE_LINK}`,
      type: 'GENERATE_SHARE_LINK',
      data: {
        match_id: matchId
      }
    });
    yield put(shareEvent({
      url: `${window.location.origin}${URL.HANDSHAKE_PREDICTION}${link.data.slug}`,
      name: eventName,
    }));
  } catch (e) {
    console.error(e);
  }
}

function* handleCreateEven({ values }) {
  try {
    const creator_wallet_address = getAddress();
    const { id, value } = values.source;
    const reportSource = id ? { source_id: id } : {
      source: { name: value, url: value }
    };
    const newEventData = {
      outcome_name: values.outcomeName,
      event_name: values.eventName,
      name: `Will ${values.outcomeName} in ${values.eventName}`,
      public: values.public,
      date: values.closingTime,
      reportTime: values.closingTime + 86400, // (24 * 60 * 60) - 24h
      disputeTime: values.closingTime + 90000, // (24 * 60 * 60) + (60 * 60) - 25h
      market_fee: values.marketFee,
      grant_permission: true,
      category_id: 7, // values.category.id, hard-code for now
      creator_wallet_address,
      ...reportSource
    };
    console.log('newEventData', newEventData);
    const eventFormData = new FormData();
    eventFormData.set('data', JSON.stringify(newEventData));
    eventFormData.set('image', values.image);
    const { data, status, code, message } = yield call(apiPostForm, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_MATCH}`,
      type: 'ADD_EVENT_API',
      data: eventFormData
    });
    console.log('create result', data);
    if (status) {
      const eventData = (data[0] || {});
      yield handleGenerateShareLink({
        matchId: eventData.id,
        eventName: eventData.name
      });
    } else {
      console.error('Failed to create event', code, message);
    }
  } catch (e) {
    console.error(e);
  }
}

function* handleSendEmailCode({ payload }) {
  try {
    const res = yield call(apiPost, {
      PATH_URL: API_URL.CRYPTOSIGN.SUBSCRIBE_NOTIFICATION,
      type: 'API:SEND_EMAIL_CODE',
      data: {
        email: payload.email
      }
    });
    if (res.error) {
      console.error('Failed to submit email: ', res.error);
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* createEventSaga() {
  yield takeLatest(loadReports().type, handleLoadReports);
  yield takeLatest(createEvent().type, handleCreateEven);
  yield takeLatest(sendEmailCode().type, handleSendEmailCode);
}
