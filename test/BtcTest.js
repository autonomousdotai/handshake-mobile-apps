var assert = require('assert');
var bitcore =  require('bitcore-lib');
var bitcoin = require('../src/models/Bitcoin.1.js');

const testnet = 'https://test-insight.bitpay.com/api';

describe('BTC Balance', function () {
  var btcTestnet = new bitcoin(testnet);

  describe("At the beginning", function () {
    it("should return balace when call get balance", async () => {
      // We start an 'async' function to use the 'await' keyword
      (async function(){
        try {
          var balance = await btcTestnet.getBalance("n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz");
          assert(balance)
          console.log("Balance"+balance)
        }
        catch(e) {
          console.log('e:' +e);
        }
      })()

    })

    it("should return balance = 0", async () => {
      (async function(){
        try {
          var balance = await btcTestnet.getBalance("mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M");
          assert(balance == 0.0001)
          console.log("Balance"+balance)
        }
        catch(e) {
          console.log('e:' +e);
        }
      })()

    })
  })
})




describe('Transfer BTC', function () {
  var btcTestnet = new bitcoin(testnet);

  describe("At the beginning", function () {
    it("should return tx after call transfer", async () => {
      (async function(){
        try {
          var tx = await btcTestnet.transfer("tprv8cPPkaav99EmQ4uTxgyjPFU4GCi9d7eAdTDWeDFH8qdY7Sqhd5sYj1B6cLxSpkxbba77sDcKLe9LLd5EyCHHqFKwK8S43QBpaYNioPxMpx5","mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M", 0.0001);
          assert(tx)
          console.log("transaction"+tx)
        }
        catch(e) {
          console.log('e:' +e);
        }
      })()

    })

    it("should return error when not enough money for transfer", async () => {
      (async function(){
        try {
          var tx = await btcTestnet.transfer("tprv8ccSMiuz5MfvmYHzdMbz3pjn5uW3G8zxM975sv4MxSGkvAutv54raKHiinLsxW5E4UjyfVhCz6adExCmkt7GjC41cYxbNxt5ZqyJBdJmqPA","mrPJ6rBHpJGnsLK3JGfJQjdm5vkjeAb63M", 0.0001);
          assert(tx)
          console.log("error"+tx)
        }
        catch(e) {
          console.log('e:' +e);
        }
      })()

    })

  })
})
