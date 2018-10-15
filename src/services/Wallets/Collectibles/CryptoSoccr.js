import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CryptoSoccr.json');

export class CryptoSoccr extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CryptoSoccr';
      this.isToken = true;
      this.contractAddress = '0xc95c0910d39d1f6cd3bd71e4b689660c18172b7b';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CryptoSoccr";
      this.name = "CryptoSoccrToken";
    }  
}

export default { CryptoSoccr };
