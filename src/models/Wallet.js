export class Wallet {
  constructor() {
    this.mnemonic = '';
    this.address = '';
    this.privateKey = '';
    this.coinType = '';
    this.default = false;
    this.balance = 0;
    this.network = '';
    this.name = '';
    this.title = '';
    this.protected = false;
    this.className = '';
    this.isReward = false;
    this.chainId = -1;
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(5, 32), '...');
  }
  getNetwork() {
    return this.network;
  }
  getNetworkName() {
    for (const k in this.constructor.Network) {
      if (this.constructor.Network[k] == this.network) {
        this.title = k;
        return this.title;
      }
    }
    return this.title;
  }
}

export default { Wallet };
