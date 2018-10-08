import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { URL } from '@/constants';
import { clearHeaderBack } from '@/reducers/app/action';
import meIcon from '@/assets/images/navigation/ic_me.svg.raw';
import creditIcon from '@/assets/images/navigation/ic_credit.svg.raw';
import discoverIcon from '@/assets/images/navigation/ic_atm.svg.raw';
import chatIcon from '@/assets/images/navigation/ic_prediction.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet.svg.raw';
import shopIcon from '@/assets/images/navigation/ic_shop.svg.raw';

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPath: this.props.location.pathname,
      isNotFound: this.props.app.isNotFound,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.pathname !== prevState.currentPath) {
      return { currentPath: nextProps.location.pathname };
    }
    if (nextProps.app.isNotFound !== prevState.isNotFound) {
      return { isNotFound: nextProps.app.isNotFound };
    }
    return null;
  }


  checkSelected(URLs) {
    let _URLs = URLs;
    if (!Array.isArray(URLs)) { _URLs = [URLs]; }
    return _URLs.indexOf(this.state.currentPath) >= 0 && !this.state.isNotFound ? 'selected' : '';
  }

  render() {
    return (
      <footer className="footer">
        <ul>
          <li className={cn(this.checkSelected(URL.BUY_COIN_URL))}>
            <Link to={URL.BUY_COIN_URL} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: creditIcon }} />
              <span>{this.props.intl.messages.app.navigation.credit.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected([URL.HANDSHAKE_EXCHANGE, URL.HANDSHAKE_CASH, URL.HANDSHAKE_ATM, URL.CASH_STORE_URL]))}>
            <Link to={URL.HANDSHAKE_ATM} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: discoverIcon }} />
              <span>{this.props.intl.messages.app.navigation.atm.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.PRODUCT_PREDICTION_URL))}>
            <Link to={URL.PRODUCT_PREDICTION_URL} onClick={this.props.clearHeaderBack}>
              <div className="chat-icon" dangerouslySetInnerHTML={{ __html: chatIcon }} />
              <span>{this.props.intl.messages.app.navigation.bet.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_WALLET_INDEX))}>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: walletIcon }} />
              <span>{this.props.intl.messages.app.navigation.wallet.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.SHOP_URL_INDEX))}>
            <Link to={URL.SHOP_URL_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: shopIcon }} />
              <span>{this.props.intl.messages.app.navigation.shop.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected([URL.HANDSHAKE_ME_INDEX]))}>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="me-icon" dangerouslySetInnerHTML={{ __html: meIcon }} />
              <span>{this.props.intl.messages.app.navigation.setting.toUpperCase()}</span>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default injectIntl(connect(state => ({ app: state.app }), { clearHeaderBack })(Navigation));
