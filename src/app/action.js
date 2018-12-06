import COUNTRIES_BLACKLIST from '@/app/blocked-countries';
import $http from '@/services/api';
import local from '@/services/localStore';
import { APP, API_URL } from '@/constants';
import { APIPostCreator } from '@/guru/stores/api';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

export const APP_ACTIONS = {
  IP_INFO: 'APP:IP_INFO',
  SIGN_UP: 'AUTH:SIGN_UP'
};

export const saveIpInfo = (payload = {}) => ({
  type: 'APP:IP_INFO',
  payload
});

export const userSignUp = APIPostCreator({
  type: APP_ACTIONS.SIGN_UP,
  url: API_URL.USER.SIGNUP
});

// Will use this in the near future
async function isBlockedIP(dispatch) {
  const { data } = await $http({
    url: 'https://ipfind.co/me',
    qs: { auth: process.env.ipfindKey },
    headers: { 'Content-Type': 'text/plain' }
  });
  const isBlock = process.env.isProduction && COUNTRIES_BLACKLIST.includes(data.country);
  dispatch(saveIpInfo({ ...data, isBlock }));
  return isBlock;
}

export const initApp = () => async dispatch => {
  try {
    // const isBlock = await isBlockedIP(dispatch);
    // if (isBlock) { return; }
    if (!local.get(APP.AUTH_TOKEN)) {
      const { data } = await dispatch(userSignUp({}));
      local.save(APP.AUTH_TOKEN, data.passpharse);
      MasterWallet.createMasterWallets();
    }
  } catch (e) {
    console.error('initApp: ', e);
    // TODO: Show popup
  }
};
