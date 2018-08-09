import moment from 'moment';
import { BettingHandshake } from '@/services/neuron';
import { API_URL } from '@/constants';
import { showAlert } from '@/reducers/app/action';
import { getMessageWithCode, getChainIdDefaultWallet, isInitBet } from '@/components/handshakes/betting/utils.js';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import GA from '@/services/googleAnalytics';

import { rollback, saveTransaction } from '@/reducers/handshake/action';
import { CONTRACT_METHOD } from '@/components/handshakes/betting/constants.js';

import store from '@/stores';


const myManager = null;

const TAG = 'BET_HANDLER';
export class BetHandshakeHandler {
  static getShareManager() {
    if (this.myManager == null) {
      console.log('Create new instance');
      this.myManager = new BetHandshakeHandler();
    }

    return this.myManager;
  }
  constructor() {
    this.listOnChainLoading = {};
  }

  getLoadingOnChain = (offchain) => {

    return this.listOnChainLoading[offchain];
  }
  setItemOnChain = (offchain, itemOnChain) => {
    if (this.listOnChainLoading) {
        this.listOnChainLoading[offchain] = {
          itemOnChain:itemOnChain
      }
    }
  }

  handleContract(element, i) {
    setTimeout(() => {
      const isInit = isInitBet(element);
      console.log('Is Init Bet:', isInit);
      if (isInit) {
        this.addContract(element);
      } else {
        this.shakeContract(element);
      }
    }, 3000 * i);
  }
  controlShake = async (list) => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      console.log('Element:', element);

      this.handleContract(element, i);
    }
  };

  addContract = async (item) => {
    console.log('initContract', item);

    const {
      amount, odds, side, offchain, hid,
    } = item;
    //const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;
    // hid = 10000;
    const stake = amount;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let dataBlockchain = '';
    try {
      dataBlockchain = await bettinghandshake.initBet(hid, side, stake, odds, offchain);
      // TO DO: SAVE TRANSACTION
      const {
        hash, error, payload,
      } = dataBlockchain;
      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';

        logJson = error.message;
        this.rollback(offchain);
      }
      GA.createBetNotMatchSuccess({ side, odds, amount, hash });

    } catch (e) {
      realBlockHash = '-1';
      logJson = e.message;
    }

    this.saveTransaction(offchain, CONTRACT_METHOD.INIT, chainId, realBlockHash, contractAddress, logJson);
    return dataBlockchain;
  };

  async shakeContract(item) {
    console.log('shakeContract', item);

    const {
      amount, odds, side, maker_address, maker_odds, offchain, hid,
    } = item;
    // hid = 10000;
    //const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;
    const stake = amount;
    const maker = maker_address;
    const makerOdds = maker_odds;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let result = '';
    try {
      result = await bettinghandshake.shake(
        hid,
        side,
        stake,
        odds,
        maker,
        makerOdds,
        offchain,
      );
      const {
        hash, error, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        this.rollback(offchain);
      }
      GA.createBetMatchedSuccess({ side, odds, amount, hash });
    } catch (e) {

    }

    this.saveTransaction(offchain, CONTRACT_METHOD.SHAKE, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }

  handleContract(element, i) {
    setTimeout(() => {
      const isInit = isInitBet(element);
      console.log('Is Init Bet:', isInit);
      if (isInit) {
        this.addContract(element);
      } else {
        this.shakeContract(element);
      }
    }, 3000 * i);
  }
  controlShake = async (list) => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      console.log('Element:', element);

      this.handleContract(element, i);
    }
  };


  async cancelBet(hid, side, stake, odds, offchain, eventName, outcome) {
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let logJson = '';
    let realBlockHash = '';
    let result = null;
    try {
      result = await bettinghandshake.cancelBet(hid, side, stake, odds, offchain);
      const {
         hash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      } else {

      }

      GA.createClickCancel(eventName, outcome, hash);

    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.CANCEL, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }

  async withdraw(hid, offchain, eventName, outcome) {
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let result = null;

    let logJson = '';
    let realBlockHash = '';
    try {
      result = await bettinghandshake.withdraw(hid, offchain);
      const {
        hash, payload,
      } = result;
      logJson = payload;
      realBlockHash = hash;
      GA.createClickWithdraw(eventName, outcome, hash);
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      } else {
        store.dispatch(showAlert({
          message: MESSAGE.WITHDRAW_SUCCESS,
          timeOut: 3000,
          type: 'success',
          callBack: () => {
          },
        }));
      }
    } catch (err) {
      console.log('Withdraw Error:', err);
      realBlockHash = '-1';
      logJson = err.message;
    }

    this.saveTransaction(offchain, CONTRACT_METHOD.COLLECT, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  async refund(hid, offchain, eventName, outcome) {

    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let logJson = '';
    let realBlockHash = '';
    let result = null;
    try {
      result = await bettinghandshake.refund(hid, offchain);
      const {
        hash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.REFUND, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }

  async dispute(hid, offchain) {

    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const { contractAddress } = bettinghandshake;

    let logJson = '';
    let realBlockHash = '';
    let result = null;
    try {
      result = await bettinghandshake.dispute(hid, offchain);
      const {
        hash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.REFUND, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }

  async createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchain) {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    //const predictionhandshake = new PredictionHandshake(chainId);

    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let result = '';
    const offchainString = `cryptosign_createMarket${offchain}`;
    try {
      result = await bettinghandshake.createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
      const {
        logs, hash, error, transactionHash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      GA.createClickRefund(eventName, outcome, hash);
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      }
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchainString, CONTRACT_METHOD.CREATE_MARKET, chainId, realBlockHash, contractAddress, logJson);
    return result;
  }

  /*** API */
  saveTransaction(offchain, contractMethod, chainId, hash, contractAddress, payload) {
    console.log('saveTransaction:', offchain);
    const arrayParams = [];
    const params = {
      offchain,
      contract_address: contractAddress,
      contract_method: contractMethod,
      chain_id: chainId,
      hash,
      payload,
    };
    arrayParams.push(params);
    console.log('saveTransaction Params:', arrayParams);
    store.dispatch(saveTransaction({
      PATH_URL: API_URL.CRYPTOSIGN.SAVE_TRANSACTION,
      METHOD: 'POST',
      data: arrayParams,
      successFn: this.saveTransactionSuccess,
      errorFn: this.saveTransactionFailed,
    }));
  }
  saveTransactionSuccess = async (successData) => {
    console.log(TAG, 'saveTransactionSuccess', successData);
  }
  saveTransactionFailed = (error) => {
    console.log(TAG, 'saveTransactionSuccess', error);
  }

  rollback(offchain) {
    console.log('Rollback:', offchain);
    const params = {
      offchain,
    };
    store.dispatch(rollback({
      PATH_URL: API_URL.CRYPTOSIGN.ROLLBACK,
      METHOD: 'POST',
      data: params,
      successFn: this.rollbackSuccess,
      errorFn: this.rollbackFailed,
    }));
  }
  rollbackSuccess = async (successData) => {
    console.log(TAG, 'rollbackSuccess', successData);
    store.dispatch(showAlert({
      message: MESSAGE.ROLLBACK,
      timeOut: 5000,
      type: 'danger',

    }));
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message,
        timeOut: 5000,
        type: 'danger',

      }));
    }
  }

  async createNewEvent(input) {
    try {
      input.forEach(i => {
        const closingTime = i.closingTime - Math.floor(+moment.utc() / 1000);
        const reportTime = i.reportTime - i.closingTime;
        const disputeTime = i.disputeTime - i.reportTime;
        this.createMarket(i.fee, i.source, closingTime, reportTime, disputeTime, i.offchain);
      });
    } catch (e) {
      console.error(e);
    }
  }

  async createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchain) {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    //const predictionhandshake = new PredictionHandshake(chainId);

    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let result = '';
    const offchainString = `cryptosign_createMarket${offchain}`;
    try {
      result = await bettinghandshake.createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchainString);
      const { logs, hash, error, transactionHash, payload } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      }
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
      console.error(err);
    }
    this.saveTransaction(offchainString, CONTRACT_METHOD.CREATE_MARKET, chainId, realBlockHash, contractAddress, logJson);
    return result;
  }
}

export default BetHandshakeHandler;

