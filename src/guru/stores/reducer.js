/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  putMatchDetail,
  putMatchOdd,
  putGasPrice,
  putHandShake,
  putRedeemCode,
  removeRedeemCode
} from '@/guru/pages/PlaceBet/action';
import {
  updateReports,
  shareEvent,
  resetShareEvent
} from '@/guru/pages/CreateEvent/action';
import { updateLoading } from './action';

const initialState = {
  events: [],
  matchDetail: {},
  gasPrice: '',
  userEvents: [],
  reputation: {},
  ui: {},
  authCoinBase: {},
  authMetaMask: []
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case updateLoading().type:
        draft.ui.isLoading = action.payload;
        break;
      case 'GURU:UPDATE_EVENTS':
        draft.events = action.events;
        break;
      case putMatchDetail().type:
        draft.matchDetail = {
          ...draft.matchDetail,
          ...action.data
        };
        break;
      case putMatchOdd().type:
        draft.matchDetail = {
          ...draft.matchDetail,
          odds: action.payload
        };
        break;
      case putGasPrice().type:
        draft.gasPrice = action.payload;
        break;
      case putHandShake().type:
        draft.handShakes = action.payload;
        break;
      case putRedeemCode().type:
        draft.ui.redeem = action.payload;
        break;
      case removeRedeemCode().type:
        draft.ui.redeem = null;
        break;
      case 'GURU:UPDATE_USER_EVENTS':
        draft.userEvents = action.userEvents;
        break;
      case 'GURU:UPDATE_USER_REPUTATION':
        draft.reputation = action.reputation;
        break;
      case 'GURU:UPDATE_AUTH_COINBASE':
        draft.authCoinBase = action.authCoinBase;
        break;
      case 'GURU:UPDATE_AUTH_META_MASK':
        draft.authMetaMask = action.authMetaMask;
        break;
      case updateReports().type:
        draft.reports = action.payload.data;
        break;
      case shareEvent().type:
        draft.ui.shareEvent = action.payload;
        break;
      case resetShareEvent().type:
        draft.ui.shareEvent = undefined;
        break;
      default:
        break;
    }
  });
};

export default guruReducer;
