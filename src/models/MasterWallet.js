
import localStore from '@/services/localStore';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {BitcoinTestnet} from '@/models/BitcoinTestnet.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import {Wallet} from '@/models/Wallet.js' 
var bip39 = require('bip39');
export class MasterWallet{

    // list coin is supported, can add some more Ripple ...
    static ListCoin = {Ethereum, Bitcoin, BitcoinTestnet};
    
    static ListCoinReward = {Ethereum, Bitcoin};
    
    static KEY = "wallets";

    // Create an autonomous wallet:
    static createMasterWallet(){        

        // let mnemonic = 'canal marble trend ordinary rookie until combine hire rescue cousin issue that';
        // let mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';
        
        var bip39 = require('bip39');        
        let mnemonic = bip39.generateMnemonic(); //generates string        

        let masterWallet = []        
        for (var k1 in MasterWallet.ListCoin){
            for (var k2 in MasterWallet.ListCoin[k1].Network){
                // init a wallet:
                let wallet = new MasterWallet.ListCoin[k1]();
                // set mnemonic, if not set then auto gen.
                wallet.mnemonic = mnemonic;  
                wallet.network = MasterWallet.ListCoin[k1].Network[k2];                           
                //create address, private-key ...
                wallet.createAddressPrivatekey();
                masterWallet.push(wallet);                
            }            
        }

        // set item 1,3 is default
        if (masterWallet.length > 0)
            masterWallet[1].default = true;
            masterWallet[3].default = true;

        // For Reward wallet:
        for (var k in MasterWallet.ListCoinReward){
            let wallet = new MasterWallet.ListCoinReward[k]();
            wallet.network = MasterWallet.ListCoinReward[k].Network.Mainnet;
            wallet.createAddressPrivatekey();
            wallet.isReward = true;
            masterWallet.push(wallet);   
        }
                
        // Save to local store:
        MasterWallet.UpdateLocalStore(masterWallet);

        return masterWallet;
    }

    static UpdateLocalStore(masterWallet){
        console.log("masterWallet saved: ", masterWallet);
        localStore.save(MasterWallet.KEY, masterWallet);
    }

    // Restore wallets:
    static RestoreMasterWallet(masterWalletDataString){
        // todo: need verify invalid data:
        localStore.save(MasterWallet.KEY, masterWalletDataString);
        let masterWallet = JSON.parse(masterWalletDataString);        
        localStore.save(MasterWallet.KEY, masterWallet);
        return masterWallet;
    }
    
    // Get list wallet from store local:
    static getMasterWallet(){
        let wallets = localStore.get(MasterWallet.KEY);   
        
        if (wallets == false) return false;
        
        let listWallet = [];     
        wallets.forEach(walletJson => {
                    
            let wallet = new MasterWallet.ListCoin[walletJson.className](); 
            
            wallet.mnemonic = walletJson.mnemonic;
            wallet.address = walletJson.address;
            wallet.privateKey = walletJson.privateKey;
            wallet.coinType = walletJson.coinType;
            wallet.default = walletJson.default;
            wallet.balance = walletJson.balance;
            wallet.network = walletJson.network;
            wallet.name = walletJson.name;
            wallet.title = walletJson.title;
            wallet.protected = walletJson.protected;
            wallet.isReward = walletJson.isReward;    
            wallet.chainId = walletJson.chainId;                                    

            listWallet.push(wallet);
        });
        return listWallet;
        
    }

    // Get list wallet from store local:
    static getWalletDefault(coinName=''){
                
        let wallets = localStore.get(MasterWallet.KEY);   
        
        if (wallets == false) return false;
        
        var BreakException = {};
        try {

            if (coinName != ''){
                var wallet = false;
                wallets.forEach(walletJson => {
                    if (walletJson.default && coinName==walletJson.name){
                        wallet = MasterWallet.convertObject(walletJson);                        
                    }
                })
                return wallet;
            }
            else{
                let lstDefault = {};
                                
                wallets.forEach(walletJson => {
                    if (!lstDefault.hasOwnProperty(walletJson.name))
                        lstDefault[walletJson.name] = null
                    if (walletJson.default){                                       
                        lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
                    }                                
                });
                return lstDefault;
            }
           
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        return false;
        
    }

    static convertObject(walletJson){
        let wallet = new MasterWallet.ListCoin[walletJson.className]();             
        wallet.mnemonic = walletJson.mnemonic;
        wallet.address = walletJson.address;
        wallet.privateKey = walletJson.privateKey;
        wallet.coinType = walletJson.coinType;
        wallet.default = walletJson.default;
        wallet.balance = walletJson.balance;
        wallet.network = walletJson.network;
        wallet.name = walletJson.name;
        wallet.title = walletJson.title;
        wallet.protected = walletJson.protected;
        wallet.isReward = walletJson.isReward;                    
        wallet.chainId = walletJson.chainId;  

        return wallet;

    }

    static log(data, key=MasterWallet.KEY){
        console.log('%c ' + '{0}: '.format(key), 'background: #222; color: #bada55', data)
    }
}