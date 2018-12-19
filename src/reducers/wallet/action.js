import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { createAPI } from '@/reducers/action';

export const createMasterWallets = () => new Promise((resolve) => {
  Promise.all([MasterWallet.createMasterWallets()]);
  resolve();
});

export const getFiatCurrency = createAPI('GET_FIAT_CURRENCY');

export default { createMasterWallets };
