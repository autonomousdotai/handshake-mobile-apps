import CcLimit from '@/models/CcLimit';
import UserCcLimit from '@/models/UserCcLimit';
import UserProfile from '@/models/UserProfile';
import CryptoPrice from '@/models/CryptoPrice';
import OfferPrice from '@/models/OfferPrice';
import OfferShop from '@/models/OfferShop';
import { EXCHANGE_ACTIONS } from './action';
import { EXCHANGE_ACTION } from '@/constants';

const initListOfferPrice = [];
initListOfferPrice.updatedAt = Date.now();

function exchangeReducter(state = {
  listOfferPrice: initListOfferPrice,
}, action) {
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
    case `${EXCHANGE_ACTIONS.GET_LIST_OFFER_PRICE}_SUCCESS`: {
      const listOfferPrice = action.payload.data.map((offerPrice) => {
        const price = OfferPrice.offerPrice(offerPrice);

        price.type = price.type === EXCHANGE_ACTION.SELL ? EXCHANGE_ACTION.BUY : EXCHANGE_ACTION.SELL;

        return price;
      });
      listOfferPrice.updatedAt = Date.now();
      return {
        ...state,
        listOfferPrice,
      };
    }
    case `${EXCHANGE_ACTIONS.GET_IP_INFORM}_SUCCESS`: {
      return { ...state, ipInfo: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_OFFER_STORES}_SUCCESS`: {
      return { ...state, offerStores: OfferShop.offerShop(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_FREE_START_INFO}_SUCCESS`: {
      return { ...state, freeETH: action.payload.data?.reward };
    }
    default:
      return state;
  }
}

export default exchangeReducter;
