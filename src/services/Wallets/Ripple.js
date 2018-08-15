import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
const bip39 = require("bip39");
const bip32 = require("ripple-bip32");
var keypairs = require('ripple-keypairs');
var RippleAPI = require('ripple-lib').RippleAPI;


export class Ripple extends Wallet {
    static Network = { Mainnet: 'wss://s1.ripple.com:443', Testnet: "wss://s.altnet.rippletest.net:51233" };

    constructor() {
      super();
      this.coinType = 144;
      this.name = 'XRP';
      this.title = 'Ripple';
      this.className = 'Ripple';
    }
    createAddressPrivatekey() {
      const t0 = performance.now();
  
      if (this.mnemonic == '') {
        this.mnemonic = bip39.generateMnemonic(); // generates string
      }
      const seed = bip39.mnemonicToSeed(this.mnemonic); // creates seed buffer
  
      console.log('mnemonic: ' + this.mnemonic);

      // var entropy = new Buffer(seed, 'hex');
      // console.log("entropy", entropy);
      // var secret = keypairs.generateSeed({entropy: entropy});
      // var keypair = keypairs.deriveKeypair(secret);
      // var address = keypairs.deriveAddress(keypair.publicKey);
      // var privateKey = keypair.privateKey;

      const m = bip32.fromSeedBuffer(seed)

      let masterXprv = m.toBase58();
      console.log(masterXprv)

      let derived = m.derivePath(StringHelper.format('m/44\'/{0}\'/0\'/0/0', this.coinType));//derivePath("m/0'/2147483647'", hexSeed);


      let xprv = derived.toBase58();
      console.log(xprv)
      
      // xpub
      let xpub = derived.neutered().toBase58();
      console.log(xpub);

      // ripple address
      let address = derived.getAddress();      

      // publickey / privatekey      
      const srcpair = derived.keyPair.getKeyPairs();

      console.log("srcpair---->", derived.keyPair);      
      
      let privateKey = srcpair.privateKey;

      console.log('privateKey: ' + privateKey);
      console.log('publicKey: ' + srcpair.publicKey);

      this.address = address;
      this.privateKey = privateKey;
      this.publicKey = srcpair.publicKey;

      const t1 = performance.now();
      console.log(`Call to createAddressPrivatekey for each Ripple (${address}) took ${t1 - t0} milliseconds.`);
    }
  
    async getBalance() {
      let data = await this.accountInfo();
      console.log('getAccountInfo.....', data);
      return data['xrpBalance'];
    } 
    
    accountInfo(){    
      return new Promise((resolve, reject) => {
        const api = new RippleAPI({
          server: this.network
        });
        
        api.on('error', (errorCode, errorMessage) => {
          console.log(errorCode + ': ' + errorMessage);
        });
        api.on('connected', () => {
          console.log('connected');
        });
        api.on('disconnected', (code) => {        
          console.log('disconnected, code:', code);
        });     
        api.connect().then(() => {
            api.getAccountInfo(this.address).then(data => {          
                api.disconnect();
                resolve(data);
            }).catch(err => reject);
        });
    });
      
    }
    
    checkAddressValid(address) {      
        if (!/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/i.test(address)) {
          return 'messages.ripple.error.invalid_address';
        } else {
          return true;
        }      
    }

    async transfer(toAddress, amountToSend){
      
      const instructions = {maxLedgerVersionOffset: 5};

      const payment = {
        source: {
          address: this.address,
          maxAmount: {
            value: amountToSend,
            currency: 'XRP'
          }
        },
        destination: {
          address: toAddress,
          amount: {
            value: amountToSend,
            currency: 'XRP'
          }
        }
      };
      
      return new Promise((resolve, reject) => {
        const api = new RippleAPI({
          server: this.network
        });
        
        api.on('error', (errorCode, errorMessage) => {
          console.log(errorCode + ': ' + errorMessage);
        });
        api.on('connected', () => {
          console.log('connected');
        });
        api.on('disconnected', (code) => {        
          console.log('disconnected, code:', code);
        });    
        api.connect().then(() => {   
          console.log("payment", payment);       
          api.preparePayment(this.address, payment, instructions).then(prepared => {
            console.log('Payment transaction prepared...', prepared);    
            let secret = this.secret != "" ? this.secret : null;
            const {signedTransaction} = api.sign(prepared.txJSON, secret , {}, {privateKey: this.privateKey, publicKey: this.publicKey});
            console.log('Payment transaction signed...', signedTransaction);
            api.submit(signedTransaction).then(
              quick => {
                console.log("quick", quick);
                api.disconnect();
                if (quick.resultCode == "tesSUCCESS" || quick.resultCode == "SUCCESS"){
                  resolve ({ status: 1, message: quick.resultMessage });                
                }
                else{
                  resolve({ status: 0, message: quick.resultMessage });                
                }                
              }, 
              fail => {
                console.log("fail", fail);
                api.disconnect();
                resolve({ status: 0, message: fail.resultMessage });                
              });
          }).catch(err => reject);;
        }).catch(err => reject);
      });
    }
}

export default { Ripple };
