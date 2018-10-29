/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
/* eslint react/sort-comp:0 */
/* eslint no-eval:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qrCodeIcon from '@/assets/images/icon/qrcode-icon.png';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { showAlert, showScanQRCode } from '@/reducers/app/action';
import { CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME } from '@/constants';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import { BitcoinCash } from '@/services/Wallets/BitcoinCash';
import arrowDownIcon from '@/assets/images/icon/expand-arrow.svg';
import debounce from '@/utils/debounce';
import { getCryptoFromAddress } from '@/components/handshakes/exchange/utils';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import './styles.scss';
import taggingConfig from "@/services/tagging-config";
import * as gtag from "@/services/ga-utils";

const scopedCss = (className) => `wallet-selector-${className}`;

const CRYPTO_CURRENCY_SUPPORT = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_SUPPORT).map((item) => {
  return { id: item, text: <span>{CRYPTO_CURRENCY_NAME[item]}</span> };
});


class WalletSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletAddress: '',
      walletAddressError: undefined,
      currency: listCurrency[0],
      userWallets: [],
      shouldShowUserWallet: false,
    };

    this.addressInput = React.createRef();

    this.openQrScanner = :: this.openQrScanner;
    this.updateWalletAddress = :: this.updateWalletAddress;
    this.initSampleCrypto = :: this.initSampleCrypto;
    this.detectCryptoCurrency = debounce(::this.detectCryptoCurrency, 300);
    this.renderCurrencyList = :: this.renderCurrencyList;
    this.onCurrencyChange = :: this.onCurrencyChange;
    this.updateCurrency = :: this.updateCurrency;
    this.validateWallet = :: this.validateWallet;
    this.getUnsafeIntlMsg = :: this.getUnsafeIntlMsg;
    this.getUserListWallets = :: this.getUserListWallets;
    this.shortIt = :: this.shortIt;
    this.onUserWalletSelected = :: this.onUserWalletSelected;
    this.componentCallbackHandler = debounce(::this.componentCallbackHandler, 300);
    this.showUserWallet = :: this.showUserWallet;
    this.onBlur = :: this.onBlur;
    this.onFocus = :: this.onFocus;
  }

  componentDidMount() {
    this.initSampleCrypto();
    this.getUserListWallets();
    this.componentCallbackHandler();
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  initSampleCrypto() {
    this.sampleCrypto = {
      ETH: new Ethereum(),
      BTC: new Bitcoin(),
      BCH: new BitcoinCash(),
    };
  }

  shortIt(str = '') {
    const [START, END] = [12, 12];
    return `${str.substr(0, START)}...${str.substr(-END)}`;
  }

  getUserListWallets = async () => {
    try {
      const wallets = MasterWallet.getMasterWallet();
      const supportWallet = [];
      wallets.forEach(wallet => {
        if (Object.values(CRYPTO_CURRENCY_SUPPORT).indexOf(wallet.name) !== -1) {
          supportWallet.push(wallet);
        }
      });
      this.setState({ userWallets: supportWallet });
    } catch (e) {
      console.warn('getListWallets', e);
    }
  }

  validateWallet(walletAddressFromInput, currencyFromInput) {
    const { intl: { messages } } = this.props;
    const { currency, walletAddress } = this.state;
    const _walletAddress = walletAddressFromInput || walletAddress;
    const _currency = currencyFromInput || currency;
    let wallet = null;
    let walletAddressError = null;

    if (_currency?.id === CRYPTO_CURRENCY_SUPPORT?.ETH) {
      wallet = this.sampleCrypto.ETH;
    } else if (_currency?.id === CRYPTO_CURRENCY_SUPPORT?.BTC) {
      wallet = this.sampleCrypto.BTC;
    } else if (_currency?.id === CRYPTO_CURRENCY_SUPPORT?.BCH) {
      wallet = this.sampleCrypto.BCH;
    }

    const error = _walletAddress && wallet?.checkAddressValid(_walletAddress);
    if (typeof error === 'string' && error !== '') {
      walletAddressError = messages.wallet_selector.wallet_dont_match_error;
    } else {
      walletAddressError = null;
    }
    this.setState({ walletAddressError });
    return walletAddressError;
  }

  focus = () => {
    const input = this.addressInput?.current;
    setTimeout(() => input?.focus(), 1000);
    input?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  getUnsafeIntlMsg(msg = '') {
    try {
      const { messages } = this.props.intl;
      if (msg.substr(0, 9) === 'messages.') { // just for make sure the 'msg' is what we expected! avoid from hamful script!
        return messages ? eval(msg) : '';
      }
      return '';
    } catch (e) {
      console.warn(e);
      return '';
    }
  }

  detectCryptoCurrency(walletAddressFromInput) {
    const { walletAddress } = this.state;
    const crypto = getCryptoFromAddress(walletAddressFromInput || walletAddress);

    const currency = listCurrency?.find(item => item?.id === crypto);
    currency && this.updateCurrency(currency);
  }

  showUserWallet(isShow) {
    this.setState({ shouldShowUserWallet: isShow });
  }

  openQrScanner() {
    // open qrcode modal
    this.props.showScanQRCode({
      onFinish: (data) => {
        if (data) {
          console.log('openQrScanner',);
          gtag.event({
            category: taggingConfig.coin.category,
            action: taggingConfig.coin.action.scanQrCodeAddress,
          });
          const [address/* , amount */] = data?.split(',');
          this.updateWalletAddress(address);
        }
      },
    });
  }

  updateWalletAddress(walletAddress, opt = { detector: true }) {
    const { detector } = opt;
    this.setState({ walletAddress }, () => {
      detector && this.detectCryptoCurrency(); // this must be run first
      this.validateWallet(walletAddress);
      this.componentCallbackHandler();
    });
  }

  updateCurrency(currency) {
    currency && this.setState({ currency }, () => {
      this.validateWallet();
      this.componentCallbackHandler();
    });
  }

  componentCallbackHandler() {
    const { onChange } = this.props;
    const validate = this.validateWallet(this.state.walletAddress, this.state.currency);
    if (typeof onChange === 'function') {
      onChange({
        currency: this.state.currency?.id,
        walletAddress: this.state.walletAddress,
        hasError: validate && this.getUnsafeIntlMsg(validate),
      });
    }
  }

  onCurrencyChange(currency) {
    this.updateCurrency(currency);
  }

  renderCurrencyList() {
    return listCurrency?.map(currency => (
      <DropdownItem key={currency.id} value={currency} onClick={() => this.onCurrencyChange(currency)}>
        {currency.text}
      </DropdownItem>
    ));
  }

  shouldLockCurrencySelector() {
    const { walletAddressError, currency, walletAddress } = this.state;
    if (walletAddressError !== null ||
        currency.id === CRYPTO_CURRENCY_SUPPORT.BCH ||
        currency.id === CRYPTO_CURRENCY_SUPPORT.BTC ||
        walletAddress === '') {
      return false;
    }
    return true;
  }

  onUserWalletSelected(wallet) {
    gtag.event({
      category: taggingConfig.coin.category,
      action: taggingConfig.coin.action.selectAddress,
    });
    this.updateWalletAddress(wallet?.address, { detector: false });
    const currency = listCurrency.find(c => c.id === wallet.name);
    currency && this.updateCurrency(currency);
    this.showUserWallet(false);
  }

  renderUserListWallet() {
    const { userWallets, shouldShowUserWallet } = this.state;
    const { messages } = this.props.intl;
    if (userWallets?.length === 0) {
      return null;
    }
    return (
      <ul className={`${scopedCss('list-user-wallet')} ${shouldShowUserWallet ? 'show' : ''}`}>
        <li>{messages.wallet_selector.your_wallet}:</li>
        {userWallets.map(wallet => (
          wallet && <li key={wallet?.address} onClick={() => this.onUserWalletSelected(wallet)}>{`${wallet?.name} - ${this.shortIt(wallet?.address)}`}</li>
        ))}
      </ul>
    );
  }

  onBlur() {
    this.showUserWallet(false);
    this.props.onBlur();
  }

  onFocus() {
    this.showUserWallet(true);
    this.props.onFocus();
  }

  render() {
    const { currency, walletAddressError, walletAddress } = this.state;
    const { markRequired } = this.props;
    return (
      <div className={scopedCss('input-with-trailing')}>
        <div className={`input-group ${scopedCss('wallet-input-group')} ${markRequired || walletAddressError ? 'error' : ''}`}>
          <input
            ref={this.addressInput}
            value={walletAddress}
            className={`form-control ${scopedCss('wallet-input')}`}
            onChange={(e) => { this.updateWalletAddress(e.target.value); }}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          <UncontrolledButtonDropdown>
            <DropdownToggle className={scopedCss('wallet-selector')} color="light" block disabled={this.shouldLockCurrencySelector()}>
              <img style={{ opacity: 0.5, margin: '0px 5px' }} alt="" src={arrowDownIcon} width={12} /> {currency.text}
            </DropdownToggle>
            <DropdownMenu>
              {this.renderCurrencyList()}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
        <img onClick={this.openQrScanner} className="prepend" src={qrCodeIcon} alt="" />
        {this.renderUserListWallet()}
        {walletAddressError && <span className="error-msg">{walletAddressError}</span>}
      </div>
    );
  }
}

WalletSelector.defaultProps = {
  onChange: () => null,
  markRequired: false,
};

WalletSelector.propTypes = {
  intl: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  showScanQRCode: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  markRequired: PropTypes.bool,
};


const mapDispatch = { showAlert, showScanQRCode };

export default injectIntl(connect(null, mapDispatch, null, { withRef: true })(WalletSelector), { withRef: true });
