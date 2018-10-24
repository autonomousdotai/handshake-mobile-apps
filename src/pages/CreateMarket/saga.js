import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/stores/api-saga';
import { API_URL, URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { handleLoadMatches, handleLoadMatchDetail } from '@/pages/Prediction/saga';
import { isBalanceInvalid } from '@/stores/common-saga';
import { getAddress } from '@/components/handshakes/betting/utils.js';
import { showAlert } from '@/stores/common-action';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { reportSelector } from './selector';
import {
  loadCreateEventData,
  createEvent,
  shareEvent,
  sendEmailCode,
  verifyEmail,
  updateEmailPut,
  verifyEmailCodePut,
  updateCreateEventLoading,
} from './action';

function* handleLoadReportsSaga({ cache = true }) {
  try {
    if (cache) {
      const events = yield select(reportSelector);
      if (events && events.length) {
        return events;
      }
    }
    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_REPORTS,
      type: 'LOAD_REPORTS',
      _path: 'reports',
      _key: 'list',
    });
  } catch (e) {
    return console.error('handleLoadReportsSaga', e);
  }
}

function* handleLoadCategories() {
  try {
    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_CATEGORIES,
      type: 'LOAD_CATEGORIES',
      _path: 'categories',
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

function* handleLoadCreateEventData({ eventId }) {
  try {
    yield put(updateCreateEventLoading(true));
    yield all([
      call(handleLoadReportsSaga, {}),
      eventId && call(handleLoadMatchDetail, { eventId }),
      call(handleLoadMatches, {}),
      // call(handleLoadCategories, {}),
      call(isBalanceInvalid, {}),
    ]);
    yield put(updateCreateEventLoading(false));
  } catch (e) {
    console.error(e);
  }
}

function* handleAddOutcomesSaga({ eventId, newOutcomeList, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_OUTCOME}\\${eventId}`,
      type: 'ADD_OUTCOMES_API', // @TODO: review name
      data: newOutcomeList,
      ...payload,
    });
  } catch (e) {
    console.error('handleAddOutcomesSaga', e);
    return null;
  }
}

function* handleCreateNewEventSaga({ newEventData }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_MATCH}`,
      type: 'ADD_EVENT_API',
      data: [newEventData],
    });
  } catch (e) {
    return console.error(e);
  }
}

function* handleGenerateShareLinkSaga({ matchId, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.GENERATE_LINK}`,
      type: 'GENERATE_SHARE_LINK',
      data: {
        match_id: matchId,
      },
      ...payload,
    });
  } catch (e) {
    return console.error('handleGenerateShareLinkSaga', e);
  }
}

function* saveGenerateShareLinkToStore({ matchId, eventName }) {
  const generateLink = yield call(handleGenerateShareLinkSaga, { matchId });
  return yield put(shareEvent({
    url: `${window.location.origin}${URL.HANDSHAKE_PREDICTION}${generateLink.data.slug}`,
    name: eventName,
  }));
}

function* handleCreateEventSaga({ values, isNew, selectedSource, grantPermission }) {
  try {
    yield put(updateCreateEventLoading(true));

    if (!isNew) {
      // Add new outcomes
      const newOutcomeList = values.outcomes.filter(o => !o.id).map(i => Object.assign({}, i, { public: 1 }));
      const { eventId } = values;
      const addOutcomeResult = yield call(handleAddOutcomesSaga, {
        eventId,
        newOutcomeList,
      });
      if (!addOutcomeResult.error) {
        const outcomeId = addOutcomeResult.data[0].id;
        const eventName = addOutcomeResult.data[0].name;
        yield saveGenerateShareLinkToStore({ outcomeId, eventName });
      }
    } else {
      // Create new event
      const { name, url, id } = values.reports;

      const reportSource = {
        source_id: id,
        source: selectedSource ? undefined : {
          name,
          url,
        },
      };

      Object.keys(reportSource).forEach((k) => !reportSource[k] && delete reportSource[k]);
      const newEventData = {
        homeTeamName: values.homeTeamName || '',
        awayTeamName: values.awayTeamName || '',
        homeTeamCode: values.homeTeamCode || '',
        awayTeamCode: values.awayTeamCode || '',
        homeTeamFlag: values.homeTeamFlag || '',
        awayTeamFlag: values.awayTeamFlag || '',
        name: values.eventName.value,
        public: 1,
        date: values.closingTime,
        reportTime: values.reportingTime,
        disputeTime: values.disputeTime,
        market_fee: values.creatorFee,
        outcomes: values.outcomes,
        grant_permission: grantPermission,
        creator_wallet_address: getAddress(),
        category_id: 7, // values.category.id, hard-code for now
        ...reportSource,
      };
      const { data } = yield call(handleCreateNewEventSaga, { newEventData });
      if (data && data.length) {
        const eventData = data[0];

        const outcomeId = eventData.outcomes[0].id;
        const eventName = eventData.name;
        yield saveGenerateShareLinkToStore({ outcomeId, eventName });
      }
    }
  } catch (e) {
    console.error('handleCreateNewEventSaga', e);
  } finally {
    yield put(updateCreateEventLoading(false));
  }
}

function* handleUpdateEmail({ email }) {
  try {
    const userProfile = new FormData();
    userProfile.set('email', email);
    const responded = yield call(apiPost, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'UPDATE_EMAIL_FETCH',
      data: userProfile,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return yield put(updateEmailPut(responded.data.email));
  } catch (e) {
    console.error('handleUpdateEmail', e);
    return null;
  }
}

function* handleSendEmailCode({ email }) {
  try {
    const sendCode = yield call(apiPost, {
      PATH_URL: `user/verification/email/start?email=${email}`,
      type: 'SEND_EMAIL_CODE',
    });
    if (sendCode.error) {
      console.error('Failed to submit email: ', sendCode.error);
    }
  } catch (e) {
    console.error('handleSendEmailCode', e);
  }
}

function* handleVerifyEmail({ email, code }) {
  try {
    const verify = yield call(apiPost, {
      PATH_URL: `user/verification/email/check?email=${email}&code=${code}`,
      type: 'VERIFY_EMAIL',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!verify.status) {
      return yield put(verifyEmailCodePut(false));
    }
    yield put(verifyEmailCodePut(true));
    return yield handleUpdateEmail({ email });
  } catch (e) {
    console.error('handleVerifyEmail', e);
    return null;
  }
}

export default function* createMarketSaga() {
  yield takeLatest(loadCreateEventData().type, handleLoadCreateEventData);
  yield takeLatest(createEvent().type, handleCreateEventSaga);
  yield takeLatest(sendEmailCode().type, handleSendEmailCode);
  yield takeLatest(verifyEmail().type, handleVerifyEmail);
}
