import { takeLatest, call } from 'redux-saga/effects';
import { apiPost } from '@/guru/stores/api';

import {
  updateApproveConstant
} from './action';

import { API_URL } from '@/constants';

export function* handleUpdatePermissionConstant({ payload }) {
  try {
    const response = yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.UPDATE_APPROVE_TOKEN}`,
      type: 'UPDATE_APPROVE_CONSTANT',
      data: payload
    });
    console.log('handleUpdatePermissionConstant:', response);
  } catch (e) {
    console.error('handleUpdatePermissionConstant', e);
  }
}

export default function* constantTermSaga() {
  yield takeLatest(updateApproveConstant().type, handleUpdatePermissionConstant);
}
