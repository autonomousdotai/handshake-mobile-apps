/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  updateEvents,
  updateCountReport,
  putUserSubscribe,
  putStatusEmailSubscribe,
  putRelatedMatches,
  putTokenList,
  updatePermissionConstant,
  updateCurrentContract
} from '@/guru/pages/Home/action';
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
import {
  putReferralCheck
} from '@/pages/Me/action';
import { updateLoading } from './action';

const initialState = {
  events: [],
  matchDetail: {},
  gasPrice: '',
  userEvents: [],
  reputation: {},
  ui: {},
  authCoinBase: {},
  authMetaMask: [],
  constantToken: {},
  permissionConstToken: undefined
};

const guruReducer = (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case updateLoading().type:
        draft.ui.isLoading = action.payload;
        break;
      case updateEvents().type:
        draft.events = action.payload;
        break;
      case updateCountReport().type:
        draft.ui.countReport = action.payload;
        break;
      case putUserSubscribe().type:
        draft.ui.userSubscribe = action.payload;
        break;
      case putStatusEmailSubscribe().type:
        draft.ui.userSubscribe.status = action.payload;
        break;
      case putRelatedMatches().type:
        draft.relatedMatches = action.payload;
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
        const newList = [...draft.userEvents, ...action.userEvents];
        draft.userEvents = newList;
        draft.reputation = {
          ...draft.reputation,
          loadMore: action.loadMore,
          page: action.page
        };
        break;

      case 'GURU:UPDATE_NEW_USER_EVENTS':
        draft.userEvents = action.userEvents;
        draft.reputation = {
          ...draft.reputation,
          loadMore: action.loadMore,
          page: action.page
        };
        break;
      case 'GURU:UPDATE_USER_REPUTATION':
        draft.reputation = {
          ...draft.reputation,
          ...action.reputation
        };
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
      case putReferralCheck().type:
        draft.ui.referralCheck = action.payload;
        break;
      case updatePermissionConstant().type:
        draft.permissionConstToken = action.payload;
        break;
      case putTokenList().type:
        draft.constantToken = action.payload;
        break;

      case updateCurrentContract().type:
        draft.currentContract = action.payload;
        break;
      default:
        break;
    }
  });
};

export default guruReducer;
