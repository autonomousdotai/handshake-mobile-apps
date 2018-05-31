
import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import { Bitcoin } from '@/models/Bitcoin.1';

export class BitcoinTestnet extends Bitcoin{
    
    static Network = {"Testnet": "https://test-insight.bitpay.com/api"}        

    constructor() {   
      super();      
      this.coinType = 0;            
      this.name = 'BTC';
      this.title = 'Bitcoin';  
      this.className = "Bitcoin";        
    }

    createAddressPrivatekey(){        
      
      var bitcore=  require('bitcore-lib');
      let Mnemonic = require('bitcore-mnemonic');

      let  code = new Mnemonic(this.mnemonic);

      let xpriv1 = code.toHDPrivateKey();
      
      let hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
      let hdPublicKey = hdPrivateKey.hdPublicKey;
    
      let address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.testnet);
      
      this.address = address.toString();
      this.privateKey = hdPrivateKey.xprivkey;        
  }
}