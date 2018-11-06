import { createAPI, timoAPI } from '@/reducers/action';
import axios from 'axios';
import store from '@/stores';
export const SELL_COIN_ACTIONS = {
  SELL_COIN_GET_COIN_INFO: 'SELL_COIN_GET_COIN_INFO',
  SELL_COIN_ORDER: 'SELL_COIN_ORDER',
  SELL_COIN_FINISH_ORDER: 'SELL_COIN_FINISH_ORDER',
  SELL_COIN_GENERATE_ADDRESS: 'SELL_COIN_GENERATE_ADDRESS',
  SELL_COIN_GET_BANK_LIST: 'SELL_COIN_GET_BANK_LIST',
  SELL_COIN_SELECT_BANK_NAME: 'SELL_COIN_SELECT_BANK_NAME',
  SELL_COIN_SELECT_ACCOUNT_ID: 'SELL_COIN_SELECT_ACCOUNT_ID',
  SELL_COIN_LOAD_ACCOUNT_NAME: 'SELL_COIN_LOAD_ACCOUNT_NAME'
};

export const sellCryptoFinishOrder = () => ({
  type: SELL_COIN_ACTIONS.SELL_COIN_FINISH_ORDER,
});
export const sellCryptoGetBankList = createAPI(SELL_COIN_ACTIONS.SELL_COIN_GET_BANK_LIST);
export const sellCryptoGenerateAddress = createAPI(SELL_COIN_ACTIONS.SELL_COIN_GENERATE_ADDRESS);
export const sellCryptoOrder = createAPI(SELL_COIN_ACTIONS.SELL_COIN_ORDER);
export const sellCryptoGetCoinInfo = createAPI(SELL_COIN_ACTIONS.SELL_COIN_GET_COIN_INFO);

export const getBankList = () => dispatch => new Promise((resolve, reject) => {
  console.log('getbank list');
  // axios.get('http://localhost:2203/timo/bankList').then(r => console.log(r)).catch(err => console.log(err));
  axios.get('http://localhost:2203/timo/bankList')
  .then(({ status, data: { bankList: payload } }) => {
    console.log('payload is', payload);
    if (status === 200) {
      dispatch({ type: 'SELL_COIN_GET_BANK_LIST', payload })
      resolve(payload)
    }
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => reject(err));
})

export const selectBankName = payload => {
  store.dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_SELECT_BANK_NAME, payload });
}

export const selectAccountId = payload => {
  store.dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_SELECT_ACCOUNT_ID, payload });
}

export const getBankInfo = () => dispatch => new Promise((resolve, reject) => {
  console.log('getbank list');
  // axios.get('http://localhost:2203/timo/bankList').then(r => console.log(r)).catch(err => console.log(err));
  axios.get('http://localhost:2203/timo/getBankInfo?bankId=11&targetInfo=0331000422510&bankAccount=153560102')
  .then(({ status, data }) => {
    console.log('payload is', data);
    const payload = data.data.account.cardName;
    if (status === 200) {
      dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_LOAD_ACCOUNT_NAME, payload })
      resolve(payload)
    }
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => reject(err));
})