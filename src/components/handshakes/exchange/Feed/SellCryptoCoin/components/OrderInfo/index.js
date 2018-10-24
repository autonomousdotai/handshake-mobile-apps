import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import QrCode from 'qrcode.react';

export class OrderInfo extends Component {
  static propTypes = {
  }

  render() {
    const { orderInfo: { refCode, address, fiatLocalAmount, fiatLocalCurrency, amount, currency } } = this.props;
    return (
      <div>
        <span>Code: {refCode}</span>
        <span>Receiving: {fiatLocalAmount} {fiatLocalCurrency}</span>
        <span>Selling: {amount} {currency}</span>
        <span>Address: {address}</span>
        { address && <QrCode value={address} />}
        <span>Note ---</span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  orderInfo: state.sellCoin.orderInfo,
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo);
