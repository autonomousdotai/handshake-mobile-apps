import { MasterWallet } from '@/models/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import local from '@/services/localStore';
import moment from 'moment';
import { APP } from '@/constants';
import { BET_TYPE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

export const getMessageWithCode= (code)=> {
    const keys = Object.keys(MESSAGE_SERVER).filter(k => k == code); // ["A", "B"]
    console.log('Keys:', keys);
    const value = keys.map(k => MESSAGE_SERVER[k]); // [0, 1]
    console.log('Message:', value);
    return value;
  }

  export const isSameAddress = (address) => {
    const currentAddress = getAddress();
    if(address !== currentAddress){
      return false
    }
    return true;
  }

  export const isRightNetwork = ()=> {

    const wallet = MasterWallet.getWalletDefault('ETH');
    MasterWallet.log(MasterWallet.getWalletDefault("ETH"));

    if (process.env.isProduction && !process.env.isStaging) { //Live use mainet
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        return true;
      }
    }else if (process.env.isStaging){
      return true;
    }
    return false;
  }

  export const isExpiredDate = (reportTime) => {
    //const newClosingDate = moment.unix(closingDate).add(90, 'minutes');
    console.log('Report Time:', reportTime);
    const newClosingDate = moment.unix(reportTime);
    let dayUnit = newClosingDate.utc();
    let today = moment();
    let todayUnit = today.utc();
    //console.log('Closing Unix:', closingDateUnit.format());
    console.log('New Date Unix:', dayUnit.format());
    console.log('Today Unix:', todayUnit.format());
    if(!todayUnit.isSameOrBefore(dayUnit, "miliseconds") && today){
      console.log('Expired Date');
      return true
    }
    return false;
  }

  export const getChainIdDefaultWallet = () => {
    const wallet = MasterWallet.getWalletDefault('ETH');
    const chainId = wallet.chainId;
    return chainId;
  }

  export const getId = (idOffchain) => {
    const array = idOffchain.split('_');
    if (array.length > 1) {
      const secondItem = array[1];
      if (secondItem) {
        const strId = secondItem.substring(1);
        return parseInt(strId);
      }
    }
  }

  export const getShakeOffchain = (id)=> {
    return `cryptosign_s${id}`;
  }

  export const getBalance = async () => {
    const wallet = MasterWallet.getWalletDefault('ETH');
    const balance = await wallet.getBalance();
    console.log('Balance:', balance);
    return balance;
  }
  export const getEstimateGas = async () => {
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const result = await bettinghandshake.getEstimateGas();
    return result;
  }
  export const getAddress = () => {
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    return bettinghandshake.address;
  }

  export const foundShakeList = (item, offchain) => {
    //const shakerList = [];
    const profile = local.get(APP.AUTH_PROFILE);
    const { shakers, outcome_id, from_address } = item;

    const idOffchain = getId(offchain);
    console.log('Id Offchain:', idOffchain);
    if(shakers){
      const shakersArr = JSON.parse(shakers);
      const shakedList = shakersArr.filter(element => element.shaker_id === profile.id);
      console.log('foundShakedList:', shakedList);
      return shakedList;
      /*
      if (shakedList) {
        foundShakedItem.outcome_id = outcome_id;
       foundShakedItem.from_address = from_address;
        return foundShakedItem;
      }
      */
    }
    
    return null;
  }
  export const isExistMatchBet = (list) => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      /*
      const { offchain } = element;
      const shakeItem = foundShakeItem(element, offchain);
      if(shakeItem){
        return true;
      }
      */
     const {type} = element;
     console.log('Sa element:', element);

     if(type == BET_TYPE.SHAKE){
       return true;
     }
    }
    return false;
  }

  export const isInitBet = (dict) => {
    /*
    const { shakers } = dict;
    if (shakers.length == 0) {
      const profile = local.get(APP.AUTH_PROFILE);
      console.log('User Profile Id:', profile.id);
      const { user_id } = dict;
      if (user_id && profile.id === user_id) {
        return true;
      }
    }
    return false;
    */
   const {type} = dict;
   if(type == BET_TYPE.INIT){
     return true;
   }
   return false;
  }
