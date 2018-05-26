import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Field, formValueSelector} from "redux-form";
import {connect} from "react-redux";
import CreditCard from '@/pages/Exchange/components/CreditCard';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import localStore from '@/services/localStore';
import {URL} from '@/config';
import './CreditCardFeed.scss';
import {validate} from '@/pages/Exchange/validation';
import throttle from 'lodash/throttle';
import createForm from '@/components/core/form/createForm'
import {fieldCleave, fieldDropdown, fieldInput} from '@/components/core/form/customField'
import {required} from '@/components/core/form/validation'
import {createCCOrder, getCcLimits, getCryptoPrice, getUserCcLimit, getUserProfile} from '@/reducers/exchange/action';
import {API_URL} from "@/constants";

const nameFormCreditCard = 'creditCard'
const FormCreditCard = createForm({ propsReduxForm: { form: nameFormCreditCard,
    initialValues: { currency: 'ETH' } } });
const selectorFormCreditCard = formValueSelector(nameFormCreditCard)

class CreditCardFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: 'ETH',
      isNewCCOpen: false,
      modalContent: '',
      showCCScheme: false,
    }
    this.getCryptoPriceByAmountThrottled = throttle(this.getCryptoPriceByAmount, 500);
  }

  componentDidMount() {
    this.props.getUserProfile({PATH_URL: API_URL.EXCHANGE.GET_USER_PROFILE, headers: {'Custom-Uid': 'megalodon'}});
    this.props.getCcLimits({PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT});
    this.props.getUserCcLimit({PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT, headers: {'Custom-Uid': 'megalodon'}});

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

  getCryptoPriceByAmount = (amount) => {
    const cryptoCurrency = this.state.currency;

    var data = {amount: amount, currency: cryptoCurrency};

    this.props.getCryptoPrice({PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE, qs: data,
        successFn: this.handleGetCryptoPriceSuccess,
        errorFn: this.handleGetCryptoPriceFailed
      });
  }

  handleGetCryptoPriceSuccess = (data) => {
    console.log('handleGetCryptoPriceSuccess', data);
    const {userCcLimit} = this.props;

    if (userCcLimit.limit < userCcLimit.amount + data.fiat_amount) {
      this.setState({showCCScheme: true});
    }
  }

  handleGetCryptoPriceFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
  }


  handleCreateCCOrder = (params) => {
    const {cryptoPrice} = this.props;
    let address = localStore.get('address');
    address = '0x2a08a375e203a72f1A378827A3b66D2785A2F7D5';

    if (cryptoPrice) {
      const paramsObj = {
        amount: cryptoPrice.amount.trim(),
        currency: cryptoPrice.currency.trim(),
        fiat_amount: cryptoPrice.fiat_amount.trim(),
        fiat_currency: "USD",
        address: address,
        payment_method_data: params
      };
      console.log('handleCreateCCOrder',paramsObj);
      this.props.createCCOrder({data: paramsObj, headers: {'Custom-Uid': 'megalodon'},
        successFn: this.handleCreateCCOrderSuccess,
        errorFn: this.handleCreateCCOrderFailed
      });
    }
  }

  handleCreateCCOrderSuccess = (data) => {
    console.log('handleCreateCCOrderSuccess', data);
    this.setState({modalContent:
        (<div>
          <h1>Buy Success. Buy another?</h1>
          <Button onClick={this.handleBuySuccess}>Cancel</Button>
          <Button onClick={this.handleBuyAnother}>OK</Button>
        </div>)
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyAnother = () => {
    this.modalRef.close();
  }

  handleBuySuccess = () => {
    this.props.history.push(URL.TRANSACTION_LIST);
  }

  handleCreateCCOrderFailed = (e) => {
    // console.log('handleCreateCCOrderFailed', JSON.stringify(e.response));
    this.setState({modalContent:
        (<div>
          <h1>Buy Failed</h1>
          <span>{e.response?.data?.message}</span>
          <Button onClick={this.handleBuyFailed}>OK</Button>
        </div>)
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyFailed = () => {
    this.modalRef.close();
  }

  handleSubmit = (values) => {
    console.log('handleSubmit', values);
    const {userProfile: {credit_card}} = this.props;

    let cc = {};

    //Use existing credit card
    if (credit_card.cc_number.trim().length > 0 && !this.state.isNewCCOpen) {
      cc = {token: "true"};
    } else {
      const {cc_number, cc_expired, cc_cvc} = values;
      cc = {
        cc_num: cc_number && cc_number.trim().replace(/ /g, ''),
        cvv: cc_cvc && cc_cvc.trim().replace(/ /g, ''),
        expiration_date: cc_expired && cc_expired.trim().replace(/ /g, ''),
        token: "",
        save: "true"
      };
    }

    // console.log('handleSubmit', cc);
    this.handleCreateCCOrder(cc);
  }

  onAmountChange = (e) => {
    const amount = e.target.value;
    this.getCryptoPriceByAmount(amount);
    this.setState({amount: amount}, () => {
      this.getCryptoPriceByAmountThrottled(amount);
    });
  }

  onCurrencyChange = (e, newValue) => {
    console.log('onCurrencyChange', newValue);
    // const currency = e.target.textContent || e.target.innerText;
    this.setState({currency: newValue}, () => {
      this.getCryptoPriceByAmount(this.state.amount);
    });
  }

  handleToggleNewCC = () => {
    this.setState({ isNewCCOpen: !this.state.isNewCCOpen })
  }

  handleValidate = (values) => {
    return validate(values, this.state, this.props)
  }

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
    const {intl, userProfile, cryptoPrice, amount} = this.props;
    const allCryptoCurrencies = [
      { name: 'ETH', text: 'ETH' },
      { name: 'BTC', text: 'BTC' },
    ];
    const fiatCurrency = '$';
    const total = cryptoPrice && cryptoPrice.fiat_amount;

    let modalContent = this.state.modalContent;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <div>
              <FormCreditCard onSubmit={this.handleSubmit} validate={this.handleValidate}>
                <Feed className="feed p-2 mb-2" background="linear-gradient(-133deg, #006AFF 0%, #3AB4FB 100%)">
                  <div style={{ color: 'white' }}>
                    <div className="form-group pt-2 d-flex">
                      <label className="col-form-label"><FormattedMessage id="buy"/></label>
                      <div className="mx-2">
                        <Field
                          name="amount"
                          validate={[required]}
                          component={fieldInput}
                          className="form-control-custom form-control-custom-ex d-inline-block"
                          placeholder={intl.formatMessage({id: 'amount'})}
                          onChange={this.onAmountChange}
                        />
                      </div>
                      <span className="d-inline-block ml-auto" style={{ width: '235px' }}>
                                <Field
                                  name="currency"
                                  component={fieldDropdown}
                                  list={allCryptoCurrencies}
                                  onChange={this.onCurrencyChange}
                                  // defaultText={''}
                                />
                              </span>
                    </div>
                    <div className="pb-2">
                      <span><FormattedMessage id="askUsingCreditCard" values={{ fiatCurrency: fiatCurrency, total: total }} /></span>
                    </div>
                    {
                      amount && (
                        <CreditCard
                          isCCExisting={userProfile && userProfile.credit_card.cc_number.trim().length > 0}
                          lastDigits={userProfile && userProfile.credit_card.cc_number}
                          isNewCCOpen={this.state.isNewCCOpen}
                          handleToggleNewCC={this.handleToggleNewCC}
                        />
                      )
                    }
                  </div>
                </Feed>
                <Button block type="submit"><FormattedMessage id="shakeNow"/></Button>
              </FormCreditCard>
            </div>
          </div>
        </div>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    )
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
  ccLimits: state.exchange.ccLimits,
  amount: selectorFormCreditCard(state, 'amount'),
  currency: selectorFormCreditCard(state, 'currency'),
});

const mapDispatchToProps = {
  getUserProfile,
  getCryptoPrice,
  createCCOrder,
  getUserCcLimit,
  getCcLimits,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreditCardFeed));
