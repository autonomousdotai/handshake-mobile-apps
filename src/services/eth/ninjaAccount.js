import { MasterWallet } from '@/services/Wallets/MasterWallet';

export function getPrivateKey(coinName = 'ETH') {
  return MasterWallet.getWalletDefault(coinName).privateKey;
}

export function getUserAddress(coinName = 'ETH') {
  return MasterWallet.getWalletDefault(coinName).address;
}

export function getChainId(coinName = 'ETH') {
  const { chainId } = MasterWallet.getWalletDefault(coinName).wallet;
  if (!chainId) {
    console.error('Fail to get chainId from default wallet');
    return null;
  }
  return chainId;
}
