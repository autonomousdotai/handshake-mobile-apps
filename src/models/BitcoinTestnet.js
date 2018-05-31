import axios from 'axios'
import satoshi from 'satoshi-bitcoin';
import { rule } from 'postcss';
import { Bitcoin } from '@/models/Bitcoin';
let bitcore = require('bitcore-lib');

export class BitcoinTestnet extends Bitcoin{

    static Network = {"Testnet": "https://test-insight.bitpay.com/api"}

    constructor() {
      super();
      this.coinType = 1;
      this.name = 'BTC';
      this.title = 'Bitcoin';
      this.className = "BitcoinTestnet";
    }
    setDefaultNetwork(){
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
      console.log("BitcoinTestnet network: ", bitcore.Networks.defaultNetwork);
    }

}
