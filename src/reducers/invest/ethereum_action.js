import PrivateKeyProvider from 'truffle-privatekey-provider'
import Web3 from 'web3'
import {blockchainNetworks} from '@/constants'

const network = blockchainNetworks.rinkeby.endpoint
const contractAddress = "0xdcca696b0c8c8faa8f82f2ac9380f74879867165";
var contract = new web3.eth.Contract(ABI, contractAddress)

export const eth_callMethod = (
    actionType,
    aid,
    privateKey,
    method,
    ...params
) => (dispatch) => {
    var privateProvider = new PrivateKeyProvider(privateKey, network);
    let account = web3.eth.accounts.privateKeyToAccount(privateKey);
    var web3 = new Web3(privateProvider)

    switch(actionType){
        case 'call':
            let result =  await contract.methods[method](...params).call();
            dispatch({
                type: ACTIONS.ETH_RUN_RESULT,
                payload: {
                    id: aid,
                    result: result
                }
            })
            break;
        case 'send':
            var txPromise =  contract.methods[method](...params).send({from: account});   
            txPromise.on('transactionHash', function(hash){
                dispatch({
                    type: ACTIONS.ETH_PENDING,
                    payload: {
                        id: aid,
                        result: hash
                    }
                })
            })
            .on('receipt', function(receipt){
                dispatch({
                    type: ACTIONS.ETH_RUN_RESULT,
                    payload: {
                        id: aid,
                        result: receipt
                    }
                })
            })
            .on('error', function(err){
                dispatch({
                    type: ACTIONS.ETH_RUN_FAIL,
                    payload: {
                        id: aid,
                        result: err
                    }
                })
            }); // If a out of gas error, the second parameter is the receipt.         
            break;
    }
}

export const ACTIONS = {
    ETH_PENDING: "ETH_PENDING",
    ETH_RUN_RESULT: "ETH_RUN_RESULT",
    ETH_RUN_FAIL: "ETH_RUN_FAIL",
}

var ABI = []