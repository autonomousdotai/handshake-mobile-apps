
const Web3 = require('web3');
import {Wallet} from '@/models/Wallet.js' 

export class Ethereum extends Wallet{      
    
    static Network = {"Mainnet": 'https://mainnet.infura.io/', "Rinkeby": "https://rinkeby.infura.io/"}    
    
    constructor() {   
        super();      
        this.coinType = 60;                
        this.name = 'ETH';
        this.title = 'Ethereum'; 
        this.className = "Ethereum";   
        this.default = true;         
      }

      createAddressPrivatekey(){        
        
        var hdkey = require('hdkey');
        var ethUtil = require('ethereumjs-util');
        var bip39 = require('bip39');          

        if (this.mnemonic == ''){              
            this.mnemonic = bip39.generateMnemonic(); //generates string
        }        
        const seed = bip39.mnemonicToSeed(this.mnemonic); //creates seed buffer        
        const root = hdkey.fromMasterSeed(seed);
        
        // Create address for eth ...
        let addrNode = root.derive(("m/44'/{0}'/0'/0/0").format(this.coinType));          
        
        let pubKey = ethUtil.privateToPublic(addrNode._privateKey);
        let addr = ethUtil.publicToAddress(pubKey).toString('hex');
        let address = ethUtil.toChecksumAddress(addr);
        let privateKey = addrNode._privateKey.toString('hex');

        this.address = address;
        this.privateKey = privateKey;        
    }    
    
    async getBalance() {  
        let web3 = new Web3(new Web3.providers.HttpProvider(this.network));      
        const balance = await web3.eth.getBalance(this.address);        
        return Web3.utils.fromWei(balance.toString());
      };
}