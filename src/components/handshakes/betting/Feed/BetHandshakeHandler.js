import { MasterWallet } from '@/models/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import { APP } from '@/constants';

import local from '@/services/localStore';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
console.log('Chain Id:', chainId);

const bettinghandshake = new BettingHandshake(chainId);

export const MESSAGE = {
  BET_PROGRESSING: "Your bet is creating. Please wait",
  CREATE_BET_SUCCESSFUL: "Success! You placed a bet.",
  NOT_ENOUGH_BALANCE: "Go to wallet to request free ETH",
  CHOOSE_MATCH: "Please choose match and outcome",
  ODD_LARGE_THAN: "Please enter odds greater than 1",
  AMOUNT_VALID: "Please place a bet larger than 0.",
}

export const BET_BLOCKCHAIN_STATUS = {
    STATUS_PENDING: -1,
    STATUS_INITED: 0,
    STATUS_MAKER_UNINITED: 1,
    STATUS_SHAKER_SHAKED: 2,
    STATUS_REFUNDING: 3,
    STATUS_REFUND: 4,
    STATUS_DONE: 5,
    STATUS_BLOCKCHAIN_PENDING: -4,
}

export const ROLE = {
  INITER: 1,
  SHAKER: 2,
};

export const SIDE = {
  SUPPORT: 1,
  AGAINST: 2,
};

export const BETTING_STATUS = {
  INITED: -1,
  DRAW: 0,
  SUPPORT_WIN: 1,
  AGAINST_WIN: 2,
};

export const BETTING_STATUS_LABEL =
    {  INITING: 'Your bet is being placed', 
    CANCEL: 'Cancel this bet', "LOSE": 'Better luck next time.', 
    "WIN": `You're a winner!`,'DONE': 'Completed',
    WITHDRAW: 'Withdraw winnings', 
    CANCELLING: 'Your bet is being cancelled.',
    PROGRESSING: "Your bet is progressing.",
    WAITING_RESULT: 'Match has not yet begun', 
    REFUND: 'Refund your bet', 
    CANCELLED: 'Your bet was cancelled.', 
    REFUNDING: 'Your coin is being refunded to you.', 
    REFUNDED: 'Your coin has been refunded.'}

export class BetHandshakeHandler {
    static getStatusLabel(blockchainStatus, resultStatus, role, side, isMatch){
        var label = null;
        var strStatus = null;
        var isAction = false;
        console.log('Role:', role);
        console.log('isMatch:', isMatch);
        console.log('Blockchain status:', blockchainStatus);
        if(blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_PENDING){
          strStatus = BETTING_STATUS_LABEL.INITING;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED){
          strStatus = BETTING_STATUS_LABEL.CANCELLED;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND){
          strStatus = BETTING_STATUS_LABEL.REFUNDED;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE&&resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT){
          strStatus = BETTING_STATUS_LABEL.WIN;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE&&resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST){
          strStatus = BETTING_STATUS_LABEL.WIN;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_BLOCKCHAIN_PENDING){
          //TO DO: scan txhash and rollback after a few minutes
          strStatus = BETTING_STATUS_LABEL.PROGRESSING;
          isAction = false;
        }else if(!isMatch && role === ROLE.INITER){
            label = BETTING_STATUS_LABEL.CANCEL;
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.DRAW){
            label = BETTING_STATUS_LABEL.REFUND;
            strStatus = BETTING_STATUS_LABEL.REFUNDING;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST){
            //label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.SUPPORT){
            //label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch){
          strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
          isAction = false;
      }
        return {"title": label, "isAction": isAction, "status": strStatus};
  }

  static getId(idOffchain) {
    const array = idOffchain.split('_');
    if (array.length > 1) {
      const secondItem = array[1];
      if (secondItem) {
        const strId = secondItem.substring(1);
        console.log(strId);
        console.log(secondItem);
        return parseInt(strId);
      }
    }
  }

  static async getBalance() {
    const balance = await wallet.getBalance();
    console.log('Balance:', balance);
    return balance;
  }

  static foundShakeItemList(dict, offchain) {
    const shakerList = [];
    const profile = local.get(APP.AUTH_PROFILE);
    const { shakers, outcome_id, from_address } = dict;
    console.log('Shakers:', shakers);
    const idOffchain = BetHandshakeHandler.getId(offchain);
    const foundShakedItem = shakers.find(element => element.shaker_id === profile.id && element.id === idOffchain);
    console.log('foundShakedItem:', foundShakedItem);
    if (foundShakedItem) {
      foundShakedItem.outcome_id = outcome_id;
      foundShakedItem.from_address = from_address;
      shakerList.push(foundShakedItem);
    }
    return shakerList;
  }

  static isInitBet(dict) {
    
   const {shakers} = dict;
   if(shakers.length == 0){
     
    const profile = local.get(APP.AUTH_PROFILE);
    console.log('User Profile Id:', profile.id);
    const { user_id } = dict;
    if (user_id && profile.id === user_id) {
      return true;
    }
   }
   return false;
  }
  static addContract = async (item, hid) => {
    console.log('initContract, hid:', item, hid);

    const {
      amount, id, odds, side, outcome_id, from_address, offchain,
    } = item;
    const stake = amount;
    // const payout = stake * odds;
    const payout = Math.round(stake * odds * 10 ** 18) / 10 ** 18;
    const maker = from_address;
    // const hid = outcome_id;
    const dataBlockchain = await bettinghandshake.initBet(hid, side, stake, payout, offchain);
    return dataBlockchain;
  };

  static async shakeContract(item, hid) {
    console.log('shakeContract, hid:', item, hid);

    const {
      amount, id, odds, side, outcome_id, from_address,
    } = item;
    const stake = amount;
    // const payout = stake * odds;
    const payout = Math.round(stake * odds * 10 ** 18) / 10 ** 18;
    const offchain = `cryptosign_s${id}`;
    console.log('offchain:', offchain);
    const maker = from_address;
    // const hid = outcome_id;
    const result = await bettinghandshake.shake(
      hid,
      side,
      stake,
      payout,
      maker,
      offchain,
    );
    return result;
  }
  // static timemoutShake(shakedItem, i, hid){
  //   setTimeout(function () {
  //     console.log("Time out:", i);
  //     BetHandshakeHandler.shakeContract(shakedItem, hid);   

  //   }, 15000*i); 
  // }
  static handleContract(element, hid, i){
    setTimeout(function () {
      console.log("Time out:");
      const {offchain} = element;
      const isInitBet = BetHandshakeHandler.isInitBet(element);
      console.log('isInitBet:', isInitBet);
      if (isInitBet) {
        BetHandshakeHandler.addContract(element, hid);
      } else {
        const foundShakeList = BetHandshakeHandler.foundShakeItemList(element, offchain);
        console.log("Found shake List:", foundShakeList);
        for (var i = 0; i< foundShakeList.length; i++){
          const shakedItem = foundShakeList[i];  
          BetHandshakeHandler.shakeContract(shakedItem, hid);   

        }
              
      }   

    }, 3000*i); 
    
  }
  static controlShake = async (list, hid) => {
    const result = null;
/*
    const dataList = async (element) => {
      console.log('Element:', element);
      const isInitBet = BetHandshakeHandler.isInitBet(element);
      console.log('isInitBet:', isInitBet);
      
      if (isInitBet) {
        BetHandshakeHandler.addContract(element, hid);
      } else {
        const foundShakeList = BetHandshakeHandler.foundShakeItemList(element, offchain);
        console.log("Found shake List:", foundShakeList);
        for (var i = 0; i< foundShakeList.length; i++){
          const shakedItem = foundShakeList[i];  
          BetHandshakeHandler.timemoutShake(shakedItem, i, hid);
        }
              
      }
      
     BetHandshakeHandler.handleContract(element, hid, i);

    };
    list.forEach(dataList);
    */

    for (var i = 0; i< list.length ; i++){
      const element = list[i];
      console.log('Element:', element);
      
      BetHandshakeHandler.handleContract(element, hid, i);

    }
  };

  static async initContract(hid, side, stake, payout, offchain) {
    result = await bettinghandshake.initBet(hid, side, stake, payout, offchain);
    return result;
  }
}
