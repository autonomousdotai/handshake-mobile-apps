
import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { Bitcoin } from '@/models/Bitcoin.1';

export class BitcoinTestnet extends Bitcoin {
    static Network = { Testnet: 'https://test-insight.bitpay.com/api' }

    constructor() {
      super();
      this.coinType = 0;
      this.name = 'BTC';
      this.title = 'Bitcoin';
      this.className = 'BitcoinTestnet';
    }

    createAddressPrivatekey() {
      const bitcore = require('bitcore-lib');
      const Mnemonic = require('bitcore-mnemonic');

      const code = new Mnemonic(this.mnemonic);

      const xpriv1 = code.toHDPrivateKey();

      const hdPrivateKey = new bitcore.HDPrivateKey(xpriv1);
      const hdPublicKey = hdPrivateKey.hdPublicKey;

      const address = new bitcore.Address(hdPublicKey.publicKey, bitcore.Networks.testnet);

      this.address = address.toString();
      this.privateKey = hdPrivateKey.xprivkey;
    }
}

export default { BitcoinTestnet };
