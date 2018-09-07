import { initContract } from '@/services/eth/initContract';

// @TODO: handle options, file & address

function ninjaBaseContract(contractFile, contractAddress) {
  const options = {
    from: '',
    gasPrice: '',
    gas: '',
    data: '',
  };

  return initContract({ contractFile, contractAddress, options });
}

export function initPredictionContract() {
  const contractFile = '';
  const contractAddress = '';

  return ninjaBaseContract({ contractFile, contractAddress });
}

export function initTokenContract() {
  const contractFile = '';
  const contractAddress = '';

  return ninjaBaseContract({ contractFile, contractAddress });
}

export function initShurikenContract() {
  const contractFile = '';
  const contractAddress = '';

  return ninjaBaseContract({ contractFile, contractAddress });
}

export function contractMethodCreator(contract, contractMethodName, params) {
  return contract.methods[contractMethodName](...params).encodeABI();
}
