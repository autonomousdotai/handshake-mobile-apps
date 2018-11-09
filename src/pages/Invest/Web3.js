import PrivateKeyProvider from 'truffle-privatekey-provider'
import Web3 from 'web3'
import {blockchainNetworks} from '@/constants'

const network = blockchainNetworks.rinkeby.endpoint
const contractAddress = "0xdcca696b0c8c8faa8f82f2ac9380f74879867165";

export const eth_callMethod = async function(
    actionType,
    privateKey,
    method,
    ...params
){
    var privateProvider = new PrivateKeyProvider(privateKey, network);
    let account = web3.eth.accounts.privateKeyToAccount(privateKey);
    var web3 = new Web3(privateProvider)
    var contract = new web3.eth.Contract(ABI, contractAddress)

    switch(actionType){
        case 'call':
            let result =  await contract.methods[method](...params).call();
            return result
        case 'send':
            var txPromise =  contract.methods[method](...params).send({from: account});   
            return txPromise
            break;
    }
}



var ABI = []

async function test(){
    debugger
    //dynamic set provider
    web3.setProvider(privateProvider)

    let addr = (await web3.eth.getAccounts())[0]

    //get balance
    // let balance = await web3.eth.getBalance(addr)

    // SCENARIO: check transaction status
    // console.log(await web3.eth.getTransaction("0x382018d4d8ebedd30ed5aa53a5360ea21dad983ec1783cdba07a99074d9d8bbd"))


    // SCENARIO: transfer money
    // let tx = web3.eth.sendTransaction({from: addr, to: "0x88d6de616ae36e222c88f614962044d251c67574", value: web3.utils.toWei("1", "ether")})
    // tx.on('transactionHash', function(hash){
    //     console.log("tx hash:" , hash)
    // })
    // .on('receipt', function(receipt){
    //     console.log("receipt:" , receipt)
    // })
    // .on('error', console.error); // If a out of gas error, the second parameter is the receipt.

    // SCENARIO: call contract function
    // let contractAddress = "0xdcca696b0c8c8faa8f82f2ac9380f74879867165";
    // let contract = new web3.eth.Contract(ABI, contractAddress)
    // let tx =  contract.methods.setMessage("0x123").send({from: addr})
    // tx.on('transactionHash', function(hash){
    //     console.log("tx hash:" , hash)
    // })
    // .on('receipt', function(receipt){
    //     console.log("receipt:" , receipt)
    // })
    // .on('error', console.error); // If a out of gas error, the second parameter is the receipt.
}


