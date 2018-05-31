
import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import {Wallet} from '@/models/Wallet.js' 

export class Bitcoin extends Wallet{
    
    static Network = {"Mainnet": 'https://insight.bitpay.com/api'}        

    constructor() {   
      super();      
      this.coinType = 0;            
      this.name = 'BTC';
      this.title = 'Bitcoin';  
      this.className = "Bitcoin";        
    }

    getShortAddress(){
      return this.address.replace(this.address.substr(12, 19), '...');
    }

    createAddressPrivatekey(){        
      
      var bitcore=  require('bitcore-lib');
      let Mnemonic = require('bitcore-mnemonic');

      let  code = new Mnemonic(this.mnemonic);

      let xpriv1 = code.toHDPrivateKey();
      
      let hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
      let hdPublicKey = hdPrivateKey.hdPublicKey;
    
      let address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.livenet);

      var derived = hdPrivateKey.derive("m/{0}'".format(this.coinType));
      var wif = derived.privateKey.toWIF();
      
      this.address = address.toString();
      this.privateKey = derived.xprivkey;        
  }
      
    async getBalance() {      
      var url = this.network + '/addr/' + this.address + '/balance';        

      var response = await axios.get(url);      
      
      if (response.status == 200){
        return await satoshi.toBitcoin(response.data);
      }
      return false;      
    }
}