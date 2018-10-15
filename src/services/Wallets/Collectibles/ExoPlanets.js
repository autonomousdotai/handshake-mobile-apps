import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/ExoPlanets.json');

export class ExoPlanets extends TokenERC721 {

    constructor() {
      super();
      this.className = 'ExoPlanets';
      this.isToken = true;
      this.contractAddress = '0xedb94888eff041eb50c9fc92c360f66afb3b94c5';
      this.decimals = 0;
      this.customToken = true;
      this.title = "ExoPlanets";
      this.name = "XPL";
    }  
}

export default { ExoPlanets };
