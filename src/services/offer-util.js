import React from "react";
import local from '@/services/localStore';
import { AMOUNT_DECIMAL, APP, HANDSHAKE_USER, PRICE_DECIMAL } from '@/constants';
import { BigNumber } from 'bignumber.js';
import { FormattedMessage } from 'react-intl';

export function getOfferPrice(listOfferPrice = [], type = '', currency = '', fiatCurrency = '') {
  let result = {};

  for (const offerPrice of listOfferPrice) {
    if (offerPrice.type === type && offerPrice.currency === currency && offerPrice.fiatCurrency === fiatCurrency) {
      result = offerPrice;
      break;
    }
  }

  return result;
}

export function getHandshakeUserType(initUserId, shakeUserIds = []) {
  const profile = local.get(APP.AUTH_PROFILE);
  const userId = profile.id;

  if (userId === initUserId) {
    return HANDSHAKE_USER.OWNER;
  } else if (shakeUserIds.includes(userId)) {
    return HANDSHAKE_USER.SHAKED;
  }
  return HANDSHAKE_USER.NORMAL;
}

export function formatMoney(price = 0) {
  return new BigNumber(price).toFormat(PRICE_DECIMAL);
}


export function formatMoneyByLocale(price = 0, locale = 'USD') {
  // console.log('coins - price', price);
  switch (locale.toLowerCase()) {
    case 'vnd':
      return new BigNumber(price).dividedBy(1000).decimalPlaces(0).times(1000)
        .toFormat(PRICE_DECIMAL);
    default:
      return new BigNumber(price).toFormat(PRICE_DECIMAL);
  }
}

export function roundNumberByLocale(price = 0, locale = 'USD', decimalNumber = 0) {
  switch (locale.toLowerCase()) {
    case 'vnd':
      return new BigNumber(price).dividedBy(1000).decimalPlaces(0).times(1000)
        .toNumber();
    default:
      return new BigNumber(price).decimalPlaces(decimalNumber);
  }
}


export function formatAmountCurrency(amount = 0) {
  return amount.toString();
  // return new BigNumber(amount).toFormat(AMOUNT_DECIMAL);
}

export function daysBetween(date1 = new Date(), date2 = new Date()) {
  // Get 1 day in milliseconds
  const one_day = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  const date1_ms = date1.getTime();
  const date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  let difference_ms = date2_ms - date1_ms;
  // take out milliseconds
  difference_ms /= 1000;
  const seconds = Math.floor(difference_ms % 60);
  difference_ms /= 60;
  const minutes = Math.floor(difference_ms % 60);
  difference_ms /= 60;
  const hours = Math.floor(difference_ms % 24);
  const days = Math.floor(difference_ms / 24);

  // const textDays = <FormattedMessage id="ex.shop.shake.label.days" />;
  const textDays = ' days';

  return `${days > 0 ? days + textDays : ''} ${hours >= 10 ? hours : `0${hours}`}:${minutes >= 10 ? minutes : `0${minutes}`}:${seconds >= 10 ? seconds : `0${seconds}`}`;
}

export function getLatLongHash(method, lat, lng) {
  const latValues = new BigNumber(lat).toFormat(7).split('.');
  const lngValues = new BigNumber(lng).toFormat(7).split('.');

  const result = `${method}${latValues[0].length}${latValues[0]}${latValues[1].length}${latValues[1]}${lngValues[0].length}${lngValues[0]}${lngValues[1].length}${lngValues[1]}`;

  return result;
}

export function shortenUser(userName) {
  if (userName.length > 12) {
    return `${userName.substr(0, 4)}...${userName.substr(userName.length - 4)}`;
  }
  return userName;
}

export default { getOfferPrice };
