
const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')

import {Wallet} from '@/models/Wallet.js' 

const BN = Web3.utils.BN;

export class Ethereum extends Wallet{      
    
    static Network = {"Mainnet": 'https://mainnet.infura.io/', "Rinkeby": "https://rinkeby.infura.io/"}    
    
    constructor() {   
        super();      
        this.coinType = 60;                
        this.name = 'ETH';
        this.title = 'Ethereum'; 
        this.className = "Ethereum";         
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
        
        this.chainId = this.network == Ethereum.Network.Mainnet ? 1 : 4
    }    

    getWeb3(){
      return new Web3(new Web3.providers.HttpProvider(this.network));
    }
    
    async getBalance() {  
        let web3 = this.getWeb3();
        const balance = await web3.eth.getBalance(this.address);        
        return Web3.utils.fromWei(balance.toString());
    };
    
    async transfer(toAddress, amountToSend){    
      try {
          console.log("transfered from address:" + this.address);
          // check amount:
          var web3 = new Web3(new Web3.providers.HttpProvider(this.network));
          let balance = await web3.eth.getBalance(this.address);  
          balance = await Web3.utils.fromWei(balance.toString())          
          
          console.log('Your wallet balance is currently {0} ETH' .format(balance))

          if (balance > 0 && balance > amountToSend){

            let gasPrice = new BN(await web3.eth.getGasPrice());

            console.log('Current ETH Gas Prices (in GWEI): {0}' .format(gasPrice))

            let nonce = await web3.eth.getTransactionCount(this.address);

            let value = web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether'));

            console.log('Value to send: {0}' .format(value))

            let details = {
              "to": toAddress,
              "value": value,
              "gas": 210000,
              "gasPrice": await web3.utils.toHex(parseInt(gasPrice)), // converts the gwei price to wei
              "nonce": nonce,
              "chainId": this.chainId
            }
            console.log("send details: ", details);

            const transaction = new EthereumTx(details)
            transaction.sign( Buffer.from(this.privateKey, 'hex') )
            const serializedTransaction = transaction.serialize()
            const addr = transaction.from.toString('hex')
            console.log('Based on your private key, your wallet address is', addr)
            const transactionId = web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex') )

            const url = '{0}/tx/{1}'.format(this.network, transactionId);
            console.log(url.toString())

            return "Please allow for 30 seconds before transaction appears on Etherscan";
          }
          else{
            return "Do not have enought Wei to send"
          }
      } catch (error) {
        return error;
      }
    }
}