import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/guru/stores/api';
import { API_URL } from '@/constants';
import { updateLoading } from '@/guru/stores/action';
import { loadMatches, updateEvents, updateUserEvents, loadUserReputation, updateUserReputation, loginCoinbase, updateAuthCoinbase, loginMetaMask, updateAuthMetaMask } from './action';


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
    yield put(updateLoading(true));

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
  yield takeLatest(loadUserReputation().type, handleLoadReputation);
  yield takeLatest(loginCoinbase().type, handleAuthorizeCoinbase);
  yield takeLatest(loginMetaMask().type, handleAuthorizeMetaMask);
}
