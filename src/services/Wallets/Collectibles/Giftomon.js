import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/Giftomon.json');

export class Giftomon extends TokenERC721 {

    constructor() {
      super();
      this.className = 'Giftomon';
      this.isToken = true;
      this.contractAddress = '0xa9e3440d5c64e99c77410ec4b15746b835add59e';
      this.decimals = 0;
      this.customToken = true;
      this.title = "Giftomon";
      this.name = "GTOM";
    }  
}

export default { Giftomon };
