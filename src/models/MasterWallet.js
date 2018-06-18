
import localStore from '@/services/localStore';
import { Bitcoin } from '@/models/Bitcoin.js';
import { BitcoinTestnet } from '@/models/BitcoinTestnet.js';
import { Ethereum } from '@/models/Ethereum.js';
import { Shuriken } from '@/models/Shuriken.js';
import { Wallet } from '@/models/Wallet.js';
import { APP } from '@/constants';
import { StringHelper } from '@/services/helper';

const bip39 = require('bip39');

export class MasterWallet {
    // list coin is supported, can add some more Ripple ...

    static ListCoin = {
      Ethereum, Shuriken, Bitcoin, BitcoinTestnet,
    };

    static ListCoinReward = { Ethereum, Bitcoin };

    static KEY = 'wallets';

    // Create an autonomous wallet:

    static createMasterWallets() {
      const t0 = performance.now();

      // let mnemonic = 'canal marble trend ordinary rookie until combine hire rescue cousin issue that';
      // let mnemonic = 'book trial moral hunt riot ranch yard trap tool horse good barely';

      let mnemonic = bip39.generateMnemonic(); // generates string

      const masterWallet = [];

      let defaultWallet = [1, 3];
      if (process.env.isProduction) {
        defaultWallet = [0, 1];
      }

      for (const k1 in MasterWallet.ListCoin) {
        for (const k2 in MasterWallet.ListCoin[k1].Network) {
          // check production, only get mainnet:
          if (process.env.isProduction && k2 != 'Mainnet') {
            break;
          }
          // init a wallet:
          const wallet = new MasterWallet.ListCoin[k1]();
          // set mnemonic, if not set then auto gen.
          wallet.mnemonic = mnemonic;
          wallet.network = MasterWallet.ListCoin[k1].Network[k2];
          // create address, private-key ...
          wallet.createAddressPrivatekey();

          masterWallet.push(wallet);
        }
      }

      // set default item:
      if (masterWallet.length > 1)
      {
        masterWallet[defaultWallet[0]].default = true;
        masterWallet[defaultWallet[1]].default = true;
      }

      // For Reward wallet:
      // todo: now need hide
      // mnemonic = bip39.generateMnemonic();
      // for (const k in MasterWallet.ListCoinReward) {
      //   const wallet = new MasterWallet.ListCoinReward[k]();
      //   wallet.mnemonic = mnemonic;
      //   wallet.network = MasterWallet.ListCoinReward[k].Network.Mainnet;
      //   wallet.createAddressPrivatekey();
      //   wallet.isReward = true;
      //   masterWallet.push(wallet);
      // }

      // Save to local store:
      MasterWallet.UpdateLocalStore(masterWallet);

      const t1 = performance.now();

      MasterWallet.log(`Call to createMasterWallet took ${t1 - t0} milliseconds.`);

      return masterWallet;
    }

    // return list coin temp for create/import:
    static getListCoinTemp() {
      const tempWallet = [];
      for (const k1 in MasterWallet.ListCoin) {
        for (const k2 in MasterWallet.ListCoin[k1].Network) {
          // check production, only get mainnet:
          if (process.env.isProduction && k2 != 'Mainnet') {
            break;
          }
          const wallet = new MasterWallet.ListCoin[k1]();
          wallet.network = MasterWallet.ListCoin[k1].Network[k2];
          tempWallet.push(wallet);
        }
      }
      if (tempWallet.length > 0) tempWallet[0].default = true;
      return tempWallet;
    }

    // for create new wallets:
    static createNewsallets(listCoinTemp, mnemonic) {
      let isImport = false;
      if (mnemonic == '') {
        mnemonic = bip39.generateMnemonic(); // generates string
      } else if (!bip39.validateMnemonic(mnemonic)) {
        console.log('validateMnemonic mnemonic', false);
        return false;
      } else {
        isImport = true;
      }
      const masterWallet = MasterWallet.getMasterWallet();
      listCoinTemp.forEach((wallet) => {
        if (wallet.default) {
          wallet.default = false;
          wallet.mnemonic = mnemonic;
          wallet.protected = isImport;
          // create address, private-key ...
          wallet.createAddressPrivatekey();
          masterWallet.push(wallet);
        }
      });
      MasterWallet.UpdateLocalStore(masterWallet);
      return masterWallet;
    }

    static UpdateLocalStore(masterWallet) {
      console.log('masterWallet saved');
      localStore.save(MasterWallet.KEY, masterWallet);
    }

    static UpdateBalanceItem(item) {
      const wallets = MasterWallet.getMasterWallet();
      wallets.forEach((wallet) => {
        if (wallet.address == item.address && wallet.network == item.network) {
          wallet.balance = item.balance;
        }
      });
      MasterWallet.UpdateLocalStore(wallets);
    }

    // Restore wallets:
    static RestoreMasterWallet(masterWalletDataString) {
      // todo: need verify invalid data:
      localStore.save(MasterWallet.KEY, masterWalletDataString);
      const masterWallet = JSON.parse(masterWalletDataString);
      localStore.save(MasterWallet.KEY, masterWallet);
      return masterWallet;
    }

    // check not exists Shuri wallet:
    static createShuriWallet() {

      const wallets = MasterWallet.getMasterWallet();

      let hasUpdateMain = false;
      let shuriWalletMain = false;
      let hasUpdateTest = false;
      let shuriWalletTest = false;

      wallets.forEach((wallet) => {
        if (wallet.name == 'ETH' && !hasUpdateMain) {
          shuriWalletMain = JSON.parse(JSON.stringify(wallet));
          const shuriTemp = new Shuriken();
          shuriWalletMain.name = shuriTemp.name;
          shuriWalletMain.className = shuriTemp.className;
          shuriWalletMain.title = shuriTemp.title;
          shuriWalletMain.network = shuriTemp.constructor.Network.Mainnet;
          shuriWalletMain.chainId = 1;
          shuriWalletMain = MasterWallet.convertObject(shuriWalletMain);
          hasUpdateMain = true;
        }
        if (!process.env.isProduction && wallet.name == 'ETH' && !hasUpdateTest) {
          shuriWalletTest = JSON.parse(JSON.stringify(wallet));
          const shuriTemp = new Shuriken();
          shuriWalletTest.name = shuriTemp.name;
          shuriWalletTest.className = shuriTemp.className;
          shuriWalletTest.title = shuriTemp.title;
          shuriWalletTest.network = shuriTemp.constructor.Network.Rinkeby;
          shuriWalletTest.chainId = 4;
          shuriWalletTest = MasterWallet.convertObject(shuriWalletTest);
          hasUpdateTest = true;

        }
      });
      if (hasUpdateMain && shuriWalletMain) {
        wallets.push(shuriWalletMain);
        MasterWallet.UpdateLocalStore(wallets);
      }
      if (hasUpdateTest && shuriWalletTest) {
        wallets.push(shuriWalletTest);
        MasterWallet.UpdateLocalStore(wallets);
      }

      return wallets;
    }

    // for force set default mainnet:
    static forceSetDefaultMainnet(wallets) {
      const listWallet = [];
      let isDefaultBTC = false;
      let isDefaultETH = false;
      if (process.env.isProduction) {
        wallets.forEach((wallet) => {
          if (wallet.getNetworkName() == 'Mainnet') {
            if (wallet.default) {
              if (wallet.name == 'ETH') {
                isDefaultETH = true;
              }
              if (wallet.name == 'BTC') {
                isDefaultBTC = true;
              }
            }
            listWallet.push(wallet);
          }
        });
        if (!isDefaultBTC || !isDefaultETH) {
          listWallet.forEach((wallet) => {
            if (wallet.name == 'BTC' && !wallet.isReward) {
              if (!isDefaultBTC) {
                wallet.default = true;
                isDefaultBTC = true;
              }
            }
            if (wallet.name == 'ETH' && !wallet.isReward) {
              if (!isDefaultETH) {
                wallet.default = true;
                isDefaultETH = true;
              }
            }
          });
        }
        MasterWallet.UpdateLocalStore(listWallet);
        return listWallet;
      }
      return wallets;
    }

    // Get list wallet from store local:
    static getMasterWallet() {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const listWallet = [];
      let hasTestnet = false;

      wallets.forEach((walletJson) => {
        const wallet = MasterWallet.convertObject(walletJson);
        if (wallet != false) {
          if (wallet.getNetworkName() !== 'Mainnet') {
            hasTestnet = true;
          }
          listWallet.push(wallet);
        }
      });

      if (hasTestnet) {
        return MasterWallet.forceSetDefaultMainnet(listWallet);
      }

      return listWallet;
    }

    // Get list wallet from store local:
    static getWalletDefault(coinName = '') {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const BreakException = {};
      try {
        if (coinName != '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.default && coinName == walletJson.name) {
              if (process.env.isProduction) {
                if (walletJson.network === MasterWallet.ListCoin[walletJson.className].Network.Mainnet) {
                  wallet = MasterWallet.convertObject(walletJson);
                }
              } else
                {wallet = MasterWallet.convertObject(walletJson);}
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.default) {
            if (process.env.isProduction) {
              if (walletJson.network === MasterWallet.ListCoin[walletJson.className].Network.Mainnet) {
                lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
              }
            } else
              {lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);}
          }
        });
        return lstDefault;
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return false;
    }

  // Get list reward wallet from store local:
    static getRewardWalletDefault(coinName = '') {
      const wallets = localStore.get(MasterWallet.KEY);

      if (wallets == false) return false;

      const BreakException = {};
      try {
        if (coinName != '') {
          let wallet = false;
          wallets.forEach((walletJson) => {
            if (walletJson.isReward && coinName == walletJson.name) {
              wallet = MasterWallet.convertObject(walletJson);
            }
          });
          return wallet;
        }

        const lstDefault = {};

        wallets.forEach((walletJson) => {
          if (!lstDefault.hasOwnProperty(walletJson.name)) { lstDefault[walletJson.name] = null; }
          if (walletJson.isReward) {
            lstDefault[walletJson.name] = MasterWallet.convertObject(walletJson);
          }
        });
        return lstDefault;
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      return false;
    }

    static convertObject(walletJson) {
      try {
        const wallet = new MasterWallet.ListCoin[walletJson.className]();
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
      } catch (e) {
        return false;
      }
    }

    static IsJsonString(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    }
    static restoreWallets(dataString) {
      try {
        const jsonData = MasterWallet.IsJsonString(dataString);
        console.log('jsonData', jsonData);
        if (jsonData !== false) {
          if (Array.isArray(jsonData)) {
            console.log('isArray');
            const listWallet = [];
            jsonData.forEach((walletJson) => {
              const wallet = MasterWallet.convertObject(walletJson);
              console.log('wallet=>', wallet);
              if (wallet === false) {
                throw BreakException;
              }
              listWallet.push(wallet);
            });
            MasterWallet.UpdateLocalStore(listWallet);
            return listWallet;
          }
        }
      } catch (e) {
        console.log('Wallet is invaild', e);
      }
      return false;
    }

    static getShurikenWalletJson() {
      const wallets = MasterWallet.getMasterWallet();
      const shuries = wallets.filter(wallet => wallet.name === 'SHURI');
      if (shuries.length) {
        const {
          address, name, network, chainId,
        } = shuries[0];
        return JSON.stringify({
          ETH: {
            address, name, network, chainId,
          },
        });
      }
      return false;
    }

    static getRewardWalletJson() {
      const walletReward = MasterWallet.getMasterWallet();
      const reward_wallet_string = {};
      walletReward.forEach((reward_wallet) => {
        if (reward_wallet.isReward)
          {reward_wallet_string[reward_wallet.name] = { address: reward_wallet.address, name: reward_wallet.name, network: reward_wallet.network, chainId: reward_wallet.chainId};}
      });
      return JSON.stringify(reward_wallet_string);
    }

    static log(data, key = MasterWallet.KEY) {
      console.log(`%c ${StringHelper.format('{0}: ', key)}`, 'background: #222; color: #bada55', data);
    }
}

export default { MasterWallet };
