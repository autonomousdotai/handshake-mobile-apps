/*

export async function hsGetTxCount() {
  const fromAddress = await getUserAddress();
  console.log('accountAddress', fromAddress);
  return getTxCount({ fromAddress, defaultBlock: 'latest' });
}

util for params 2

// file handskhaker ETHER
var a = () => {
const contract = initContract();
return contract.methods.transfer(destAddress, sanitizeHex(transferAmount.toString(16))).encodeABI()
}

var b = () => {
return contract.methods.transfer2(destAddress, sanitizeHex(transferAmount.toString(16))).encodeABI()
}


// file handshakeToken
var contractToken = requre('./a.json')
var t = () => {
return contractToken.methods.transfer(destAddress, sanitizeHex(transferAmount.toString(16))).encodeABI()
}

var t = () => {
return contract.methods.transfer2(destAddress, sanitizeHex(transferAmount.toString(16))).encodeABI()
}


export const transferToken = async(destAddress: string, amountDecimal: number) => {
  const web3 =  Web3Provider();
  if (amountDecimal <= 0
    || destAddress === process.env.OWNER_ADDRESS
    || destAddress === '0x00') return false;
  const y: any          = process.env.DECIMALS;
  const contractAddress = process.env.CONTRACT_ADDRESSS;
  const ownerAddress    = process.env.OWNER_ADDRESS;
  const priKey          = process.env.PRI_KEY;
  const privKey         = new Buffer(priKey, 'hex');
  const transferAmount  = (new BigNumber(`${amountDecimal}`)).times(10 ** y);
  const gasPriceWei     = await getGasPrice(true);
  const nonce           = await getNonce(ownerAddress);
  const contract        = new web3.eth.Contract(NoahABI, contractAddress, {
    from: ownerAddress
  });
  const balance         = await contract.methods.balanceOf(ownerAddress).call();
  if (transferAmount.isGreaterThan(balance)) return false;
  const rawTransaction = {
    'from'    : ownerAddress,
    'nonce'   : '0x' + nonce.toString(16),
    'gasPrice': web3.utils.toHex(gasPriceWei),
    'gasLimit': web3.utils.toHex(parseInt(process.env.GAS_LIMIT)),
    'to'      : contractAddress,
    'value'   : '0x0',
    'data'    : contract.methods.transfer(destAddress, sanitizeHex(transferAmount.toString(16))).encodeABI()
  };

  const tx                    = new ethTx(rawTransaction);
  tx.sign(privKey);
  const serializedTx          = tx.serialize();
  let transactionHash: any    = +moment.utc();
  return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('transactionHash', (hash: string) => {
      transactionHash = hash;
    })
    .on('receipt', (receipt: any) => {
      return receipt;
    })
    .catch((err: any) => {
      const error = err.toString();
      if (error.indexOf('Transaction was not mined within 50 blocks') > 0)
        return {
          status: '0x2',
          error : err.toString(),
          data  : rawTransaction,
          transactionHash  : transactionHash
        };
      else if (error.indexOf('known transaction') > 0)
        return {
          status: '0x3',
          error : err.toString(),
          data  : rawTransaction,
          transactionHash  : transactionHash
        };
      else if (error.indexOf('Failed to check for transaction receipt') > 0)
        return {
          status: '0x4',
          error : err.toString(),
          data  : rawTransaction,
          transactionHash  : transactionHash
        };
      return {
        status: '0x0',
        error : err.toString(),
        data  : rawTransaction,
        transactionHash  : transactionHash
      };
    });
};

const loadABI = (contract_json) => {
  const PredictionABI = require(`../contracts/${contract_json}.json`).abi;
  return PredictionABI;
}
*/
