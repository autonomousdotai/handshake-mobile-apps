import axios from 'axios';
import Web3 from 'web3';

export const getGasPrice = async () => {
  await axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(({ data }) => {
      return (data.average / 10).toString(); // 10 gwei units - so divide by 10 to get in gwei
    })
    .catch((error) => {
      console.log('Failed to get data from ethGasStation: ', error);
      axios
        .get(`https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${process.env.apikeyEtherscan}`)
        .then(({ data }) => {
          const gasPrice = Number(data.result)
            .toString();
          return Web3.utils.fromWei(gasPrice, 'gwei');
        });
    });
};

const currentTime = () => Math.floor(Date.now() / 1000); // seconds

let gasLastedTime = currentTime();
let gasLastedValue = getGasPrice();

export const gasPrice = () => {
  console.log('gasLastedTime', gasLastedTime);
  console.log('gasLastedValue', gasLastedValue);
  if ((currentTime() - gasLastedTime) > 16) {
    gasLastedValue = getGasPrice();
    gasLastedTime = currentTime();
  }
  return gasLastedValue;
}
