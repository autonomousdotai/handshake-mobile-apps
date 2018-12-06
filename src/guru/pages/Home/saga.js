import { takeLatest, call, select, put } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { updateLoading } from '@/guru/stores/action';
import {
  loadMatches,
  updateEvents,
  getReportCount,
  removeExpiredEvent,
  updateCountReport,
  checkRedeemCode,
  emailSubscriber,
  putUserSubscribe,
  putStatusEmailSubscribe,
  updateUserEvents,
  updateNewUserEvents,
  loadUserReputation,
  updateUserReputation,
  loginCoinbase,
  updateAuthCoinbase,
  loginMetaMask,
  updateAuthMetaMask
} from './action';
import { eventSelector } from './selector';

export function* handleLoadMatches({ isDetail, source }) {
  try {
    if (isDetail) {
      const { data } = yield call(apiGet, {
        PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${isDetail}`,
        type: 'LOAD_MATCH_DETAIL_SHARE'
      });
      if (data) {
        yield put(updateEvents([data]));
        yield put(updateLoading(false));
      }
    } else {
      const PATH_URL = source ? `${API_URL.CRYPTOSIGN.LOAD_MATCHES}?source=${source}` : API_URL.CRYPTOSIGN.LOAD_MATCHES;
      const { data } = yield call(apiGet, {
        PATH_URL,
        type: 'LOAD_MATCHES'
      });
      if (data) {
        yield put(updateEvents(data));
        yield put(updateLoading(false));
      }
    }
  } catch (e) {
    console.error('handleLoadMachesSaga', e);
  }
}

export function* handleRemoveEvent({ eventId }) {
  try {
    const events = yield select(eventSelector);
    if (events && events.length) {
      const data = events.filter((item) => item.id !== eventId);
      if (data) {
        yield put(updateEvents(data));
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
      type: 'COUNT_REPORT'
    });
    yield put(updateCountReport(response.data.length));
  } catch (e) {
    console.error(e);
  }
}

export function* handleCheckRedeem() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.CHECK_REDEEM_CODE,
      type: 'CHECK_REDEEM_CODE'
    });
    yield put(putUserSubscribe(response.data));
  } catch (e) {
    console.error('handleCheckRedeem', e);
  }
}

export function* handleEmailSubscriber(values) {
  try {
    const { status } = yield call(apiPost, {
      PATH_URL: API_URL.CRYPTOSIGN.SUBCRIBE_EMAIL_PREDICTION,
      type: 'SUBCRIBE_EMAIL_PREDICTION',
      data: values
    });
    yield put(putStatusEmailSubscribe(status));
    yield put(updateLoading(false));
  } catch (e) {
    console.error('handleEmailSubscriber', e);
  }
}

// Moving to Reputation
export function* handleLoadReputation({ userId, page }) {
  try {
    yield put(updateLoading(true));

    const PATH_URL = `${API_URL.CRYPTOSIGN.GET_REPUTATION_USER}/${userId}/${page}`;
    const { data } = yield call(apiGet, {
      PATH_URL,
      type: 'LOAD_USER_REPUTATION',
    });

    if (data) {
      const { matches } = data;
      const loadMore = matches.length < 10 ? false : true;
      const newPage = loadMore ? page + 1 : 0;
      if (page === 0) {
        yield put(updateNewUserEvents(matches, loadMore, newPage));
      } else {
        yield put(updateUserEvents(matches, loadMore, newPage));
      }
      yield put(updateUserReputation(data));
    }
    yield put(updateLoading(false));
  } catch (e) {
    console.error('handleLoadReputation', e);
  }
}
export function* handleAuthorizeCoinbase({ code }) {
  try {
    const clientId = 'e087d6e310d0fcac821dbbe0ed890e26ea492f380baf276d0f9fdf8150114c8e';
    const clientSecret = '5818a0e5f9b1bc117909ef0b0c56f20856f4fa26bf6718b20af735bbc6036205';
    const grantType = 'authorization_code';
    const redirectUrl = 'http://localhost:8080/auth/callback';
    const BASE_URL = 'https://api.coinbase.com';
    const PATH_URL = 'oauth/token';
    const response = yield call(apiPost, {
      BASE_URL,
      PATH_URL,
      data: {
        grant_type: grantType,
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl
      },
      type: 'LOGIN_COIN_BASE'
    });
    console.log('Response Authorize Coinbase:', response);
    yield put(updateAuthCoinbase(response));

  } catch (e) {
    console.error('handleAuthorizeCoinbase', e);
  }
}

export function* handleAuthorizeMetaMask({ web3Provider }) {

  try {
    const accounts = yield web3Provider.eth.getAccounts();
    yield put(updateAuthMetaMask(accounts));
    console.log('Account:', accounts);
  } catch (e) {
    console.error('handleAuthorizeMetaMask', e);
  }
}


export default function* homeSaga() {
  yield takeLatest(loadMatches().type, handleLoadMatches);
  yield takeLatest(getReportCount().type, handleCountReport);
  yield takeLatest(removeExpiredEvent().type, handleRemoveEvent);
  yield takeLatest(checkRedeemCode().type, handleCheckRedeem);
  yield takeLatest(emailSubscriber().type, handleEmailSubscriber);
  yield takeLatest(loadUserReputation().type, handleLoadReputation);
  yield takeLatest(loginCoinbase().type, handleAuthorizeCoinbase);
  yield takeLatest(loginMetaMask().type, handleAuthorizeMetaMask);
}
