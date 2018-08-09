import { call } from 'redux-saga/effects';
import { getBalance, getEstimateGas } from '@/components/handshakes/betting/utils';

export function* isBalanceValid() {
  try {
    const balance = yield call(getBalance, {});
    const estimatedGas = yield call(getEstimateGas, {});
    return balance >= estimatedGas;
  } catch (e) {
    console.error(e);
    return false;
  }
}
