import { MasterWallet } from '@/services/Wallets/MasterWallet';

export const getWalletDefault = (coinName) => (MasterWallet.getWalletDefault(coinName));

export const getChainIdDefaultWallet = () => (getWalletDefault('ETH').chainId);

export const getAddress = () => (getWalletDefault('ETH').address);

export const getBalance = async () => {
  const balance = await getWalletDefault('ETH').getBalance();
  const balance = await wallet.getBalance();
  return balance;
};

export const getGasPrice = () => (window.gasPrice || 20);

export const getEstimateGas = async () => {
  const gasPrice = getGasPrice();
  const chainId = getChainIdDefaultWallet();
  const neuron = MasterWallet[(chainId === 4 ? 'neutronTestNet' : 'neutronMainNet')];
  const estimateGas = await neuron.caculateLimitGasWithEthUnit(gasPrice);
  return estimateGas;
};
