import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/PandaEarth.json');

export class PandaEarth extends TokenERC721 {

    constructor() {
      super();
      this.className = 'PandaEarth';
      this.isToken = true;
      this.contractAddress = '0x663e4229142a27f00bafb5d087e1e730648314c3';
      this.decimals = 0;
      this.customToken = true;
      this.title = "PandaEarth";
      this.name = "PE";
    }  
}

export default { PandaEarth };
