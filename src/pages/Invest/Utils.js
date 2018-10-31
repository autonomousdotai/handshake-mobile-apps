import ethereumAPI from './ethereumAPI'
import axios from 'axios'

export default {
  duration: function (timeInSecond) {
    var interval = Math.floor(timeInSecond / 31536000)
    if (interval > 1) {
      return interval + ' years'
    }
    interval = Math.floor(timeInSecond / 2592000)
    if (interval > 1) {
      return interval + ' months'
    }
    interval = Math.floor(timeInSecond / 86400)
    if (interval > 1) {
      return interval + ' days'
    }
    interval = Math.floor(timeInSecond / 3600)
    if (interval > 1) {
      return interval + ' hours'
    }
    interval = Math.floor(timeInSecond / 60)
    if (interval > 1) {
      return interval + ' minutes'
    }
    return Math.floor(timeInSecond) + ' timeInSecond'
  },
  hasMetamask: function () {
    if (typeof web3 !== 'undefined') return true
    else return false
  },
  isMainnet: function (web3) {
    return new Promise(async function (resolve) {
      if (!web3) return false
      setTimeout(() => {
        try {
          if (web3.version.network == '1') resolve(true)
          else resolve(false)
        } catch (err) {
          console.log(err)
          resolve(false)
        }
      }, 1)
    })
  },
  fetchData: async function(url, body) {
    try {
      if (body){
        return await axios.post(url, body)
      } else {
        return await axios.get(url)
      }
    } catch(err){
      console.log(err)
      return {status: 'fail', msg: err.message}
    }
  }
}




