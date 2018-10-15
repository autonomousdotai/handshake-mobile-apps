import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY,
  EXCHANGE_FEED_TYPE,
  FIAT_CURRENCY,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedDate, FormattedMessage, injectIntl } from 'react-intl';
// components
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import { change } from 'redux-form';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import CreditTransaction from '@/models/CreditTransaction';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
  '': iconUsd,
};

export const CREDIT_FEED_TYPES = {
  TRANSACTION: 'credit_transaction',
  DEPOSIT: 'credit_deposit',
  WITHDRAW: 'credit_withdraw',
  INSTANT: 'instant',
};

class TransactionItem extends React.Component {
  constructor(props) {
    super(props);
    const { extraData } = props;

    this.transaction = CreditTransaction.creditTransaction(JSON.parse(extraData));
  }

  render() {
    const { messages } = this.props.intl;
    const { initAt } = this.props;
    const { amount, percentage, currency, revenue, feedType, status, subStatus, information, fiatAmount, fee } = this.transaction;
    console.log('this.transaction', this.transaction);

    return (
      <div className="transaction">
        <div className="text-normal" style={{ padding: '0 15px' }}>
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
              </div>

              {feedType === CREDIT_FEED_TYPES.DEPOSIT && subStatus === 'transferring' && (
                <div className="text-normal mt-2">
                  <FormattedMessage id="movingCoinToEscrow" values={{}} />
                </div>
              )
              }

              <hr />
            </div>
          }

          {
            feedType === CREDIT_FEED_TYPES.DEPOSIT ? (
              <div>
                <div className="d-table w-100">
                  <div className="d-table-cell text-normal">
                    {messages.me.credit.transaction.amount}
                  </div>
                  <div className="d-table-cell text-right">
                    <span className="font-weight-bold">{amount}</span>
                    &nbsp;
                    <span className="text-normal">{currency}</span>
                  </div>
                </div>

                <div className="d-table w-100">
                  <div className="d-table-cell text-normal">
                    {messages.me.credit.transaction.deposit.percentage}
                  </div>
                  <div className="d-table-cell text-right">
                    <span className="font-weight-bold">{percentage}</span>
                    &nbsp;
                    <span className="text-normal">%</span>
                  </div>
                </div>
              </div>
            )
              : feedType === CREDIT_FEED_TYPES.WITHDRAW ? (
                <div>
                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      {messages.me.credit.transaction.amount}
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">{amount}</span>
                      &nbsp;
                      <span className="text-normal">{FIAT_CURRENCY.USD}</span>
                    </div>
                  </div>

                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      {messages.me.credit.transaction.withdraw.toAccount}
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">{information?.username}</span>
                    </div>
                  </div>
                </div>
            ) : feedType === CREDIT_FEED_TYPES.TRANSACTION ? (
              <div>
                <div className="d-table w-100">
                  <div className="d-table-cell text-normal">
                    {messages.me.credit.transaction.transaction.selling}
                  </div>
                  <div className="d-table-cell text-right">
                    <span className="font-weight-bold">{amount}</span>
                      &nbsp;
                    <span className="text-normal">{currency}</span>
                  </div>
                </div>

                <div className="d-table w-100">
                  <div className="d-table-cell text-normal">
                    {messages.me.credit.transaction.transaction.receiving}
                  </div>
                  <div className="d-table-cell text-right">
                    <span className="font-weight-bold">{revenue}</span>
                      &nbsp;
                    <span className="text-normal">{FIAT_CURRENCY.USD}</span>
                  </div>
                </div>
                <div className="d-table w-100">
                  <div className="d-table-cell text-normal">
                    {messages.me.credit.transaction.transaction.fee}
                  </div>
                  <div className="d-table-cell text-right">
                    <span className="font-weight-bold">{fee}</span>
                    &nbsp;
                    <span className="text-normal">{FIAT_CURRENCY.USD}</span>
                  </div>
                </div>
              </div>
            ) : feedType === CREDIT_FEED_TYPES.INSTANT ? (
                <div>
                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      {messages.me.credit.transaction.instant.buying}
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">{amount}</span>
                      &nbsp;
                      <span className="text-normal">{currency}</span>
                    </div>
                  </div>

                  <div className="d-table w-100">
                    <div className="d-table-cell text-normal">
                      {messages.me.credit.transaction.instant.cost}
                    </div>
                    <div className="d-table-cell text-right">
                      <span className="font-weight-bold">{fiatAmount}</span>
                      &nbsp;
                      <span className="text-normal">{FIAT_CURRENCY.USD}</span>
                    </div>
                  </div>
                </div>
              ) : <div />
          }

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
});

export default injectIntl(connect(mapState, mapDispatch)(TransactionItem));
