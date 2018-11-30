
import Web3 from 'web3';
import { sendMsgToExtension } from './events';
import { isExtension } from './util';

const sigUtil = require('eth-sig-util');


const msg = 'Welcome to Ninja! To avoid digital ninja burglars, sign below to authenticate with Ninja.';

const changeMetamaskStatus = (status) => {
  localStorage.setItem('metamask', status ? 1 : 0);
};

const getMetamaskStatus = () => {
  console.log(window.ethereum);
  console.log(isExtension());
  if (typeof window.ethereum === 'undefined' && !isExtension()) {
    return undefined;
  }
  return localStorage.getItem('metamask') === '1';
};


const checkAccountExist = (address) => {
  const signedTokens = JSON.parse(localStorage.getItem('sign_tokens') || '[]');
  const index = signedTokens.findIndex(i => { return i.address.toUpperCase() === address.toUpperCase(); });
  if (index === -1) {
    return undefined;
  }
  return signedTokens[index];
};

const listenMetamaskEvent = () => {
  if (typeof window.ethereum !== 'undefined') {
    window.web3.currentProvider.publicConfigStore.on('update', (e) => {
      console.log(e);
      window.location.reload();
    });
  }
};

/*
  Show popup connect to Matamask
  If user connected not show popup
*/
const connectMetamask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.enable();
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('Please install MetaMask extension');
    sendMsgToExtension({
      action_key: 'enable'
    });
  }
};

/*
* params:
* * signedToken: string
* * signText: string
* * accountAddr: string
*/
const recovertSign = (params) => {
  const { signedToken, signText } = params;
  return sigUtil.recoverPersonalSignature({
    data: signText,
    sig: signedToken
  });
};

const personalSign = (signText, fromAccount) => {
  return new Promise((resolve, reject) => {
    const params = [signText, fromAccount];
    const method = 'personal_sign';
    window.web3.currentProvider.sendAsync({
      method,
      params,
      fromAccount
    }, (err, result) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      if (result.error) {
        return resolve({
          isErr: true,
          isCancel: true,
          err: result.error
        });
      }

      return resolve({
        signedToken: result.result,
        accountAddr: fromAccount
      });
    });
  });
};

const storeAccount = (account) => {
  let signedTokens = JSON.parse(localStorage.getItem('sign_tokens') || '[]');
  const index = signedTokens.findIndex(i => { return i.address.toUpperCase() === account.address.toUpperCase(); });
  if (index !== -1) {
    signedTokens.splice(index, 1);
  }
  signedTokens = signedTokens.map(i => { const item = i; item.isActive = false; return item; });
  signedTokens.push(account);
  localStorage.setItem('sign_tokens', JSON.stringify(signedTokens));
};

const loginMetaMask = async () => {
  try {
    if (!getMetamaskStatus()) {
      console.error('Web3 provider not found!');
      return Promise.reject(new Error('Web3 provider not found!'));
    }

    const web3Provider = new Web3(window.web3);

    const signText = web3Provider.utils.toHex(msg);
    const accounts = await web3Provider.eth.getAccounts();

    if (!accounts || accounts.length === 0) {
      return Promise.reject(new Error('Not found account'));
    }

    const account = checkAccountExist(accounts[0]);
    if (account) {
      const recovered = recovertSign({ signedToken: account.signedToken, signText });
      if (recovered.toUpperCase() === accounts[0].toUpperCase()) {
        return Promise.resolve(account);
      }
    }

    const newAccount = await personalSign(signText, accounts[0]);
    storeAccount(newAccount);
    return Promise.resolve(newAccount);
  } catch (e) {
    console.dir(`Extension error: `, e);
    throw e;
  }
};

export {
  loginMetaMask,
  connectMetamask,
  recovertSign,
  personalSign,
  changeMetamaskStatus,
  getMetamaskStatus,
  listenMetamaskEvent
};
