import axios from 'axios';
import Web3 from 'web3';

export const getGasPrice = () => {
  axios
    .get('https://ethgasstation.info/json/ethgasAPI.json')
    .then(({ data }) => {
      window.gasPrice = (data.average / 10).toString(); // 10 gwei units - so divide by 10 to get in gwei
    })
    .catch((error) => {
      console.log('Failed to get data from ethGasStation: ', error);
      axios
        .get(`https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${process.env.apikeyEtherscan}`)
        .then(({ data }) => {
          const gasPrice = Number(data.result).toString();
          window.gasPrice = Web3.utils.fromWei(gasPrice, 'gwei');
        });
    });
};
