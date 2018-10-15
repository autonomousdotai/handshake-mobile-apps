import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/WarToken.json');

export class WarToken extends TokenERC721 {

    constructor() {
      super();
      this.className = 'WarToken';
      this.isToken = true;
      this.contractAddress = '0xda9c03dfd4d137f926c3cf6953cb951832eb08b2';
      this.decimals = 0;
      this.customToken = true;
      this.title = "WAR Token";
      this.name = "WAR";
    }  
}

export default { WarToken };
