import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
// components
// style
import createForm from '@/components/core/form/createForm';
import { change } from 'redux-form';
import { API_URL, HANDSHAKE_ID } from '@/constants';

import TransactionItem from './TransactionItem';
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import Modal from '@/components/core/controls/Modal/Modal';
import { getTransactionNinjaCoin, reviewBuyCoin } from '@/reducers/exchange/action';
import { buyCryptoGetBankInfo, buyCryptoSaveRecipt } from '@/reducers/buyCoin/action';
import Review from '@/components/core/controls/Review/Review';

const nameFormTransaction = 'formTransaction';
const FormTransaction = createForm({
  propsReduxForm: {
    form: nameFormTransaction,
  },
});

class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      modalTitle: '',
      selectedTransaction: {},
    };
  }

  componentDidMount() {
    const { country } = this.props;
    this.getTransactionNinjaCoin();
  }

  getTransactionNinjaCoin = () => {
    this.props.getTransactionNinjaCoin({
      PATH_URL: API_URL.ME.BASE,
      qs: {
        type: HANDSHAKE_ID.EXCHANGE,
      },
    });
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  onReceiptSaved = () => {
    // get new data from server
    this.getTransactionNinjaCoin();
    this.modalRef.close();
  }

  openNewTransaction = (transaction = {}) => {
    this.setState({ selectedTransaction: transaction }, () => {
      const { center } = transaction;

      const { messages } = this.props.intl;

      this.props.buyCryptoGetBankInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_BANK_INFO}/${center}`,
        successFn: (res) => {
          const bankInfo = res.data[0].information;

          // let bankData = {};
          const receipt = {
            createdAt: transaction.createdAt,
            amount: transaction.fiatAmount || 0,
            // customerAmount: +transaction.fiatAmount,
            // amount: (+transaction.fiatAmount - +transaction.storeFee) || 0,
            fiatCurrency: transaction.fiatCurrency,
            referenceCode: transaction.refCode,
            status: transaction.status,
            id: transaction.id,
          };

          const bankData = bankInfo;
          // if fiatAmount over limit => use global bank, else local bank
          // if (this.isOverLimit(receipt.amount)) {
            // bankData = bankInfo.XX; // global bank
          // } else {
            // bankData = bankInfo[country] || bankInfo.XX;
            receipt.amount = transaction.fiatLocalAmount;
            receipt.fiatCurrency = transaction.fiatLocalCurrency;
          // }
          this.setState({
            modalTitle: messages.atm_cash_transfer_info.title,
            modalContent: (
              <AtmCashTransferInfo
                receipt={receipt}
                bankInfo={bankData}
                saveReceiptHandle={this.saveReceiptHandle}
                onDone={this.onReceiptSaved}
              />
            ),
          }, () => {
            this.modalRef.open();
          });
        },
      });
    });
  }

  saveReceiptHandle = ({ data, successFn, errorFn }) => {
    const { selectedTransaction } = this.state;
    this.props.buyCryptoSaveRecipt({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_SAVE_RECEIPT}/${selectedTransaction?.id}`,
      METHOD: 'PUT',
      data,
      successFn,
      errorFn,
    });
  }

  isOverLimit = (amountInUsd) => {
    const { coinInfo } = this.props;
    const amount = amountInUsd || coinInfo?.fiatAmount;
    return Number.parseFloat(amount) > Number.parseFloat(coinInfo?.limit);
  }

  showReview = (transaction = {}) => {
    this.setState({ selectedTransaction: transaction }, () => {
      const { messages } = this.props.intl;
      this.setState({
        modalTitle: messages.review.title,
        modalContent: (
          <Review onSubmit={this.handleSubmitRating} />
        ),
      }, () => {
        this.modalRef.open();
      });
    });
  }

  // Review offer when receive notification after shop complete
  handleSubmitRating = (values) => {
    const { review } = values;
    const { selectedTransaction } = this.state;
    this.props.reviewBuyCoin({
      PATH_URL: `${API_URL.INTERNAL.REVIEW_COIN_ORDER}`,
      METHOD: 'POST',
      data: { review: review.trim(), order: selectedTransaction.id },
      successFn: this.handleReviewOfferSuccess,
      errorFn: this.handleReviewOfferFailed,
    });
  }

  handleReviewOfferSuccess = (responseData) => {
    const data = responseData.data;
    this.modalRef.close();
    this.getTransactionNinjaCoin();
  }

  handleReviewOfferFailed = (e) => {
    this.modalRef.close();
  }

  renderTransactionList = () => {
    const { buyCoinTransaction, intl: { messages } } = this.props;

    if (buyCoinTransaction && buyCoinTransaction.length === 0) {
      return (
        <div className="empty-list">
          <FormattedHTMLMessage id="buy_coin_transaction.text.no_history" />
        </div>
      );
    }

    return (
      <div>
        {
          buyCoinTransaction && buyCoinTransaction.map(transaction => {
            const { id } = transaction;
            return (
              <TransactionItem key={id} {...transaction} onShowTransferInfo={this.openNewTransaction} onShowReview={this.showReview} />
            );
          })
        }
      </div>
    );
  }

  render() {
    const { modalContent, modalTitle } = this.state;

    return (
      <div className="transaction-container mt-4">
        {this.renderTransactionList()}
        <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
          {modalContent}
        </Modal>
      </div>
    );
  }
}

const mapState = state => ({
  buyCoinTransaction: state.exchange.buyCoinTransaction,
  country: state.app.ipInfo.country,
  bankInfo: state.buyCoin?.bankInfo,
  coinInfo: state.buyCoin?.coinInfo || {},
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  getTransactionNinjaCoin: bindActionCreators(getTransactionNinjaCoin, dispatch),
  buyCryptoGetBankInfo: bindActionCreators(buyCryptoGetBankInfo, dispatch),
  buyCryptoSaveRecipt: bindActionCreators(buyCryptoSaveRecipt, dispatch),
  reviewBuyCoin: bindActionCreators(reviewBuyCoin, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Transaction));
