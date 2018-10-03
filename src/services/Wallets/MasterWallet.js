
import localStore from '@/services/localStore';
import { Bitcoin } from '@/services/Wallets/Bitcoin.js';
import { BitcoinCash } from '@/services/Wallets/BitcoinCash.js';
import { BitcoinCashTestnet } from '@/services/Wallets/BitcoinCashTestnet.js';
import { BitcoinTestnet } from '@/services/Wallets/BitcoinTestnet.js';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { TokenERC20 } from '@/services/Wallets/Tokens/TokenERC20';
import { Shuriken } from '@/services/Wallets/Tokens/Shuriken.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';
import { CryptoPunks } from '@/services/Wallets/Collectibles/CryptoPunks';
import { CryptoStrikers } from '@/services/Wallets/Collectibles/CryptoStrikers';
import { CryptoKitties } from '@/services/Wallets/Collectibles/CryptoKitties';
import { Axie } from '@/services/Wallets/Collectibles/Axie';
import { BlockchainCuties } from '@/services/Wallets/Collectibles/BlockchainCuties';
import { ChibiFighters } from '@/services/Wallets/Collectibles/ChibiFighters';
import { CryptoClown } from '@/services/Wallets/Collectibles/CryptoClown';
import { CryptoCrystal } from '@/services/Wallets/Collectibles/CryptoCrystal';
import { Cryptogs } from '@/services/Wallets/Collectibles/Cryptogs';
import { CryptoHorse } from '@/services/Wallets/Collectibles/CryptoHorse';
import { CryptoSoccr } from '@/services/Wallets/Collectibles/CryptoSoccr';
import { CryptoZodiacs } from '@/services/Wallets/Collectibles/CryptoZodiacs';
import { CSCPreSaleFactory } from '@/services/Wallets/Collectibles/CSCPreSaleFactory';
import { DopeRaider } from '@/services/Wallets/Collectibles/DopeRaider';
import { Etherbots } from '@/services/Wallets/Collectibles/Etherbots';
import { EtheremonAsset } from '@/services/Wallets/Collectibles/EtheremonAsset';
import { EtherLambos } from '@/services/Wallets/Collectibles/EtherLambos';
import { ExoPlanets } from '@/services/Wallets/Collectibles/ExoPlanets';
import { Giftomon } from '@/services/Wallets/Collectibles/Giftomon';
import { HelloDog } from '@/services/Wallets/Collectibles/HelloDog';
import { OxcertKYC } from '@/services/Wallets/Collectibles/OxcertKYC';
import { PandaEarth } from '@/services/Wallets/Collectibles/PandaEarth';
import { PirateKittyToken } from '@/services/Wallets/Collectibles/PirateKittyToken';
import { UnicornGO } from '@/services/Wallets/Collectibles/UnicornGO';
import { WarToken } from '@/services/Wallets/Collectibles/WarToken';

import { APP, BASE_API } from '@/constants';
import { StringHelper } from '@/services/helper';
import Neuron from '@/services/neuron/Neutron';
import axios from 'axios';
import { merge } from 'lodash';
import { isEqual } from '@/utils/array.js';

const bip39 = require('bip39');
import qs from 'qs';
import { Ripple } from '@/services/Wallets/Ripple.js';

const CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

export class MasterWallet {
    // list coin is supported, can add some more Ripple ...
    static ListDefaultCoin = {

      Ethereum, Bitcoin, BitcoinTestnet, BitcoinCash, Ripple, BitcoinCashTestnet
    };

    static ListCoin = {
      Ethereum, Bitcoin, BitcoinTestnet, BitcoinCash, Ripple, BitcoinCashTestnet, TokenERC20, TokenERC721,
      CryptoStrikers, CryptoPunks, CryptoKitties, Axie, BlockchainCuties,
      ChibiFighters, CryptoClown, CryptoCrystal, Cryptogs, CryptoHorse,
      CryptoSoccr, CryptoZodiacs, CSCPreSaleFactory, DopeRaider, Etherbots,
      EtheremonAsset, EtherLambos, ExoPlanets,
      Giftomon, HelloDog, OxcertKYC, PandaEarth, PirateKittyToken, UnicornGO, WarToken
    };

    static ListCoinReward = { Ethereum, Bitcoin };

    static neutronMainNet = new Neuron(1);
    static neutronTestNet = new Neuron(4);

    static KEY = 'wallets';

    // Create an autonomous wallet:

    static createMasterWallets() {
      const t0 = performance.now();

      // let mnemonic = 'canal marble trend ordinary rookie until combine hire rescue cousin issue that';
      // let mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';

      const mnemonic = bip39.generateMnemonic(); // generates string

      const masterWallet = [];

      let defaultWallet = [1, 3];// eth main, eth test, btc main, btc test => local web
      if (process.env.isLive) { // // eth main, eth test, btc main, btc test => live web
        defaultWallet = [0, 1, 2, 3];
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
      for(let i = 0; i < defaultWallet.length; i++){
        masterWallet[defaultWallet[i]].default = true;
      }

      // For Reward wallet:
      // todo: now need hide
      // mnemonic = bip39.generateMnemonic();
      // for (const k in MasterWallet.ListCoinReward) {
      //   const wallet = new MasterWallet.ListCoinReward[k]();
      //   wallet.mnemonic = mnemonic;
      //   wallet.network = MasterWallet.ListCoinReward[k].Network.Mainnet;
      //   wallet.createAddressPrivatekey();
      //   wallet.isReward = true;
      //   masterWallet.push(wallet);
      // }

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

        const defaultHeaders = {
          'Content-Type': 'application/json',
        };
        let headers = {};
        const completedHeaders = merge(
          defaultHeaders,
          headers,
        );
        const token = localStore.get(APP.AUTH_TOKEN);
        completedHeaders.Payload = token;

        let data = new FormData();
        data.append ("wallet_addresses", listAddresses);

        let endpoint = 'user/profile';

        let response = axios({
          method: 'POST',
          timeout: BASE_API.TIMEOUT,
          headers: completedHeaders,
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

      const defaultHeaders = {
        'Content-Type': 'application/json',
        'Content': 'application/json',
      };
      let headers = {};
      const completedHeaders = merge(
        defaultHeaders,
        headers,
      );
      const token = 'kpWdZ3Rzk9E6m7O4clDWLGWoDOjdx08Qn_zXjY5xaxPCKYB0D14p1CRjtw==';
      completedHeaders.Payload = token;
      let endpoint = "user/notification";

      let response = axios.post(
        `${BASE_API.BASE_URL}/${endpoint}`,
         JSON.stringify(data),
        {headers: completedHeaders}
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

    // Restore wallets:
    static RestoreMasterWallet(masterWalletDataString) {
      // todo: need verify invalid data:
      localStore.save(MasterWallet.KEY, masterWalletDataString);
      const masterWallet = JSON.parse(masterWalletDataString);
      localStore.save(MasterWallet.KEY, masterWallet);
      return masterWallet;
    }

    // create shuriken if not exists:
    static createShuriWallet() {
      const wallets = MasterWallet.getMasterWallet();

      let hasUpdateMain = false;
      let shuriWalletMain = false;
      let hasUpdateTest = false;
      let shuriWalletTest = false;

      wallets.forEach((wallet) => {
        if (wallet.name == 'ETH' && !hasUpdateMain) {
          shuriWalletMain = JSON.parse(JSON.stringify(wallet));
          const shuriTemp = new Shuriken();
          shuriWalletMain.name = shuriTemp.name;
          shuriWalletMain.className = shuriTemp.className;
          shuriWalletMain.title = shuriTemp.title;
          shuriWalletMain.network = shuriTemp.constructor.Network.Mainnet;
          shuriWalletMain.chainId = 1;
          shuriWalletMain.default = false;
          shuriWalletMain = MasterWallet.convertObject(shuriWalletMain);
          hasUpdateMain = true;
        }
        if (!process.env.isLive && wallet.name == 'ETH' && !hasUpdateTest) {
          shuriWalletTest = JSON.parse(JSON.stringify(wallet));
          const shuriTemp = new Shuriken();
          shuriWalletTest.name = shuriTemp.name;
          shuriWalletTest.className = shuriTemp.className;
          shuriWalletTest.title = shuriTemp.title;
          shuriWalletTest.network = shuriTemp.constructor.Network.Rinkeby;
          shuriWalletTest.chainId = 4;
          shuriWalletTest.default = false;
          shuriWalletTest = MasterWallet.convertObject(shuriWalletTest);
          hasUpdateTest = true;
        }
      });
      if (hasUpdateMain && shuriWalletMain) {
        wallets.push(shuriWalletMain);
        MasterWallet.UpdateLocalStore(wallets);
      }
      if (hasUpdateTest && shuriWalletTest) {
        wallets.push(shuriWalletTest);
        MasterWallet.UpdateLocalStore(wallets);
      }

      return wallets;
    }

    // for force set default mainnet:
    static forceSetDefaultMainnet(wallets) {
      const listWallet = [];
      let isDefaultBTC = false;
      let isDefaultETH = false;
      if (process.env.isLive) {
        wallets.forEach((wallet) => {
          if (wallet.getNetworkName() == 'Mainnet') {
            if (wallet.default) {
              if (wallet.name == 'ETH') {
                isDefaultETH = true;
              }
              if (wallet.name == 'BTC') {
                isDefaultBTC = true;
              }
            }
            listWallet.push(wallet);
          }
        });
        if (!isDefaultBTC || !isDefaultETH) {
          listWallet.forEach((wallet) => {
            if (wallet.name == 'BTC' && !wallet.isReward) {
              if (!isDefaultBTC) {
                wallet.default = true;
                isDefaultBTC = true;
              }
            }
            if (wallet.name == 'ETH' && !wallet.isReward) {
              if (!isDefaultETH) {
                wallet.default = true;
                isDefaultETH = true;
              }
            }
          });
        }
        MasterWallet.UpdateLocalStore(listWallet);
        return listWallet;
      }
      return wallets;
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
      let hasTestnet = false;

      wallets.forEach((walletJson) => {
        const wallet = MasterWallet.convertObject(walletJson);
        if (wallet != false) {
          if (wallet.getNetworkName() !== 'Mainnet') {
            hasTestnet = true;
          }
          //remove shuri:
          if (wallet.name != "SHURI"){
            listWallet.push(wallet);
          }
        }
      });

      if (hasTestnet) {
        return MasterWallet.forceSetDefaultMainnet(listWallet);
      }

      return MasterWallet.fixBitcoinCashTestnet(listWallet);
    }

    static fixBitcoinCashTestnet(wallets){
      let walletTemps = [];
      if (process.env.isLive)
      {
        wallets.forEach((wallet) => {
          if (wallet.name =='BCH'){
            try {
              // console.log("fix bch testnet");
              let newBCHWallet = new BitcoinCash();
              newBCHWallet.mnemonic = wallet.mnemonic;
              newBCHWallet.network = BitcoinCash.Network.Mainnet;
              newBCHWallet.protected = wallet.protected;
              newBCHWallet.title = wallet.title;
              newBCHWallet.balance = wallet.balance;
              // create address, private-key ...
              newBCHWallet.createAddressPrivatekey();

              walletTemps.push(newBCHWallet);
              // console.log("success fix bch testnet");
            }
            catch (e){
              console.log(e);
              walletTemps.push(wallet);
            }
          }
          else{
            walletTemps.push(wallet);
          }
        });
        return walletTemps;
      }
      return wallets;
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

  // Get list reward wallet from store local:
    static getRewardWalletDefault(coinName = '') {
      const wallets = MasterWallet.getWalletDataLocalString();

      if (wallets === false) return false;

      const BreakException = {};
      try {
        if (coinName !== '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.isReward && coinName === walletJson.name) {
              wallet = MasterWallet.convertObject(walletJson);
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.isReward) {
            lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
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
          if (jsonData.hasOwnProperty('chat_encryption_keypair')) {
            chat_encryption_keypair = jsonData.chat_encryption_keypair;
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

    static getShuriWallet(){
      let wallets = MasterWallet.getMasterWallet();
      if (wallets !== false){
        let shuries = wallets.filter(wallet => wallet.name === 'SHURI' && !wallet.customToken);
        if (shuries.length > 0){
            return shuries[0];
        }
      }
      return false;
    }

    static convertToJsonETH(wallet){
      if (wallet !== false) {
        const {
          address, name, chainId,
        } = wallet;
        return JSON.stringify({
          ETH: {
            address, name, chainId,
          },
        });
      }
      return false;
    }

    static getShurikenWalletJson() {
      let shuries = MasterWallet.getShuriWallet();
      if (shuries !== false) {
        const {
          address, name, chainId,
        } = shuries;
        return JSON.stringify({
          ETH: {
            address, name, chainId,
          },
        });
      }
      return false;
    }

    static getRewardWalletJson() {
      const walletReward = MasterWallet.getMasterWallet();
      const reward_wallet_string = {};
      walletReward.forEach((reward_wallet) => {
        if (reward_wallet.isReward) {
          reward_wallet_string[reward_wallet.name] = {
            address: reward_wallet.address, name: reward_wallet.name, network: reward_wallet.network, chainId: reward_wallet.chainId,
          };
        }
      });
      return JSON.stringify(reward_wallet_string);
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
}

export default { MasterWallet };
