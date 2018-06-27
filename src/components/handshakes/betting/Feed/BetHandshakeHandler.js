import { MasterWallet } from '@/models/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import { API_URL, APP } from '@/constants';
import {showAlert} from '@/reducers/app/action';
import {getMessageWithCode, getChainIdDefaultWallet, foundShakeItem, isInitBet} from '@/components/handshakes/betting/utils.js';

import GA from '@/services/googleAnalytics';

import local from '@/services/localStore';
import { rollback, saveTransaction,collect } from '@/reducers/handshake/action';
import { updateBettingChange} from '@/reducers/me/action';

import store from '@/stores';
import moment from 'moment';

export const MESSAGE_SERVER = {
  /* ERROR */
    1000: 'Please double check your input data.',
    1001: 'No equivalent bets found. Please create a new bet.',
    1002: 'Please provide valid wallet address!',
    1003: 'Missing offchain data!',
    1004: 'Odds should be large than 1',
    1005: 'The maximum free bet is 100!',
    1006: 'You cannot withdraw this handshake!',
    1007:  'Cannot rollback this handshake!',

    /* OUTCOME */
    1008: 'Please check your outcome id',
    1009: 'Please check your outcome result',
    1010: 'This outcome has had result already!',

    /* MATCH */
    1011: 'Match not found. Please try again.',
    1012: 'Match result invalid. Please try again.',
    1013: 'Match result is empty. Please try again.',
    1014: 'The report time is exceed!',

    /* USER */
    1015: 'Please enter a valid email address.',
    1016: 'Please make sure your email and password are correct.',
    1017: 'Sorry, we were unable to register you. Please contact human@autonomous.ai for support.',
    1018: 'Invalid user',
    1019: 'Please purchase to sign more.',
    1020: 'Invalid user',
    1021: 'Please login with google+ or facebook account.',
    1022: 'You have received free bet already!',

    /* HANSHAKE */
    1023: 'You\'re out of gas! Please wait while we add ETH to your account.',
    1024: 'You can\'t Handshake with yourself!',
    1025: 'This Handshake seems to be empty.',
    1026: 'You are not authorized to make this Handshake.',
    1027: 'Contract file not found!',
    1028: 'Handshake not found. Please try again.',
    1029: 'Please enter a payment amount.',
    1030: 'Amount should be larger > 0.',
    1031: 'Amount key is invalid.',
    1032: 'Public key is invalid.',
    1033: 'Please enter a valid wallet address which exists in our system.',
    1034: 'You\'re out of gas! Please wait while we add ETH to your account.',
    1035: 'Your note is too long. It should be less than 1000 characters.',
    1036: 'Please choose type of handshake.',
    1037: 'This is not betting template.',
    1038: 'There is shakers. Therefore you cannot refund!',
    1039: 'Your result does not match with outcome!',
    1040: 'Withdraw only works after dispute time.',

    /* SHAKER */
    1041: 'Shaker not found. Please try again.',
    1042: 'You have rollbacked already!',


    /* WALLET */
    1043: 'Busy day for Handshakes - we\'re out of freebies! Please try again tomorrow.',
    1044: 'You can only request free Handshakes once.',
    1045: 'Your account can\'t get free ETH.',
}


export const MESSAGE = {
  BET_PROGRESSING: 'Your bet is creating. Please wait',
  CREATE_BET_NOT_MATCH: 'Finding a ninja to bet against you.',
  CREATE_BET_MATCHED: 'Bet matched! Waiting for outcome.',
  NOT_ENOUGH_BALANCE: 'Too rich for your blood. Please top up your wallet.',
  NOT_ENOUGH_GAS: `Not enough gas. Your balance should larger than 0.007eth gas + value. Please top up your wallet.`,
  CHOOSE_MATCH: 'Please choose match and outcome',
  ODD_LARGE_THAN: 'Please enter odds greater than 1',
  AMOUNT_VALID: 'Please place a bet larger than 0.',
  MATCH_OVER: 'Time travel is hard. Please bet on a future or ongoing match.',
  RIGHT_NETWORK: 'You must set your wallet on Mainnet',
  ROLLBACK: `Something did not go according to plan. Please try again.`,
  WITHDRAW_SUCCESS: 'Success! Your winnings have been withdrawn to your wallet.',
  DIFFERENCE_ADDRESS: `Current address isn't same as which you used to create bet`,
};


/*
```'STATUS_COLLECT_FAILED': -9,
    'STATUS_COLLECT_PENDING': -8,

    'STATUS_DISPUTE_FAILED': -7,
    'STATUS_REFUND_FAILED': -6,

    'STATUS_MAKER_UNINIT_FAILED': -5,
    'STATUS_MAKER_UNINIT_PENDING': -4,

    'STATUS_SHAKER_ROLLBACK': -3,
    'STATUS_MAKER_INIT_ROLLBACK': -2,

    'STATUS_PENDING': -1,
    
    'STATUS_INITED': 0,
    'STATUS_MAKER_UNINITED': 1,
    'STATUS_SHAKER_SHAKED': 2,
    'STATUS_REFUNDED': 3,
    'STATUS_DISPUTED': 4,
    'STATUS_RESOLVED': 5,
    'STATUS_DONE': 6,```*/

export const BET_BLOCKCHAIN_STATUS = {  
    STATUS_COLLECT_PENDING: -8,
    STATUS_DISPUTE_FAILED: -7,
    STATUS_REFUND_FAILED: -6,
    STATUS_MAKER_UNINIT_FAILED: -5,
    STATUS_MAKER_UNINIT_PENDING: -4,

    STATUS_SHAKER_ROLLBACK: -3,
    STATUS_MAKER_INIT_ROLLBACK: -2,



    STATUS_PENDING: -1,
    STATUS_INITED: 0,
    STATUS_MAKER_UNINITED: 1,
    STATUS_SHAKER_SHAKED: 2,
    STATUS_REFUND: 3,
    STATUS_DISPUTE: 4,
    STATUS_RESOLVE: 5,
    STATUS_DONE: 6,
};

export const ROLE = {
  INITER: 1,
  SHAKER: 2,
};

export const SIDE = {
  SUPPORT: 1,
  AGAINST: 2,
};
export const BET_TYPE = {
  INIT: 'init',
  SHAKE: 'shake'
}
export const BETTING_STATUS = {
  INITED: -1,
  DRAW: 0,
  SUPPORT_WIN: 1,
  AGAINST_WIN: 2,
};

export const BETTING_STATUS_LABEL =
    {
      INITING: 'Placing a bet..',
      CANCEL: 'Cancel this bet',
      RETRY: 'Retry',
      ROLLBACK_INIT: 'There is something wrong with blockchain. The bet is cancelled',
      ROLLBACK_SHAKE: 'There is something wrong with blockchain. The bet is cancelled',
      ACTION_FAILED: `There is something wrong with blockchain. Your action is cancelled`,
      SOLVE: 'Please retry to solve problem',
      LOSE: 'Better luck next time.',
      WIN: `You're a winner!`,
      DONE: 'Completed',
      WITHDRAW: 'Withdraw winnings',
      CANCELLING: 'Your bet is being cancelled.',
      PROGRESSING: 'Your bet is progressing a transaction. Please wait..',
      BET_WAIT_MATCHING: 'Bet placed. Matching..',
      BET_MACHED_WAIT_RESULT: 'Bet matched. Waiting for result..',
      REFUND: 'Refund your bet',
      CANCELLED: 'Your bet was cancelled.',
      REFUNDING: 'Your coin is being refunded to you.',
      REFUNDED: 'Your coin has been refunded.',
      ROLLBACK: `Something did not go according to plan. We're fixing it`,

    };

export const CONTRACT_METHOD = {
  INIT: 'init',
  SHAKE: 'shake',
  CANCEL: 'uninit',
  REFUND: 'refund',
  COLLECT: 'collect',
};

const myManager = null;

export class BetHandshakeHandler {
  static getShareManager() {
    if (this.myManager == null) {
      console.log('Create new instance');
      this.myManager = new BetHandshakeHandler();
    }

    return this.myManager;
  }
  constructor() {

  }
  getStatusLabel(blockchainStatus, resultStatus, role, side, isMatch) {
    let label = null;
    let strStatus = null;
    let isAction = false;
    console.log('getStatusLabel Role:', role);
    console.log('getStatusLabel isMatch:', isMatch);
    console.log('getStatusLabel Blockchain status:', blockchainStatus);

    if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING
      || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING) {
    strStatus = BETTING_STATUS_LABEL.PROGRESSING;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
              || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
              || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED){
    strStatus = BETTING_STATUS_LABEL.ACTION_FAILED;
    isAction = false;

  }
    else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_PENDING) {

      strStatus = BETTING_STATUS_LABEL.INITING;
      isAction = false;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED) {
      strStatus = BETTING_STATUS_LABEL.CANCELLED;
      isAction = false;
    }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_INIT_ROLLBACK) {
      strStatus = BETTING_STATUS_LABEL.ROLLBACK_INIT;
      isAction = false;
    }
    else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_ROLLBACK) {
      strStatus = BETTING_STATUS_LABEL.ROLLBACK_SHAKE;
      isAction = false;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND) {
      strStatus = BETTING_STATUS_LABEL.REFUNDED;
      isAction = false;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT) {
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = false;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST) {
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = false;
    } else if (!isMatch && role === ROLE.INITER && blockchainStatus !== BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.BET_WAIT_MATCHING;
      isAction = true;
    } else if (isMatch && resultStatus === BETTING_STATUS.DRAW) {
      label = BETTING_STATUS_LABEL.REFUND;
      strStatus = BETTING_STATUS_LABEL.REFUNDING;
      isAction = true;
    } else if (isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT) {
      label = BETTING_STATUS_LABEL.WITHDRAW;
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = true;
    } else if (isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST) {
      // label = BETTING_STATUS_LABEL.LOSE;
      strStatus = BETTING_STATUS_LABEL.LOSE;
      isAction = false;
    } else if (isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.SUPPORT) {
      // label = BETTING_STATUS_LABEL.LOSE;
      strStatus = BETTING_STATUS_LABEL.LOSE;
      isAction = false;
    } else if (isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST) {
      label = BETTING_STATUS_LABEL.WITHDRAW;
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = true;
    } else if (isMatch || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
      strStatus = BETTING_STATUS_LABEL.BET_MACHED_WAIT_RESULT;
      isAction = false;
    }
    return { title: label, isAction, status: strStatus };
  }  
  
  addContract = async (item, hid) => {
    console.log('initContract, hid:', item, hid);

    const {
      amount, odds, side, offchain,
    } = item;
    const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;
    //hid = 10000;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = "";
    let logJson = "";
    let dataBlockchain = "";
    try {
      dataBlockchain = await bettinghandshake.initBet(hid, side, stake, odds, offchain);
      //TO DO: SAVE TRANSACTION
      const {blockHash, logs, hash, error} = dataBlockchain;
      logJson = JSON.stringify(logs);
      realBlockHash = blockHash;
      if(hash == -1){
        realBlockHash = "-1";
        logJson = error.message;
        this.rollback(offchain);
  
      }
  
      // Send GA event tracking
      try {
        if(hash === -1) {
          GA.createBetNotMatchFail({
            side,
            odds,
            amount,
            message: logJson,
          })
        } else {
          GA.createBetNotMatchSuccess({ side, odds, amount });
        }
      } catch (err) {
        console.log(err);
      }
  
    }catch(e){
      realBlockHash = "-1";
      logJson = e.message;
    }
    
    this.saveTransaction(offchain,CONTRACT_METHOD.INIT, chainId, realBlockHash, contractAddress, logJson);
    return dataBlockchain;
  };

  async shakeContract(item, hid) {
    console.log('shakeContract, hid:', item, hid);

    const {
      amount, id, odds, side,maker_address, maker_odds, offchain
    } = item;
    // hid = 10000;
    const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;
    // const payout = stake * odds;
    // const payout = Math.round(stake * odds * 10 ** 18) / 10 ** 18;
    //const offchain = `cryptosign_s${id}`;
    console.log('offchain:', offchain);
    const maker = maker_address;
    const makerOdds = maker_odds;
    // const hid = outcome_id;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = "";
    let logJson = "";
    let result = "";
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
      const {blockHash, logs, hash, error} = result;
  
      logJson = JSON.stringify(logs);
      realBlockHash = blockHash;
      if(hash == -1){
        realBlockHash = "-1";
        logJson = error.message;
        this.rollback(offchain);
      }
  
       // Send GA event tracking
      try {
        if(hash === -1) {
          GA.createBetMatchedFail({
            side,
            odds,
            amount,
            message: logJson,
          });
        } else {
          GA.createBetMatchedSuccess({ side, odds, amount });
        }
      } catch (err) {}
  
    }catch(e){

    }
    
    this.saveTransaction(offchain,CONTRACT_METHOD.SHAKE, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }


  handleContract(element, hid, i) {
    setTimeout(() => {
      console.log('Time out:');
      const { offchain, odds } = element;
      const isInit = isInitBet(element);
      console.log('Is Init Bet:', isInit);
      if (isInit) {
        this.addContract(element, hid);
      } else {
        /*
        const shakeItem = foundShakeItem(element, offchain);
        console.log('Found shake Item:', shakeItem);
        
       if(shakeItem){
        this.shakeContract(shakeItem, hid, odds);

       }
       */
      this.shakeContract(element, hid);

      }
    }, 3000 * i);
  }
  controlShake = async (list, hid) => {
    const result = null;

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      console.log('Element:', element);

      this.handleContract(element, hid, i);
    }
  };



  async cancelBet(hid, side, stake, odds, offchain){
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let logJson = "";
    let realBlockHash = "";
    let result = null;
    try{
      result = await bettinghandshake.cancelBet(hid, side, stake, odds, offchain);
      const {blockHash, logs, hash, error} = result;
  
      logJson = JSON.stringify(logs);
      realBlockHash = blockHash;
      if(hash == -1){
        realBlockHash = "-1";
        logJson = error.message;        
        store.dispatch(showAlert({
          message: <div className="text-center">{MESSAGE.ROLLBACK}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          }
        }));
      }

    }catch(err){
      realBlockHash = "-1";
      logJson = err.message;
    }
    
    this.saveTransaction(offchain,CONTRACT_METHOD.CANCEL, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  async withdraw(hid, offchain){
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let result = null;
    let logJson = "";
    let realBlockHash= "";
    try {
      result = await bettinghandshake.withdraw(hid, offchain);
      const {blockHash, logs, hash, error} = result;
      logJson = JSON.stringify(logs);
      realBlockHash = blockHash;
      if(hash == -1){
        realBlockHash = "-1";
        logJson = error.message;
        store.dispatch(showAlert({
          message: <div className="text-center">{MESSAGE.ROLLBACK}</div>,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          }
        }));
      }else {
        
        store.dispatch(showAlert({
          message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
          timeOut: 3000,
          type: 'success',
          callBack: () => {
          }
        }));
      }
    }catch(err){
      realBlockHash = "-1";
      logJson = err.message;
    }
    
    this.saveTransaction(offchain,CONTRACT_METHOD.COLLECT, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  async refund(hid, offchain){
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const result = await bettinghandshake.refund(hid, offchain);
    const {blockHash, logs, hash, error} = result;
    let logJson = JSON.stringify(logs);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = blockHash;
    if(hash == -1){
      realBlockHash = "-1";
      logJson = error.message;
      this.rollback(offchain);

    }
    this.saveTransaction(offchain,CONTRACT_METHOD.REFUND, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  //CALL API
  /*
  collect(offchain){
    console.log('Call Withdraw API');
    let params = {
      offchain: offchain
    }
    store.dispatch(collect({PATH_URL: API_URL.CRYPTOSIGN.COLLECT, METHOD:'POST',data: params,
    successFn: this.collectSuccess,
    errorFn: this.collectFailed
  }));
  }

  collectSuccess = async (successData)=>{
    console.log('collectSuccess', successData);
    const {status} = successData
    if(status){
      
      let updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
      store.dispatch(updateBettingChange(updateInfo));
      store.dispatch(showAlert({
        message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        }
      }));
    
    }
  }
  collectFailed = (error) => {
    console.log('collectFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      }));
    }

  }
  */
  saveTransaction(offchain,contractMethod, chainId, hash, contractAddress, payload){
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
    console.log('saveTransactionSuccess', successData);
  }
  saveTransactionFailed = (error) => {
    console.log('saveTransactionSuccess', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message: message,
        timeOut: 5000,
        type: 'danger',
        
      }));
    }

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
    console.log('rollbackSuccess', successData);
    store.dispatch(showAlert({
      message: MESSAGE.ROLLBACK,
      timeOut: 5000,
      type: 'danger',

    }));
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message: message,
        timeOut: 5000,
        type: 'danger',
        
      }));
    }
    
  }
}

export default BetHandshakeHandler;

