import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { URL } from '@/constants';
import { clearHeaderBack } from '@/reducers/app/action';
import meIcon from '@/assets/images/navigation/ic_setting.svg.raw';
import meIconNormal from '@/assets/images/navigation/ic_setting_normal.svg.raw';
import discoverIcon from '@/assets/images/navigation/ic_atm.svg.raw';
import discoverIconNormal from '@/assets/images/navigation/ic_atm_normal.svg.raw';
import chatIcon from '@/assets/images/navigation/ic_prediction.svg.raw';
import chatIconNormal from '@/assets/images/navigation/ic_prediction_normal.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet.svg.raw';
import walletIconNormal from '@/assets/images/navigation/ic_wallet_normal.svg.raw';
import createIcon from '@/assets/images/navigation/ic_add.svg.raw';

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
          <li className={cn(this.checkSelected(URL.HANDSHAKE_WALLET_INDEX))}>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: this.checkSelected(URL.HANDSHAKE_WALLET_INDEX) ? walletIcon : walletIconNormal }} />
              <span>{this.props.intl.messages.app.navigation.wallet.toUpperCase()}</span>
            </Link>
          </li>

          <li className={cn(this.checkSelected([URL.HANDSHAKE_EXCHANGE, URL.HANDSHAKE_CASH, URL.HANDSHAKE_PREDICTION]))}>
            <Link to={URL.HANDSHAKE_EXCHANGE} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: this.checkSelected([URL.HANDSHAKE_EXCHANGE, URL.HANDSHAKE_CASH, URL.HANDSHAKE_PREDICTION]) ? discoverIcon : discoverIconNormal }} />
              <span>{this.props.intl.messages.app.navigation.atm.toUpperCase()}</span>
            </Link>
          </li>
          <li>
            {
              this.props.location.pathname === URL.HANDSHAKE_CREATE_INDEX
              ? (
                <a>
                  <div className="create" dangerouslySetInnerHTML={{ __html: createIcon }} />
                </a>
              )
              : (
                <Link to={URL.HANDSHAKE_CREATE_INDEX}>
                  <div className="create" dangerouslySetInnerHTML={{ __html: createIcon }} />
                </Link>
              )
            }
          </li>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_CHAT_INDEX))}>
            <Link to={URL.HANDSHAKE_CHAT_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="chat-icon" dangerouslySetInnerHTML={{ __html: this.checkSelected(URL.HANDSHAKE_CHAT_INDEX) ? chatIcon : chatIconNormal }} />
              <span>{this.props.intl.messages.app.navigation.bet.toUpperCase()}</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_ME_INDEX))}>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="me-icon" dangerouslySetInnerHTML={{ __html: this.checkSelected(URL.HANDSHAKE_ME_INDEX) ? meIcon : meIconNormal}} />
              <span>{this.props.intl.messages.app.navigation.setting.toUpperCase()}</span>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default injectIntl(connect(state => ({ app: state.app }), { clearHeaderBack })(Navigation));