import Web3 from 'web3';
import configs from '../../configs';


let w3;
export default function initWeb3(chainId = 4) {
  if (!w3) {
    w3 = new Web3(new Web3.providers.HttpProvider(configs.network[chainId].blockchainNetwork));
  }
  return w3;
}
