 import { axiosInstance } from '@/reducers/action';
 import { MasterWallet } from '../../services/Wallets/MasterWallet';
 import HedgeFundAPI from '../../pages/Invest/contracts/HedgeFundAPI';
 const hedgeFundApi = new HedgeFundAPI('latest', false);
export const ACTIONS = {
  FETCH_PROJECTS: 'FETCH_PROJECTS',
  FETCH_PROJECT_DETAIL: 'FETCH_PROJECT_DETAIL',
  FETCH_TRADERS: 'FETCH_TRADERS',
  FETCH_TRADER_DETAIL: 'FETCH_TRADER_DETAIL',
  SYNC_WALLET: 'SYNC_WALLET',
  SYNCED_INFO: 'SYNCED_INFO',
  SM_PROJECT: 'CALL_SM_PROJECT',
  SM_PROJECT_FUND_AMOUNT: 'SM_PROJECT_FUND_AMOUNT',
  FETCH_TRANSACTIONS: 'FETCH_TRANSACTIONS'
}
const LIST_PROJECT_URL = '/projects/list?isFunding=true';
const LIST_INVESTING_URL = '/fundings/list';
const PROJECT_DETAIL_URL = '/projects';
const LIST_TRADER_URL = '/users/list-trader';
const GET_TRADER_URL = '/users';
const LINK_WALLET_URL = '/link-to-wallet';
const IMAGE_PREFIX = 'http://35.198.235.226:9000/api/file-storages/avatar/download';
const GET_TRADER_URL_ID = id => `${GET_TRADER_URL}/${id}?filter[include]=project`
export const toHexColor = (str) => {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return `#${hex.substring(0, 6)}`;
};
export const getImageUrl = avatar => `${IMAGE_PREFIX}/${avatar}`
export const date_diff_indays = function(dt1, dt2) {
  return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
}
const validateWallet = () => {
  if (!MasterWallet.getWalletDefault()) {
    MasterWallet.createMasterWallets();
  }
}
export const fetch_projects = () => dispatch => new Promise((resolve, reject) => {
  axiosInstance.get(LIST_PROJECT_URL)
  .then(({ status, data: payload }) => {
    if (status === 200) {
      dispatch({ type: ACTIONS.FETCH_PROJECTS, payload })
      resolve(payload)
    }
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => reject(err));
})

export const fetch_investing = () => dispatch => new Promise((resolve, reject) => {
  validateWallet();
  const { address } = MasterWallet.getWalletDefault().ETH;
  axiosInstance.get(`${LIST_INVESTING_URL}/${address}`)
  .then(({ status, data: payload }) => {
    if (status === 200) {
      dispatch({ type: ACTIONS.FETCH_PROJECTS, payload })
      resolve(payload)
    }
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => reject(err));
})

export const fetch_project_detail = (id) => dispatch => new Promise((resolve, reject) => {
  axiosInstance.get(`${PROJECT_DETAIL_URL}/${id}?filter={"include": "User"}`)
  .then(({ status, data: payload }) => {
    if (status === 200) {
      dispatch({ type: ACTIONS.FETCH_PROJECT_DETAIL, payload })
      resolve(payload)
    }
    reject(`Response return status is not success ${status}`);
  })
  .catch(err => reject(err));
})

export const fetch_traders = () => dispatch => new Promise((resolve, reject) => {
  axiosInstance.get(LIST_TRADER_URL)
  .then(({ status, data: payload }) => {
    if (status === 200) {
      dispatch({ type: ACTIONS.FETCH_TRADERS, payload })
      resolve(payload)
    }
    reject('');
  })
  .catch(err => reject(err));
})

export const fetch_trader_detail = (id) => dispatch => new Promise((resolve, reject) => {
  axiosInstance.get(GET_TRADER_URL_ID(id))
  .then(({ status, data: payload }) => {
    if (status === 200) {
      dispatch({ type: ACTIONS.FETCH_TRADER_DETAIL, payload })
      resolve(payload)
    }
    reject('');
  })
  .catch(err => reject(err));
})

export const getNumberOfFund = async (pid)  => {
  // debugger
  console.log('pid is', pid);
  const numberFund = await hedgeFundApi.getProjectInfo('0x' +pid);
  console.log(numberFund);
  return numberFund.numFunder;
}

export const getSMProjectInfo = (pid) => dispatch => new Promise((resolve, reject) => {
  hedgeFundApi.getProjectInfo('0x' + pid).then(payload => {
    dispatch({ type: ACTIONS.SM_PROJECT, payload });
    resolve(payload)
  }).catch(err => reject(err))
});

export const getFundAmount = (pid) => dispatch => new Promise((resolve, reject) => {
  validateWallet();
  const { address } = MasterWallet.getWalletDefault().ETH;
  hedgeFundApi.getFundAmount('0x' + pid, address).then(data => {
    const payload = hedgeFundApi.getEthPrice(data);
    dispatch({ type: ACTIONS.SM_PROJECT_FUND_AMOUNT, payload });
    resolve(payload)
  }).catch(err => reject(err))
});

// withdrawFund

export const withdrawFund = (pid) => dispatch => new Promise((resolve, reject) => {
  validateWallet();
  const { privateKey } = MasterWallet.getWalletDefault().ETH;
  hedgeFundApi.withdrawFund(privateKey, '0x' + pid).then(data => {
    resolve(data)
  }).catch(err => reject(err))
});

export const eth_sendTransaction = ({
  privateKey,
  
}) => (dispatch) => {

}

export const exampleTraders = [
  {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      firstName: 'Booby Gabershek',
      lastName: 'Ga',
      rating: 1,
      average: -0.36,
      amount: 2000,
  },
  {
      id: 2,
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      firstName: 'Quang Vo',
      lastName: 'Ga',
      rating: 3,
      average: 0.25,
      amount: 14567892000
  },
  {
      id: 3,
      avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
      firstName: 'Anonymous',
      lastName: 'Ga',
      rating: 3,
      average: 0.2,
      amount: 1000650
  }
];

export const exampleProjects = [
  {
    name: 'Project A1',
    owner: ' ',
    target: '100',
    exchange: 'binance',
    max: '100',
    commission: 0,
    fundingAmount: '30',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 604800,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58d2af926767a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'Andy',
      lastName: 'Vo',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  },
  {
    name: 'Project A2',
    owner: ' ',
    target: '10',
    exchange: 'binance',
    max: '10',
    commission: 0,
    fundingAmount: '0',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 1537808400,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58deaf926767a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'amit',
      lastName: 'wwww',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  },
  {
    name: 'Project A3',
    owner: ' ',
    target: '10',
    exchange: 'binance',
    max: '10',
    commission: 0,
    fundingAmount: '0',
    updatedAmount: '0',
    releasedAmount: '0',
    pendingAmount: '0',
    refundAmount: '0',
    startTime: '1970-01-18T19:10:08.400Z',
    deadline: '1970-01-18T19:10:08.400Z',
    lifeTime: 1537808400,
    currency: 'ETH',
    stages: [10, 25, 30, 35],
    createdDate: '2018-09-25T07:15:11.937Z',
    updatedDate: '2018-09-25T07:15:11.937Z',
    depositAddress: null,
    currentStage: null,
    smartContractVersion: 'v1',
    state: 'WITHDRAW',
    id: '5ba9e0e58deaf92367a1e61',
    userId: '5b8e55f3a572c4004ffaa973',
    User: {
      firstName: 'amit',
      lastName: 'wwww',
      userType: 'trader',
      username: 'amit11',
      email: 'amit007kolambikar@gmail.com',
      emailVerified: false,
      id: '5b8e55f3a572c4004ffaa973'
    }
  }
]

export const hasLinkedWallet = () => dispatch => new Promise((resolve, reject) => {
  try {
    const authProfile = JSON.parse(localStorage.getItem('auth_profile'));
    console.log(authProfile);
    const { id: walletId } = authProfile;
    axiosInstance.get(`/link-to-wallet/has-linked?walletId=${walletId}`)
    .then(({ status, data: { success: payload} }) => {
      if (status === 200) {
        dispatch({ type: ACTIONS.SYNC_WALLET, payload })
        resolve(payload)
      }
      reject('');
    })
    .catch(err => reject(err));
  } catch( err) {
    reject(err);
  }
})

export const linkWallet = (password) => dispatch => new Promise((resolve, reject) => {
  try {
    const token = JSON.parse(localStorage.getItem('auth_token'));
    const authProfile = JSON.parse(localStorage.getItem('auth_profile'));
    const { id, username: walletName } = authProfile;
    const walletId = id.toString();
    const wallets = MasterWallet.encryptWalletsByPassword(password);
    axiosInstance.post(LINK_WALLET_URL, {
      walletId,
      walletName,
      wallets,
      token
    }).then(({ status, data: payload }) => {
      if(status === 200) {
        dispatch({ type: ACTIONS.SYNCED_INFO, payload });
        resolve(payload);
      }
    }).catch(err => reject(err));
  } catch (err) {
    reject(err);
  }
})

export const resetLinkWallet = () => dispatch => dispatch({ type: ACTIONS.SYNCED_INFO, payload: false })

import TransactionStorage from './transactions';
export const fetchTransactions = pid => dispatch => {
  const trxStorage = new TransactionStorage(pid);
  const payload = trxStorage.getTransactions().sort(() => -1);
  dispatch({ type: ACTIONS.FETCH_TRANSACTIONS, payload });
}

export const addTransaction = (pid, trx) => dispatch => {
  const trxStorage = new TransactionStorage(pid);
  trxStorage.addTransaction(trx);
  const payload = trxStorage.getTransactions().sort(() => -1);
  dispatch({ type: ACTIONS.FETCH_TRANSACTIONS, payload });
}

export const updateTransaction = (pid, trx) => dispatch => {
  const trxStorage = new TransactionStorage(pid);
  trxStorage.updateTransaction(trx);
  const payload = trxStorage.getTransactions();
  dispatch({ type: ACTIONS.FETCH_TRANSACTIONS, payload });
}