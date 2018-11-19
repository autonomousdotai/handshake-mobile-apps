import * as Yup from 'yup';
import moment from 'moment';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { BET_TYPE, VALIDATE_CODE } from '@/components/handshakes/betting/constants.js';
import { getBalance, getEstimateGas, getAddress } from '@/utils/helpers';
import { parseBigNumber } from '@/utils/number';

export const validationSchema = Yup.object().shape({
  amount: Yup.number()
    .positive(MESSAGE.AMOUNT_VALID)
    // .required('Required')
});

// export const isRightNetwork = () => {
//   const wallet = MasterWallet.getWalletDefault('ETH');
//   MasterWallet.log(MasterWallet.getWalletDefault('ETH'));
//   if (process.env.isProduction) {
//     return (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet);
//   }
//   return true; // process.env.isStaging;
// };

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

export const isSameAddress = (address) => (address !== getAddress());

export const isExpiredDate = (reportTime) => {
  const newClosingDate = moment.unix(reportTime);
  const dayUnit = newClosingDate.utc();
  const today = moment();
  const todayUnit = today.utc();
  return (!todayUnit.isSameOrBefore(dayUnit, 'miliseconds') && today);
};

export const isExistMatchBet = (list) => (list.find(item => item.type === BET_TYPE.SHAKE));

export const validationBet = async ({
  amount = 0,
  freeBet = false
}) => {
  const balance = await getBalance();
  const estimateGas = await getEstimateGas();
  const estimatedGasBN = parseBigNumber(estimateGas.toString() || 0);
  const total = parseBigNumber(amount).plus(estimatedGasBN).toNumber() || 0;
  const result = {
    status: true,
    message: undefined,
    code: -1,
    value: null,
    balance
  };

  if (!isRightNetwork()) {
    return {
      ...result,
      message: MESSAGE.RIGHT_NETWORK,
      status: false,
      code: VALIDATE_CODE.NOT_RIGHT_NETWORK
    };
  }

  if (!amount) {
    return {
      ...result,
      message: MESSAGE.AMOUNT_VALID,
      status: false,
      code: VALIDATE_CODE.NOT_ENTER_AMOUNT
    };
  }

  if (total > balance && !freeBet) {
    return {
      ...result,
      message: MESSAGE.NOT_ENOUGH_BALANCE,
      status: false,
      code: VALIDATE_CODE.NOT_ENOUGH_BALANCE,
      value: { balance, total }
    };
  }

  return result;
};
