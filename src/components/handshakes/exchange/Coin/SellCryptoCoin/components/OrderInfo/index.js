import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showAlert } from '@/reducers/app/action';
import QrCode from 'qrcode.react';
import { injectIntl } from 'react-intl';
import { formatMoneyByLocale } from '@/services/offer-util';
import ClockCount from '@/components/handshakes/exchange/components/ClockCount';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import iconCopy from '@/assets/images/icon/icon-copy.svg';
import './styles.scss';

const scopedCss = (className) => `sell-crypto-coin-summary-${className}`;

class OrderInfo extends Component {
  onFinish = () => {
    const { onFinish } = this.props;
    if (typeof onFinish === 'function') {
      onFinish();
    }
  }

  onCountdownExpired = () => {
    const { getCoinInfo } = this.props;
    if (typeof getCoinInfo === 'function') {
      getCoinInfo();
    }
  }

  getLocalStr = () => {
    const { intl: { messages } } = this.props;
    return messages?.sell_coin?.summary || {};
  };

  copied = () => {
    const { messages: { atm_cash_transfer_info } } = this.props.intl;
    this.props.showAlert({
      message: atm_cash_transfer_info.copied,
      timeOut: 3000,
      isShowClose: true,
      type: 'success',
    });
  }

  isValidToSubmit = () => {
    const { orderInfo, generatedAddress } = this.props;
    const { fiatLocalAmount, fiatLocalCurrency, amount, currency } = orderInfo;
    if (!generatedAddress || !fiatLocalAmount || !amount || !fiatLocalCurrency || !currency) {
      return false;
    }
    return true;
  }

  renderAddressWallet = (text) => {
    return (
      <CopyToClipboard text={text} onCopy={this.copied}>
        <div className="address-wallet">
          <span>{text}</span>
          <div className="copy-icon"><img alt="copy-icon" src={iconCopy} /></div>
        </div>
      </CopyToClipboard>
    );
  }

  renderInfo = () => {
    const { orderInfo: { fiatLocalAmount, fiatLocalCurrency, amount, currency } } = this.props;
    const infos = [
      {
        name: this.getLocalStr().info?.receiving,
        value: `${formatMoneyByLocale(fiatLocalAmount) || ''} ${fiatLocalCurrency || ''}`,
      },
      {
        name: this.getLocalStr().info?.selling,
        value: `${amount || ''} ${currency || ''}`,
      },
    ];
    return (
      <div className={scopedCss('summary-info')}>
        {infos.map(({ name, value }) => (
          <div key={name} className={scopedCss('info-item')}>
            <span>{name}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    );
  }

  renderNotes = () => {
    const notes = this.getLocalStr().info?.notes || {};
    return (
      <div className={scopedCss('note-txt')}>
        <div>
          <span>{notes.main_note}</span>
          <span>{notes.sub_note}</span>
        </div>
        <ul>
          {
            // eslint-disable-next-line
            notes.list?.map((note, index) => (<li key={index}>{note}</li>))
          }
        </ul>
      </div>
    );
  }

  render() {
    const { className, generatedAddress, onFinish } = this.props;
    return (
      <div className={`${scopedCss('container')} ${className}`}>
        <span className={scopedCss('summary-txt')}>{this.getLocalStr().label}</span>
        <ClockCount
          internalClockdown
          loop
          duration={300}
          className={scopedCss('countdown')}
          onExpired={this.onCountdownExpired}
        />
        {this.renderInfo()}
        <div className={scopedCss('qr-container')}>
          { generatedAddress && this.renderAddressWallet(generatedAddress) }
          { generatedAddress && <QrCode value={generatedAddress} />}
          {this.renderNotes()}
        </div>
        {onFinish && <button disabled={!this.isValidToSubmit()} onClick={this.onFinish} className={scopedCss('btn')}>{this.getLocalStr().btn?.close_summary}</button>}
      </div>
    );
  }
}

const mapDispatchToProps = {
  showAlert,
};

OrderInfo.defaultProps = {
  className: '',
  onFinish: null,
  getCoinInfo: null,
};

OrderInfo.propTypes = {
  orderInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
  className: PropTypes.string,
  generatedAddress: PropTypes.string.isRequired,
  onFinish: PropTypes.func,
  getCoinInfo: PropTypes.func,
};

export default injectIntl(connect(null, mapDispatchToProps)(OrderInfo));
