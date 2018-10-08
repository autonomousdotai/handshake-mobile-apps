import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/OxcertKYC.json');

export class OxcertKYC extends TokenERC721 {

    constructor() {
      super();
      this.className = 'OxcertKYC';
      this.isToken = true;
      this.contractAddress = '0xb57756d92bd170a66b4f361eafbfd13e625372c2';
      this.decimals = 0;
      this.customToken = true;
      this.title = "0xcert KYC";
      this.name = "KYC";
    }  
}

export default { OxcertKYC };
