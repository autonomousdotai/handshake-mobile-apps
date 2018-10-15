import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CryptoHorse.json');

export class CryptoHorse extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CryptoHorse';
      this.isToken = true;
      this.contractAddress = '0xb88924408a95917c75de67fc9fbdc4af992979c3';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CryptoHorse";
      this.name = "CHC";
    }  
}

export default { CryptoHorse };
