
export function resultCallback(errObj, result) {
  if (!errObj) {
    console.log('result', result);
  } else {
    console.log('errObj', errObj);
  }
}

export function eventCallBack(mainFn) {
  mainFn
    .once('transactionHash', (hashStr) => {
      console.log('hashStr', hashStr);
    })
    .once('receipt', (receiptObj) => {
      console.log('receiptObj', receiptObj);
    })
    .on('confirmation', (confNumber, receipt) => {
      // If a out of gas error, the second parameter is the receipt.
      console.log('confNumber', confNumber);
      console.log('receipt', receipt);
    })
    .on('error', (error) => { // string or object
      console.log('error', error);
    });
}
