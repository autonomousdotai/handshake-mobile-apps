
import Web3 from 'web3';
import { sendMsgToExtension } from './events';
import { isExtension } from './util';

const { loginMetaMask } = require('./connect');


const loadContractInstance = ({ contractName, contractAddress }, fromAddress) => {
  /* eslint-disable global-require */
  let contractJSON;
  const web3 = new Web3(window.web3);
  try {
    contractJSON = require(`@/contracts/Prediction/${contractName}.json`); // eslint-disable-line import/no-dynamic-require
    if (web3.eth.contract) {
      return web3.eth.contract(contractJSON.abi).at(contractAddress);
    }
    return new web3.eth.Contract(contractJSON.abi, contractAddress, {
      from: fromAddress
    });
  } catch (e) {
    throw (contractJSON);
  }
  /* eslint-enable global-require */
};

/*
* options:
* * contractName: string
* * contractAddress: string
* * methodName: string
* * currentAddress: string
* * params: array
*/
const sendTnx = (options, fromAddress, contractInstance) => {
  return new Promise((resolve, reject) => {
    try {
      const web3 = new Web3(window.web3);
      const contractMethod = contractInstance[options.methodName] || contractInstance.methods[options.methodName];
      contractMethod(...options.params).send({
        from: fromAddress,
        gasLimit: options.gasLimit,
        chainId: options.chainId,
        value: options.value || web3.utils.toHex(web3.utils.toWei(String(options.amount), 'ether'))
      })
        .on('transactionHash', (transactionHash) => {
          console.log('transactionHash: ', transactionHash);
          return resolve({});
        })
        .on('receipt', (receipt) => {
          console.log('tnx receipt: ', receipt);
          return resolve({});
        })
        .on('error', (error) => {
          console.log(error);
          return reject(error);
        });
    } catch (e) {
      console.error(e);
      return Promise.receipt(e);
    }
  });
};

/*
* options:
* * contractName: string
* * contractAddress: string
* * methodName: string
* * currentAddress: string
* * amount
* * params: array
*/
const handleTnx = async (options) => {
  try {
    if (isExtension()) {
      sendMsgToExtension({
        action_key: 'transaction',
        data: options.data
      });
      return Promise.resolve({ is_extension: true });
    }
    const account = await loginMetaMask();
    const fromAddress = account.address;
    if (!account) {
      return Promise.reject(new Error(`Can not find Metamask's account`));
    }
    return sendTnx(options.data, fromAddress, loadContractInstance(options.data, fromAddress));
  } catch (e) {
    console.error(e);
    return Promise.receipt(e);
  }
};

export {
  handleTnx,
  sendTnx
};
