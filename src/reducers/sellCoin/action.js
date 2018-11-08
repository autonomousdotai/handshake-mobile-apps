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
  axios.get('http://35.198.235.226:2203/timo/bankList')
  .then(({ status, data: { bankList: payload } }) => {
    if (status === 200) {
      dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_GET_BANK_LIST, payload })
      resolve(payload)
    }
    dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_GET_BANK_LIST, payload: [] })
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => {
    dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_GET_BANK_LIST, payload: [] })
    reject(err)
  });
})

export const selectBankName = payload => {
  store.dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_SELECT_BANK_NAME, payload });
}

export const selectAccountId = accountId => {
  const payload = {
    accountId: '',
    accountName: ''
  };
  // length of cardnumber (visa/master/...)
  if ([13,14,15, 16, 19].indexOf(accountId.length) >=  0) {
    payload.accountId = accountId;
  }
  store.dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_SELECT_ACCOUNT_ID, payload });
}

export const getBankInfo = (bankId, targetInfo) => dispatch => new Promise((resolve, reject) => {
  axios.get(`http://35.198.235.226:2203/timo/getBankInfo?bankId=${bankId}&targetInfo=${targetInfo}&bankAccount=153560102`)
  .then(({ status, data }) => {
    console.log('payload is', data);
    const payload = data.data.account.cardName;
    if (status === 200) {
      dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_LOAD_ACCOUNT_NAME, payload })
      resolve(payload)
    }
    dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_LOAD_ACCOUNT_NAME, payload: '' })
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => {
    dispatch({ type: SELL_COIN_ACTIONS.SELL_COIN_LOAD_ACCOUNT_NAME, payload: '' })
    reject(err);
  });
})