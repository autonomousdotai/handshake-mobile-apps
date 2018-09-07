import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import Handshake from '@/models/Handshake.js';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { MESSAGE_SERVER } from '@/components/handshakes/betting/message.js';
import { BET_TYPE, ROLE } from '@/components/handshakes/betting/constants.js';
import moment from 'moment';

import { BigNumber } from 'bignumber.js';
import _ from 'lodash';


const ROUND = 1000000;
const ROUND_ODD = 10;
const TAG = 'BETTING_UTIL';


export const parseBigNumber = (value) => {
  return new BigNumber(value);
}
export const getMessageWithCode = (code) => {
  const keys = Object.keys(MESSAGE_SERVER).filter(k => k == code); // ["A", "B"]
  const value = keys.map(k => MESSAGE_SERVER[k]); // [0, 1]
  return value;
}
export const getChainIdDefaultWallet = () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  const { chainId } = wallet;
  return chainId;
};

export const getAddress = () => {
  /*
  const chainId = getChainIdDefaultWallet();
  const bettinghandshake = new BettingHandshake(chainId);
  return bettinghandshake.address;
  */
  const wallet = MasterWallet.getWalletDefault('ETH');
  return wallet.address;
};

export const getId = (idOffchain) => {
  const array = idOffchain.split('_');
  if (array.length > 1) {
    const secondItem = array[1];
    if (secondItem) {
      const strId = secondItem.substring(1);
      return parseInt(strId, 10); // ID is not a value
    }
  }
  return null;
};

export const getShakeOffchain = id => `cryptosign_s${id}`;

export const getBalance = async () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  const balance = await wallet.getBalance();
  return balance;
};

export const getGasPrice = () => {
  const chainId = getChainIdDefaultWallet();
  return chainId === 4 ? window.gasPrice || 20 : window.gasPrice || 20;
};

export const getEstimateGas = async () => {

  const chainId = getChainIdDefaultWallet();
  const neuron =
  chainId === 4 ? MasterWallet.neutronTestNet : MasterWallet.neutronMainNet;
  const gasPrice = getGasPrice();
  const estimateGas = await neuron.caculateLimitGasWithEthUnit(gasPrice);
  console.log(TAG, 'Estimate Gas:', estimateGas);
  return estimateGas;
  // const bettinghandshake = new BettingHandshake(chainId);
  // const result = await bettinghandshake.getEstimateGas();
  // return result;
};

export const leftTime = (endTime) => {
  const newClosingDate = moment.unix(endTime);
  const dayUnit = newClosingDate.utc();
  const today = moment();
  const todayUnit = today.utc();
  let d = Math.abs(dayUnit - todayUnit) / 1000;                           // delta
  const r = {};                                                                // result
  const s = {                                                                  // structure
    year: 31536000,
    month: 2592000,
    week: 604800, // uncomment row to ignore
    day: 86400,   // feel free to add your own row
    hour: 3600,
    minute: 60,
    second: 1
  };

  Object.keys(s).forEach(function(key){
      r[key] = Math.floor(d / s[key]);
      d -= r[key] * s[key];
  });

  // for example: {year:0,month:0,week:1,day:2,hour:34,minute:56,second:7}
  console.log(r);
  let text = "";
  if (r.day > 0) {
    text += `${r.day}d `;
  }
  if (r.hour > 0) {
    text += `${r.hour}hr `;
  }

  if (r.minute > 0) {
    text += `${r.minute}m `;
  }

  if (r.second > 0) {
    text += `${r.second}s`;
  }

  return text;
};

export const foundShakeList = (item) => {
  // const shakerList = [];
  const profile = local.get(APP.AUTH_PROFILE);
  const { shakers } = item;

  //const idOffchain = getId(offchain);
  //console.log('Id Offchain:', idOffchain);
  if (!_.isEmpty(shakers)) {
    const shakersArr = JSON.parse(shakers);
    const shakedList = shakersArr.filter(element => element.shaker_id === profile.id);
    console.log('foundShakedList:', shakedList);
    return shakedList;

  }

  return [];
};
export const isExistMatchBet = (list) => {
  for (let i = 0; i < list.length; i += 1) {
    const element = list[i];

    const { type } = element;
    console.log('Sa element:', element);

    if (type === BET_TYPE.SHAKE) {
      return true;
    }
  }
  return false;
};

export const isInitBet = (dict) => {

  const { type } = dict;
  if (type === BET_TYPE.INIT) {
    return true;
  }
  return false;
};

export const isShakeUser = (shakeIds) => {
  const profile = local.get(APP.AUTH_PROFILE);

  if (shakeIds) {
    if (shakeIds.indexOf(profile.id) > -1) {
      return true;
    }
  }
  return false;
};

export const isMakerShakerSameUser = (initUserId, shakeIds) => {
  const profile = local.get(APP.AUTH_PROFILE);

  const userId = profile.id;
  if (userId === initUserId && isShakeUser(shakeIds, userId)) {
    return true;
  }
  return false;
};

export const isMatch = (shakeUserIds) => {
  if (shakeUserIds) {
    return shakeUserIds.length > 0;
  }
  return false;
};

export const formatAmount = (amount) => {
  return Math.floor(amount * ROUND) / ROUND;
};

export const formatOdds = (odds) => {
  return Math.floor(odds * ROUND_ODD) / ROUND_ODD;
};

export const parseJsonString = (extraData) => {
  try {
    return JSON.parse(extraData);
  } catch (e) {
    console.log(e);
    return {};
  }
}

export const findUserBet = (handshake) => {
  const {
    result, shakeUserIds, closingTime,
    reportTime, disputeTime, initUserId, side, hid, type,
    totalAmount, totalDisputeAmount, contractName, contractAddress,
  } = handshake;

  let findItem = handshake;
  let isUserShake = isShakeUser(shakeUserIds);
  const matched = isMatch(shakeUserIds);

  //Maker and shaker is same user
  const isSameUser = isMakerShakerSameUser(initUserId, shakeUserIds);
  if (isSameUser && matched && result === side) {
    isUserShake = false;
  }

  if (isUserShake) {
    const shakedItemList = foundShakeList(handshake);

    if (shakedItemList.length > 0) {
      const firstItem = Handshake.handshake(shakedItemList[0]);

      findItem = Object.assign(firstItem, {
        id: getShakeOffchain(firstItem.id),
        hid,
        result,
        closingTime,
        reportTime,
        disputeTime,
        totalAmount,
        totalDisputeAmount,
        //contractAddress,
        //contractName,
      });
    }
  }

  const cloneItem = Object.assign({}, findItem);
  const newItem = Object.assign(cloneItem, {
    role: isUserShake ? ROLE.SHAKER : ROLE.INITER,
    matched,
    type,

  });

  console.log(TAG, 'findUserBet:', newItem);

  return newItem;

}

