import { takeLatest, call, put } from 'redux-saga/effects';
import { API_URL } from '@/constants';
import { apiGet, apiPost, apiPostForm } from '@/guru/stores/api';
import { getAddress } from '@/components/handshakes/betting/utils';
import {
  loadReports,
  updateReports,
  createEvent,
  sendEmailCode,
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
    const res = yield call(apiPostForm, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_MATCH}`,
      type: 'ADD_EVENT_API',
      data: eventFormData
    });
    console.log('res', res);
  } catch (e) {
    console.error(e);
  }
}

function* handleSendEmailCode({ payload }) {
  try {
    const res = yield call(apiPost, {
      PATH_URL: `user/verification/email/start?email=${payload.email}`,
      type: 'API:SEND_EMAIL_CODE'
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
