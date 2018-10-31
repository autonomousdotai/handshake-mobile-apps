import { spawn } from 'redux-saga/effects';
import homeSaga from '@/guru/pages/Home/saga';

export default function* guruSaga() {
  yield spawn(() => console.log('guruSaga'));
  yield spawn(homeSaga);
}
