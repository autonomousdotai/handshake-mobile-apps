import { EXCHANGE_ACTIONS } from './action';

function exchangeReducter(state = {}, action) {
  // console.log('exchangeReducter', JSON.stringify(action));
  switch (action.type) {
    case `${EXCHANGE_ACTIONS.GET_CRYPTO_PRICE}_SUCCESS`: {
      return { ...state, cryptoPrice: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_CC_LIMIT}_SUCCESS`: {
      return { ...state, userCcLimit: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_CC_LIMITS}_SUCCESS`: {
      return { ...state, ccLimits: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_PROFILE}_SUCCESS`: {
      return { ...state, userProfile: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_TRANSACTION}_SUCCESS`: {
      return { ...state, userTransaction: action.payload };
    }
    default:
      return state;
  }
}

export default exchangeReducter;
