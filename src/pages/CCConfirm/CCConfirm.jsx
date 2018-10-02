import React from 'react';

import './CCConfirm.scss';
import Helper from '@/services/helper';
import local from '@/services/localStore';
import { API_URL, APP, FIAT_CURRENCY, HANDSHAKE_ID, URL } from '@/constants';
import { FormattedMessage, injectIntl } from 'react-intl';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { bindActionCreators } from 'redux';
import { change } from 'redux-form';
import { connect } from 'react-redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import { createCCOrder } from '@/reducers/exchange/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import { BigNumber } from 'bignumber.js';
import { roundNumberByLocale } from '@/services/offer-util';

class CCConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };

    console.log('location.search', window.location.search);
  }

  componentDidMount() {
    const { MD: client_secret } = Helper.getQueryStrings(window.location.search);
    this.source = local.get(APP.CC_SOURCE);
    const { id: cc_client_secret } = this.source;

    if (client_secret && client_secret === cc_client_secret) {
      this.handleSubmit({}, nextProps.userProfile);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userProfile && nextProps.userProfile !== this.props.userProfile) {
      console.log('componentWillReceiveProps', nextProps);
      const { MD: client_secret } = Helper.getQueryStrings(window.location.search);
      this.source = local.get(APP.CC_SOURCE);
      const { id: cc_client_secret } = this.source;

      if (client_secret && client_secret === cc_client_secret) {
        this.handleSubmit({}, nextProps.userProfile);
      }
    }
  }

  showLoading = () => {
    this.setState({ isLoading: true });
  };

  hideLoading = () => {
    this.setState({ isLoading: false });
  };

  handleSubmit = (values, userProfile) => {
    const { PaRes: client_secret } = Helper.getQueryStrings(window.location.search);
    console.log('handleSubmit', this.props);
    const { handleSubmit } = this.props;

    this.showLoading();

    if (handleSubmit) {
      handleSubmit(values);
    } else {
      // console.log('handleSubmit', values);
      // const { userProfile: { creditCard } } = this.props;

      // Use existing credit card
      const {
        id: token, three_d_secure: {
          last4, exp_month, exp_year,
        },
      } = this.source;
      const cc_number = last4;
      const cc_expired = `${exp_month}/${exp_year.toString().substr(2, 2)}`;
      // const card = local.get(APP.CC_TOKEN);

      const cc = {
        cc_num: cc_number,
        // cvv: card,
        expiration_date: cc_expired,
        token,
        client_secret,
      };

      console.log('handleSubmit', cc);
      this.handleCreateCCOrder(cc);
    }
  };

  handleCreateCCOrder = (params) => {
    const { authProfile } = this.props;
    const cryptoPrice = local.get(APP.CC_PRICE);
    const address = local.get(APP.CC_ADDRESS);
    const email = local.get(APP.CC_EMAIL);

    // let address = '';
    // if (addressForced) {
    //   address = addressForced;
    // } else {
    //   const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
    //   address = wallet.address;
    // }

    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiatAmount.trim(),
        fiat_currency: FIAT_CURRENCY.USD,
        address,
        email: email,
        payment_method_data: params,
        username: authProfile ? authProfile.username : '',
      };
      // console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({
        PATH_URL: API_URL.EXCHANGE.CREATE_CC_ORDER,
        data: paramsObj,
        METHOD: 'POST',
        successFn: this.handleCreateCCOrderSuccess,
        errorFn: this.handleCreateCCOrderFailed,
      });
    }
  };

  handleCreateCCOrderSuccess = (data) => {
    console.log('handleCreateCCOrderSuccess', data);

    this.hideLoading();
    local.remove(APP.CC_SOURCE);
    local.remove(APP.CC_PRICE);
    local.remove(APP.CC_ADDRESS);
    local.remove(APP.CC_TOKEN);
    local.remove(APP.CC_EMAIL);

    const {
      data: {
        amount, currency, fiat_amount, fiat_currency,
      },
    } = data;

    const value = roundNumberByLocale(new BigNumber(fiat_amount).multipliedBy(100).toNumber(), fiat_currency).toNumber();

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.buySuccess,
      label: currency,
      value,
    });

    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="buyUsingCreditCardSuccessMessge" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: this.handleBuySuccess,
    });
  };

  handleBuySuccess = () => {
    // if (this.timeoutClosePopup) {
    //   clearTimeout(this.timeoutClosePopup);
    // }

    const { callbackSuccess } = this.props;
    // this.modalRef.close();

    if (callbackSuccess) {
      callbackSuccess();
    } else {
      this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.CREDIT}&tab=transaction`);
    }
  };

  handleCreateCCOrderFailed = (e) => {
    this.hideLoading();

    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: this.handleBuyFailed,
    });
  };

  handleBuyFailed = () => {
    // this.modalRef.close();

    const { callbackFailed } = this.props;

    if (callbackFailed) {
      callbackFailed();
    } else {
      this.props.history.push(`${URL.BUY_BY_CC_URL}`);
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div />
      </React.Fragment>

    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  authProfile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  createCCOrder: bindActionCreators(createCCOrder, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CCConfirm));
