import { connectMetamask } from './connect';

const storeAccount = (account) => {
  let signedTokens = JSON.parse(localStorage.getItem('sign_tokens') || '[]');
  const index = signedTokens.findIndex(i => { return i.address.toUpperCase() === account.address.toUpperCase(); });
  if (index !== -1) {
    signedTokens.splice(index, 1);
  }
  signedTokens = signedTokens.map(i => { const item = i; item.isActive = false; return item; });
  signedTokens.push(account);
  localStorage.setItem('sign_tokens', JSON.stringify(signedTokens));
};

export const sendMsgToExtension = (data) => {
  console.log('BEGEN SEND: ', data);
  window.parent.postMessage(data, '*');
};

// Listen all msg from extension
window.addEventListener('message', async (value) => {
  try {
    if (!value.data) {
      console.log('Data invalid');
      return;
    }
    switch (value.data.action_key) {
      case 'enable_request':
        connectMetamask();
        break;
      case 'personal_sign':
        console.log('User signed at extension!');
        storeAccount(value.data);
        break;
      case 'sync_local_storage':
        console.log('Send sync storage!');
        sendMsgToExtension(JSON.parse(localStorage.getItem('sign_token')));
        break;
      default:
        break;
    }
  } catch (e) {
    console.error(e);
  }
});

export default { };
