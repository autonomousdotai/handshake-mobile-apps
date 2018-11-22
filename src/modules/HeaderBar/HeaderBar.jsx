import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
// import MultiLanguage from '@/components/core/controls/MultiLanguage';
import Icon from '@/guru/components/Icon/Icon';
import meIcon from '@/assets/images/icon/extension_logo.svg';
import Ether from '@/assets/images/navigation/ic_ether.svg';
import { MasterWallet } from "@/services/Wallets/MasterWallet";

class HeaderBar extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    titleBar: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    titleBar: ''
  };

  me = () => {
    const style = { width: '28px', height: '28px' };
    return (
      <Link to={URL.HANDSHAKE_ME_INDEX} className="me-icon">
        {/* <div dangerouslySetInnerHTML={{ __html: meIcon }} /> */}
        <Icon path={meIcon} style={style} />
      </Link>
    );
  };

  wallet = (walletProps) => {
    if (!walletProps || !parseFloat(walletProps.balance)) return this.topUp();
    const { balance } = walletProps;
    return (
      <Link to={URL.WALLET_EXTENSION} className="wallet">
        <span className="balance">{Number((parseFloat(balance)).toFixed(6))}</span>
        <span className="name">
          <img src={Ether} alt="ETH" />
        </span>
      </Link>
    );
  };

  topUp = () => {
    return (
      <Link to={URL.WALLET_EXTENSION} className="wallet btn btn-primary">
        <span className="TopUp">Top up</span>
      </Link>
    );
  };

  caption = (title) =>{
    return (
      <Link to={URL.HANDSHAKE_PREDICTION} className="Caption">
        {/* <img src={predictionIcon} alt="" /> */}
        <span>{title}</span>
      </Link>
    );
  };

  buyCrypto = () => {
    return (
      <Link to={URL.BUY_BY_CC_URL} className="BuyCrypto">
        <span>Buy crypto with credit card</span>
      </Link>
    );
  };

  render() {
    const { props } = this;
    const { className, titleBar } = props;
    const { pathname } = window.location;

    const wallets = MasterWallet.getMasterWallet();
    const walletProps = wallets[1];

    return (
      <div className={className}>
        {this.me()}
        {this.caption(titleBar)}
        {/* <MultiLanguage /> */}
        {(pathname !== URL.WALLET_EXTENSION) && this.wallet(walletProps)}
        {/* { (pathname === URL.HANDSHAKE_WALLET) && BuyCrypto()} */}
      </div>
    );
  }
}

export default HeaderBar;
