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
    this.isCollectibles = false;
    this.decimals = 18;
    this.secret = '';
    this.publicKey = '',
    this.icon = 'eth.svg'
    //settings:
    this.hideBalance=false;
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 34), '...');
  }
  getShortestAddress() {
    return '...' + this.address.slice(-4);
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

  getLevelFee(){
    return false;
  }
  getBackgroundImg() {
    return StringHelper.format('{0}-{1}{2}.svg', this.className.toLowerCase(), this.getNetworkName().toLowerCase(), this.isReward ? '-reward' : '');
  }
  getCoinLogo(){
    return StringHelper.format('{0}.svg', this.name.toLowerCase());
  }
  formatNumber(value, decimal=6){
    let result = 0, count = 0;
    try {
      if(!isNaN(value)) result = Number(value);

      if (Math.floor(value) !== value)
          count = value.toString().split(".")[1].length || 0;

      if(count > decimal)
        result = Number(value).toFixed(decimal);
    }
    catch(e) {
      result = 0;
    }

    return result;
  }
}

export default { Wallet };
