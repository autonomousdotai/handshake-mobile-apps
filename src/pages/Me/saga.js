import { takeLatest, call, select, put } from 'redux-saga/effects';
import { API_URL } from '@/constants';
import { apiGet, apiPost } from '@/guru/stores/api';
import { updateLoading } from '@/guru/stores/action';
import { referralCheck, putReferralCheck, referralJoin } from './action';

export function* handleReferralCheck() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.REFERRAL_CHECK}`,
      type: 'REFERRAL_CHECK'
    });
    if (response.status) {
      const referralInfo = { ...response.data, status: response.status };
      yield put(putReferralCheck(referralInfo));
      yield put(updateLoading(false));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* handleReferralJoin() {
  try {
    const data = yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.REFERRAL_JOIN}`,
      type: 'REFERRAL_JOIN'
    });
    if (data) {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* meSaga() {
  yield takeLatest(referralCheck().type, handleReferralCheck);
  yield takeLatest(referralJoin().type, handleReferralJoin);
}
