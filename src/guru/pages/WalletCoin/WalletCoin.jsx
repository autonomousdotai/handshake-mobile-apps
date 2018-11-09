import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';

const stateConstant = 'sa123456';

class WalletCoin extends React.Component {
  loginCoinBase = (props) => {

    const clientId = 'e087d6e310d0fcac821dbbe0ed890e26ea492f380baf276d0f9fdf8150114c8e';
    const redirectUrl = encodeURIComponent('http://localhost:8080/auth/callback');
    const URL = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${stateConstant}&scope=wallet:accounts:read`;
    window.open(URL);
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
  render() {
    return (
      <div className="wrapperWalletCoin">
        {this.renderLoginCoinbase(this.props)}
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
