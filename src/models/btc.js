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
        //console.log("utxos:"+JSON.stringify(utxos))

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
        //console.log("data.txFee"+txFee);
        resolve(txFee);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}


var sendRawTx = function (server, rawTx) {
  return new bluebird.Promise(function (resolve, reject) {
    var options = {
      method: 'POST',
      uri: server + '/tx/send',
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
