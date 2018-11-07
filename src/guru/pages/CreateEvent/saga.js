import { takeLatest, call, put } from 'redux-saga/effects';
import { API_URL } from '@/constants';
import { apiGet, apiPost, apiPostForm } from '@/guru/stores/api';
import {
  loadReports,
  updateReports,
  createEvent,
  sendEmailCode,
  updateProfile,
  updateEmailProfile
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
    const { source } = values;
    const reportSource = source.id ? { source_id: source.id }
      : {
        source: {
          name: source.value,
          url: source.value
        }
      };
    const newEventData = {
      homeTeamName: values.homeTeamName || '',
      awayTeamName: values.awayTeamName || '',
      homeTeamCode: values.homeTeamCode || '',
      awayTeamCode: values.awayTeamCode || '',
      homeTeamFlag: values.homeTeamFlag || '',
      awayTeamFlag: values.awayTeamFlag || '',
      name: values.eventName.label,
      public: values.private ? 0 : 1,
      date: values.closingTime,
      reportTime: values.reportingTime,
      disputeTime: values.disputeTime,
      market_fee: values.creatorFee,
      outcomes: values.outcomes,
      category_id: 7, // values.category.id, hard-code for now
      ...reportSource,
    };
    console.log('newEventData', newEventData);
    // const { data } = yield call(handleCreateNewEventSaga, { newEventData });
    // if (data && data.length) {
    //   const eventData = data[0];
    //   const { contract } = eventData;
    //   console.log('Contract:', contract);
    //   const inputData = eventData.outcomes.map(o => {
    //     return {
    //       fee: eventData.market_fee,
    //       source: eventData.source_name,
    //       closingTime: eventData.date,
    //       reportTime: eventData.reportTime,
    //       disputeTime: eventData.disputeTime,
    //       offchain: o.id,
    //       contractAddress: contract.contract_address,
    //       contractName: contract.json_name,
    //     };
    //   });
    //   const matchId = eventData.id;
    //   const eventName = eventData.name;
    //   yield saveGenerateShareLinkToStore({ matchId, eventName });
    //   betHandshakeHandler.createNewEvent(inputData);
    // }
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

function* handleUpdateEmail({ payload }) {
  try {
    const userProfile = new FormData();
    userProfile.set('email', payload.email);
    const responded = yield call(apiPostForm, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'UPDATE_EMAIL_FETCH',
      data: userProfile,
    });
    if (responded.status) {
      yield put(updateProfile(responded));
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* createEventSaga() {
  yield takeLatest(loadReports().type, handleLoadReports);
  yield takeLatest(createEvent().type, handleCreateEven);
  yield takeLatest(sendEmailCode().type, handleSendEmailCode);
  yield takeLatest(updateEmailProfile().type, handleUpdateEmail);
}
