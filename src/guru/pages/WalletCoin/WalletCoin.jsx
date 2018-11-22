import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';

import { loginMetaMask } from '@/guru/pages/Home/action';

import Web3 from 'web3';

const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');

const stateConstant = 'sa123456';


class WalletCoin extends React.Component {
  loginCoinBase = (props) => {

    /*
    const clientId = 'e087d6e310d0fcac821dbbe0ed890e26ea492f380baf276d0f9fdf8150114c8e';
    const redirectUrl = encodeURIComponent('http://localhost:8080/auth/callback');
    const URL = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${stateConstant}&scope=wallet:accounts:read`;
    window.open(URL);
    */
    const { currentProvider: cp } = window.web3;
    const isToshi = !!cp.isToshi;
    console.log('Is Toshi:', isToshi);
  }

  connect = () => {
    if (typeof ethereum !== 'undefined') {
      try {
        ethereum.enable();

      }catch(e) {
        console.log(e);
      }
    }else {
      alert('Please install MetaMask extension');

    }
  }
  loginMetaMask = async (props) => {
    this.connect();
    /*
    if (typeof window.web3 !== 'undefined') {
      const { currentProvider } = window.web3;
      const web3Provider = new Web3(currentProvider);
      this.props.dispatch(loginMetaMask({ web3Provider }));

    } else {
      alert('Please install MetaMask extension');
    }
    */
   /*
    const text = 'Sign Ninja';
    const msg = ethUtil.bufferToHex(text);
    // var msg = '0x1' // hexEncode(text)
    const { currentProvider } = window.web3;
    const web3Provider = new Web3(currentProvider);
    const accounts = await web3Provider.eth.getAccounts();
    const fromAccount = accounts[0];
    console.log('From:', fromAccount);
    if (!fromAccount) return connect();

    console.log('CLICKED, SENDING PERSONAL SIGN REQ');
    const params = [msg, fromAccount];
    const method = 'personal_sign';

    web3.currentProvider.sendAsync({
      method,
      params,
      fromAccount
    }, function (err, result) {
      if (err) return console.error(err);
      if (result.error) return console.error(result.error);
      console.log('PERSONAL SIGNED:' + JSON.stringify(result.result));
      console.log('recovering...');
      const msgParams = { data: msg };
      msgParams.sig = result.result;
      console.dir({ msgParams });
      const recovered = sigUtil.recoverPersonalSignature(msgParams);
      console.dir({ recovered });

      if (recovered.toUpperCase() === fromAccount.toUpperCase() ) {
        console.log('SigUtil Successfully verified signer as ' + fromAccount);
      } else {
        console.dir(recovered);
        console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + fromAccount);
        console.log('Failed, comparing %s to %s', recovered, fromAccount);
      }

    });
    */

  }


  renderLoginCoinbase(props) {
    return (
      <Button
        className="coinbaseButton"
        onClick={() => this.loginCoinBase(props)}
      >
        Login Coin Base
      </Button>
    );
  }
  renderLoginMetaMask(props) {
    return (
      <Button
        className="metaMaskButton"
        onClick={() => this.loginMetaMask(props)}
      >
        Login MetaMask
      </Button>
    );
  }
  render() {
    return (
      <div className="wrapperWalletCoin">
        {this.renderLoginCoinbase(this.props)}
        {this.renderLoginMetaMask(this.props)}
      </div>
    );
  }
}

export default injectIntl(connect(
  (state) => {
    return {

    };
  },
)(WalletCoin));
