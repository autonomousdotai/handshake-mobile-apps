
import Web3 from 'web3';
import { sendMsgToExtension } from './events';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');


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

      // Store signed to localStorage
      localStorage.setItem('sign_token', result.result);

      return resolve({
        signedToken: result.result,
        accountAddr: fromAccount
      });
    });
  });
};

const loginMetaMask = async (msg) => {
  try {
    await connectMetamask();
    const signedToken = localStorage.getItem('sign_token');
    const signText = ethUtil.bufferToHex(msg);

    if (!window.web3) {
      return false;
    }

    const web3Provider = new Web3(window.web3);
    const accounts = await web3Provider.eth.getAccounts();

    if (signedToken) {
      const recovered = recovertSign({ signedToken, signText });
      if (recovered.toUpperCase() === accounts[0].toUpperCase()) {
        return accounts[0];
      }
    }
    const resultSign = await personalSign(signText, accounts[0]);
    if (resultSign.isErr) {
      if (resultSign.isCancel) {
        console.log('User reject sign.');
      }
      return false;
    }
    localStorage.setItem('sign_token', JSON.stringify({ token: resultSign.signedToken, is_active: true }));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export { loginMetaMask, connectMetamask, recovertSign, personalSign };
