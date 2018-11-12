import initWeb3 from './initWeb3';

// @TODO: generic, move to utils
function loadABI(contractFile) {
  try {
    const abiContent = require(contractFile); // eslint-disable-line
    if (!abiContent) {
      throw new Error('ABI is empty');
    }
    return abiContent;
  } catch (e) {
    console.error('Failed to load ABI: ', e);
    return e;
  }
}

const contractInstance = {};

export function initContract({ contractFile, contractAddress, options }) {
  if (contractInstance[contractAddress]) {
    return contractInstance[contractAddress];
  }
  const web3 = initWeb3();
  const abi = loadABI(contractFile);
  contractInstance[contractAddress] = new web3.eth.Contract(abi, contractAddress, options);
  return contractInstance[contractAddress];
}
