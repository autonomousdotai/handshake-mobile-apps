// const PrivateKeyProvider = require('truffle-privatekey-provider')
const Web3js = require('web3')
import NetworkAPI from './NetworkAPI';
const axios = require('axios')
/*
  Note:
    reserved web3 for metamask
    web3js for web3 library
*/

const hexEncode = function (str = '') {
  if (str.startsWith('0x')) return str
  var hex, i
  var result = ''
  for (i = 0; i < str.length; i++) {
    hex = str.charCodeAt(i).toString(16)
    result += ('000' + hex).slice(-4)
  }
  return '0x' + result
}

function validatingPrivateKey (s) {
  if (s.startsWith('0x')) return s
  return '0x' + s
}

class HedgeFundAPI extends NetworkAPI {
  constructor (version = 'latest', useMetamask) {
    super()
    var self = this
    this.version = version
    self.contractInfo = 0
    this.useMetamask = useMetamask
    // eliminate http
    this.contractUrl = '';
    // this.contractUrl = `http://35.198.235.226/json/hedgefund_latest.json`
    // try {
    //   new Promise(async (resolve)=>{
    //     this.contractInfo = (await axios.get(this.contractUrl)).data
    //     resolve()
    //   })
    // } catch(err){
    //   this.contractInfo = -1
    // }
  }

  async _init () {
    return new Promise((resolve, reject) => {
      var checkContractInfo = () => {
        if (this.contractInfo == -1) {
          return reject(
            new Error('Cannot get contract info ' + this.contractUrl)
          )
        }
        if (this.contractInfo == 0) return setTimeout(checkContractInfo, 1000)
        this.network = this.contractInfo.network
        this.ABI = this.contractInfo.abi
        this.contractAddress = this.contractInfo.address
        resolve()
      }
      checkContractInfo()
    })
  }

  async getMetamaskNetwork () {
    await this._init()
    if (!this.useMetamask) return HedgeFundAPI.NETWORK_TYPE.NONE
    try {
      var web3js = new Web3js(web3.currentProvider)
      return await web3js.eth.net.getId()
    } catch (err) {
      console.log('getMetamaskNetwork', err)
      return HedgeFundAPI.NETWORK_TYPE.NONE
    }
  }

  async _call (method, ...params) {
    await this._init()
    // always using infura
    var web3js = new Web3js(new Web3js.providers.HttpProvider(this.network))

    let contract = new web3js.eth.Contract(this.ABI, this.contractAddress)
    var result = contract.methods[method](...params).call()
    return result
  }

  async getAccount (privateKey) {
    await this._init()
    if (this.useMetamask) {
      // use metamask
      var web3js = new Web3js(web3.currentProvider)
      var account = (await web3js.eth.getAccounts())[0]
      if (!account) {
        throw new Error('Not login metamask!')
      }
    } else {
      // let privateProvider = new PrivateKeyProvider(privateKey, this.network)
      // var web3js = new Web3js(privateProvider)
      // var account = web3js.eth.accounts.privateKeyToAccount(
      //   validatingPrivateKey(privateKey)
      // ).address
      // if (!account) {
      //   throw new Error('Can not get public address from private key')
      // }
    }
    return account;
  }

  async _createTx (privateKey, value = '0', method, ...params) {
    await this._init()
    if (this.useMetamask) {
      // use metamask
      var web3js = new Web3js(web3.currentProvider)
      var account = (await web3js.eth.getAccounts())[0]
      if (!account) {
        throw new Error('Not login metamask!')
      }
    } else {
      // let privateProvider = new PrivateKeyProvider(privateKey, this.network)
      // var web3js = new Web3js(privateProvider)
      // var account = web3js.eth.accounts.privateKeyToAccount(
      //   validatingPrivateKey(privateKey)
      // ).address
      // if (!account) {
      //   throw new Error('Can not get public address from private key')
      // }
    }
    let contract = new web3js.eth.Contract(this.ABI, this.contractAddress)
    let sendF = contract.methods[method](...params).send.bind(this, {
      from: account,
      value: web3js.utils.toWei(value + '', 'ether'),
      gasPrice: await web3js.eth.getGasPrice(),
      nonce: await web3js.eth.getTransactionCount(account)
    })

    let estimateGasF = contract.methods
      [method](...params)
      .estimateGas.bind(this, {
        from: account,
        value: web3js.utils.toWei(value + '', 'ether')
      })

    return {
      run: sendF,
      estimateGas: estimateGasF
    }
  }

  initProject (
    privateKey = null,
    target,
    max,
    deadline,
    lifeTime,
    commission,
    pid
  ) {
    if (commission < 0 || commission > 100) {
      throw new Error('Commission should be in range [0,100]')
    }

    return this._createTx(
      privateKey,
      0,
      'initProject',
      Web3js.utils.toWei(target + '', 'ether'),
      Web3js.utils.toWei(max + '', 'ether'),
      deadline,
      lifeTime,
      commission,
      hexEncode(pid)
    )
  } // in ether //in ether

  // POST
  stopProject (privateKey = null, pid) {
    return this._createTx(privateKey, 0, 'stopProject', hexEncode(pid))
  }

  async fundProject (privateKey = null, amount, pid) {
    console.log('fundproject', privateKey, amount, pid);
    const projectInfo = await this.getProjectInfo(pid);
    console.log(projectInfo);
    return this._createTx(
      privateKey,
      amount + '',
      'fundProject',
      hexEncode(pid)
    )
  }

  withdrawFund (privateKey = null, pid) {
    return this._createTx(privateKey, 0, 'withdrawFund', hexEncode(pid))
  }

  release (privateKey = null, pid, exchange, amount, stage) {
    return this._createTx(
      privateKey,
      0,
      'release',
      hexEncode(pid),
      exchange,
      Web3js.utils.toWei(amount + '', 'ether'),
      stage
    )
  }

  retract (privateKey = null, pid, retractAmount) {
    // retract amount in ether
    return this._createTx(
      privateKey,
      0,
      'retract',
      hexEncode(pid),
      Web3js.utils.toWei(retractAmount + '', 'ether')
    )
  }

  voteStop (privateKey = null, pid, stop) {
    return this._createTx(privateKey, 0, 'voteStop', hexEncode(pid), stop)
  }

  validateState (privateKey = null, pid) {
    return this._createTx(privateKey, 0, 'validateState', hexEncode(pid))
  }

  shouldValidateState (privateKey = null, pid = '') {
    return this._call(privateKey, 'shouldValidateState', hexEncode(pid))
  }

  // GET
  getProjectSize () {
    return this._call('getProjectSize')
  }

  getProjectInfo (pid = '') {
    return this._call('getProjectInfo', hexEncode(pid))
  }

  getFundAmount (pid = '', address = '') {
    return this._call('getFundAmount', hexEncode(pid), address)
  }

  getWithdrawAmount (pid = '') {
    return this._call('getWithdrawAmount', hexEncode(pid))
  }

  getNumberOfFunder (pid = '') {
    return this._call('getNumberOfFunder', hexEncode(pid))
  }
}

// module.exports = HedgeFundAPI
export default HedgeFundAPI;
