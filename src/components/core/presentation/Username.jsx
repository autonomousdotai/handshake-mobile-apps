import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'redux';
import { showAlert } from '@/reducers/app/action';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class Username extends React.PureComponent {
  static propTypes = {
    username: PropTypes.any.isRequired,
    showAlert: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { username: this.props.username?.toString() };
    this.state.username = this.walletAddressHandle(this.state.username);

    this.copied = ::this.copied;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.username !== prevState.username) {
      return { username: this.walletAddressHandle(nextProps.username) };
    }
    return null;
  }

  walletAddressHandle(address) {
    if ((address.startsWith('0x') && address.length === 42) || address.length === 34 || address.length >= 20) {
      return `${address.substr(0, 5)}...${address.substr(-5)}`;
    }
    return address;
  }

  copied() {
    this.props.showAlert({
      message: 'Copied to clipboard!',
      timeOut: false,
      isShowClose: true,
      type: 'success',
      callBack: () => {},
    });
  }

  render() {
    return (
      <CopyToClipboard text={this.props.username} onCopy={this.copied}>
        <span style={{ cursor: 'pointer' }}>{this.state.username}</span>
      </CopyToClipboard>
    );
  }
}

export default connect(null, ({ showAlert }))(Username);
