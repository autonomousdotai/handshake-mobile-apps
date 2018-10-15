import { call, put } from 'redux-saga/effects';
import { getBalance, getEstimateGas } from '@/components/handshakes/betting/utils';
import { gasCheck } from '@/stores/common-action';

export function* isBalanceInvalid() {
  try {
    const balance = yield call(getBalance, {});
    const estimatedGas = yield call(getEstimateGas, {});
    const result = estimatedGas > balance ? estimatedGas : false;
    yield put(gasCheck(result));
    return result;
  } catch (e) {
    console.error(e);
    return false;
  }
}
