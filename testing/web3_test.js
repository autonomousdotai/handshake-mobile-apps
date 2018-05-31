// import required libs
const EthereumTx = require('ethereumjs-tx');
const Web3 = require('web3');

// betting contract
const bettingContract = require('@/contracts/BettingHandshake.json');

// init web3 + account
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/LLJy74SjotuIMxZJMUvf'));
const contractAddress = '0x80bd40fe184916a435a13357fda19f4eb569c3c5';
const account = '0x4f94a1392A6B48dda8F41347B15AF7B80f3c5f03'; // account address
const privateKey = Buffer.from(
  '597933799852631539767596fd1fdf6afcc5d02027702972548ed567b67f4266',
  'hex',
); // private key

// Create instance of contract based on address and abi
const contract = new web3.eth.Contract(bettingContract.abi, contractAddress, {
  from: account,
  gasLimit: 3000000, // refactor: should be estimated gas
});

// Based on which contract you have, we init which method we use.
const goal = web3.utils.toWei('0.1', 'ether');
const escrow = web3.utils.toWei('0.1', 'ether');
const deadline = '80000';
const offchain = 'cts_1';

const contractFunction = contract.methods.initBet(
  [],
  goal,
  escrow,
  parseInt(deadline),
  Web3.utils.asciiToHex(offchain),
);
const functionAbi = contractFunction.encodeABI();

let estimatedGas;
let nonce;

// Call to blockchain
// TODO: use await.
web3.eth.getTransactionCount(account).then((_nonce) => {
  nonce = _nonce.toString(16);
  console.log(`Nonce: ${nonce}`);

  // call ethereumjs-tx
  const txParams = {
    gasPrice: '0x09184e72a000',
    gasLimit: 3000000,
    to: contractAddress,
    data: functionAbi,
    from: account,
    nonce: `0x${nonce}`,
    chainId: 4,
  };

  const tx = new EthereumTx(txParams);
  tx.value = web3.utils.toHex(web3.utils.toWei('0.1', 'ether'));
  tx.sign(privateKey);

  const serializedTx = tx.serialize();

  web3.eth
    .sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
    .on('receipt', (receipt) => {
      console.log(receipt);
    });
});
