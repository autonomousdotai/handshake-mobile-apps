import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App/App';

if (!String.prototype.format) {
  String.prototype.format = function () {
    const args = arguments;
    return this.replace(
      /{(\d+)}/g,
      (match, number) =>
        (typeof args[number] !== 'undefined' ? args[number] : match),
    );
  };
}

// require('../testing/test_handshake_blockchain');
// require('../testing/web3_test');

ReactDOM.render(<App />, document.getElementById(`${process.env.ROOT}`));

