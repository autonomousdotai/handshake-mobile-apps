import COUNTRIES_BLACKLIST from '@/app/blocked-countries';
import $http from '@/services/api';
import local from '@/services/localStore';
import { APP, API_URL } from '@/constants';
import { APIPostCreator, APIGetCreator, APIFormCreator } from '@/guru/stores/api';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { ACTIONS } from '@/reducers/auth/action';

export const APP_ACTIONS = {
  IP_INFO: 'APP:IP_INFO',
  SIGN_UP: 'APP:SIGN_UP',
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
  type: ACTIONS.AUTH_UPDATE,
  url: API_URL.USER.PROFILE
});

export const getProfile = APIGetCreator({
  type: ACTIONS.AUTH_FETCH,
  url: API_URL.USER.PROFILE
});

// Will use this in the near future
async function isBlockedIP(dispatch) { // eslint-disable-line
  const { data } = await $http({
    url: 'https://ipfind.co/me',
    qs: { auth: process.env.NINJA_IP_FIND },
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

function updateWalletToProfile(dispatch) {
  const data = new FormData();
  data.append('wallet_addresses', MasterWallet.getListWalletAddressJson());
  dispatch(updateWalletProfile({ data }));
}

export const initApp = () => async dispatch => {
  try {
    if (!local.get(APP.AUTH_TOKEN)) {
      // create user token
      await signUp(dispatch);

      // create user wallet
      MasterWallet.createMasterWallets();

      // update wallet to profile
      updateWalletToProfile(dispatch);
    } else {
      dispatch(getProfile());
    }
  } catch (e) {
    console.error('initApp: ', e);
    // TODO: Show popup
  }
};
