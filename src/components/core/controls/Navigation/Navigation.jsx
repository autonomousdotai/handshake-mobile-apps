import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { URL } from '@/config';
import { clearHeaderBack } from '@/reducers/app/action';
import meIcon from '@/assets/images/navigation/ic_private.svg.raw';
import discoverIcon from '@/assets/images/navigation/ic_discover.svg.raw';
import chatIcon from '@/assets/images/navigation/ic_chat.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet.svg.raw';
import createIcon from '@/assets/images/navigation/ic_add.svg.raw';
import cn from 'classnames';

class Navigation extends React.Component {
  static propTypes = {
    clearHeaderBack: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location.pathname !== prevState.currentPath) {
      return { currentPath: nextProps.location.pathname };
    }
    if (nextProps.app.isNotFound !== prevState.isNotFound) {
      return { isNotFound: nextProps.app.isNotFound };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      currentPath: this.props.location.pathname,
      isNotFound: this.props.app.isNotFound,
    };
  }

  checkSelected(_URL) {
    return this.state.currentPath.startsWith(_URL) && !this.state.isNotFound ? 'selected' : '';
  }

  render() {
    return (
      <footer className="footer">
        <ul>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_ME_INDEX))}>
            <Link to={URL.HANDSHAKE_ME_INDEX} onClick={this.props.clearHeaderBack}>
              <div className="me-icon" dangerouslySetInnerHTML={{ __html: meIcon }} />
              <span>Me</span>
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_DISCOVER_INDEX))}>
            <Link to={URL.HANDSHAKE_DISCOVER_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: discoverIcon }} />
              <span>Discover</span>
            </Link>
          </li>
          <li>
            <Link to={URL.HANDSHAKE_CREATE_INDEX}>
              <div className="create" dangerouslySetInnerHTML={{ __html: createIcon }} />
            </Link>
          </li>
          <li className={cn(this.checkSelected(URL.HANDSHAKE_CHAT_INDEX))}>
            <Link to={URL.HANDSHAKE_CHAT_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: chatIcon }} />
              <span>Chat</span>
            </Link>
          </li>
          <li className={cn((this.state.currentPath.startsWith(URL.HANDSHAKE_WALLET_INDEX) && !this.state.isNotFound ? 'selected' : ''))}>
            <Link to={URL.HANDSHAKE_WALLET_INDEX} onClick={this.props.clearHeaderBack}>
              <div dangerouslySetInnerHTML={{ __html: walletIcon }} />
              <span>Wallet</span>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}

export default connect(state => ({ app: state.app }), { clearHeaderBack })(Navigation);
