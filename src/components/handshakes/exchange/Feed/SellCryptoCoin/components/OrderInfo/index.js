import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sellCryptoFinishOrder } from '@/reducers/sellCoin/action';
import QrCode from 'qrcode.react';
import { injectIntl } from 'react-intl';
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

  shortIt(str = '') {
    const [START, END] = [9, 10];
    return `${str.substr(0, START)}...${str.substr(-END)}`;
  }

  renderInfo = () => {
    const { orderInfo: { refCode, address, fiatLocalAmount, fiatLocalCurrency, amount, currency } } = this.props;
    const infos = [
      {
        name: this.getLocalStr().info?.code,
        value: refCode || '',
      },
      {
        name: this.getLocalStr().info?.receiving,
        value: `${fiatLocalAmount || ''} ${fiatLocalCurrency || ''}`,
      },
      {
        name: this.getLocalStr().info?.selling,
        value: `${amount || ''} ${currency || ''}`,
      },
      {
        name: this.getLocalStr().info?.address,
        value: this.shortIt(address || ''),
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
};

OrderInfo.propTypes = {
  sellCryptoFinishOrder: PropTypes.func.isRequired,
  orderInfo: PropTypes.object.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderInfo));
