import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellCryptoFinishOrder } from '@/reducers/sellCoin/action';
import { showAlert } from '@/reducers/app/action';
import QrCode from 'qrcode.react';
import { injectIntl } from 'react-intl';
import { formatMoneyByLocale } from '@/services/offer-util';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import iconCopy from '@/assets/images/icon/icon-copy.svg';
import './styles.scss';

const scopedCss = (className) => `sell-crypto-coin-summary-${className}`;

class OrderInfo extends Component {
  onFinish = () => {
    this.props.sellCryptoFinishOrder();
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
    const { orderInfo: { refCode, fiatLocalAmount, fiatLocalCurrency, amount, currency } } = this.props;
    const infos = [
      {
        name: this.getLocalStr().info?.code,
        value: refCode || '',
      },
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
    const notes = this.getLocalStr().info?.notes || [];
    return (
      <ul className={scopedCss('note-txt')}>
        {
          // eslint-disable-next-line
          notes.map((note, index) => (<li key={index}>{note}</li>))
        }
      </ul>
    );
  }

  render() {
    const { orderInfo: { address } } = this.props;
    return (
      <div className={scopedCss('container')}>
        <span className={scopedCss('summary-txt')}>{this.getLocalStr().label}</span>
        {this.renderInfo()}
        <div className={scopedCss('qr-container')}>
          { address && this.renderAddressWallet(address) }
          { address && <QrCode value={address} />}
          {this.renderNotes()}
        </div>
        <button onClick={this.onFinish} className={scopedCss('btn')}>{this.getLocalStr().btn?.close_summary}</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orderInfo: state.sellCoin.orderInfo,
});

const mapDispatchToProps = {
  sellCryptoFinishOrder,
  showAlert,
};

OrderInfo.propTypes = {
  sellCryptoFinishOrder: PropTypes.func.isRequired,
  orderInfo: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInfo));
