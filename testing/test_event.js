// const services = require('./src/services');
// const neuron = require('./src/services/neuron')(4);
import Neuron from './src/services/neuron';

const neuron = new Neuron(4);
const runCryptoSign = async () => {
  const transactionHash =
    '0x20e83b9c12669c4439ba7659044145143c34e75e13574c1aa848af8024b5d9f9';
  const receipt = await neuron.getTransactionReceipt(transactionHash);
  }
};
const run = async () => {
  const transactionHash =
    '0x20e83b9c12669c4439ba7659044145143c34e75e13574c1aa848af8024b5d9f9';
  const receipt = await neuron.getTransactionReceipt(transactionHash);
  // web3.eth.getTransactionReceipt(transactionHash, (err, transaction) => {
  //   console.log(`test_event run --- = ${err}`);
  // });
  // console.log(`test_event run = ${neuron.getBalance('0x3fd23f3ba1b27a2293eebf9623acf15ac6a10128')}`);
  if (receipt && receipt.logs.length > 0) {
    const eventHex = web3.utils.sha3('__shake(uint256,uint8,uint256,uint256)');
    for (const i in receipt.logs) {
      console.log(`data ${i}`);
      console.log(eventHex);
      console.log(receipt.logs[i].topics);
      if (receipt.logs[i].topics.indexOf(eventHex) !== -1) {
        console.log(web3.eth.abi.decodeLog(
          [
            {
              indexed: false,
              name: 'hid',
              type: 'uint256',
            },
            {
              indexed: false,
              name: 'state',
              type: 'uint8',
            },
            {
              indexed: false,
              name: 'balance',
              type: 'uint256',
            },
            {
              indexed: false,
              name: 'offchain',
              type: 'uint256',
            },
          ],
          receipt.logs[i].data,
          receipt.logs[i].topics,
        ));
      }
    }
  }
};

export default run;
