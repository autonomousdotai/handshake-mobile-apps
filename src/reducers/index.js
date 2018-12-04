import { reducer as form } from 'redux-form';
import guru from '@/guru/stores/reducer';
import handshake from './handshake';
import betting from './betting';
import me from './me';
import comment from './comment';
import admin from './admin';

export default {
  guru,
  form,
  handshake,
  me,
  betting,
  comment,
  admin,
};
