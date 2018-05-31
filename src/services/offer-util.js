import local from '@/services/localStore';
import {APP, HANDSHAKE_USER} from "../constants";

export function getOfferPrice(listOfferPrice = [], type = '', currency = '' ) {
  let result = null;

  for (let offerPrice of listOfferPrice) {
    if (offerPrice.type === type && offerPrice.currency === currency) {
      result = offerPrice;
      break;
    }
  }

  return result;
}

export function getHandshakeUserType(initUserId, shakedUserIds = []) {
  const profile = local.get(APP.AUTH_PROFILE);
  const userId = profile.id;

  if (userId === initUserId) {
    return HANDSHAKE_USER.OWNER;
  } else if (shakedUserIds.includes(userId)) {
    return HANDSHAKE_USER.SHAKED;
  } else {
    return HANDSHAKE_USER.NORMAL;
  }
}

export default { getOfferPrice };
