import axios from 'axios';
import local from '@/services/localStore';
import { APP, BASE_API } from '@/constants';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

const $http = ({
  url, data = {}, qs, id = '', headers = {}, method = 'GET', ...rest
}) => {
  // start handle headers
  const parsedMethod = method.toLowerCase();
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  const completedHeaders = Object.assign({} , defaultHeaders, headers);

  if (url.startsWith(BASE_API.BASE_URL)) {
    const token = local.get(APP.AUTH_TOKEN);
    if (token) {
      completedHeaders.Payload = token;
    }
    const wallet = MasterWallet.getWalletDefault('ETH');
    if (wallet && wallet.chainId) {
      completedHeaders.ChainId = wallet.chainId + (process.env.chainIdAdditional || 0);
    }
  }
  // end handle headers

  return axios({
    method: parsedMethod,
    timeout: BASE_API.TIMEOUT,
    headers: completedHeaders,
    url: id ? `${url}/${id}` : url, // trimEnd(`${url}/${id}`, '/'),
    params: qs,
    data,
    ...rest,
  });
};

export default $http;
