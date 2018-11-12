import { spawn } from 'redux-saga/effects';
import homeSaga from '@/guru/pages/Home/saga';
import createEventSaga from '@/guru/pages/CreateEvent/saga';
import placeBetSaga from '@/guru/pages/PlaceBet/saga';

export default function* guruSaga() {
  yield spawn(homeSaga);
  yield spawn(createEventSaga);
  yield spawn(placeBetSaga);
}
