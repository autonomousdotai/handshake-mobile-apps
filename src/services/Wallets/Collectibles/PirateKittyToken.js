import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { TokenERC721 } from '@/services/Wallets/Collectibles/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/Wallet/PirateKittyToken.json');

export class PirateKittyToken extends TokenERC721 {

    constructor() {
      super();
      this.className = 'PirateKittyToken';
      this.isToken = true;
      this.contractAddress = '0x6e10e8f202ced220791043df74aa84615caec537';
      this.decimals = 0;
      this.customToken = true;
      this.title = "PirateKittyToken";
      this.name = "KCT";
    }  
}

export default { PirateKittyToken };
