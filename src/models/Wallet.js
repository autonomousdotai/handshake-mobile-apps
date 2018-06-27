import { StringHelper } from '@/services/helper';

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
    this.isToken = false;
    this.customToken = false;
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 34), '...');
  }
  getNetwork() {
    return this.network;
  }
  getNetworkName() {
    for (const k in this.constructor.Network) {
      if (this.constructor.Network[k] == this.network) {
        return k;
      }
    }
    return this.title;
  }
  getShortBalance() {
    return Number((parseFloat(this.balance)).toFixed(8));
  }
  getBackgroundImg(){
    return StringHelper.format("{0}-{1}{2}.svg", this.className.toLowerCase(), this.getNetworkName().toLowerCase(), this.isReward ? "-reward" : '' );    
  }
}

export default { Wallet };
