import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { injectIntl } from 'react-intl';
// components
import {
  getDashboardInfo,
  getListOfferPrice,
  getOfferStores,
  getTransactionCreditATM,
  reviewOffer,
} from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import createForm from '@/components/core/form/createForm';
import { change } from 'redux-form';

import TransactionItem from './TransactionItem';

const nameFormTransaction = 'formTransaction';
const FormTransaction = createForm({
  propsReduxForm: {
    form: nameFormTransaction,
  },
});

class Transaction extends React.Component {
  componentDidMount() {
    this.getTransactionCreditATM();
  }

  getTransactionCreditATM = () => {
    const qs = {};

    qs.type = HANDSHAKE_ID.CREDIT;

    this.props.getTransactionCreditATM({ PATH_URL: API_URL.ME.BASE, qs });
  }

  render() {
    const { creditTransactions } = this.props;

    return (
      <div className="mt-4">
        {
          creditTransactions && creditTransactions.map(transaction => {
            const { id } = transaction;
            return (
              <TransactionItem key={id} {...transaction} />
            );
          })
        }
      </div>
    );
  }
}

const mapState = state => ({
  me: state.me,
  creditTransactions: state.exchange.creditTransactions,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  getTransactionCreditATM: bindActionCreators(getTransactionCreditATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Transaction));
