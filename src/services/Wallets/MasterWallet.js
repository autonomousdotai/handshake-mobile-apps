
import localStore from '@/services/localStore';
import { Bitcoin } from '@/services/Wallets/Bitcoin.js';
import { BitcoinTestnet } from '@/services/Wallets/BitcoinTestnet.js';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Constant } from '@/services/Wallets/Constant';

import { APP, BASE_API } from '@/constants';
import Helper from '@/services/helper';
import Neuron from '@/services/neuron/Neutron';
import axios from 'axios';

const bip39 = require('bip39');

const CryptoJS = require('crypto-js');

export class MasterWallet {
    // list coin is supported, can add some more Ripple ...
    static ListDefaultCoin = {
      Ethereum, Bitcoin, BitcoinTestnet, Constant
    };

    static ListCoin = {
      Ethereum, Bitcoin, BitcoinTestnet, Constant
    };

    static neutronMainNet = new Neuron(1);
    static neutronTestNet = new Neuron(4);

    static KEY = 'wallets';

    static QRCODE_TYPE = {"UNKNOW": 0, "URL": 1, "REDEEM": 2, "TRANSFER": 3, "CRYPTO_ADDRESS": 4};

    // Create an autonomous wallet:

    static createMasterWallets() {
      const t0 = performance.now();

      // let mnemonic = 'canal marble trend ordinary rookie until combine hire rescue cousin issue that';
      // let mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';

      const mnemonic = bip39.generateMnemonic(); // generates string

      const masterWallet = [];

      let defaultWallet = [1, 3];// eth main, eth test, btc main, btc test => local web
      if (process.env.isLive) { // // eth main, eth test, btc main, btc test => live web
        defaultWallet = [0, 1];
      }
      if (process.env.isDojo) { // eth test, shuri test, btc test => dojo web
        defaultWallet = [0, 2];
      }

      for (const k1 in MasterWallet.ListDefaultCoin) {
        for (const k2 in MasterWallet.ListDefaultCoin[k1].Network) {
          // check production, only get mainnet:
          if (process.env.isLive && k2 != 'Mainnet') {
            break;
          }
          if (!process.env.isLive && process.env.isDojo && k2 == 'Mainnet') {
            continue;
          }
          // init a wallet:
          const wallet = new MasterWallet.ListDefaultCoin[k1]();
          // set mnemonic, if not set then auto gen.
          wallet.mnemonic = mnemonic;
          wallet.network = MasterWallet.ListDefaultCoin[k1].Network[k2];
          // create address, private-key ...
          wallet.createAddressPrivatekey();

          masterWallet.push(wallet);
        }
      }

      // set default item:
      console.log('defaultWallet', defaultWallet, masterWallet);
      for(let i = 0; i < defaultWallet.length; i++){
        console.log('defaultWallet[i]', defaultWallet[i], masterWallet);
        masterWallet[defaultWallet[i]].default = true;
      }

      // Save to local store:
      MasterWallet.UpdateLocalStore(masterWallet);

      const t1 = performance.now();

      MasterWallet.log(`Call to createMasterWallet took ${t1 - t0} milliseconds.`);

      return masterWallet;
    }

    // return list coin temp for create/import:
    static getListCoinTemp() {
      const tempWallet = [];
      for (const k1 in MasterWallet.ListDefaultCoin) {
        for (const k2 in MasterWallet.ListDefaultCoin[k1].Network) {
          // check production, only get mainnet:
          if (process.env.isLive && k2 != 'Mainnet') {
            break;
          }
          const wallet = new MasterWallet.ListDefaultCoin[k1]();
          wallet.network = MasterWallet.ListCoin[k1].Network[k2];
          tempWallet.push(wallet);
        }
      }
      if (tempWallet.length > 0) tempWallet[0].default = true;
      return tempWallet;
    }

    // for create new wallets:
    static createNewsallets(listCoinTemp, mnemonic) {
      let isImport = false;
      if (mnemonic == '') {
        mnemonic = bip39.generateMnemonic(); // generates string
      } else if (!bip39.validateMnemonic(mnemonic)) {
        return false;
      } else {
        isImport = true;
      }
      const masterWallet = MasterWallet.getMasterWallet();
      listCoinTemp.forEach((wallet) => {
        if (wallet.default) {
          wallet.default = false;
          wallet.mnemonic = mnemonic;
          wallet.protected = isImport;
          // create address, private-key ...
          wallet.createAddressPrivatekey();
          masterWallet.push(wallet);
        }
      });
      MasterWallet.UpdateLocalStore(masterWallet, true);
      return masterWallet;
    }

    static AddToken(newToken) {
      const wallets = MasterWallet.getWalletDataLocalString();
      if (wallets === false) return false;
      wallets.push(JSON.parse(JSON.stringify(newToken)));
      MasterWallet.UpdateLocalStore(wallets, true);
      return true;
    }

    static UpdateLocalStore(masterWallet, sync = false) {

      // encrypt wallet:
      let encryptWalletData = MasterWallet.encrypt(JSON.stringify(masterWallet));

      localStore.save(MasterWallet.KEY, encryptWalletData);

      // call api update list address:
      if (sync){
        MasterWallet.SyncWalletAddress();
      }

    }

    static getListWalletAddressJson(){

      const masterWallet = MasterWallet.getWalletDataLocalString();

        let listAddresses = [];

        masterWallet.forEach((wallet) => {
          if (listAddresses.indexOf(wallet.address) === -1){
            listAddresses.push(wallet.address);
          }
        });
        return JSON.stringify(listAddresses);
    }

    static SyncWalletAddress(){
      try{

        let listAddresses = MasterWallet.getListWalletAddressJson();

        console.log("update wallet addresses ...");
        const token = localStore.get(APP.AUTH_TOKEN);

        const defaultHeaders = {
          'Content-Type': 'application/json', Payload: token
        };

        let data = new FormData();
        data.append ("wallet_addresses", listAddresses);

        let endpoint = 'user/profile';

        let response = axios({
          method: 'POST',
          timeout: BASE_API.TIMEOUT,
          headers: defaultHeaders,
          url: `${BASE_API.BASE_URL}/${endpoint}`,
          data
        });
        console.log("update wallet response ", response );
      }

      catch (error) {
        console.error('callAPI: ', error);
      }
    }

    static NotifyUserTransfer(from_address, to_address) {
      let data = {
        "notification":{
            "title":"Nofification",
            "body":"You have a transaction from " + from_address,
            "click_action":"https://ninja.org/wallet",
        },
        "data": {
            "action": "transfer",
            "data": {"to_address": to_address, "from_address": from_address},
        },
        "to": to_address,
      }

      const token = localStore.get(APP.AUTH_TOKEN);

      const defaultHeaders = {
        'Content-Type': 'application/json', Payload: token
      };

      let endpoint = "user/notification";

      let response = axios.post(
        `${BASE_API.BASE_URL}/${endpoint}`,
         JSON.stringify(data),
        {headers: defaultHeaders}
      )

      console.log("called NotifyUserTransfer ", response );
    }

    static UpdateBalanceItem(item) {
      const wallets = MasterWallet.getMasterWallet();
      wallets.forEach((wallet) => {
        if (wallet.address === item.address && wallet.network === item.network) {
          wallet.balance = item.balance;
        }
      });
      MasterWallet.UpdateLocalStore(wallets);
    }

    // get wallet data string local store:
    static getWalletDataLocalString(){

      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      // check is json or encrypt data:
      if (typeof(wallets) !== 'object'){
        let walletDecrypt = MasterWallet.decrypt(wallets);
        let walletsObject = MasterWallet.IsJsonString(walletDecrypt);
        if (walletsObject !== false){
          return walletsObject;
        }
      }
      else{
        // backup:
        try {localStore.save('backup', CryptoJS.AES.encrypt(JSON.stringify(wallets), 'backup').toString());} catch (e){console.log(e);};
        MasterWallet.UpdateLocalStore(wallets);
      }

      return wallets;
    }

    // Get list wallet from store local:
    static getMasterWallet() {

      let wallets = MasterWallet.getWalletDataLocalString();

      if (wallets == false) return false;

      const listWallet = [];
      wallets.forEach((walletJson) => {
        const wallet = MasterWallet.convertObject(walletJson);
        if (wallet != false) {
          listWallet.push(wallet);
        }
      });
      return listWallet;
    }

    static getWallets(coinName = '') {
      const wallets = MasterWallet.getWalletDataLocalString();

      if (wallets === false) return false;

      const BreakException = {};
      let result = [];
      try {
        if (coinName !== '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (coinName === walletJson.name) {
              if (process.env.isLive) {
                if (walletJson.network === MasterWallet.ListCoin[walletJson.className].Network.Mainnet) {
                  result.push(MasterWallet.convertObject(walletJson));
                }
              } else {
                result.push(MasterWallet.convertObject(walletJson));
              }
            }
          });
        }
        else {
          result.push(MasterWallet.convertObject(walletJson));
        }
      } catch (e) {
        if (e !== BreakException) throw e;
      }

      return result;
    }

    // Get list wallet from store local:
    static getWalletDefault(coinName = '') {
      const wallets = MasterWallet.getWalletDataLocalString();

      if (wallets === false) return false;

      const BreakException = {};
      try {
        if (coinName !== '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.default && coinName === walletJson.name) {
              if (process.env.isLive) {
                if (walletJson.network === MasterWallet.ListCoin[walletJson.className].Network.Mainnet) {
                  wallet = MasterWallet.convertObject(walletJson);
                }
              } else { wallet = MasterWallet.convertObject(walletJson); }
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.default) {
            if (process.env.isLive) {
              if (walletJson.network === MasterWallet.ListCoin[walletJson.className].Network.Mainnet) {
                lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
              }
            } else { lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson); }
          }
        });
        return lstDefault;
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return false;
    }

    static convertObject(walletJson) {
      try {
        const wallet = new MasterWallet.ListCoin[walletJson.className]();
        wallet.mnemonic = walletJson.mnemonic;
        wallet.address = walletJson.address;
        wallet.privateKey = walletJson.privateKey;
        wallet.coinType = walletJson.coinType;
        wallet.default = walletJson.default;
        wallet.balance = walletJson.balance;
        wallet.network = walletJson.network;
        wallet.name = walletJson.name;
        wallet.title = walletJson.title;
        wallet.protected = walletJson.protected;
        wallet.isReward = walletJson.isReward;
        wallet.chainId = walletJson.chainId;
        if (walletJson.isToken) wallet.isToken = walletJson.isToken;
        if (walletJson.decimals) wallet.decimals = walletJson.decimals;
        if (walletJson.contractAddress) wallet.contractAddress = walletJson.contractAddress;
        if (walletJson.customToken) wallet.customToken = walletJson.customToken;
        if (walletJson.isCollectibles) wallet.isCollectibles = walletJson.isCollectibles;
        if (walletJson.secret) wallet.secret = walletJson.secret;
        if (walletJson.publicKey) wallet.publicKey = walletJson.publicKey;
        if (walletJson.hideBalance) wallet.hideBalance = walletJson.hideBalance;

        return wallet;
      } catch (e) {
        return false;
      }
    }

    static IsJsonString(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    }
    static restoreWallets(dataString) {
      try {
        let jsonData = MasterWallet.IsJsonString(dataString);

        // check encrypt if not json ?
        if (jsonData === false){
          jsonData = MasterWallet.decrypt(dataString);
          if (jsonData !== false){
            jsonData = MasterWallet.IsJsonString(jsonData);
          }
        }

        let auth_token = false;
        let wallets = false;
        let chat_encryption_keypair = false;

        if (jsonData !== false) {
          if (jsonData.hasOwnProperty('auth_token')) {
            auth_token = jsonData.auth_token;
          }
          if (jsonData.hasOwnProperty('wallets')) {
            wallets = jsonData.wallets;
          } else {
            // for old user without keys auth_token + chat_encryption_keypair
            wallets = jsonData;
          }

          if (Array.isArray(wallets)) {
            const listWallet = [];
            wallets.forEach((walletJson) => {
              const wallet = MasterWallet.convertObject(walletJson);
              if (wallet) {
                listWallet.push(wallet);
                //throw BreakException;
              }
            });
            MasterWallet.UpdateLocalStore(listWallet);
            if (auth_token !== false) {
              localStore.save(APP.AUTH_TOKEN, auth_token);
            }
            if (chat_encryption_keypair !== false){
              localStore.save(APP.CHAT_ENCRYPTION_KEYPAIR, chat_encryption_keypair);
            }
            return listWallet;
          }
        }
      } catch (e) {
        //console.log('Wallet is invaild', e);
      }
      return false;
    }

    static log(data, key = MasterWallet.KEY) {
      //console.log(`%c ${StringHelper.format('{0}: ', key)}`, 'background: #222; color: #bada55', data);
    }
    static encrypt(message) {
      try{
        let WALLET_SECRET_KEY = process.env.WALLET_SECRET_KEY;
        let ciphertext = CryptoJS.AES.encrypt(message, WALLET_SECRET_KEY);
        return ciphertext.toString();
      }
      catch (e){
        console.log("encrypt", e);
        return false;
      }
    }
    static decrypt(ciphertext) {
      try{
        let WALLET_SECRET_KEY = process.env.WALLET_SECRET_KEY;
        let bytes = CryptoJS.AES.decrypt(ciphertext, WALLET_SECRET_KEY);
        let plaintext = bytes.toString(CryptoJS.enc.Utf8);
        return plaintext;
      }
      catch (e){
        console.log("decrypt", e);
        return false;
      }
    }
    /**
    * Get coin type from its wallet address
    * @param {String} address
    */
    static getCoinSymbolFromAddress(address){
      for (const i in MasterWallet.ListDefaultCoin){
        let wallet = new MasterWallet.ListDefaultCoin[i]();
        if (wallet.checkAddressValid(address) === true){
          return {"symbol": wallet.name, "name": wallet.title, "address": address, "amount": ""};
        }
      }
      return false;
    }

    static getQRCodeDetail(text){
      // 0: any data ...
      // 1: website:
      // 2: ninja-redeem:code?value=25
      // 3: <coin-title>:<address>?amount=<number>
      // 4: <address-only>

      let keyRedem = "ninja-redeem";

      function url(text) {
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        if(!urlRegex.test(text)) {
          return false;
        } else {
          let match = text.match(urlRegex);
          return match[0];
        }
      }
      function redeem(text){
        if (text.includes(keyRedem)){
          let dataSplit = text.split('?');
          let code = dataSplit[0].split(':')[1];
          let param = Helper.getQueryStrings("?"+dataSplit[1]);
          return {"code": code, "value" : param['value']};
        }
        return false;
      }
      function transfer(text){
        let dataSplit = text.split('?');
        for (const i in MasterWallet.ListDefaultCoin){
          let wallet = new MasterWallet.ListDefaultCoin[i]();
          if (dataSplit[0].toLowerCase().includes((wallet.title.replace(/\s/g,'')).toLowerCase())){
            let listData = dataSplit[0].split(':');
            if(listData.length > 0){
              let address = listData[1];
              let param = Helper.getQueryStrings("?"+dataSplit[1]);
              return {"symbol": wallet.name, "address": address, "amount" : param['amount']};
            }
            else{
              return false;
            }
          }
        }
        return false;
      }
      function address(text){
        return MasterWallet.getCoinSymbolFromAddress(text);
      }
      // let check:
      // web:
      let result = {"type": MasterWallet.QRCODE_TYPE.UNKNOW, "data": {}, text: text};

      let tmpResult = url(text);
      if (tmpResult != false){
        result.type = MasterWallet.QRCODE_TYPE.URL;
        result.data = tmpResult;
        return result;
      }

      tmpResult = redeem(text);

      if (tmpResult != false){
        result.type = MasterWallet.QRCODE_TYPE.REDEEM;
        result.data = tmpResult;
        return result;
      }

      tmpResult = transfer(text);
      if (tmpResult != false){
        result.type = MasterWallet.QRCODE_TYPE.TRANSFER;
        result.data = tmpResult;
        return result;
      }
      tmpResult = address(text);
      if (tmpResult != false){
        result.type = MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS;
        result.data = tmpResult;
        return result;
      }
      return result;
    }

    static readContacts(){
      let listContact = localStore.get("contacts");
      if (listContact == false) return [];
      return listContact;
    }
    static removeContact(contact){
      let listContact = localStore.get("contacts");
      let listTemp = [];
      if (listContact.length > 0){
        listContact.forEach((cont) => {
          if (cont.name != contact.name){
            listTemp.push(cont);
          }
        });
      }
      localStore.save("contacts", listTemp);
      return listTemp;
    }
    static addContact(contact){
      console.log("contact need add", contact);
      let flag = false;
      let listContact = MasterWallet.readContacts();
      if (listContact.length > 0){
        for (var i = 0; i < listContact.length; i ++){
          let cont = listContact[i];
          if ((contact.email !== "" && cont.email === contact.email) || cont.name === contact.name){
            flag = true;
            break;
          }
          else {
            for (var j = 0; j < listContact[i].addresses.length; j ++){
              if (contact.addresses.filter(item => item.address === listContact[i].addresses[j].address).length > 0){
                flag = true;
                break;
                break;
              }
            }
          };
        }
      }
      else{
        listContact = [];
      }
      if (flag){
        return "Entry already exist";
      }

      listContact.push(contact);

      localStore.save("contacts", listContact);
      return true;
    }

    static updateContact(contact, oldName){
      console.log("contact need update", contact, "oldName", oldName);
      let flag = false;
      let listContact = MasterWallet.readContacts();
      let listContactTmp = [];

      for (var i = 0; i < listContact.length; i ++){
        let cont = listContact[i];
        if (listContact[i].name === oldName ){
          cont = contact
        }
        listContactTmp.push(cont);
      }

      localStore.save("contacts", listContactTmp);
      return true;
    }

}

export default { MasterWallet };
