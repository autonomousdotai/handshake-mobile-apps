import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// action, mock
import { CRYPTO_CURRENCY, FIAT_CURRENCY, API_URL } from '@/constants';
import {FormattedDate, FormattedMessage, injectIntl} from 'react-intl';
// components
// style
import {change} from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import { cancelAtmCashTransfer } from '@/reducers/exchange/action';
import './TransactionItem.scss';
import CashStoreTransaction from "@/models/CashStoreTransaction";
import cx from 'classnames';

import icWarning from '@/assets/images/cash/ic-transaction-warning.svg';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
  '': iconUsd,
};

export const CASH_ORDER_STATUS = {
  PROCESSING: 'processing',
  SUCCESS: 'success',
  TRANSFERRING: 'transferring',
  CANCELLED: 'cancelled',
  FAILED: 'transfer_failed',
  FIAT_TRANSFERRING: 'fiat_transferring',
};

class TransactionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transaction: {},
    };
  }

  componentDidMount() {
    const { extraData, initAt } = this.props;
    this.getTransaction(extraData, initAt);
  }

  UNSAFE_componentWillReceiveProps({ extraData, initAt }) {
    this.getTransaction(extraData, initAt);
  }

  onCancelOrder = () => {
    const { transaction } = this.state;
    this.props.cancelAtmCashTransfer({
      PATH_URL: `${API_URL.EXCHANGE.SEND_ATM_CASH_TRANSFER}/${transaction.id}`,
      METHOD: 'DELETE',
      successFn: (res) => {
        const { data } = res;
        const updatedTransaction = data && CashStoreTransaction.cashStoreTransaction(data);
        updatedTransaction && this.setState({ transaction: updatedTransaction });
      },
    });
  }

  getTransaction = (extraData, initAt) => {
    try {
      if (extraData && initAt) {
        let transaction = {};
        transaction = CashStoreTransaction.cashStoreTransaction(JSON.parse(extraData));
        transaction.createdAt = new Date(initAt * 1000).toISOString();
        this.setState({ transaction });
      }
    } catch (e) {
      console.warn('getTransaction', e);
    }
  }

  ellipsisText(text = '') {
    let newText = '';
    if (text.length >= 20) {
      newText = `${text.substr(0, 4)}...${text.substr(-6)}`;
    }

    return newText;
  }

  render() {
    const { messages } = this.props.intl;
    const { initAt } = this.props;
    const { amount, currency, fiatAmount, status, address } = this.state.transaction;

    return (
      <div className="transaction">
        <div className="text-normal" style={{ padding: '0 15px', marginBottom: '7px' }}>
          <FormattedDate
            value={new Date(initAt * 1000)}
            year="numeric"
            month="long"
            day="2-digit"
            hour="2-digit"
            minute="2-digit"
          />
        </div>
        <div className="transaction-detail">
          {
            <div>
              {/*<div className="d-table w-100">
                <div className="d-table-cell font-weight-bold">
                  <img src={CRYPTO_ICONS[currency]} width={19} />
                  <span className="type-order ml-2">{feedType === CREDIT_FEED_TYPES.DEPOSIT ? messages.me.credit.transaction.deposit.title :
                    feedType === CREDIT_FEED_TYPES.TRANSACTION ? messages.me.credit.transaction.transaction.title :
                      feedType === CREDIT_FEED_TYPES.WITHDRAW ? messages.me.credit.transaction.withdraw.title :
                        feedType === CREDIT_FEED_TYPES.INSTANT ? messages.me.credit.transaction.instant.title : ''
                  }</span>
                </div>
                {
                  subStatus === 'transferring' && (
                    <div className="d-table-cell text-right">
                      <img src={iconSpinner} width="14px" />
                      <span className="status ml-2">{messages.me.credit.transaction.processing}</span>
                    </div>
                  )
                }
              </div>*/}

              {status === CASH_ORDER_STATUS.PROCESSING && (
                <div className="text-normal mt-2">
                  {messages.create.atm.transactions.messageTransfer}
                  <span className="transfer-now" onClick={() => this.props.onShowTransferInfo(this.state.transaction)}>{messages.create.atm.transactions.transferNow}</span>
                </div>
              )
              }

              {/*<hr />*/}
            </div>
          }

          <div className="mt-3">
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.create.atm.transactions.amount}
              </div>
              <div className="d-table-cell text-right">
                <span className="font-weight-bold">{amount}</span>
                &nbsp;
                <span className="text-normal">{currency}</span>
              </div>
            </div>

            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.create.atm.transactions.needToTransfer}
              </div>
              <div className="d-table-cell text-right">
                <img src={icWarning} width="16px" style={{ marginBottom: '4px' }}/>
                &nbsp;&nbsp;
                <span className="font-weight-bold">{fiatAmount}</span>
                &nbsp;
                <span className="text-normal">{FIAT_CURRENCY.USD}</span>
              </div>
            </div>
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.create.atm.transactions.to_wallet}
              </div>
              <div className="d-table-cell text-right">
                <span className="font-weight-bold">{this.ellipsisText(address)}</span>
              </div>
            </div>
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.create.atm.transactions.status}
              </div>
              <div className="d-table-cell text-right">
                <span className={cx('text-normal', `${status}`)}>{messages.create.atm.transactions.statusValues[status] || '---'}</span>
              </div>
            </div>
            {
              status === CASH_ORDER_STATUS.PROCESSING && (
                <div className="d-table w-100" style={{ textAlign: 'center' }}>
                  <ConfirmButton
                    onConfirm={this.onCancelOrder}
                    label={messages.create.atm.transactions.cancel_order}
                  />
                </div>
              )
            }
          </div>

        </div>
      </div>
    );
  }
}

const mapState = state => ({
  // me: state.me
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  cancelAtmCashTransfer: bindActionCreators(cancelAtmCashTransfer, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(TransactionItem));
