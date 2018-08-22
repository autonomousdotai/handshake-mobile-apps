import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import CreditCard from '@/components/handshakes/exchange/components/CreditCard';
import LevelItem from '@/components/handshakes/exchange/components/LevelItem';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import local from '@/services/localStore';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_LIST,
  FIAT_CURRENCY,
  FIAT_CURRENCY_SYMBOL,
  URL,
} from '@/constants';
import '../styles.scss';
import { validate } from '@/components/handshakes/exchange/validation';
import throttle from 'lodash/throttle';
import createForm from '@/components/core/form/createForm';
import { fieldCleave, fieldDropdown, fieldInput, fieldRadioButton } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import { createCCOrder, getCcLimits, getCryptoPrice, getUserCcLimit } from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import _sample from 'lodash/sample';
import { feedBackgroundColors } from '@/components/handshakes/exchange/config';
import { formatMoney } from '@/services/offer-util';
import { BigNumber } from 'bignumber.js';
import axios from 'axios';
import './FeedCreditCard.scss';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';

const nameFormCreditCard = 'creditCard';
const FormCreditCard = createForm({
  propsReduxForm: {
    form: nameFormCreditCard,
    initialValues: { currency: CRYPTO_CURRENCY_DEFAULT },
  },
});
const selectorFormCreditCard = formValueSelector(nameFormCreditCard);

// const mainColor = '#259B24'

class FeedCreditCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: CRYPTO_CURRENCY_DEFAULT,
      isNewCCOpen: false,
      modalContent: '',
      showCCScheme: false,
    };
    this.getCryptoPriceByAmountThrottled = throttle(this.getCryptoPriceByAmount, 500);
    this.mainColor = _sample(feedBackgroundColors);
  }

  async componentDidMount() {
    const { currencyForced, rfChange } = this.props;
    if (currencyForced) {
      rfChange(nameFormCreditCard, 'currency', currencyForced);
    }

    this.props.getCcLimits({ PATH_URL: API_URL.EXCHANGE.GET_CC_LIMITS });
    this.props.getUserCcLimit({ PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT });

    this.getCryptoPriceByAmount(0);

    this.intervalCountdown = setInterval(() => {
      this.getCryptoPriceByAmount(this.state.amount);
    }, 30000);
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  showLoading = () => {
    this.props.showLoading({ message: '' });
  };

  hideLoading = () => {
    this.props.hideLoading();
  };

  getCryptoPriceByAmount = (amount) => {
    const cryptoCurrency = this.state.currency;

    const data = { amount, currency: cryptoCurrency };

    this.props.getCryptoPrice({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
    });
  };

  handleGetCryptoPriceSuccess = (responseData) => {
    // console.log('handleGetCryptoPriceSuccess', data);
    const { userCcLimit } = this.props;
    const cryptoPrice = CryptoPrice.cryptoPrice(responseData.data);

    const amoutWillUse = new BigNumber(userCcLimit.amount).plus(new BigNumber(cryptoPrice.fiatAmount)).toNumber();

    if (this.state.amount && userCcLimit && userCcLimit.limit < amoutWillUse) {
      this.setState({ showCCScheme: false });
    } else {
      this.setState({ showCCScheme: false });
    }
  };

  handleGetCryptoPriceFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
  };


  handleCreateCCOrder = (params) => {
    const { cryptoPrice, addressForced, authProfile } = this.props;


    let address = '';
    if (addressForced) {
      address = addressForced;
    } else {
      const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
      address = wallet.address;
    }

    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiatAmount.trim(),
        fiat_currency: FIAT_CURRENCY.USD,
        address,
        email: authProfile ? authProfile.email : '',
        payment_method_data: params,
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
    this.hideLoading();

    console.log('handleCreateCCOrderSuccess', data);

    const { data: { amount, currency, fiat_amount, fiat_currency } } = data;

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.buySuccess,
      value: fiat_amount,
    });

    // this.timeoutClosePopup = setTimeout(() => {
    //   this.handleBuySuccess();
    // }, 3000);
    //
    // this.setState({modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
    //             <div>Buy success</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleBuySuccess}>Dismiss</Button>
    //       </div>
    //     )
    // }, () => {
    //   this.modalRef.open();
    // });

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
      this.props.history.push(URL.HANDSHAKE_ME);
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

    // this.setState({modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
    //             <div>{e.response?.data?.message}</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleBuyFailed}>Dismiss</Button>
    //       </div>
    //     )
    // }, () => {
    //   this.modalRef.open();
    // });
  };

  handleBuyFailed = () => {
    // this.modalRef.close();

    const { callbackFailed } = this.props;

    if (callbackFailed) {
      callbackFailed();
    }
  };

  handleSubmit = async (values) => {
    const { handleSubmit } = this.props;
    const { userCcLimit, cryptoPrice, addressForced } = this.props;

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.clickBuy,
    });

    const amoutWillUse = new BigNumber(userCcLimit.amount).plus(new BigNumber(cryptoPrice.fiatAmount)).toNumber();

    if (this.state.amount && userCcLimit && userCcLimit.limit < amoutWillUse) {
      this.props.showAlert({
        message: <div className="text-center"><FormattedMessage
          id="overCCLimit"
          values={{
          currency: FIAT_CURRENCY_SYMBOL,
          limit: formatMoney(userCcLimit.limit),
          amount: formatMoney(userCcLimit.amount),
        }}
        />
        </div>,
        timeOut: 5000,
        type: 'danger',
        // callBack: this.handleBuySuccess
      });

      return;
    }

    this.showLoading();

    if (handleSubmit) {
      handleSubmit(values);
    } else {
      // console.log('handleSubmit', values);
      const { userProfile: { creditCard } } = this.props;

      let cc = {};

      // Use existing credit card
      if (creditCard.ccNumber.length > 0 && !this.state.isNewCCOpen) {
        cc = { token: 'true' };
        this.handleCreateCCOrder(cc);
      } else {
        const { cc_number, cc_expired, cc_cvc } = values;
        const mmYY = cc_expired.split('/');
        const params = new URLSearchParams();
        params.append('card[number]', cc_number && cc_number.trim().replace(/ /g, ''));
        params.append('card[exp_month]', mmYY[0]);
        params.append('card[exp_year]', mmYY[1]);
        params.append('card[cvc]', cc_cvc);
        params.append('key', process.env.stripeKey);
        params.append('type', 'card');

        axios.post(
          'https://api.stripe.com/v1/sources',
          params,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .then((payload) => {
            console.log('payload', payload);
            const stripe = Stripe(process.env.stripeKey);
            stripe.createSource({
              type: 'three_d_secure',
              amount: new BigNumber(cryptoPrice.fiatAmount).multipliedBy(100).toString(),
              currency: FIAT_CURRENCY.USD,
              three_d_secure: {
                card: payload.data.id,
              },
              redirect: {
                return_url: `${process.env.PUBLIC_URL}/payment`,
              },
            }).then((result) => {
              console.log('submit result', result);
              if (result.source.three_d_secure.three_d_secure === 'not_supported') {
                this.hideLoading();

                const message = <FormattedMessage id="threeDSecureNotSupported" />;
                this.props.showAlert({
                  message: <div className="text-center">{message}</div>,
                  timeOut: 3000,
                  type: 'danger',
                  // callBack: this.handleBuySuccess
                });
              } else {
                local.save(APP.CC_SOURCE, result.source);
                local.save(APP.CC_PRICE, cryptoPrice);
                local.save(APP.CC_TOKEN, payload.data.id);

                let address = '';
                if (addressForced) {
                  address = addressForced;
                } else {
                  const wallet = MasterWallet.getWalletDefault(cryptoPrice.currency);
                  address = wallet.address;
                }
                local.save(APP.CC_ADDRESS, address);

                window.location = result.source.redirect.url;
              }
            });

            // const newCCNum = payload.data.id;
            // cc = {
            //   cc_num: newCCNum,
            //   cvv: cc_cvc && cc_cvc.trim().replace(/ /g, ""),
            //   expiration_date: cc_expired && cc_expired.trim().replace(/ /g, ""),
            //   token: "",
            //   save: "true"
            // };
            // this.handleCreateCCOrder(cc);
          }).catch((error) => {
            // console.log('error', error);
            this.hideLoading();

            const message = error?.response?.data?.errors[0] || 'Something wrong!';
            this.props.showAlert({
              message: <div className="text-center">{message}</div>,
              timeOut: 3000,
              type: 'danger',
            // callBack: this.handleBuySuccess
            });
          });
      }
      // console.log('handleSubmit', cc);
    }
  };

  onAmountChange = (e, amount) => {
    // const amount = e.target.value;
    // this.getCryptoPriceByAmount(amount);
    this.setState({ amount }, () => {
      this.getCryptoPriceByAmountThrottled(amount);
    });
  };

  onCurrencyChange = (e, newValue) => {
    // console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    this.setState({ currency: newValue }, () => {
      this.getCryptoPriceByAmountThrottled(this.state.amount);
    });
  };

  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen });
  };

  handleValidate = (values) => {
    return validate(values, this.state, this.props);
  };

  // handleValidate = values => {
  //   console.log('valuessv', values)
  //   // same as above, but feel free to move this into a class method now.
  //   let errors = {};
  //   // if (!values.email) {
  //   //   errors.email = 'Required';
  //   // } else if (
  //   //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  //   // ) {
  //   //   errors.email = 'Invalid email address';
  //   // }
  //   return errors;
  // }

  render() {
    const {
      intl, userProfile, cryptoPrice, amount, userCcLimit, ccLimits, buttonTitle, currencyForced,
    } = this.props;
    const { showCCScheme } = this.state;
    const fiatCurrency = FIAT_CURRENCY_SYMBOL;
    const total = cryptoPrice && cryptoPrice.fiatAmount;

    const modalContent = this.state.modalContent;

    const curLevel = userCcLimit ? userCcLimit.level : 1;

    let newTo = 0;

    return (
      <div className="mb-2">
        <div>
          <FormCreditCard onSubmit={this.handleSubmit} validate={this.handleValidate}>
            <Feed className="feed p-2 mb-2" background={this.mainColor}>
              <div style={{ color: 'white' }}>
                {
                  showCCScheme && (
                    <div style={{ background: 'rgb(255,255,255,0.2)' }} className="pt-2 px-2 rounded mb-2">
                      {
                        ccLimits.map((ccLimit, index) => {
                          const { level, limit, duration } = ccLimit;
                          const isActive = curLevel === level;

                          let text = '';
                          const from = newTo + 1;
                          newTo += duration;
                          const to = newTo;
                          if (index === ccLimits.length - 1) {
                            text = `Every ${duration} days`;
                          } else {
                            text = `Day ${from}-${to}`;
                          }

                          return (
                            <LevelItem key={index} style={{ margin: '0 8px 8px 0', opacity: isActive ? '' : 0.6 }}>
                              <div
                                className="rounded p-1"
                                style={{
                                lineHeight: 1.2,
                                background: isActive ? '#FF3B30' : 'rgb(255,255,255,0.2)',
                              }}
                              >
                                {text}
                              </div>
                              <div className="p-1">
                                <small>{fiatCurrency}{limit} limit</small>
                              </div>
                            </LevelItem>
                          );
                        })
                      }
                    </div>
                  )
                }
                <div className="form-group pt-2 d-flex">
                  <label className="col-form-label headline"><h4><FormattedMessage id="buy" /></h4></label>
                  <div className="mx-2">
                    <Field
                      name="amount"
                      // type="number"
                      // step="any"
                      validate={[required]}
                      component={fieldCleave}
                      propsCleave={{
                        placeholder: intl.formatMessage({ id: 'amount' }),
                        options: { numeral: true, delimiter: '', numeralDecimalScale: 8 },
                        style: {
                          fontSize: '26px',
                          fontWeight: '600',
                          height: '44px',
                        },
                      }}
                      className="form-control-custom form-control-custom-ex d-inline-block w-100"
                      onChange={this.onAmountChange}
                    />
                  </div>
                  <span className="d-inline-block ml-auto" style={{ maxWidth: '368px', minWidth: '128px' }}>
                    <Field
                      name="currency"
                      type="radio-big"
                      // containerClass="radio-container-old"
                      component={fieldRadioButton}
                      list={currencyForced ? CRYPTO_CURRENCY_LIST.filter(c => c.value === currencyForced) : CRYPTO_CURRENCY_LIST}
                      color="#fff"
                      onChange={this.onCurrencyChange}
                    />
                  </span>
                </div>
                <div className="pb-2">
                  <h4 className="headline"><FormattedMessage
                    id="askUsingCreditCard"
                    values={{
                    fiatCurrency: FIAT_CURRENCY.USD,
                    total: formatMoney(total),
                  }}
                  />
                  </h4>
                </div>
                {
                  amount && (
                    <CreditCard
                      isCCExisting={userProfile && userProfile.creditCard.ccNumber.length > 0}
                      lastDigits={userProfile && userProfile.creditCard.ccNumber}
                      isNewCCOpen={this.state.isNewCCOpen}
                      handleToggleNewCC={this.handleToggleNewCC}
                    />
                  )
                }
              </div>
            </Feed>
            <Button block type="submit" className="buy-button">{buttonTitle && buttonTitle || <FormattedMessage id="shakeNow" />} </Button>
          </FormCreditCard>
        </div>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
    // return (
    //   <Grid>
    //     <Row>
    //       <Col xs={12}>
    //
    //       </Col>
    //     </Row>
    //   </Grid>
    // );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits || [],
  amount: selectorFormCreditCard(state, 'amount'),
  currency: selectorFormCreditCard(state, 'currency'),
  authProfile: state.auth.profile,
});

const mapDispatchToProps = (dispatch) => ({
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
  createCCOrder: bindActionCreators(createCCOrder, dispatch),
  getUserCcLimit: bindActionCreators(getUserCcLimit, dispatch),
  getCcLimits: bindActionCreators(getCcLimits, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
