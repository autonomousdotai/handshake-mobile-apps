import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
import iconTransaction from '@/assets/images/icon/icons8-transfer_between_users.svg';
import iconPhone from '@/assets/images/icon/icons8-phone.svg';
import iconChat from '@/assets/images/icon/icons8-chat.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {
  API_URL,
  CRYPTO_CURRENCY,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_FEED_TYPE,
  EXCHANGE_METHOD_PAYMENT,
  HANDSHAKE_EXCHANGE_CC_STATUS_NAME,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_STATUS_NAME,
  HANDSHAKE_USER,
  APP_USER_NAME,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_ACTION_PERSON
} from "@/constants";
import ModalDialog from "@/components/core/controls/ModalDialog";
import {connect} from "react-redux";
import {
  cancelShakedOffer,
  closeOffer,
  completeShakedOffer,
  shakeOffer,
  withdrawShakedOffer
} from "@/reducers/exchange/action";
// import getSymbolFromCurrency from 'currency-symbol-map';
import Offer from "@/models/Offer";
import {MasterWallet} from "@/models/MasterWallet";
import {getHandshakeUserType, getOfferPrice} from "@/services/offer-util";
import {showAlert} from '@/reducers/app/action';
import {Link} from "react-router-dom";
import {URL} from '@/config';
import {getDistanceFromLatLonInKm} from '../utils'
import {ExchangeHandshake} from '@/services/neuron';
import _sample from "lodash/sample";
import { feedBackgroundColors } from "@/components/handshakes/exchange/config";
import {updateOfferStatus} from "@/reducers/discover/action";
import {formatAmountCurrency, formatMoney} from "@/services/offer-util";
import {BigNumber} from "bignumber.js";
import { showLoading, hideLoading } from '@/reducers/app/action';

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const {initUserId, shakeUserIds, extraData} = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;
    this.fiatAmount = 0;

    this.state = {
      modalContent: '',
    };
    this.mainColor = _sample(feedBackgroundColors)
  }

  componentDidMount() {
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  handleActionFailed = (e) => {
    this.hideLoading();
    // console.log('e', e);
    this.props.showAlert({
      message: <div className="text-center">{e.response?.data?.message}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
    // this.setState({
    //   modalContent:
    //     (
    //       <div className="py-2">
    //         <Feed className="feed p-2" background="#259B24">
    //           <div className="text-white d-flex align-items-center" style={{minHeight: '75px'}}>
    //             <div>{e.response?.data?.message}</div>
    //           </div>
    //         </Feed>
    //         <Button block className="btn btn-secondary mt-2" onClick={this.handleDismissActionFailed}>Dismiss</Button>
    //       </div>
    //     )
    // }, () => {
    //   this.modalRef.open();
    // });
  }

  // handleDismissActionSuccess = () => {
  //   this.modalRef.close();
  // }
  //
  // handleDismissActionFailed = () => {
  //   this.modalRef.close();
  // }

  confirmOfferAction = (message, actionConfirm) => {
    const {intl,} = this.props;
    console.log('offer', this.offer);

    // const message = intl.formatMessage({ id: 'handshakeOfferConfirm' }, {
    //   type: offer.type === 'buy' ? 'Sell' : 'Buy',
    //   amount: new BigNumber(offer.amount).toFormat(6),
    //   currency: offer.currency,
    //   currency_symbol: getSymbolFromCurrency(offer.fiatCurrency),
    //   total: new BigNumber(fiatAmount).toFormat(2),
    // });

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{minHeight: '50px'}}>
                <div>{message}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.handleConfirmAction(actionConfirm)}>Confirm</Button>
            <Button block className="btn btn-secondary" onClick={this.cancelAction}>Not now</Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  handleConfirmAction = (actionConfirm) => {
    this.modalRef.close();
    actionConfirm();
  }

  cancelAction = () => {
    this.modalRef.close();
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance);
    const bnAmount = new BigNumber(amount);
    const bnFee = new BigNumber(fee);

    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee));

    if (condition) {
      const { intl } = this.props;
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: currency,
          })}
        </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

    return condition;
  }

  ////////////////////////
  handleShakeOfferExchange = async () => {
    const { intl, authProfile } = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;

    const wallet = MasterWallet.getWalletDefault(offer.currency);
    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(10, true);

    if ((offer.currency === CRYPTO_CURRENCY.ETH || (offer.type === EXCHANGE_ACTION.BUY && offer.currency === CRYPTO_CURRENCY.BTC))
      && this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {

      return;
    }

    const address = wallet.address;

    let offerShake = {
      fiat_amount: fiatAmount.toString(),
      address: address,
      email: authProfile.email || '',
      username: authProfile.username || '',
    };

    this.showLoading();
    this.props.shakeOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id,
      METHOD: 'POST',
      data: offerShake,
      successFn: this.handleShakeOfferExchangeSuccess,
      errorFn: this.handleShakeOfferExchangeFailed,
    });
  }

  handleShakeOfferExchangeSuccess = (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    const offer = this.offer;
    if (currency === CRYPTO_CURRENCY.ETH) {
      this.handleCallActionOnContract(data);
    } else if (currency === CRYPTO_CURRENCY.BTC) {
      if (offer.type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(offer.currency);
        wallet.transfer(offer.systemAddress, offer.totalAmount, 10).then(success => {
          console.log('transfer', success);
        });
      }
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="shakeOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
  }

  handleShakeOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCloseOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.closeOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id,
      METHOD: 'DELETE',
      successFn: this.handleCloseOfferExchangeSuccess,
      errorFn: this.handleCloseOfferExchangeFailed,
    });
  }

  handleCloseOfferExchangeSuccess = (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      this.handleCallActionOnContract(data);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="closeOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.fireBaseDataChange( { [`exchange_${data.id}`]: data });
      }
    });
  }

  handleCloseOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCompleteShakedOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.completeShakedOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.SHAKE,
      METHOD: 'POST',
      successFn: this.handleCompleteShakedOfferExchangeSuccess,
      errorFn: this.handleCompleteShakedOfferExchangeFailed,
    });
  }

  handleCompleteShakedOfferExchangeSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = await exchangeHandshake.accept(data.hid, data.id);

      console.log('handleCompleteShakedOfferSuccess', result);
    }

    // console.log('data', data);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="completeShakedfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleCompleteShakedOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleRejectShakedOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.cancelShakedOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.SHAKE,
      METHOD: 'DELETE',
      successFn: this.handleRejectShakedOfferExchangeSuccess,
      errorFn: this.handleRejectShakedOfferExchangeFailed,
    });
  }

  handleRejectShakedOfferExchangeSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = null;

      if ((data.type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.OWNER) ||
        (data.type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.SHAKED)
      ) {
        result = await exchangeHandshake.reject(data.hid, data.id);
      } else {
        result = await exchangeHandshake.cancel(data.hid, data.id);
      }

      console.log('handleCancelShakedOfferSuccess', result);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="cancelShakedfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleRejectShakedOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleWithdrawShakedOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.cancelShakedOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.WITHDRAW,
      METHOD: 'POST',
      successFn: this.handleWithdrawShakedOfferExchangeSuccess,
      errorFn: this.handleWithdrawShakedOfferExchangeFailed,
    });
  }

  handleWithdrawShakedOfferExchangeSuccess = (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      this.handleCallActionOnContract(data);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="withdrawShakedfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleWithdrawShakedOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////
  handleCallActionOnContract = async (data) => {
    const {intl, status} = this.props;
    const offer = this.offer;

    const currency = data.currency;

    const wallet = MasterWallet.getWalletDefault(currency);

    const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        switch (status) {
          // case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
          //   title = 'Shake Now';
          //   break;
          // }
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            let amount = 0;
            if (offer.type === EXCHANGE_ACTION.BUY) {
              amount = data.total_amount;
            }
            const result = await exchangeHandshake.shake(data.hid, amount, data.id);

            console.log('handleShakeOfferSuccess', result);

            break;
          }
          // case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
          //   title = 'Shake Now';
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
          //   title = 'Shake Now';
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
          //   title = 'Shake Now';
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
          //   title = 'Shake Now';
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
          //   title = 'Shake Now';
          //   break;
          // }
        }
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          // case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
          //   break;
          // }
          // case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
          //   break;
          // }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOfferExchange)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOfferExchange)}>Complete</Button>
                }
              </div>
            );

            break;
          }
          // case HANDSHAKE_EXCHANGE_STATUS.COMPLETING: {
          //   title = 'Shake Now';
          //   break;
          // }
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
            // actionButtons = 'Withdraw';
            // nguoi co crypto se withdraw
            if (offer.type === EXCHANGE_ACTION.SELL) {
              const result = await exchangeHandshake.withdraw(data.hid, data.id);

              console.log('handleWithdrawShakedOfferSuccess', result);
            }
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
            // title = 'Withdraw';
            // Ko lam dc gi
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
            // actionButtons = 'Cancel';
            //call action cancel
            let result = '';
            if (offer.type === EXCHANGE_ACTION.BUY) {
              result = await exchangeHandshake.closeByCashOwner(data.hid, data.id);
            } else {
              result = await exchangeHandshake.cancel(data.hid, data.id);
            }

            console.log('handleCloseOfferSuccess', result);
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            // actionButtons = 'Cancel';
            //call action cancel
            let result = '';
            if (offer.type === EXCHANGE_ACTION.BUY) {
              result = await exchangeHandshake.closeByCashOwner(data.hid, data.id);
            } else {
              result = await exchangeHandshake.cancel(data.hid, data.id);
            }

            console.log('handleCloseOfferSuccess', result);
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
            // title = 'Shake Now';
            //Ko lam gi dc
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
            // title = 'Shake Now';
            //Ko lam gi dc
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            // message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            // let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            // actionButtons = (
            //   <div>
            //     <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleCancelShakedOffer)}>Reject</Button>
            //     {offer.type === 'sell' &&
            //     <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message2, this.handleCompleteShakedOffer)}>Complete</Button>
            //     }
            //   </div>
            // );
            break;
          }
          // case HANDSHAKE_EXCHANGE_STATUS.COMPLETING: {
          //   title = 'Shake Now';
          //   break;
          // }
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
            // actionButtons = 'Withdraw';
            // neu la nguoi buy coin thi dc withdraw
            if (offer.type === EXCHANGE_ACTION.BUY) {
              const result = await exchangeHandshake.withdraw(data.hid, data.id);

              console.log('handleWithdrawShakedOfferSuccess', result);
            }
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
            // title = 'Withdraw';
            // Ko lam dc gi
            break;
          }
        }
        break;
      }
    }
  }

  ////////////////////////


  getActionButtonsExchange = () => {
    const {intl, status} = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            message = intl.formatMessage({id: 'handshakeOfferConfirm'}, {
              type: offer.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] : EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
              amount: formatAmountCurrency(offer.amount),
              currency: offer.currency,
              currency_symbol: offer.fiatCurrency,
              total: formatMoney(fiatAmount),
            });

            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleShakeOfferExchange)}>Shake</Button>
              </div>
            );
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOfferExchange)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOfferExchange)}>Complete</Button>
                }
              </div>
            );

            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
            if (offer.type === EXCHANGE_ACTION.SELL) {
              message = intl.formatMessage({id: 'withdrawOfferConfirm'}, {});
              actionButtons = (
                <div>
                  <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleWithdrawShakedOfferExchange)}>Withdraw</Button>
                </div>
              );
            }
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            message = intl.formatMessage({id: 'cancelOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleCloseOfferExchange)}>Cancel</Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOfferExchange)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.SELL &&
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOfferExchange)}>Complete</Button>
                }
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
            if (offer.type === EXCHANGE_ACTION.BUY) {
              message = intl.formatMessage({id: 'withdrawOfferConfirm'}, {});
              actionButtons = (
                <div>
                  <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleWithdrawShakedOfferExchange)}>Withdraw</Button>
                </div>
              );
            }
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
            break;
          }
        }
        break;
      }
    }

    return actionButtons;
  }

  getBuyerSeller = () => {
    const offer = this.offer;
    let result = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        result = EXCHANGE_ACTION_PERSON[offer.type];
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        if (offer.type === EXCHANGE_ACTION.BUY) {
          result = EXCHANGE_ACTION_PERSON[offer.SELL];
        } else {
          result = EXCHANGE_ACTION_PERSON[offer.BUY];
        }
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        result = EXCHANGE_ACTION_PERSON[offer.type];
        break;
      }
    }

    return result;
  }


  render() {
    const {intl, initUserId, shakeUserIds, location, state, status, mode = 'discover', ipInfo: { latitude, longitude }, initAt, ...props} = this.props;
    const offer = this.offer;
    const {listOfferPrice} = this.props;
    let fiatAmount = 0;

    if (offer.fiatAmount) {
      fiatAmount = offer.fiatAmount;
    } else {
      if (listOfferPrice) {
        let offerPrice = getOfferPrice(listOfferPrice, offer.type, offer.currency);
        if (offerPrice) {
          fiatAmount = offer.amount * offerPrice.price || 0;
          fiatAmount = fiatAmount + fiatAmount * offer.percentage / 100;
        } else {
          console.log('aaaa', offer.type, offer.currency);
        }
      }
      this.fiatAmount = fiatAmount;
    }

    let modalContent = this.state.modalContent;

    let email = '';
    if (offer.feedType === EXCHANGE_FEED_TYPE.EXCHANGE) {
      email = offer.email ? offer.email : offer.contactPhone ? offer.contactPhone : offer.contactInfo;
    } else if (offer.feedType === EXCHANGE_FEED_TYPE.INSTANT) {
      email = APP_USER_NAME;
    }


    let statusText = '';
    let message = '';
    let actionButtons = null;
    let from = '';
    let showChat = false;
    let chatUsername = '';
    let buyerSeller = this.getBuyerSeller();

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];

        let offerType = '';
        if (mode === 'me') {
          switch (status) {
            case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
            case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
            case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
            case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
            case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING:
            case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
              switch (this.userType) {
                case HANDSHAKE_USER.SHAKED: {
                  from = 'With';
                  if (offer.type === EXCHANGE_ACTION.BUY) {
                    offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
                  } else if (offer.type === EXCHANGE_ACTION.SELL) {
                    offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
                  }
                  break;
                }
                case HANDSHAKE_USER.OWNER: {
                  from = 'From';

                  offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
                  break;
                }
              }

              // offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
              message = intl.formatMessage({ id: 'offerHandShakeContentMeDone' }, {
                offerType: offerType,
                amount: formatAmountCurrency(offer.amount),
                currency: offer.currency,
                currency_symbol: offer.fiatCurrency,
                total: formatMoney(fiatAmount),
                fee: offer.feePercentage,
                payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
              });
              break;
            }
            default: {
              switch (this.userType) {
                case HANDSHAKE_USER.SHAKED: {
                  from = 'With';
                  if (offer.type === EXCHANGE_ACTION.BUY) {
                    offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
                  } else if (offer.type === EXCHANGE_ACTION.SELL) {
                    offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
                  }
                  break;
                }
                case HANDSHAKE_USER.OWNER: {
                  from = 'From';

                  offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];

                  break;
                }
              }

              message = intl.formatMessage({ id: 'offerHandShakeContentMe' }, {
                offerType: offerType,
                amount: formatAmountCurrency(offer.amount),
                currency: offer.currency,
                currency_symbol: offer.fiatCurrency,
                total: formatMoney(fiatAmount),
                fee: offer.feePercentage,
                payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
              });
              break;
            }
          }

          //Check show chat
          switch (status) {
            case HANDSHAKE_EXCHANGE_STATUS.CREATED:
            case HANDSHAKE_EXCHANGE_STATUS.ACTIVE:
            case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
            case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
              showChat = false;
              break;
            }
            default: {
              showChat = true;

              switch (this.userType) {
                case HANDSHAKE_USER.NORMAL: {
                  break;
                }
                case HANDSHAKE_USER.SHAKED: {
                  chatUsername = offer.username;
                  break;
                }
                case HANDSHAKE_USER.OWNER: {
                  chatUsername = offer.toUsername;
                  break;
                }
              }
            }
          }

          // message = intl.formatMessage({ id: 'offerHandShakeContentMe' }, {
          //   offerType: offerType,
          //   amount: formatAmountCurrency(offer.amount),
          //   currency: offer.currency,
          //   currency_symbol: offer.fiatCurrency,
          //   total: formatMoney(fiatAmount),
          //   fee: offer.feePercentage,
          // });
        } else {
          message = intl.formatMessage({ id: 'offerHandShakeContent' }, {
            offerType: offer.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] : EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
            amount: formatAmountCurrency(offer.amount),
            currency: offer.currency,
            currency_symbol: offer.fiatCurrency,
            total: formatMoney(fiatAmount),
            payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE]
          });
        }

        actionButtons = this.getActionButtonsExchange();
        break;
      }
      case EXCHANGE_FEED_TYPE.INSTANT: {
        from = 'From';
        statusText = HANDSHAKE_EXCHANGE_CC_STATUS_NAME[status];
        let just = ' ';

        var hours = Math.abs(Date.now() - (initAt * 1000)) / 36e5;

        if (hours < 4) {
          just = ' just ';
        }

        message = intl.formatMessage({ id: 'instantOfferHandShakeContent' }, {
          just: just,
          offerType: 'bought',
          amount: formatAmountCurrency(offer.amount),
          currency: offer.currency,
          currency_symbol: offer.fiatCurrency,
          total: formatMoney(fiatAmount),
          fee: offer.feePercentage,
        });

        actionButtons = null;
        break;
      }
    }

    const phone = offer.contactPhone;
    const address = offer.contactInfo;

    let distanceKm = 0;
    let distanceMiles = 0;

    if (location) {
      const latLng = location.split(',')
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1])
      distanceMiles = distanceKm * 0.621371
    }
    const isCreditCard = offer.feedType === EXCHANGE_FEED_TYPE.INSTANT;
    return (
      <div>
        {
          mode === 'me' && (
            <div>
              <span style={{ color: '#C8C7CC' }}>{from}</span> <span style={{ color: '#666666' }}>{email}</span>
              <span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>
            </div>
          )
        }
        <Feed
          className="feed text-white"
          // background={`${mode === 'discover' ? '#FF2D55' : '#50E3C2'}`}
          background={this.mainColor}
        >
          <div className="d-flex mb-4">
            <div>
              <h4 style={{ lineHeight: '1.4' }} className="headline">{message}</h4>
            </div>
            { mode === 'me' && !isCreditCard && showChat && (
              <div className="ml-auto pl-2" style={{ width: '50px' }}>
                {/* to-do chat link */}
                <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                  <img src={iconChat} width='35px' />
                </Link>
              </div>
            )}
          </div>
          {!isCreditCard && (<div className="mb-2">About {buyerSeller}</div>)}
          {/*<span>status: {status}</span><br></br>*/}
          {/*<span>userType: {this.userType}</span><br></br>*/}
          {
            mode === 'discover' ? (
              <div className="media mb-1">
                <img className="mr-2" src={iconTransaction} width={20}/>
                <div className="media-body">
                  <div>
                    <FormattedMessage id="transactonOfferInfo" values={{
                      success: offer.success, failed: offer.failed
                    }}/>
                  </div>
                </div>
              </div>
            ) : (
              !isCreditCard && (
                <div>
                  {
                    phone && phone.split('-')[1] !== '' && ( // no phone number
                      <div className="media mb-1">
                        <img className="mr-2" src={iconPhone} width={20}/>
                        <div className="media-body">
                          <div>
                            <a href={`tel:${phone.replace(/-/g, '')}`} className="text-white">{phone}</a>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  <div className="media">
                    <img className="mr-2" src={iconLocation} width={20}/>
                    <div className="media-body">
                      <div>{address}</div>
                    </div>
                  </div>
                </div>
              )
            )
          }
          {
            !isCreditCard && (
              <div className="media">
                <img className="mr-2" src={mode === 'discover' ? iconLocation : ''} width={20} />
                <div className="media-body">
                  <div style={{ fontSize: mode === 'me' ? '80%' : '' }}>
                    <FormattedMessage id="offerDistanceContent" values={{
                      // offerType: offer.type === 'buy' ? 'Buyer' : 'Seller',
                      distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
                      distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
                    }}/>
                  </div>
                </div>
              </div>
            )
          }
        </Feed>
        {/*<Button block className="mt-2" onClick={this.confirmShakeOffer}>{titleButton}</Button>*/}
        {actionButtons}
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

FeedExchange.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  discover: state.discover,
  listOfferPrice: state.exchange.listOfferPrice,
  ipInfo: state.app.ipInfo,
  authProfile: state.auth.profile,
});

const mapDispatch = ({
  shakeOffer,
  closeOffer,
  completeShakedOffer,
  cancelShakedOffer,
  withdrawShakedOffer,
  showAlert,
  updateOfferStatus,
  showLoading,
  hideLoading,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
