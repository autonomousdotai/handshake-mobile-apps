import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Feed from '@/components/core/presentation/Feed';
import Button from '@/components/core/controls/Button';
import './styles.scss';
import createForm from '@/components/core/form/createForm';
import { formatAmountCurrency, formatMoneyByLocale, getOfferPrice } from '@/services/offer-util';
import axios from 'axios';
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton,
} from '@/components/core/form/customField';
import { maxValue, minValue, number, required, requiredPhone } from '@/components/core/form/validation';
import { change, clearFields, Field, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_COLORS,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  FIAT_CURRENCY,
  FIAT_CURRENCY_LIST,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SUB_STATUS,
  HANDSHAKE_ID,
  MIN_AMOUNT,
  NB_BLOCKS,
  URL,
} from '@/constants';

import { validate } from './validation';
import '../styles.scss';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { getUserLocation, showAlert } from '@/reducers/app/action';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { ExchangeCashHandshake } from '@/services/neuron';
// import phoneCountryCodes from '@/components/core/form/country-calling-codes.min.json';
import COUNTRIES from '@/data/country-dial-codes.js';
import { feedBackgroundColors } from '@/components/handshakes/exchange/config';
import {
  addOfferItem,
  createOfferStores,
  getOfferStores,
  offerItemRefill,
  trackingOnchain,
  updateOfferStores,
} from '@/reducers/exchange/action';
import { BigNumber } from 'bignumber.js';
import { authUpdate, checkUsernameExist } from '@/reducers/auth/action';
import OfferShop from '@/models/OfferShop';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import PropTypes from 'prop-types';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import Modal from '@/components/core/controls/Modal';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import { showPopupGetGPSPermission } from '@/reducers/app/action';

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreate,
    initialValues: {
      currency: CRYPTO_CURRENCY_DEFAULT,
      customizePriceBuy: -0.25,
      customizePriceSell: 0.25,
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = '#000000';
const btnBg = 'rgba(29,29,38,0.30)';
const validateFee = [
  minValue(-50),
  maxValue(50),
];

class Component extends React.Component {
  static propTypes = {
    setLoading: PropTypes.func.isRequired,
  };

  CRYPTO_CURRENCY_LIST = Object.values(CRYPTO_CURRENCY).map(item => ({ value: item, text: <div className="currency-selector"><img src={CRYPTO_CURRENCY_COLORS[item].icon} /> <span>{CRYPTO_CURRENCY_NAME[item]}</span></div>, hide: false }));

  constructor(props) {
    super(props);

    // const { update } = Helper.getQueryStrings(window.location.search);
    const isUpdate = false;
    // if (update && update === 'true') {
    //   isUpdate = true;
    // }

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
      isUpdate,
      enableAction: true,
      buyBalance: 0,
      sellBalance: 0,
      modalFillContent: '',
    };
    this.mainColor = '#1F2B34';
  }

  setAddressFromLatLng = (lat, lng, addressDefault) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    if (addressDefault) {
      setTimeout(() => {
        rfChange(nameFormExchangeCreate, 'address', addressDefault);
      }, 0);
    } else {
      axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`).then((response) => {
        const address = response.data.results[0] && response.data.results[0].formatted_address;
        rfChange(nameFormExchangeCreate, 'address', address);
      });
    }
  }

  componentDidMount() {
    const {
      ipInfo, rfChange, authProfile, freeStartInfo, isChooseFreeStart, getUserLocation,
    } = this.props;
    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude, ipInfo?.addressDefault);

    // show popup to get GPS permission
    this.props.showPopupGetGPSPermission();

    // getUserLocation({
    //   successFn: (ipInfo2) => {
    //     this.setAddressFromLatLng(ipInfo2?.latitude, ipInfo2?.longitude, ipInfo2?.addressDefault);
    //   },
    // });

    // auto fill phone number from user profile
    let detectedCountryCode = '';
    const foundCountryPhone = COUNTRIES.find(i => i.code.toUpperCase() === ipInfo?.country.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(nameFormExchangeCreate, 'phone', authProfile.phone || `${detectedCountryCode}-`);
    rfChange(nameFormExchangeCreate, 'username', authProfile.username || '');
    rfChange(nameFormExchangeCreate, 'address', authProfile.address || '');

    let fiatCurrency = { id: FIAT_CURRENCY.USD, text: FIAT_CURRENCY.USD };
    if (FIAT_CURRENCY[ipInfo?.currency]) {
      fiatCurrency = {
        id: ipInfo?.currency, text: ipInfo?.currency,
      };
    }

    rfChange(nameFormExchangeCreate, 'stationCurrency', fiatCurrency);

    if (freeStartInfo?.reward !== '' && isChooseFreeStart) {
      rfChange(nameFormExchangeCreate, 'amountSell', freeStartInfo?.reward);
    }

    this.getOfferStores(authProfile);
  }

  getOfferStores() {
    const { authProfile } = this.props;
    this.props.getOfferStores({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${authProfile.id}`,
      successFn: this.handleGetOfferStoresSuccess,
      errorFn: this.handleGetOfferStoresFailed,
    });
  }

  handleGetOfferStoresSuccess = (res) => {
    console.log('handleGetOfferStoresSuccess', res);
  }

  handleGetOfferStoresFailed = (e) => {
    console.log('handleGetOfferStoresFailed', e);
  }

  componentWillReceiveProps(nextProps) {
    const { rfChange, currency } = this.props;
    // const { isUpdate } = this.state;
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.offerStores && nextProps.offerStores !== this.props.offerStores) {
      console.log('componentWillReceiveProps inside', nextProps.offerStores);
      this.offer = nextProps.offerStores;

      const fiatCurrency = {
        id: this.offer.fiatCurrency, text: this.offer.fiatCurrency,
      };
      rfChange(nameFormExchangeCreate, 'stationCurrency', fiatCurrency);

      if (this.offer.contactPhone) {
        rfChange(nameFormExchangeCreate, 'phone', this.offer.contactPhone);
      }
      if (this.offer.contactInfo) {
        rfChange(nameFormExchangeCreate, 'address', this.offer.contactInfo);
      }

      // const { nextCurrency } = this.calculateCurrencyList();
      //
      // if (nextCurrency) {
      //   this.calculateAction(nextCurrency);
      // } else {
      this.calculateAction(currency);
      // }

      // if (!isUpdate && isAllInitiate) {
      //   const message = <FormattedMessage id="offerStoresAlreadyCreated" />;
      //
      //   this.setState({
      //     modalContent:
      //       (
      //         <div className="py-2">
      //           <Feed className="feed p-2" background="#259B24">
      //             <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
      //               <div>{message}</div>
      //             </div>
      //           </Feed>
      //           <Button block className="mt-2 btn btn-secondary" onClick={this.handleOfferStoreAlreadyCreated}><FormattedMessage id="ex.btn.OK" /></Button>
      //         </div>
      //       ),
      //   }, () => {
      //     this.modalRef.open();
      //   });
      // }
    }
  }

  // calculateCurrencyList = () => {
  //   const { isUpdate } = this.state;
  //   const { rfChange } = this.props;
  //   let isAllInitiate = true;
  //   let nextCurrency = '';
  //   this.CRYPTO_CURRENCY_LIST = Object.values(CRYPTO_CURRENCY).map((item) => {
  //     if (isUpdate) {
  //       if (this.offer.itemFlags[item]) {
  //         if (!nextCurrency) {
  //           nextCurrency = item;
  //         }
  //       }
  //       return {
  //         value: item,
  //         text: <div className="currency-selector"><img src={CRYPTO_CURRENCY_COLORS[item].icon} />
  //           <span>{CRYPTO_CURRENCY_NAME[item]}</span>
  //               </div>,
  //         hide: !this.offer.itemFlags[item],
  //       };
  //     }
  //     if (!this.offer.itemFlags[item] || this.offer.itemFlags[item] === undefined) {
  //       isAllInitiate = false;
  //
  //       if (!nextCurrency) {
  //         nextCurrency = item;
  //       }
  //     }
  //     return {
  //       value: item,
  //       text: <div className="currency-selector"><img src={CRYPTO_CURRENCY_COLORS[item].icon} />
  //         <span>{CRYPTO_CURRENCY_NAME[item]}</span>
  //             </div>,
  //       hide: this.offer.itemFlags[item],
  //     };
  //   });
  //
  //   if (nextCurrency) {
  //     rfChange(nameFormExchangeCreate, 'currency', nextCurrency);
  //   }
  //
  //   return { nextCurrency, isAllInitiate };
  // }

  calculateAction(currency) {
    const { rfChange } = this.props;
    // const { isUpdate } = this.state;
    let isExist = false;
    if (this.offer) {
      for (const item of Object.values(this.offer.items)) {
        console.log('item', item);
        if (item.currency === currency) {
          isExist = true;
          const isFreeStart = currency === CRYPTO_CURRENCY.ETH && item.freeStart !== '';
          this.setState({
            isUpdate: HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[item.status] === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE,
            enableAction: (HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[item.status] !== HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED &&
              HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[item.status] !== HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING &&
              HANDSHAKE_EXCHANGE_SHOP_OFFER_SUB_STATUS.refilling !== item.subStatus) && !isFreeStart,
          });

          // if (isUpdate) {
          rfChange(nameFormExchangeCreate, 'customizePriceBuy', item.buyPercentage * 100);
          rfChange(nameFormExchangeCreate, 'customizePriceSell', item.sellPercentage * 100);
          this.setState({ buyBalance: item.buyAmount, sellBalance: item.sellAmount });
          // }

          break;
        }
      }
    }

    if (!isExist) {
      this.setState({
        isUpdate: false,
        enableAction: true,
      });
      rfChange(nameFormExchangeCreate, 'customizePriceBuy', -0.25);
      rfChange(nameFormExchangeCreate, 'customizePriceSell', 0.25);
    }
  }

  handleOfferStoreAlreadyCreated = () => {
    this.props.history.push(URL.HANDSHAKE_ME);
  }

  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  onCurrencyChange = (e, newValue) => {
    console.log('onCurrencyChange newValue', newValue);
    const {
      rfChange, amountSell, freeStartInfo, isChooseFreeStart,
    } = this.props;
    // console.log('onCurrencyChange currency', currency);

    if (newValue === CRYPTO_CURRENCY.ETH) {
      if (freeStartInfo?.reward !== '' && amountSell > +freeStartInfo?.reward && isChooseFreeStart) {
        rfChange(nameFormExchangeCreate, 'amountSell', freeStartInfo?.reward);
      }
    }

    this.calculateAction(newValue);

    // const currency = e.target.textContent || e.target.innerText;
    // const { amount } = this.props;
    // this.setState({ currency: newValue }, () => {
    //   this.getCryptoPriceByAmount(amount);
    // });
  }

  buyCoinsUsingCreditCard = () => {
    this.modalRef.close();
    const { messages } = this.props.intl;
    const { currency } = this.props;
    const wallet = MasterWallet.getWalletDefault(currency);

    this.setState({
      modalFillContent:
        (
          <FeedCreditCard
            buttonTitle={messages.create.cash.credit.title}
            currencyForced={wallet ? wallet.name : ''}
            callbackSuccess={this.afterWalletFill}
            addressForced={wallet ? wallet.address : ''}
            isPopup
          />
        ),
    }, () => {
      this.modalFillRef.open();
    });

    gtag.event({
      category: taggingConfig.creditCard.category,
      action: taggingConfig.creditCard.action.showPopupCreateNotEnoughCoin,
    });
  }

  cancelTopupNow = () => {
    this.modalRef.close();

    this.continueSaveOffer();
  }

  showNotEnoughCoinAlert = (balance, amountBuy, amountSell, fee, currency) => {
    const { isUpdate } = this.state;
    console.log('showNotEnoughCoinAlert', balance, amountBuy, amountSell, fee, currency);
    const bnBalance = new BigNumber(balance);
    const bnAmountBuy = new BigNumber(0);
    const bnAmountSell = new BigNumber(amountSell);
    const bnFeeBuy = new BigNumber(0);
    const bnFeeSell = new BigNumber(fee);

    const conditionBuy = bnBalance.isLessThan(bnAmountBuy.plus(bnFeeBuy));
    const conditionSell = bnBalance.isLessThan(bnAmountSell.plus(bnFeeSell));

    if (conditionBuy || conditionSell) {
      this.setState({
        modalContent:
          (
            <div className="py-2">
              <Feed className="feed p-2" background="#259B24">
                <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                  <div><FormattedMessage id="notEnoughCoinInWalletStores" /></div>
                </div>
              </Feed>
              <Button className="mt-2" block onClick={this.buyCoinsUsingCreditCard}><FormattedMessage id="ex.btn.topup.now" /></Button>
              <Button block className="btn btn-secondary" onClick={this.cancelTopupNow}>{isUpdate ? <FormattedMessage id="ex.btn.update.atm" /> : <FormattedMessage id="ex.btn.create.atm" />}</Button>
            </div>
          ),
      }, () => {
        this.modalRef.open();
      });

      // this.props.showAlert({
      //   message: <div className="text-center">
      //     <FormattedMessage id="notEnoughCoinInWalletStores" />
      //   </div>,
      //   timeOut: 5000,
      //   type: 'danger',
      //   callBack: () => {
      //   },
      // });
    }

    return conditionBuy || conditionSell;
  }

  checkMainNetDefaultWallet = (wallet) => {
    let result = false;

    try {
      if (process.env.isLive) {
        if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
          result = true;
        } else {
          result = false;
        }
      }
    } catch (e) {
      result = false;
    }

    if (process.env.isDojo) {
      result = true;
    }

    if (!result) {
      const message = <FormattedMessage id="requireDefaultWalletOnMainNet" />;
      this.showAlert(message);
    }

    return result;
  }

  resetFormValue = () => {
    const { rfChange, clearFields } = this.props;
    rfChange(nameFormExchangeCreate, 'currency', CRYPTO_CURRENCY_DEFAULT);
    rfChange(nameFormExchangeCreate, 'customizePriceBuy', -0.25);
    rfChange(nameFormExchangeCreate, 'customizePriceSell', 0.25);
    clearFields(nameFormExchangeCreate, false, false, 'amountBuy', 'amountSell');
  }

  onSubmit = (values) => {
    const { messages } = this.props.intl;

    if (values.username) {
      this.props.checkUsernameExist({
        PATH_URL: 'user/username-exist',
        qs: { username: values.username },
        successFn: (res) => {
          if (!res.data) {
            this.handleSubmit(values);
          } else {
            this.showAlert(messages.me.profile.username.exist);
          }
        },
      });
    } else {
      this.showAlert(messages.me.profile.username.required);
    }
  }

  handleSubmit = async (values) => {
    console.log('handleSubmit', values);
    const {
      freeStartInfo, isChooseFreeStart,
    } = this.props;
    const {
      currency, amountBuy, amountSell,
    } = values;

    this.showLoading();

    const wallet = MasterWallet.getWalletDefault(currency);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      this.hideLoading();
      return;
    }

    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(NB_BLOCKS, true);

    if (freeStartInfo?.reward === '' || currency !== CRYPTO_CURRENCY.ETH || !isChooseFreeStart) {
      const condition = this.showNotEnoughCoinAlert(balance, amountBuy, amountSell, fee, currency);

      if (condition) {
        this.hideLoading();
        return;
      }
    }

    this.continueSaveOffer();
  }

  continueSaveOffer = () => {
    const {
      authProfile, ipInfo, freeStartInfo, isChooseFreeStart,
    } = this.props;
    const { lat, lng, isUpdate } = this.state;
    const {
      currency, amountBuy, amountSell, customizePriceBuy,
      customizePriceSell, phone, address, stationCurrency,
    } = this.props;

    const wallet = MasterWallet.getWalletDefault(currency);

    const phones = phone.trim().split('-');
    const phoneNew = phones.length > 1 && phones[1].length > 0 ? phone : '';

    const sellAmount = amountSell ? amountSell.toString() : isUpdate ? '' : '0';
    const buyAmount = amountBuy ? amountBuy.toString() : isUpdate ? '' : '0';

    const data = {
      currency,
      sell_amount: sellAmount,
      sell_percentage: customizePriceSell.toString(),
      buy_amount: buyAmount,
      buy_percentage: customizePriceBuy.toString(),
      user_address: wallet.address,
    };

    if (currency === CRYPTO_CURRENCY.ETH && freeStartInfo?.reward !== '' && isChooseFreeStart) {
      data.free_start = freeStartInfo?.token;
    }

    const offer = {
      email: authProfile?.email || '',
      username: authProfile?.username,
      contact_phone: phoneNew,
      contact_info: address,
      latitude: lat,
      longitude: lng,
      fiat_currency: stationCurrency.id,
      chat_username: authProfile?.username,
    };

    const offerStore = {
      offer,
      item: data,
    };

    const intentMsg = (amountBuy > 0 && amountSell > 0) ? `buy ${amountBuy} ${currency} and sell ${amountSell} ${currency}` : (amountBuy > 0 ? `buy ${amountBuy} ${currency}` : `sell ${amountSell} ${currency}`);
    let message = '';
    if (isUpdate) {
      message = <FormattedMessage id="updateOfferStoreConfirm" />;
    } else {
      message = <FormattedMessage id="createOfferStoreConfirm" values={{ intentMsg }} />;
    }

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            {
              this.offer ? (
                <Button className="mt-2" block onClick={() => this.addOfferItem(data, offerStore)}><FormattedMessage id="ex.btn.confirm" /></Button>
              ) : (
                <Button className="mt-2" block onClick={() => this.createOffer(offerStore)}><FormattedMessage id="ex.btn.confirm" /></Button>
              )
            }
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  cancelCreateOffer = () => {
    this.hideLoading();
    this.modalRef.close();
  }

  // //////////////////////

  createOffer = (offer) => {
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createOfferStores({
      PATH_URL: API_URL.EXCHANGE.OFFER_STORES,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  // //////////////////////

  addOfferItem = (offerItem, offerStore) => {
    this.modalRef.close();
    console.log('addOfferItem', offerItem, this.offer);
    const { offer } = this;
    const { isUpdate } = this.state;

    if (isUpdate) {
      this.props.updateOfferStores({
        PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
        data: offerStore,
        METHOD: 'PUT',
        successFn: this.handleCreateOfferSuccess,
        errorFn: this.handleCreateOfferFailed,
      });
      // this.props.offerItemRefill({
      //   PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/refill`,
      //   METHOD: 'POST',
      //   data: offerItem,
      //   successFn: (res) => {
      //     this.handleRefillOfferSuccess(res);
      //
      //     this.props.updateOfferStores({
      //       PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      //       data: offerStore,
      //       METHOD: 'PUT',
      //       // successFn: this.handleCreateOfferSuccess,
      //       // errorFn: this.handleCreateOfferFailed,
      //     });
      //   },
      //   errorFn: this.handleCreateOfferFailed,
      // });
    } else {
      this.props.addOfferItem({
        PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
        METHOD: 'POST',
        data: offerItem,
        successFn: this.handleCreateOfferSuccess,
        errorFn: this.handleCreateOfferFailed,
      });
    }
  }

  // //////////////////////

  handleCreateOfferSuccess = async (responseData) => {
    console.log('handleCreateOfferSuccess', responseData);
    const { rfChange, currency, amountSell } = this.props;
    const offer = OfferShop.offerShop(responseData.data);
    this.offer = offer;

    // console.log('handleCreateOfferSuccess', data);

    // const wallet = MasterWallet.getWalletDefault(currency);
    //
    // if (currency === CRYPTO_CURRENCY.BTC) {
    //   console.log('transfer BTC', offer.items.BTC.systemAddress, amountSell);
    //   if (amountSell > 0) {
    //     wallet.transfer(offer.items.BTC.systemAddress, offer.items.BTC.sellTotalAmount, NB_BLOCKS).then((success) => {
    //       console.log('transfer', success);
    //     });
    //   }
    // } else if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (amountSell > 0 && offer.items.ETH.freeStart === '') {
    //     wallet.transfer(offer.items.ETH.systemAddress, offer.items.ETH.sellTotalAmount, NB_BLOCKS).then((success) => {
    //       console.log('transfer', success);
    //     });
    //     try {
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //
    //       let result = null;
    //       result = await cashHandshake.initByStationOwner(offer.items.ETH.sellTotalAmount, offer.id);
    //       console.log('handleCreateOfferSuccess', result);
    //
    //       this.trackingOnchain(offer.id, '', result.hash, offer.items.ETH.status, '', currency);
    //     } catch (e) {
    //       this.trackingOnchain(offer.id, '', '', offer.items.ETH.status, e.toString(), currency);
    //       console.log('handleCreateOfferSuccess', e.toString());
    //     }
    //   }
    // }

    this.hideLoading();
    const message = <FormattedMessage id="createOfferSuccessMessage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.gotoUserDashBoard();
      },
    });

    this.resetFormValue();

    // const { nextCurrency } = this.calculateCurrencyList();
    //
    // if (nextCurrency) {
    //   this.calculateAction(nextCurrency);
    // } else {
    //   this.calculateAction(currency);
    // }

    // if (isAllInitiate) {
    //   this.props.history.push(URL.HANDSHAKE_ME);
    // }

    this.updateUserProfile(offer);
  }

  // //////////////////////

  handleRefillOfferSuccess = async (responseData) => {
    console.log('handleRefillOfferSuccess', responseData);
    const { rfChange, currency, amountSell } = this.props;
    const offer = OfferShop.offerShop(responseData.data);
    this.offer = offer;

    // console.log('handleCreateOfferSuccess', data);

    // const wallet = MasterWallet.getWalletDefault(currency);
    //
    // if (currency === CRYPTO_CURRENCY.BTC) {
    //   console.log('transfer BTC', offer.items.BTC.systemAddress, amountSell);
    //   if (amountSell > 0) {
    //     wallet.transfer(offer.items.BTC.systemAddress, offer.items.BTC.sellTotalAmount, NB_BLOCKS).then((success) => {
    //       console.log('transfer', success);
    //     });
    //   }
    // } else if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (amountSell > 0 && offer.items.ETH.freeStart === '') {
    //     try {
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //
    //       let result = null;
    //       if (offer.hid) {
    //         result = await cashHandshake.addInventory(offer.items.ETH.sellTotalAmount, offer.hid, offer.id);
    //       } else {
    //         result = await cashHandshake.initByStationOwner(offer.items.ETH.sellTotalAmount, offer.id);
    //       }
    //
    //       console.log('handleRefillOfferSuccess', result);
    //
    //       this.trackingOnchainRefill(offer.id, '', result.hash, offer.items.ETH.subStatus, '', currency);
    //     } catch (e) {
    //       this.trackingOnchainRefill(offer.id, '', '', offer.items.ETH.subStatus, e.toString(), currency);
    //       console.log('handleRefillOfferSuccess', e.toString());
    //     }
    //   }
    // }

    this.hideLoading();
    const message = <FormattedMessage id="updateOfferSuccessMessage" />;

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.gotoUserDashBoard();
      },
    });

    this.resetFormValue();

    this.updateUserProfile(offer);
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  trackingOnchain = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const data = {
      tx_hash: txHash, action, reason, currency,
    };

    let url = '';
    if (offerStoreShakeId) {
      url = `exchange/offer-stores/${offerStoreId}/shakes/${offerStoreShakeId}/onchain-tracking`;
    } else {
      url = `exchange/offer-stores/${offerStoreId}/onchain-tracking`;
    }
    this.props.trackingOnchain({
      PATH_URL: url,
      data,
      METHOD: 'POST',
      successFn: () => {
      },
      errorFn: () => {

      },
    });
  }

  trackingOnchainRefill = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const data = {
      tx_hash: txHash, action, reason, currency,
    };
    const url = `exchange/offer-stores/${offerStoreId}/onchain-item-tracking`;

    this.props.trackingOnchain({
      PATH_URL: url,
      data,
      METHOD: 'POST',
      successFn: () => {
      },
      errorFn: () => {

      },
    });
  }

  // //////////////////////

  updateUserProfile = (offerShop) => {
    const { username } = this.props;
    console.log('updateUserProfile offerShop', offerShop);
    const params = new URLSearchParams();
    params.append('name', offerShop.username);
    params.append('address', offerShop.contactInfo);
    params.append('username', username);
    this.props.authUpdate({
      PATH_URL: 'user/profile',
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      METHOD: 'POST',
      successFn: () => {
      },
      errorFn: () => {
        // this.setState({ haveProfile: false });
      },
    });
  }

  // /////////////////////

  handleValidate = values => {
    const { isUpdate } = this.state;
    return validate(values, isUpdate);
  }

  gotoUserDashBoard = () => {
    this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.EXCHANGE}&tab=dashboard`);
  }

  afterWalletFill = () => {
    this.modalFillRef.close();
  }

  closeFillCoin = () => {
    this.setState({ modalFillContent: '' });
  }

  render() {
    const { messages } = this.props.intl;
    const {
      currency, listOfferPrice, stationCurrency, customizePriceBuy, customizePriceSell, amountBuy, amountSell, freeStartInfo, isChooseFreeStart,
    } = this.props;
    const {
      isUpdate, enableAction, buyBalance, sellBalance, modalContent, modalFillContent,
    } = this.state;
    const fiatCurrency = stationCurrency?.id;
    // const allowInitiate = this.offer ? (!this.offer.itemFlags.ETH || !this.offer.itemFlags.BTC) : true;

    // let enableChooseFiatCurrency = true;
    // if (this.offer) {
    //   for (const value of Object.values(this.offer.itemFlags)) {
    //     if (value) {
    //       enableChooseFiatCurrency = false;
    //       break;
    //     }
    //   }
    // }
    console.log('this.offer', this.offer);
    // console.log('this.state', this.state);

    const { price: priceBuy } = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, currency, fiatCurrency);
    const { price: priceSell } = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, currency, fiatCurrency);
    const priceBuyDisplayed = formatMoneyByLocale(priceBuy, fiatCurrency);
    const priceSellDisplayed = formatMoneyByLocale(priceSell, fiatCurrency);
    const estimatedPriceBuy = formatMoneyByLocale(priceBuy * (1 + parseFloat(customizePriceBuy, 10) / 100), fiatCurrency);
    const estimatedPriceSell = formatMoneyByLocale(priceSell * (1 + parseFloat(customizePriceSell, 10) / 100), fiatCurrency);

    const wantToBuy = amountBuy && amountBuy > 0;
    const wantToSell = amountSell && amountSell > 0;

    const listCurrency = FIAT_CURRENCY_LIST;
    return (
      <div className="create-exchange">
        <FormExchangeCreate onSubmit={this.onSubmit} validate={this.handleValidate}>
          <div className="d-flex mt-3">
            <div className="input-group">
              <Field
                name="currency"
                // containerClass="radio-container-old"
                component={fieldRadioButton}
                type="tab-3"
                list={this.CRYPTO_CURRENCY_LIST}
                validate={[required]}
                onChange={this.onCurrencyChange}
              />
            </div>
          </div>

          <div className="label">{isUpdate ? (<FormattedMessage id="ex.create.label.beASeller.update" />) : (<FormattedMessage id="ex.create.label.beASeller" />)}</div>
          <div className="section">
            {
              isUpdate && (
                <div>
                  <div className="d-flex">
                    <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.sell.currentBalance" /></span></label>
                    <div className="input-group">
                      <div><span className="form-text">{formatAmountCurrency(sellBalance)}</span></div>
                    </div>
                  </div>

                  <hr className="hrLine" />
                </div>
              )
            }

            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle">{isUpdate ? (<FormattedMessage id="ex.create.label.amountSell.update" />) : (<FormattedMessage id="ex.create.label.amountSell" />)}</span></label>
              <div className="input-group">
                <Field
                  name="amountSell"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={MIN_AMOUNT[currency]}
                  disabled={isChooseFreeStart && freeStartInfo?.reward !== '' && currency === CRYPTO_CURRENCY.ETH}
                  // onChange={this.onAmountChange}
                  // validate={[requiredOneOfAmounts, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  validate={[number]}
                />
              </div>
            </div>

            <hr className="hrLine" />

            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.marketPrice" /></span></label>
              <div className="input-group">
                <div><span className="form-text">{priceSellDisplayed} {fiatCurrency}</span></div>
              </div>
            </div>
            <hr className="hrLine" />

            <div className="d-flex py-1">
              <label className="col-form-label mr-auto label-create">
                <span className="align-middle"><FormattedMessage id="ex.create.label.premiumSell" /></span>
                <div className="explanation"><FormattedMessage id="ex.create.label.premiumSellExplanation" /></div>
              </label>
              <div className="input-group align-items-center">
                <Field
                  name="customizePriceSell"
                  // className='form-control-custom form-control-custom-ex w-100'
                  component={fieldNumericInput}
                  btnBg={btnBg}
                  suffix="%"
                  color={textColor}
                  validate={validateFee}
                />
                { wantToSell && <span className="w-100 estimate-price sell">&asymp; {estimatedPriceSell} {fiatCurrency}</span> }
              </div>
            </div>

            {/*
              (wantToBuy || wantToSell) && (
                <div className="tooltip-price mt-2">
                  { wantToBuy && <span>Your buying price {estimatedPriceBuy} {fiatCurrency}. </span> }
                  { wantToSell && <span>Your selling price {estimatedPriceSell} {fiatCurrency}. </span> }
                  { (wantToBuy && wantToSell) ? 'These' : 'This'} may fluctuate according to the price of {currency}
                </div>
              )
            */}
          </div>

          <div className="label">{isUpdate ? (<FormattedMessage id="ex.create.label.beABuyer.update" />) : (<FormattedMessage id="ex.create.label.beABuyer" />)}</div>
          <div className="section">
            {
              isUpdate && (
                <div>
                  <div className="d-flex">
                    <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.buy.currentBalance" /></span></label>
                    <div className="input-group">
                      <div><span className="form-text">{formatAmountCurrency(buyBalance)}</span></div>
                    </div>
                  </div>

                  <hr className="hrLine" />
                </div>
              )
            }
            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle">{isUpdate ? (<FormattedMessage id="ex.create.label.amountBuy.update" />) : (<FormattedMessage id="ex.create.label.amountBuy" />)}</span></label>
              <div className="input-group">
                <Field
                  name="amountBuy"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={MIN_AMOUNT[currency]}
                  // onChange={this.onAmountChange}
                  // validate={[requiredOneOfAmounts, currency === CRYPTO_CURRENCY.BTC ? minValue001 : minValue01]}
                  validate={[number]}
                />
              </div>
            </div>
            <hr className="hrLine" />

            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.marketPrice" /></span></label>
              <div className="input-group">
                <div><span className="form-text">{priceBuyDisplayed} {fiatCurrency}</span></div>
              </div>
            </div>
            <hr className="hrLine" />


            <div className="d-flex py-1">
              <label className="col-form-label mr-auto label-create">
                <span className="align-middle"><FormattedMessage id="ex.create.label.premiumBuy" /></span>
                <div className="explanation"><FormattedMessage id="ex.create.label.premiumSellExplanation" /></div>
              </label>
              <div className="input-group align-items-center">
                <Field
                  name="customizePriceBuy"
                  // className='form-control-custom form-control-custom-ex w-100'
                  component={fieldNumericInput}
                  btnBg={btnBg}
                  suffix="%"
                  color={textColor}
                  validate={validateFee}
                />
                { wantToBuy && <span className="w-100 estimate-price buy">&asymp; {estimatedPriceBuy} {fiatCurrency}</span> }
              </div>
            </div>
          </div>

          <div>
            <div className="label"><FormattedMessage id="ex.create.label.stationInfo" /></div>
            <div className="section">
              {/*
            <div className="d-flex">
              <label className="col-form-label mr-auto label-create"><span className="align-middle"><FormattedMessage id="ex.create.label.nameStation"/></span></label>
              <div className='input-group'>
                <Field
                  name="nameShop"
                  className="form-control-custom form-control-custom-ex w-100 input-no-border"
                  component={fieldInput}
                  placeholder={'Apple store'}
                  // onChange={this.onAmountChange}
                  // validate={[required]}
                />
              </div>
            </div>
            <hr className="hrLine"/> */}

              <div className="d-flex py-1">
                <label className="col-form-label mr-auto label-create">
                  <span className="align-middle">{messages.me.profile.text.username.label}</span>
                  <div className="explanation">{messages.me.profile.text.username.desc1}</div>
                </label>
                <div className="input-group">
                  <Field
                    name="username"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    placeholder={messages.me.profile.text.username.label}
                    validate={[required]}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex mt-2">
                  <label className="col-form-label mr-auto label-create"><span
                    className="align-middle"
                  ><FormattedMessage id="ex.create.label.stationCurrency" />
                  </span>
                  </label>
                  <div className="input-group w-100">
                    <Field
                      name="stationCurrency"
                      classNameWrapper=""
                      defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                      classNameDropdownToggle="dropdown-button"
                      list={listCurrency}
                      component={fieldDropdown}
                      // disabled={!enableChooseFiatCurrency}
                    />
                  </div>
                </div>
                <hr className="hrLine" />
              </div>

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                ><FormattedMessage id="ex.create.label.phone" />
                </span>
                </label>
                <div className="input-group w-100">
                  <Field
                    name="phone"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldPhoneInput}
                    color={textColor}
                    type="tel"
                    placeholder="4995926433"
                    // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
                    validate={[requiredPhone]}
                  />
                </div>
              </div>
              <hr className="hrLine" />

              <div className="d-flex mt-2">
                <label className="col-form-label mr-auto label-create"><span
                  className="align-middle"
                ><FormattedMessage id="ex.create.label.address" />
                </span>
                </label>
                <div className="w-100">
                  <Field
                    name="address"
                    className="form-control-custom form-control-custom-ex w-100 input-no-border"
                    component={fieldInput}
                    validate={[required]}
                    placeholder="81 E. Augusta Ave. Salinas"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button block type="submit" disabled={!enableAction} className="mt-3"> {
            isUpdate ? (<FormattedMessage id="btn.update" />) : (<FormattedMessage id="btn.initiate" />)
          }
          </Button>
        </FormExchangeCreate>
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
        <Modal title={messages.create.cash.credit.title} onRef={modal => this.modalFillRef = modal} onClose={this.closeFillCoin}>
          {modalFillContent}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const currency = selectorFormExchangeCreate(state, 'currency');

  const amountBuy = selectorFormExchangeCreate(state, 'amountBuy');
  const amountSell = selectorFormExchangeCreate(state, 'amountSell');

  const customizePriceBuy = selectorFormExchangeCreate(state, 'customizePriceBuy') || 0;
  const customizePriceSell = selectorFormExchangeCreate(state, 'customizePriceSell') || 0;

  // const nameShop = selectorFormExchangeCreate(state, 'nameShop');
  const phone = selectorFormExchangeCreate(state, 'phone');
  const address = selectorFormExchangeCreate(state, 'address');
  const stationCurrency = selectorFormExchangeCreate(state, 'stationCurrency');
  const username = selectorFormExchangeCreate(state, 'username');

  return {
    currency,
    amountBuy,
    amountSell,
    customizePriceBuy,
    customizePriceSell,
    // nameShop,
    phone,
    address,
    stationCurrency,
    username,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile,
    offerStores: state.exchange.offerStores,
    listOfferPrice: state.exchange.listOfferPrice,
    freeStartInfo: state.exchange.freeStartInfo,
    isChooseFreeStart: state.exchange.isChooseFreeStart,
    app: state.app,
  };
};

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOfferStores: bindActionCreators(createOfferStores, dispatch),
  addOfferItem: bindActionCreators(addOfferItem, dispatch),
  getOfferStores: bindActionCreators(getOfferStores, dispatch),
  trackingOnchain: bindActionCreators(trackingOnchain, dispatch),
  updateOfferStores: bindActionCreators(updateOfferStores, dispatch),
  offerItemRefill: bindActionCreators(offerItemRefill, dispatch),
  getUserLocation: bindActionCreators(getUserLocation, dispatch),
  checkUsernameExist: bindActionCreators(checkUsernameExist, dispatch),
  showPopupGetGPSPermission: bindActionCreators(showPopupGetGPSPermission, dispatch),
});
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
