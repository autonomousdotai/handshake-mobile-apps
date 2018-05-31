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
      this.className = ''      
    }

    getShortAddress(){
      return this.address.replace(this.address.substr(12, 27), '...');
    }
    
  }
  