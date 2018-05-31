const config = {
  network: {
    1: {
      multiSigAuthAddress: '',
      handshakeProtocolAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      bettingHandshakeAddress: '0x83a7ce297cdbfa6fa358cf6505e8b3f5ed5e23c0',
      blockchainNetwork: 'https://mainnet.infura.io/',
    },
    4: {
      multiSigAuthAddress: '',
      handshakeProtocolAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '0x4c621cfd5496b2077eb1c5b0308e2ea72358191b',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      bettingHandshakeAddress: '0x80bd40fe184916a435a13357fda19f4eb569c3c5',
      cryptosignOwnerAddress: '',
      cryptosignOwnerPrivateKey: '',
      blockchainNetwork: 'https://rinkeby.infura.io/',
    },
  },
  
  firebase: {
    /*
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    storageBucket: '',
    messagingSenderId: '',
    */
   apiKey: 'AIzaSyAY_QJ_6ZmuYfNR_oM65a0JVvzIyMb-n9Q',
    authDomain: 'handshake-205007.firebaseapp.com',
    databaseURL: 'https://handshake-205007.firebaseio.com',
    projectId: 'handshake-205007',
    storageBucket: 'handshake-205007.appspot.com',
    messagingSenderId: '852789708485',
  },
};

export default config;
