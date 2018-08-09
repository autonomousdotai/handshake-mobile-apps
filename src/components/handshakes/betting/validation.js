import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { MESSAGE } from '@/components/handshakes/betting/message.js';

import moment from 'moment';

import {getAddress, getEstimateGas, parseBigNumber, getBalance } from '@/components/handshakes/betting/utils.js';

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
  const t0 = performance.now();
  const balance = await getBalance();
  const t1 = performance.now();
  console.log(TAG, 'Time getBalance:', (t1-t0));
  const t2 = performance.now();
  const estimateGas = await getEstimateGas();
  const t3 = performance.now();
  console.log(TAG, 'Time getEstimateGas:', (t3-t2));
  const estimatedGasBN = parseBigNumber(estimateGas.toString()||0);
  const total = amount.plus(estimatedGasBN).toNumber()||0;
  let result = { status: true, message: '' };
  if (!isRightNetwork()) {
    result.message = MESSAGE.RIGHT_NETWORK;
    result.status = false;
    return result;
  }

  if (matchName.length === 0 || matchOutcome.length === 0) {
    result.message = MESSAGE.CHOOSE_MATCH;
    result.status = false;
    return result;
  }

  if (isExpiredDate(closingDate)) {
    result.message = MESSAGE.MATCH_OVER;
    result.status = false;
    return result;
  }
  if (amount <= 0) {
    result.message = MESSAGE.AMOUNT_VALID;
    result.status = false;
    return result;
  }

  if (total > balance && !freeBet) {
    result.message = MESSAGE.NOT_ENOUGH_BALANCE;
    result.status = false;
    return result;
  }

  if (odds <= 1 || odds > 11.5) {
    result.message = MESSAGE.ODD_LARGE_THAN;
    result.status = false;
    return result;
  }

  return result;
};
