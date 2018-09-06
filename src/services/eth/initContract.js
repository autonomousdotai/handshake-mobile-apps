/* eslint-disable import/no-dynamic-require,global-require */
import initWeb3 from './initWeb3';

function loadABI(contractName) {
  try {
    const filePath = `../contracts/${contractName}.json`;
    const abiContent = require(filePath);
    if (!abiContent) {
      throw ('Cannot find contract file ', filePath);
    }
    return abiContent;
  } catch (e) {
    console.error('Failed to load ABI: ', e);
    return e;
  }
}

export function initContract(contractName, contractAddress, options) {
  const web3 = initWeb3();
  const abi = loadABI(contractName);
  return new web3.eth.Contract(abi, contractAddress, options);
}

export const contractMethod = (contractName, contractAddress, options, contractMethodName, params) => {
  const contract = initContract(contractName, contractAddress, options);
  return contract.methods[contractMethodName](...params).encodeABI();
}

export const handShakeContract = (options, contractMethodName, params) => {
  const contractName = 'handshakecontract';
  const contractAddress = 'handshakeAddress';

  return contractMethod(contractName, contractAddress, options, contractMethodName, params);
}
