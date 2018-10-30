import Web3 from 'web3';
import configs from '../../configs';
import { getChainId } from './ninjaAccount';


let w3;
export default function initWeb3() {
  if (!w3) {
    const chainId = getChainId();
    w3 = new Web3(new Web3.providers.HttpProvider(configs.network[chainId].blockchainNetwork));
  }
  return w3;
}
