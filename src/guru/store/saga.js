import { spawn } from 'redux-saga/effects';

export default function* guruSaga() {
  yield spawn(() => console.log('guruSaga'));
}
