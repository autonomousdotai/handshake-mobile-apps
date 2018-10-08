import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CryptoCrystal.json');

export class CryptoCrystal extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CryptoCrystal';
      this.isToken = true;
      this.contractAddress = '0xcfbc9103362aec4ce3089f155c2da2eea1cb7602';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CryptoCrystal";
      this.name = "CC";
    }  
}

export default { CryptoCrystal };
