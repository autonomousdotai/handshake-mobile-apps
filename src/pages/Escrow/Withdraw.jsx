import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { API_URL, CRYPTO_CURRENCY, EXCHANGE_ACTION, FIAT_CURRENCY, MIN_AMOUNT, NB_BLOCKS, URL } from '@/constants';
import createForm from '@/components/core/form/createForm';
import { change, Field } from 'redux-form';
import './Deposit.scss';
import { fieldInput } from '@/components/core/form/customField';
import iconPaypal from '@/assets/images/icon/icons8-paypal.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import {email, isNormalInteger, minValue, number, required} from '@/components/core/form/validation';
import { bindActionCreators } from 'redux';
import {
  createCreditATM,
  depositCoinATM,
  getCreditATM,
  trackingDepositCoinATM,
  withdrawCashDepositATM,
} from '@/reducers/exchange/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

import './CommonStyle.scss';
import './Withdraw.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';

const nameFormEscrowWithdraw = 'escrowWithdraw';
const FormEscrowWithdraw = createForm({
  propsReduxForm: {
    form: nameFormEscrowWithdraw,
  },
});

class EscrowWithdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
    };
  }

  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  handleValidate = (values) => {
    console.log('handleValidate', values);
    const { amount, username } = values;
    const { creditRevenue } = this.props;
    const { messages } = this.props.intl;

    const errors = {};

    if (amount <= 0) {
      errors.amount = messages.me.credit.withdraw.validate.amountMustLargerThan0;
    } else if (amount > creditRevenue) {
      errors.amount = messages.me.credit.withdraw.validate.amountMustLessThanBalance;
    }

    return errors;
  }

  handleWithdraw = (values) => {
    const { messages } = this.props.intl;
    console.log('handleWithdraw', values);

    const { amount, username } = values;

    const offer = { amount, information: { username } };

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{messages.me.credit.withdraw.askToWithdraw}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.withdrawCash(offer)}><FormattedMessage id="ex.btn.confirm" /></Button>
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  withdrawCash = (offer) => {
    this.showLoading();
    this.modalRef.close();

    this.props.withdrawCashDepositATM({
      PATH_URL: API_URL.EXCHANGE.WITHDRAW_CASH_DEPOSIT_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleWithdrawCashSuccess,
      errorFn: this.handleWithdrawCashFailed,
    });
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  handleWithdrawCashSuccess = async (res) => {
    console.log('handleWithdrawCashSuccess', res);

    this.hideLoading();

    this.props.history.push(URL.ESCROW_WITHDRAW_SUCCESS);
  }

  handleWithdrawCashFailed = (e) => {
    console.log('handleWithdrawCashFailed', e);
    this.hideLoading();

    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }


  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;
    const { creditRevenue } = this.props;
    const { modalContent } = this.state;

    return (
      <div className="escrow-withdraw">
        {/* <div> */}
        {/* <button className="btn btn-lg bg-transparent d-inline-block btn-close"> */}
        {/* &times; */}
        {/* </button> */}
        {/* </div> */}
        <div className="wrapper font-weight-normal">
          <FormEscrowWithdraw onSubmit={this.handleWithdraw} validate={this.handleValidate}>
            {/* <h4 className="font-weight-bold">Withdraw money</h4> */}
            <div className="d-table w-100 mt-4">
              <div className="d-table-cell escrow-label">{messages.me.credit.withdraw.yourBalance}</div>
              <div className="d-table-cell text-right black-color">
                {creditRevenue}
              </div>
            </div>

            <div className="mt-4">
              <div className="escrow-label">{messages.me.credit.withdraw.yourPapalName}</div>
              <div>
                <Field
                  name="username"
                  className="form-control w-100"
                  type="text"
                  component={fieldInput}
                  validate={[email, required]}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="escrow-label">{messages.me.credit.withdraw.amount}</div>
              <div>
                <Field
                  name="amount"
                  className="form-control w-100"
                  type="text"
                  component={fieldInput}
                  validate={[number, required]}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-block btn-escrow-primary"
              >
                <img src={iconPaypal} className="mr-2" width={20} />
                <span>{messages.me.credit.withdraw.buttonTitle}</span>
              </button>
            </div>
            <div className="text-center mt-2">
              <small className="escrow-label">
                {messages.me.credit.withdraw.description}
              </small>
            </div>
          </FormEscrowWithdraw>
        </div>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapState = state => ({
  depositInfo: state.exchange.depositInfo,
  creditRevenue: state.exchange.creditRevenue || 0,
});

const mapDispatch = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  withdrawCashDepositATM: bindActionCreators(withdrawCashDepositATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(EscrowWithdraw));
