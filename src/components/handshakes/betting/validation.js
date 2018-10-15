import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { MESSAGE } from '@/components/handshakes/betting/message.js';

import moment from 'moment';

import {getAddress, getEstimateGas, parseBigNumber, getBalance } from '@/components/handshakes/betting/utils.js';
import { VALIDATE_CODE } from '@/components/handshakes/betting/constants.js';

const TAG = 'VALIDATION';
export const isRightNetwork = () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  MasterWallet.log(MasterWallet.getWalletDefault('ETH'));

  if (process.env.isStaging) {
    return true;
  }
  if (process.env.isProduction) {
    if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
      return true;
    }
    return false;
  }
  return true;
};

export const isExpiredDate = (reportTime) => {
  console.log('Report Time:', reportTime);
  const newClosingDate = moment.unix(reportTime);
  const dayUnit = newClosingDate.utc();
  const today = moment();
  const todayUnit = today.utc();
  // console.log('Closing Unix:', closingDateUnit.format());
  console.log('New Date Unix:', dayUnit.format());
  console.log('Today Unix:', todayUnit.format());
  if (!todayUnit.isSameOrBefore(dayUnit, 'miliseconds') && today) {
    console.log('Expired Date');
    return true;
  }
  return false;
};

export const isSameAddress = (address) => {
  const currentAddress = getAddress();
  if (address !== currentAddress) {
    return false;
  }
  return true;
};

export const validateBet = async (amount = 0, odds = 0, closingDate, matchName = '', matchOutcome = '', freeBet=false) => {
  const balance = await getBalance();

  const estimateGas = await getEstimateGas();
  const estimatedGasBN = parseBigNumber(estimateGas.toString()||0);
  const total = amount.plus(estimatedGasBN).toNumber()||0;
  let result = { status: true, message: '', code: -1, value: null, balance };
  if (!isRightNetwork()) {
    result.message = MESSAGE.RIGHT_NETWORK;
    result.status = false;
    result.code = VALIDATE_CODE.NOT_RIGHT_NETWORK;
    return result;
  }

  if (matchName.length === 0 || matchOutcome.length === 0) {
    result.message = MESSAGE.CHOOSE_MATCH;
    result.status = false;
    result.code = VALIDATE_CODE.NOT_CHOOSE_MATCH;
    return result;
  }

  if (isExpiredDate(closingDate)) {
    result.message = MESSAGE.MATCH_OVER;
    result.status = false;
    result.code = VALIDATE_CODE.EXPIRED_TIME;
    return result;
  }
  const amountNumber = amount.toNumber();
  if (amountNumber <= 0 || !amountNumber) {
    result.message = MESSAGE.AMOUNT_VALID;
    result.status = false;
    result.code = VALIDATE_CODE.NOT_ENTER_AMOUNT;
    return result;
  }

  if (total > balance && !freeBet) {
    result.message = MESSAGE.NOT_ENOUGH_BALANCE;
    result.status = false;
    result.code = VALIDATE_CODE.NOT_ENOUGH_BALANCE;
    result.value = { balance, total };

    return result;
  }

  const oddNumber = odds.toNumber();
  if (oddNumber <= 1 || oddNumber > 11.5 || !oddNumber) {
    result.message = MESSAGE.ODD_LARGE_THAN;
    result.status = false;
    result.code = VALIDATE_CODE.INVALID_ODDS;
    return result;
  }

  return result;


};
