var bitcore =  require('bitcore-lib');
var requestPromise = require('request-promise');
var bluebird = require('bluebird');
var BigNumber = require('bignumber.js');
var satoshi = require('satoshi-bitcoin')


class Bitcoin {

  constructor(btcServer) {
    this.btcServer = btcServer;
  }

  getBalance(address) {
    var server = this.btcServer;
    return new bluebird.Promise(function (resolve, reject) {

      var url = server + '/addr/' + address + '/balance';

      requestPromise(url)
        .then(function (balance) {
          console.log("satoshi.toBitcoin(balance)", satoshi.toBitcoin(balance));
          resolve(satoshi.toBitcoin(balance));
        })
        .catch(function (err) {
          //console.log("err:"+err);
          reject(err);
        });

    })
  }


  transfer(privateKey, to, amount){
    var server = this.btcServer;
    if(server.toString().includes("test")){
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
    }

    var prKey = bitcore.HDPrivateKey(privateKey).privateKey.toString();

    var pubKey = bitcore.HDPublicKey(privateKey);

    var address = new bitcore.Address(pubKey.publicKey).toString();

    // return prKey;

    //console.log("transfered from address:" + address);

    //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    var amountBig = new BigNumber(amount.toString());
    var satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    var data = {};

    utxosForAmount(server, address,Number(amount))
      .then(function(utxos){
        data.utxos = utxos;

        return getFee(server, 4);
      })
      .then(function(fee){

        data.fee = fee;

        var transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(address)
          .fee(data.fee)
          .to(to,Number(amount))
          .sign(prKey);

        //console.log(transaction);
        var rawTx = transaction.serialize();
        return sendRawTx(server,rawTx);

      })
      .then(function(txHash){
        return txHash;
        //console.log(txHash);
      })
      .catch(function(err){
        //console.log(err);
        return err;
      });

  }
  transfer2(fromAddress, privateKey, to, amount){
    var server = this.btcServer;
    if(server.toString().includes("test")){
      bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
    }

   
    console.log("transfered from address:" + fromAddress);

    //each BTC can be split into 100,000,000 units. Each unit of bitcoin, or 0.00000001 bitcoin, is called a satoshi
    var amountBig = new BigNumber(amount.toString());
    var satoShiRate = new BigNumber('100000000');
    amount = amountBig.times(satoShiRate).toString();

    var data = {};

    utxosForAmount(server, fromAddress, Number(amount))
      .then(function(utxos){
        data.utxos = utxos;

        return getFee(server, 4);
      })
      .then(function(fee){

        data.fee = fee;

        var transaction = new bitcore.Transaction()
          .from(data.utxos)
          .change(fromAddress)
          .fee(data.fee)
          .to(to, Number(amount))
          .sign(privateKey);

        //console.log(transaction);
        var rawTx = transaction.serialize();
        
        return sendRawTx(server,rawTx);

      })
      .then(function(txHash){
        return txHash;
        //console.log(txHash);
      })
      .catch(function(err){
        //console.log(err);
        return err;
      });

  }

}


var retrieveUtxos = function (server, address) {

  return new bluebird.Promise(function (resolve, reject) {

    var url = server +'/addr/' + address + '/utxo';
    requestPromise(url)
      .then(function (utxos) {
        utxos = JSON.parse(utxos);
        utxos.sort(function(a, b) {
          return b.satoshis - a.satoshis;
        });
        resolve(utxos);
      })
      .catch(function (err) {
        reject(err);
      });

  });
}



var utxosForAmount = function (server, address, amount) {
  return new bluebird.Promise(function (resolve, reject) {
    retrieveUtxos(server, address)
      .then(function (utxos) {
        console.log("utxos:"+JSON.stringify(utxos))

        var result = findUtxos(utxos, 0, amount, []);
        console.log(result);
        if(!result)
          return reject({"error": "Insufficent Balance"});

        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

var findUtxos = function (utxos, pos, amount , result) {
  if(pos >= utxos.length)
    return null;

  var utxo = utxos[pos];
  result.push(utxo);
  //console.log("utxo.satoshis >= amount"+utxo.satoshis+":"+ amount);

  if(utxo.satoshis >= amount){ //in case of enough money
    return result;
  }
  else{
    amount = amount - utxo.satoshis;

    return findUtxos(utxos, pos+1, amount, result);
  }
}


var getFee = function (server, blocks) {
  return new bluebird.Promise(function (resolve, reject) {
    var url = server +'/utils/estimatefee?nbBlocks='+blocks;
    requestPromise(url)
      .then(function (fee) {
        fee = JSON.parse(fee);
        var txFee = bitcore.Unit.fromBTC(fee[blocks]).toSatoshis()
        console.log("data.txFee"+txFee);
        resolve(txFee);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}


var sendRawTx = function (server, rawTx) {

  console.log("rawTx", rawTx);
  let uri = server + '/tx/send';
  console.log("uri", uri);

  return new bluebird.Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      uri: uri,
      body: {
        rawtx: rawTx
      },
      json: true // Automatically stringifies the body to JSON
    };
    requestPromise(options)
      .then(function (data) {
        resolve(data);
      }).catch(function (err) {
      reject(err);
    });
  });
}


module.exports = Bitcoin



const testnet = 'https://test-insight.bitpay.com/api';

var btcTestnet = new Bitcoin(testnet);



//var tx = btcTestnet.transfer("tprv8j91JifmvkdWmQgqQKbYsXXagNc2fvqtj7TWc7ZjDJVjz49tK5dWQnLZqwGSPE5h7mzKdpbPR9PJpQawSq2aA1Jebiaj2NqS6FVPvqx3yqS","n1S1ySUAGedc6RM4tYUbhSrZXdUfv8uvYT", 0.001);
var tx2 = btcTestnet.transfer2("muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr", "86591c463220271f2d61a19f076d84a2017f850f9643675e49f07dd733f99c2d","n1S1ySUAGedc6RM4tYUbhSrZXdUfv8uvYT", 0.000001);

console.log(tx2);

// btcTestnet.getBalance('muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr')