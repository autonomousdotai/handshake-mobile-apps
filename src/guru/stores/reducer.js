/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  updateEvents,
  updateCountReport,
  putUserSubscribe,
  putStatusEmailSubscribe,
  putRelatedMatches
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

/*
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
      default:
        break;
    }
  });
};
*/

const guruReducer = (state = {
  events: [],
  matchDetail: {},
  gasPrice: '',
  userEvents: [],
  reputation: {},
  ui: {},
  authCoinBase: {},
  authMetaMask: []
}, action) => {
  switch (action.type) {
    case updateLoading().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload
        }
      };
    case updateEvents().type:
      return {
        ...state,
        events: action.payload
      };
    case updateCountReport().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          countReport: action.payload
        }
      };
    case putUserSubscribe().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          userSubscribe: action.payload
        }
      };
    case putStatusEmailSubscribe().type:
      
      return {
        ...state,
        ui: {
          ...state.ui,
          userSubscribe: {
            status: action.payload
          }
        }
      };
    case putRelatedMatches().type:
      return {
        ...state,
        relatedMatches: action.payload
      };
    case putMatchDetail().type:
      return {
        ...state,
        matchDetail: {
          ...state.matchDetail,
          ...action.data
        }
      };
    case putMatchOdd().type:
      return {
        ...state,
        matchDetail: {
          ...state.matchDetail,
          odds: action.payload
        }
      };
    case putGasPrice().type:
      return {
        ...state,
        gasPrice: action.payload
      };
    case putHandShake().type:
      return {
        ...state,
        handShakes: action.payload
      };
    case putRedeemCode().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          redeem: action.payload
        }
      };
    case removeRedeemCode().type:
      return {
        ...state,
        ui: {
          ...state,
          redeem: null
        }
      };
    case 'GURU:UPDATE_USER_EVENTS': {
      const newList = [...state.userEvents, ...action.userEvents];
      return {
        ...state,
        userEvents: newList,
        reputation: {
          ...state.reputation,
          loadMore: action.loadMore,
          page: action.page
        }
      };
    }

    case 'GURU:UPDATE_NEW_USER_EVENTS':
      return {
        ...state,
        userEvent: action.userEvents,
        reputation: {
          ...state.reputation,
          loadMore: action.loadMore,
          page: action.page
        }
      };
    case 'GURU:UPDATE_USER_REPUTATION':
      return {
        ...state,
        reputation: {
          ...state.reputation,
          ...action.reputation
        }
      };
    case 'GURU:UPDATE_AUTH_COINBASE':
      return {
        ...state,
        authCoinBase: action.authCoinBase
      };
    case 'GURU:UPDATE_AUTH_META_MASK':
      return {
        ...state,
        authMetaMask: action.authMetaMask
      };
    case updateReports().type:
      return {
        ...state,
        reports: action.payload.data
      };
    case shareEvent().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          shareEvent: action.payload
        }
      };
    case resetShareEvent().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          shareEvent: undefined
        }
      };
    case putReferralCheck().type:
      return {
        ...state,
        ui: {
          ...state.ui,
          referralCheck: action.payload
        }
      };
    default:
      return state;
  }
};

export default guruReducer;
