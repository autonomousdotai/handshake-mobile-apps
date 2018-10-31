const Web3js = require('web3')

class NetworkAPI {
    static get NETWORK_TYPE() {
        return {
          NONE: 0,
          MAIN: 1,
          ROPSTEN: 2,
          KOVAN: 3,
          RINKEBY: 4,
          LOCAL: 5,
          CUSTOM: 6,
        }
      }

    constructor(network){
        if (network) this.network = network
    }

    async checkTransactionStatus(txid, network){
        network = network || this.network || "https://mainnet.infura.io/"
        var web3js = new Web3js(new Web3js.providers.HttpProvider(network))
        let trans = await web3js.eth.getTransaction(txid);
        return (trans && trans.blockNumber)
    }

    async getCurrentGasPrice(network){
        network = network || this.network || "https://mainnet.infura.io/"
        var web3js = new Web3js(new Web3js.providers.HttpProvider(network))
        return await web3js.eth.getGasPrice()
    }

    getEthPrice(gasPrice) {
        return Web3js.utils.fromWei(gasPrice + '', 'ether');
    }
}

export default NetworkAPI;