import { takeLatest, call, put } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/guru/stores/api';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { API_URL } from '@/constants';
import { getEstimateGas } from '@/components/handshakes/betting/utils.js';
import { updateLoading } from '@/guru/stores/action';
import {
  getMatchDetail,
  putMatchDetail,
  getMatchOdd,
  putMatchOdd,
  getGasPrice,
  putGasPrice,
  initHandShake,
  initHandShakeFree,
  putHandShake,
  checkCompareRedeemCode,
  putRedeemCode
} from './action';

export function* handleGetMatchDetail({ eventId }) {
  try {
    const data = yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.LOAD_MATCHES_DETAIL}/${eventId}`,
      type: 'GET_MATCH_DETAIL',
      _path: 'guru',
      _key: 'matchDetail'
    });
    if (data) yield put(putMatchDetail(data));
  } catch (e) {
    console.error(e);
  }
}

export function* handleGetMatchOdd({ outcomeId }) {
  try {
    const { data } = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.MATCH_ODD}`,
      type: 'GET_MATCH_ODD',
      data: {
        outcome_id: outcomeId
      }
    });
    if (data) yield put(putMatchOdd(data));
  } catch (e) {
    console.error(e);
  }
}

export function* handleGetGasPrice() {
  try {
    const gasPrice = yield getEstimateGas();
    if (gasPrice) yield put(putGasPrice(gasPrice));
  } catch (e) {
    console.error(e);
  }
}

export function* handleInitHandShake({ payload }) {
  try {
    const wallet = MasterWallet.getWalletDefault('');
    let pathUrl = '';
    switch (wallet.classname) {
      case MasterWallet.ListDefaultCoin.Constant:
        pathUrl = API_URL.CRYPTOSIGN.INIT_HANDSHAKE_CONST;
        break;
      default: // Etherum, Bitcoin, BitcoinTestnet
        pathUrl = API_URL.CRYPTOSIGN.INIT_HANDSHAKE; 
        break;
    }
    const response = yield call(apiPost, {
      PATH_URL: pathUrl,
      type: 'INIT_HANDSHAKE',
      data: payload
    });
    if (response) {
      const { data, status } = response;
      yield put(putHandShake({ ...data, status }));
      yield put(updateLoading(false));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* handleInitHandShakeFree({ payload }) {
  try {
    const wallet = MasterWallet.getWalletDefault('');
    let pathUrl = '';
    switch (wallet.classname) {
      case MasterWallet.ListDefaultCoin.Constant:
        pathUrl = API_URL.CRYPTOSIGN.INIT_HANDSHAKE_FREE_CONST;
        break;
      default: // Etherum, Bitcoin, BitcoinTestnet
        pathUrl = API_URL.CRYPTOSIGN.INIT_HANDSHAKE_FREE; 
        break;
    }
    const response = yield call(apiPost, {
      PATH_URL: pathUrl,
      type: 'INIT_HANDSHAKE_FREE',
      data: payload
    });
    if (response) {
      const { data, message, status } = response;
      yield put(putHandShake({ ...data, message, status }));
      yield put(updateLoading(false));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* handleCompareRedeemCode({ payload }) {
  try {
    const response = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.COMPARE_REDEEM_CODE}`,
      type: 'COMPARE_REDEEM_CODE',
      data: payload
    });
    if (response) {
      const { data, status } = response;
      yield put(putRedeemCode({ ...data, status, code: payload.redeem }));
    }
  } catch (e) {
    console.error(e);
  }
}



export default function* placeBetSaga() {
  yield takeLatest(getMatchDetail().type, handleGetMatchDetail);
  yield takeLatest(getGasPrice().type, handleGetGasPrice);
  yield takeLatest(getMatchOdd().type, handleGetMatchOdd);
  yield takeLatest(initHandShake().type, handleInitHandShake);
  yield takeLatest(checkCompareRedeemCode().type, handleCompareRedeemCode);
  yield takeLatest(initHandShakeFree().type, handleInitHandShakeFree);
}
