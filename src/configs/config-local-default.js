const config = {
  network: {
    1: {
      multiSigAuthAddress: '',
      handshakeAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      handshakeBettingAddress: '0x83a7ce297cdbfa6fa358cf6505e8b3f5ed5e23c0',
      blockchainNetwork: 'https://mainnet.infura.io/',
    },
    4: {
      multiSigAuthAddress: '',
      handshakeAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '0x4c621cfd5496b2077eb1c5b0308e2ea72358191b',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      handshakeBettingAddress: '0x83a7ce297cdbfa6fa358cf6505e8b3f5ed5e23c0',
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
