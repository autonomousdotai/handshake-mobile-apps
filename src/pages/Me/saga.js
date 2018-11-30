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
    if (response) {
      const { data, status } = response;
      yield put(putReferralCheck({ ...data, status }));
      yield put(updateLoading(false));
    }
  } catch (e) {
    console.error(e);
  }
}

export function* handleReferralJoin() {
  try {
    const response = yield call(apiGet, {
      PATH_URL: `${API_URL.CRYPTOSIGN.REFERRAL_JOIN}`,
      type: 'REFERRAL_JOIN'
    });
    if (response) {
      const { data, status } = response;
      yield put(putReferralCheck({ ...data, status }));
      yield put(updateLoading(false));
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* meSaga() {
  yield takeLatest(referralCheck().type, handleReferralCheck);
  yield takeLatest(referralJoin().type, handleReferralJoin);
}
