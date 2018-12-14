import COUNTRIES_BLACKLIST from '@/app/blocked-countries';
import $http from '@/services/api';
import local from '@/services/localStore';
import { APP, API_URL } from '@/constants';
import { APIPostCreator, APIFormCreator } from '@/guru/stores/api';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

export const APP_ACTIONS = {
  IP_INFO: 'APP:IP_INFO',
  SIGN_UP: 'APP:SIGN_UP',
  WALLET_TO_PROFILE: 'APP:UPDATE_WALLET_TO_PROFILE'
};

export const saveIpInfo = (payload = {}) => ({
  type: 'APP:IP_INFO',
  payload
});

export const userSignUp = APIPostCreator({
  type: APP_ACTIONS.SIGN_UP,
  url: API_URL.USER.SIGNUP
});

export const updateWalletProfile = APIFormCreator({
  type: APP_ACTIONS.WALLET_TO_PROFILE,
  url: API_URL.USER.PROFILE
});

// Will use this in the near future
async function isBlockedIP(dispatch) { // eslint-disable-line
  const { data } = await $http({
    url: 'https://ipfind.co/me',
    qs: { auth: process.env.ipfindKey },
    headers: { 'Content-Type': 'text/plain' }
  });
  const isBlock = process.env.isProduction && COUNTRIES_BLACKLIST.includes(data.country);
  dispatch(saveIpInfo({ ...data, isBlock }));
  return isBlock;
}

async function signUp(dispatch) {
  const { data, status } = await dispatch(userSignUp({}));
  if (!status) throw new Error('Failed to SignUp');
  local.save(APP.AUTH_TOKEN, data.passpharse);
}

async function updateWalletToProfile(dispatch) {
  const data = new FormData();
  data.append('wallet_addresses', MasterWallet.getListWalletAddressJson());
  const { data: profile } = await dispatch(updateWalletProfile({ data }));
  local.save(APP.AUTH_PROFILE, profile);
}

export const initApp = () => async dispatch => {
  try {
    if (!local.get(APP.AUTH_TOKEN)) {
      // create user token
      await signUp(dispatch);

      // create user wallet
      MasterWallet.createMasterWallets();

      // update wallet to profile
      await updateWalletToProfile(dispatch);
    }
  } catch (e) {
    console.error('initApp: ', e);
    // TODO: Show popup
  }
};
