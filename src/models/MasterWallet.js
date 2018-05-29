
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
        mnemonic = bip39.generateMnemonic(); //generates string        

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

            listWallet.push(wallet);
        });
        return listWallet;
        
    }

    // Get list wallet from store local:
    static getWalletDefault(){
        let wallets = localStore.get(MasterWallet.KEY);   
        
        if (wallets == false) return false;
        var wallet = false;
        var BreakException = {};
        try {
            wallets.forEach(walletJson => {
                if (walletJson.default){                
                    wallet = new MasterWallet.ListCoin[walletJson.className]();             
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
                    throw BreakException;
                }                                
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        return wallet;
        
    }

    static log(data, key=MasterWallet.KEY){
        console.log('%c ' + '{0}: '.format(key), 'background: #222; color: #bada55', data)
    }
}