import {EXCHANGE_ACTIONS} from './action';
import CcLimit from "@/models/CcLimit";
import UserCcLimit from "@/models/UserCcLimit";
import UserProfile from "@/models/UserProfile";
import CryptoPrice from "@/models/CryptoPrice";
import OfferPrice from "@/models/OfferPrice";

function exchangeReducter(state = {}, action) {
  // console.log('exchangeReducter', JSON.stringify(action));
  switch (action.type) {
    case `${EXCHANGE_ACTIONS.GET_CRYPTO_PRICE}_SUCCESS`: {
      return { ...state, cryptoPrice: CryptoPrice.cryptoPrice(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_CC_LIMIT}_SUCCESS`: {
      return { ...state, userCcLimit: UserCcLimit.userCcLimit(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_CC_LIMITS}_SUCCESS`: {
      return { ...state, ccLimits: action.payload.data.map(ccLimit => CcLimit.ccLimit(ccLimit)) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_PROFILE}_SUCCESS`: {
      return { ...state, userProfile: UserProfile.userProfile(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_OFFER_PRICE}_SUCCESS`: {
      return { ...state, offerPrice: OfferPrice.offerPrice(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_TRANSACTION}_SUCCESS`: {
      return { ...state, userTransaction: action.payload };
    }
    default:
      return state;
  }
}

export default exchangeReducter;
