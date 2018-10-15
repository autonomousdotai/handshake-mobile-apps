import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/CSCPreSaleFactory.json');

export class CSCPreSaleFactory extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CSCPreSaleFactory';
      this.isToken = true;
      this.contractAddress = '0xcc9a66acf8574141b0e025202dd57649765a4be7';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CSCPF";
      this.name = "CSCPF";
    }  
}

export default { CSCPreSaleFactory };
