import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/EtherLambos.json');

export class EtherLambos extends TokenERC721 {

    constructor() {
      super();
      this.className = 'EtherLambos';
      this.isToken = true;
      this.contractAddress = '0xda9f43015749056182352e9dc6d3ee0b6293d80a';
      this.decimals = 0;
      this.customToken = true;
      this.title = "EtherLambos";
      this.name = "EL";
    }  
}

export default { EtherLambos };
