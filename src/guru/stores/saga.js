import { spawn } from 'redux-saga/effects';
import homeSaga from '@/guru/pages/Home/saga';
import createEventSaga from '@/guru/pages/CreateEvent/saga';

export default function* guruSaga() {
  yield spawn(homeSaga);
  yield spawn(createEventSaga);
}
