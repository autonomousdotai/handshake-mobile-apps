import { reducer as form } from 'redux-form';
import guru from '@/guru/stores/reducer';
import discover from './discover';
import exchange from './exchange';
import handshake from './handshake';
import betting from './betting';
import me from './me';
import comment from './comment';
import admin from './admin';
import internalWithdraw from './internalWithdraw';
import invest from './invest';
import internalAdmin from './internalAdmin';
import buyCoin from './buyCoin';
import sellCoin from './sellCoin';
import coin from './coin';
// import firebase from './firebase';

export default {
  guru,
  discover,
  exchange,
  form,
  handshake,
  me,
  betting,
  comment,
  admin,
  internalWithdraw,
  internalAdmin,
  buyCoin,
  sellCoin,
  coin,
  // firebase,
  invest
};
