import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';
// import MultiLanguage from '@/components/core/controls/MultiLanguage';
import meIcon from '@/assets/images/navigation/ic_account.svg.raw';
import walletIcon from '@/assets/images/navigation/ic_wallet_white.svg.raw';
// import predictionIcon from '@/assets/images/categories/chip.svg';

function Me() {
  return (
    <Link to={URL.HANDSHAKE_ME_INDEX} className="me-icon">
      <div dangerouslySetInnerHTML={{ __html: meIcon }} />
    </Link>
  );
}

function Wallet() {
  return (
    <Link to={URL.HANDSHAKE_WALLET_INDEX}>
      <div dangerouslySetInnerHTML={{ __html: walletIcon }} />
    </Link>
  );
}

function Caption(title) {
  return (
    <Link to={URL.HANDSHAKE_PREDICTION} className="Caption">
      {/* <img src={predictionIcon} alt="" /> */}
      <span>{title}</span>
    </Link>
  );
}

function BuyCrypto() {
  return (
    <Link to={URL.BUY_BY_CC_URL} className="BuyCrypto">
      <span>Buy crypto with credit card</span>
    </Link>
  );
}

function HeaderBar(props) {
  const { className, titleBar } = props;
  const { pathname } = window.location;

  return (
    <div className={className}>
      {Me()}
      {Caption(titleBar)}
      {/* <MultiLanguage /> */}
      {Wallet()}
      { (pathname === URL.HANDSHAKE_WALLET) && BuyCrypto()}
    </div>
  );
}

HeaderBar.propTypes = {
  className: PropTypes.string,
  titleBar: PropTypes.string,
};

HeaderBar.defaultProps = {
  className: '',
  titleBar: '',
};

export default HeaderBar;
