import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/Cryptogs.json');

export class Cryptogs extends TokenERC721 {

    constructor() {
      super();
      this.className = 'Cryptogs';
      this.isToken = true;
      this.contractAddress = '0xefabe332d31c3982b76f8630a306c960169bd5b3';
      this.decimals = 0;
      this.customToken = true;
      this.title = "Cryptogs";
      this.name = "POGS";
    }  
}

export default { Cryptogs };
