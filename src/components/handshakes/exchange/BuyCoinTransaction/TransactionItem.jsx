import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { API_URL, CRYPTO_CURRENCY } from '@/constants';
import { FormattedDate, injectIntl } from 'react-intl';
// components
// style
import { change } from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import { cancelNinjaCoinTransaction } from '@/reducers/exchange/action';
import './TransactionItem.scss';
import cx from 'classnames';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import NinjaCoinTransaction from '@/models/NinjaCoinTransaction';
import { formatMoneyByLocale } from '@/services/offer-util';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
  '': iconUsd,
};

export const COIN_ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  FIAT_TRANSFERRING: 'fiat_transferring',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
  TRANSFERRING: 'transferring',
  TRANSFER_FAILED: 'transfer_failed',
  SUCCESS: 'success',
  REJECTED: 'rejected',
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
    const { offerFeedType } = this.props;
    const endPoint = offerFeedType === 'coin' ? API_URL.EXCHANGE.BUY_CRYPTO_SAVE_RECEIPT : API_URL.EXCHANGE.SELL_COIN_ORDER;
    this.props.cancelNinjaCoinTransaction({
      PATH_URL: `${endPoint}/${transaction.id}`,
      METHOD: 'DELETE',
      successFn: (res) => {
        const { data } = res;
        const updatedTransaction = data && NinjaCoinTransaction.transaction(data);
        updatedTransaction && this.setState({ transaction: updatedTransaction });
      },
    });
  }

  getTransaction = (extraData, initAt) => {
    try {
      if (extraData && initAt) {
        const { offerFeedType } = this.props;
        let transaction = {};
        transaction = NinjaCoinTransaction.transaction(JSON.parse(extraData));
        transaction.createdAt = new Date(initAt * 1000).toISOString();
        transaction.offerFeedType = offerFeedType;
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
    const { initAt, offerFeedType } = this.props;
    const { amount, currency, fiatLocalAmount, fiatLocalCurrency, status, address, type, refCode, reviewed } = this.state.transaction;

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
              <div className="d-table w-100">
                <div className="d-table-cell font-weight-bold">
                  <img src={CRYPTO_ICONS[currency]} width={19} />
                  <span className="type-order ml-2">
                    {
                      offerFeedType === 'coin' ? messages.me.credit.transaction.instant.title : messages.me.credit.transaction.transaction.title
                    }
                  </span>
                </div>
              </div>

              {offerFeedType === 'coin' && type === 'bank' && status === COIN_ORDER_STATUS.PENDING && (
                <div className="text-normal mt-2">
                  <span className="transfer-title">{messages.create.atm.transactions.messageTransfer}</span>
                  <span className="transfer-now" onClick={() => this.props.onShowTransferInfo(this.state.transaction)}>{messages.create.atm.transactions.transferNow}</span>
                </div>
              )
              }

              <hr />
            </div>
          }

          <div className="mt-3">
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
                <span className="font-weight-bold">{formatMoneyByLocale(fiatLocalAmount, fiatLocalCurrency, 2)}</span>
                &nbsp;
                <span className="text-normal">{fiatLocalCurrency}</span>
              </div>
            </div>
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.buy_coin_transaction.code}
              </div>
              <div className="d-table-cell text-right">
                <span className="font-weight-bold">{refCode}</span>
              </div>
            </div>
            <div className="d-table w-100">
              <div className="d-table-cell text-normal">
                {messages.create.atm.transactions.status}
              </div>
              <div className="d-table-cell text-right">
                <span className={cx('text-normal', `${status}`)}>{messages.buy_coin_transaction.statusValues[status] || '---'}</span>
              </div>
            </div>
            {
              status === COIN_ORDER_STATUS.PENDING && (
                <div className="d-table w-100" style={{ textAlign: 'right' }}>
                  <ConfirmButton
                    onConfirm={this.onCancelOrder}
                    label={messages.create.atm.transactions.cancel_order}
                    buttonClassName="cancel-btn"
                  />
                </div>
              )
            }
            {
              status === COIN_ORDER_STATUS.SUCCESS && !reviewed && (
                <div className="d-table w-100" style={{ textAlign: 'right' }}>
                  <button onClick={() => this.props.onShowReview(this.state.transaction)} className="btn cancel-btn">
                    {messages.create.atm.transactions.review_order}
                  </button>
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
  cancelNinjaCoinTransaction: bindActionCreators(cancelNinjaCoinTransaction, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(TransactionItem));
