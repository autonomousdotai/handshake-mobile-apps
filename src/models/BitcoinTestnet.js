import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import { Bitcoin } from '@/models/Bitcoin';

export class BitcoinTestnet extends Bitcoin{
    
    static Network = {"Testnet": "https://test-insight.bitpay.com/api"}        

    constructor() {   
      super();      
      this.coinType = 1;            
      this.name = 'BTC';
      this.title = 'Bitcoin';  
      this.className = "BitcoinTestnet";        
    }
    getNetwork(){
      let bitcore = require('bitcore-lib');      
      return bitcore.Networks.testnet;
    }

}