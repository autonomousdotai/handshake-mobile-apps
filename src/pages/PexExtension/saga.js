import { takeLatest, call, put } from 'redux-saga/effects';
import { apiPostForm } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { ExtensionSubscribe, updateSubscribeResult } from './action';

function* handleSubscribeEmail({ email }) {
  try {
    const bodyFormData = new FormData();
    bodyFormData.set('email', email);
    bodyFormData.set('product', 'chrome_extension');
    const result = yield call(apiPostForm, {
      PATH_URL: API_URL.CRYPTOSIGN.SUBSCRIBE_EMAIL_EXTENSION,
      type: 'SUBSCRIBE_EMAIL_EXTENSION',
      data: bodyFormData,
    });
    yield put(updateSubscribeResult(result));
  } catch (e) {
    console.error('handleSubscribeEmail: ', e);
  }
}

export default function* predictionSaga() {
  yield takeLatest(ExtensionSubscribe().type, handleSubscribeEmail);
}
