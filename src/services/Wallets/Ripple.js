import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
const bip39 = require("bip39");
const bip32 = require("ripple-bip32");
var keypairs = require('ripple-keypairs');
var RippleAPI = require('ripple-lib').RippleAPI;


export class Ripple extends Wallet {
    static Network = { Mainnet: 'wss://s1.ripple.com:443' };

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
  
      console.log('mnemonic: ' + this.mnemonic)

      // var entropy = new Buffer(seed, 'hex');
      // console.log("entropy", entropy);
      // var secret = keypairs.generateSeed({entropy: entropy});
      // var keypair = keypairs.deriveKeypair(secret);
      // var address = keypairs.deriveAddress(keypair.publicKey);
      // var privateKey = keypair.privateKey;

      const m = bip32.fromSeedBuffer(seed)

      let masterXprv = m.toBase58();
      console.log(masterXprv)

      let derived = m.derivePath(StringHelper.format('m/44\'/{0}\'/0\'/0/0', this.coinType));

      let xprv = derived.toBase58();
      console.log(xprv)
      
      // xpub
      let xpub = derived.neutered().toBase58()
      console.log(xpub);

      // ripple address
      let address = derived.getAddress();
      console.log("address cu",address);

      // publickey / privatekey      
      const srcpair = derived.keyPair.getKeyPairs();
      srcpair.address = keypairs.deriveAddress(srcpair.publicKey);
      console.log("srcpair", srcpair);      
      console.log("srcpair address ", srcpair.address);  
      
      let privateKey = srcpair.privateKey;

      console.log('privateKey: ' + privateKey);
      // console.log('address: ' + srcpair.address);
      // console.log('secret: ' + secret);

      this.address = address;
      this.privateKey = privateKey;        

      const t1 = performance.now();
      console.log(`Call to createAddressPrivatekey for each Ripple (${address}) took ${t1 - t0} milliseconds.`);
    }
  
    async getBalance() {
      const api = new RippleAPI({server: this.network});     

      api.connect().then(() => {
        api.getBalances(this.address).then(balances => {
          console.log(JSON.stringify(balances, null, 2));
          process.exit();
        });
      });
    }    
    
    checkAddressValid(address) {
      return new Promise(function(resolve, reject) {
        if (!/^r[1-9A-HJ-NP-Za-km-z]{25,34}$/i.test(address)) {
          reject(address+ ' is not a valid address');
        } else {
          resolve();
        }
      });
    }
}

export default { Ripple };
