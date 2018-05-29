const config = {
  network: {
    1: {
      multiSigAuthAddress: '',
      handshakeAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      blockchainNetwork: 'https://mainnet.infura.io/',
    },
    4: {
      multiSigAuthAddress: '',
      handshakeAddress: '',
      crowdsaleHandshakeAddress: '',
      basicHandshakeAddress: '0x4c621cfd5496b2077eb1c5b0308e2ea72358191b',
      payableHandshakeAddress: '',
      groupHandshakeAddress: '',
      cryptosignOwnerAddress: '',
      cryptosignOwnerPrivateKey: '',
      blockchainNetwork: 'https://rinkeby.infura.io/',
    },
  },
  firebase: {
    apiKey: 'AIzaSyDBZMfls5cTmY7coHYdJr7BoX98HTz_REQ',
    authDomain: 'handshake-ce73c.firebaseapp.com',
    databaseURL: 'https://handshake-ce73c.firebaseio.com',
    projectId: 'handshake-ce73c',
    storageBucket: 'handshake-ce73c.appspot.com',
    messagingSenderId: '1002982182043',
    // apiKey: 'AIzaSyCTUERDM-Pchn_UDTsfhVPiwM4TtNIxots',
    // authDomain: '',
    // databaseURL: '',
    // storageBucket: '',
    // messagingSenderId: '',
  },
};

export default config;
