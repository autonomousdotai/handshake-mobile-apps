import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import { BitcoinCash } from '@/services/Wallets/BitcoinCash';
import axios from 'axios';

// for reusable
const sampleCrypto = {
  ETH: new Ethereum(),
  BTC: new Bitcoin(),
  BCH: new BitcoinCash(),
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const countDecimals = (value) => {
  if (Math.floor(value) === value) return 0;
  const decimalsString = value.toString().split('.')[1];
  if (!decimalsString) return 0;
  return decimalsString.length || 0;
  // return value.toString().split('.')[1].length || 0;
};

export const getDistanceFromLatLonInKm = (_lat1, _lon1, _lat2, _lon2) => {
  const lat1 = parseFloat(_lat1, 10);
  const lon1 = parseFloat(_lon1, 10);
  const lat2 = parseFloat(_lat2, 10);
  const lon2 = parseFloat(_lon2, 10);
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad above
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const getErrorMessageFromCode = (error) => {
  let result = '';
  const messageFromApi = error.response?.data?.message;
  const code = error.response?.data?.code;
  const codeInt = parseInt(code, 10);
  switch (codeInt) {
    case -4: case -5: case -6: case -201: case -202: case -203: case -204:
    case -305: case -306: case -307: case -308: case -311:
      result = <FormattedMessage id="ex.error.systemError" />;
      break;
    case -312:
      result = <FormattedMessage id="ex.error.312" />;
      break;
    case -313:
      result = <FormattedMessage id="ex.error.313" />;
      break;
    case -314:
      result = <FormattedMessage id="ex.error.314" />;
      break;
    case -315:
      result = <FormattedMessage id="ex.error.315" />;
      break;
    case -1:
      result = <FormattedMessage id="ex.error.1" />;
      break;
    case -3:
      result = <FormattedMessage id="ex.error.3" />;
      break;
    case -301:
      result = <FormattedMessage id="ex.error.301" />;
      break;
    case -302:
      result = <FormattedMessage id="ex.error.302" />;
      break;
    case -303:
      result = <FormattedMessage id="ex.error.303" />;
      break;
    case -304:
      result = <FormattedMessage id="ex.error.304" />;
      break;
    case -309:
      result = <FormattedMessage id="ex.error.309" />;
      break;
    case -319:
      result = <FormattedMessage id="ex.error.319" />;
      break;
    case -320:
      result = <FormattedMessage id="ex.error.320" />;
      break;
    case -322:
      result = <FormattedMessage id="ex.error.322" />;
      break;
    case -323:
      result = <FormattedMessage id="ex.error.323" />;
      break;
    case -324:
      result = <FormattedMessage id="ex.error.324" />;
      break;
    case -325:
      result = <FormattedMessage id="ex.error.325" />;
      break;
    case -326:
      result = <FormattedMessage id="ex.error.326" />;
      break;
    case -327:
      result = <FormattedMessage id="ex.error.327" />;
      break;
    case -331:
      result = <FormattedMessage id="ex.error.331" />;
      break;
    default:
      result = messageFromApi || <FormattedMessage id="ex.error.default" />;
  }
  return result;
};

/**
 * Get coin type from its wallet address
 * @param {String} walletAddress
 */
export const getCryptoFromAddress = (walletAddress) => {
  let rs;
  Object.keys(sampleCrypto)?.forEach(crypto => {
    if (sampleCrypto[crypto]?.checkAddressValid(walletAddress) === true) {
      rs = crypto;
    }
  });

  return rs;
};

export const getAddressFromLatLng = ({ lat, lng }) => {
  if (lat && lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${process.env.GOOGLE_API_KEY}`).then((response) => {
      const address = response.data.results[0] && response.data.results[0].formatted_address;
      return address;
    });
  }
  return Promise.reject(new Error('Missing latlng'));
};

export const getGeoCodeFromAddress = (inputAddress) => {
  if (inputAddress) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${inputAddress}&sensor=true&key=${process.env.GOOGLE_API_KEY}`).then((response) => {
      const location = response.data.results[0] && response.data.results[0].geometry.location;
      return location;
    });
  }
  return Promise.reject(new Error('Missing inputAddress'));
};
