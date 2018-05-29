
import { Wallet } from '@/models/Wallet.js';

const Web3 = require('web3');

export class Ethereum extends Wallet {
    static Network = { Mainnet: 'https://mainnet.infura.io/', Rinkeby: 'https://rinkeby.infura.io/' }

    constructor() {
      super();
      this.coinType = 60;
      this.name = 'ETH';
      this.title = 'Ethereum';
      this.className = 'Ethereum';
      this.default = true;
    }

    createAddressPrivatekey() {
      const hdkey = require('hdkey');
      const ethUtil = require('ethereumjs-util');
      const bip39 = require('bip39');

      if (this.mnemonic == '') {
        this.mnemonic = bip39.generateMnemonic(); // generates string
      }
      const seed = bip39.mnemonicToSeed(this.mnemonic); // creates seed buffer
      const root = hdkey.fromMasterSeed(seed);

      // Create address for eth ...
      const addrNode = root.derive(('m/44\'/{0}\'/0\'/0/0').format(this.coinType));

      const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
      const addr = ethUtil.publicToAddress(pubKey).toString('hex');
      const address = ethUtil.toChecksumAddress(addr);
      const privateKey = addrNode._privateKey.toString('hex');

      this.address = address;
      this.privateKey = privateKey;
    }

    async getBalance() {
      const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
      const balance = await web3.eth.getBalance(this.address);
      return Web3.utils.fromWei(balance.toString());
    }
}

export default { Ethereum };
