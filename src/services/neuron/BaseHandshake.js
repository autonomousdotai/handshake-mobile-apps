import configs from '@/configs';
import Neuron from './index';

// const configs = configsBetting.network[4];
const TAG = 'BaseHandshake';
export default class BaseHandshake {
  constructor(chainId) {
    this.chainId = chainId;
    this.neuron = new Neuron(chainId);
    const web3 = this.neuron.getWeb3();
    this.web3 = web3;
    this.configs = configs.network[this.chainId];

    const compiled = this.neuron.getCompiled(this.contractFileNameWithoutExtension);
    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      this.configs.handshakeBettingAddress,
    );
    console.log('Hanshake instance:', this.handshakeInstance);
  }

  get contractFileNameWithoutExtension() {
    return TAG;
  }
}
