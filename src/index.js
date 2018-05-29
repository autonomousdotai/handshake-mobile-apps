import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App/App';

// require('../testing/test_handshake_blockchain');

ReactDOM.render(<App />, document.getElementById(`${process.env.ROOT}`));
