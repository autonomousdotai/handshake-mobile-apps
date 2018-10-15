import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_FEED_TYPE,
  FIAT_CURRENCY,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl';
// components
import {
  deactiveDepositCoinATM,
  getCreditATM,
  getDashboardInfo,
  getListOfferPrice,
  getOfferStores,
  reviewOffer,
} from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import { change } from 'redux-form';
import cx from 'classnames';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import { showAlert } from '@/reducers/app/action';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

class Asset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
    };
  }

  getCreditATM = () => {
    this.props.getCreditATM({ PATH_URL: API_URL.EXCHANGE.CREDIT_ATM });
  }

  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  deactiveDeposit = () => {
    console.log('deactiveDeposit');
    const { messages } = this.props.intl;

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{messages.me.credit.overview.askToDeactive}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={this.handleDeactiveDeposit}><FormattedMessage id="ex.btn.confirm" /></Button>
            <Button block className="btn btn-secondary" onClick={this.cancelDeactive}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  handleDeactiveDeposit = () => {
    this.showLoading();
    this.modalRef.close();
    const { currency } = this.props;
    this.props.deactiveDepositCoinATM({
      PATH_URL: `${API_URL.EXCHANGE.CREDIT_ATM}?currency=${currency}`,
      METHOD: 'DELETE',
      successFn: this.handleDeactiveDepositSuccess,
      errorFn: this.handleDeactiveDepositFailed,
    });
  }

  cancelDeactive = () => {
    this.modalRef.close();
  }

  handleDeactiveDepositSuccess = async (res) => {
    console.log('handleWithdrawCashSuccess', res);
    const { messages } = this.props.intl;

    this.hideLoading();

    this.props.showAlert({
      message: <div className="text-center">{messages.me.credit.overview.messageDeactiveSuccess}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.getCreditATM();
      },
    });
  }

  handleDeactiveDepositFailed = (e) => {
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
    const { currency, status, subStatus, sold, balance, revenue, percentage, listOfferPrice } = this.props;
    const { modalContent } = this.state;
    // const isActive = status === 'active';

    const offerPrice = listOfferPrice && listOfferPrice.find((item) => {
      const { type, currency: name, fiatCurrency } = item;
      return type === EXCHANGE_ACTION.SELL && currency === name && fiatCurrency === FIAT_CURRENCY.USD;
    });

    let fiatCurrency = offerPrice && offerPrice.price || 0;
    fiatCurrency *= (1 + percentage / 100);

    return (
      <div className="asset position-relative">
        <div style={{ opacity: status === 'inactive' ? 0.3 : 1 }}>
          <div>
            <img src={CRYPTO_ICONS[currency]} width={19} />
            <span className="ml-1 text-normal">{CRYPTO_CURRENCY_NAME[currency]}</span>
          </div>
          <div className="mt-4">
            {subStatus === 'transferring' && (
              <div className="text-normal mt-2">
                <FormattedMessage id="movingCoinToEscrow" values={{}} />
              </div>
            )
            }
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.amountSold" />
              </div>
              <div className="d-table-cell text-right red-color">
                {sold || 0}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.amountLeft" />
              </div>
              <div className="d-table-cell text-right black-color">
                {balance || 0}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.currentPrice" values={{ currency, fiatCurrency: FIAT_CURRENCY.USD }} />
              </div>
              <div className="d-table-cell text-right black-color">
                {formatMoneyByLocale(fiatCurrency, FIAT_CURRENCY.USD)}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.revenue" />
              </div>
              <div className="d-table-cell text-right black-color">
                {revenue || 0}
              </div>
            </div>
          </div>
        </div>

        {
          status === 'inactive' ? (
            <button
              className={cx('btn btn-sm btn-activate', 'primary-button')}
              onClick={() => this.props.depositCoinATM(currency)}
            >
              <FormattedMessage id="dashboard.btn.reactivate" />
            </button>
          ) : subStatus !== 'transferring' ? (
            <button
              className={cx('btn btn-sm btn-activate', 'outline-button')}
              onClick={this.deactiveDeposit}
            >
              <FormattedMessage id="dashboard.btn.deactivate" />
            </button>
          ) : (
            <div className="d-table-cell btn-activate lbl-depositing">
              <img src={iconSpinner} width="14px" style={{ marginTop: '-2px' }} />
              <span className="ml-1"><FormattedMessage id="dashboard.btn.depositing" /></span>
            </div>
          )
        }

        <hr />
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapState = state => ({
  // me: state.me
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  deactiveDepositCoinATM: bindActionCreators(deactiveDepositCoinATM, dispatch),
  getCreditATM: bindActionCreators(getCreditATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Asset));
