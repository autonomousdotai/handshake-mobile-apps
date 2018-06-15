import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
import iconChat from '@/assets/images/icon/icons8-chat.svg';
import iconPhone from '@/assets/images/icon/icons8-phone.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {
  API_URL,
  APP_USER_NAME,
  CRYPTO_CURRENCY,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PERSON,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_FEED_TYPE,
  EXCHANGE_METHOD_PAYMENT,
  HANDSHAKE_EXCHANGE_CC_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_STATUS_NAME,
  HANDSHAKE_USER,
  URL
} from "@/constants";
import ModalDialog from "@/components/core/controls/ModalDialog";
import {connect} from "react-redux";
import {
  acceptOfferItem,
  cancelOfferItem,
  cancelShakedOffer,
  closeOffer,
  completeOfferItem,
  completeShakedOffer,
  deleteOfferItem,
  rejectOfferItem,
  shakeOffer,
  withdrawShakedOffer
} from "@/reducers/exchange/action";
// import getSymbolFromCurrency from 'currency-symbol-map';
import Offer from "@/models/Offer";
import {MasterWallet} from "@/models/MasterWallet";
import {formatAmountCurrency, formatMoney, getHandshakeUserType, getOfferPrice} from "@/services/offer-util";
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import {Link} from "react-router-dom";
import {getDistanceFromLatLonInKm, getErrorMessageFromCode} from '../utils'
import {ExchangeHandshake, ExchangeShopHandshake} from '@/services/neuron';
import _sample from "lodash/sample";
import {feedBackgroundColors} from "@/components/handshakes/exchange/config";
import {updateOfferStatus} from "@/reducers/discover/action";
import {BigNumber} from "bignumber.js";
import "./FeedMe.scss"
import {getLocalizedDistance} from "@/services/util"
import {responseExchangeDataChange} from "@/reducers/me/action";

class FeedMe extends React.PureComponent {
  constructor(props) {
    super(props);

    const {initUserId, shakeUserIds, extraData} = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;

    this.state = {
      modalContent: '',
    };
    this.mainColor = _sample(feedBackgroundColors)
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  confirmOfferAction = (message, actionConfirm) => {
    console.log('offer', this.offer);

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

  showAlert = (message) => {
    this.props.showAlert({
      message: <div className="text-center">
        {message}
      </div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      }
    });
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { intl } = this.props;
    let result = true;

    if (process.env.isProduction && !process.env.isStaging) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = intl.formatMessage({ id: 'requireDefaultWalletOnMainNet' }, {});
        this.showAlert(message);
        result = false;
      }
    }

    return result;
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

  responseExchangeDataChange = (offerShake) => {
    const { id, status, } = offerShake;
    let data = {};
    let firebaseOffer = {};

    firebaseOffer.id = id;
    firebaseOffer.status = status;
    firebaseOffer.type = 'offer_store_shake';

    data[`offer_store_shake_${id}`] = firebaseOffer;

    console.log('responseExchangeDataChange', data);

    this.props.responseExchangeDataChange(data);
  }

  responseExchangeDataChangeOfferStore = (offerStore) => {
    const { id, status } = offerStore;
    const { currency } = this.offer;
    let data = {};
    let firebaseOffer = {};

    firebaseOffer.id = id;
    firebaseOffer.status = `${currency.toLowerCase()}_${status}`;
    firebaseOffer.type = 'offer_store';


    data[`offer_store_${id}`] = firebaseOffer;

    console.log('responseExchangeDataChangeOfferStore', data);

    this.props.responseExchangeDataChange(data);
  }

  ///Exchange
  ////////////////////////

  getFromExchange = () => {
    const {intl, status} = this.props;

    let from = '';
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

            break;
          }
          case HANDSHAKE_USER.OWNER: {
            from = 'From';

            break;
          }
        }

        break;
      }
      default: {
        switch (this.userType) {
          case HANDSHAKE_USER.SHAKED: {
            from = 'With';

            break;
          }
          case HANDSHAKE_USER.OWNER: {
            from = 'From';

            break;
          }
        }
        break;
      }
    }

    return from;
  }

  getContentExchange(fiatAmount) {
    const {intl, status} = this.props;
    console.log('thisss', this.offer)
    const { offer } = this;
    let message = '';

    let offerType = '';
    switch (status) {
      case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
      case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING:
      case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
        switch (this.userType) {
          case HANDSHAKE_USER.SHAKED: {
            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
            }
            break;
          }
          case HANDSHAKE_USER.OWNER: {
            offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];

            break;
          }
        }

        // offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
        message = intl.formatMessage({ id: 'offerHandShakeExchangeContentMeDone' }, {
          offerType: offerType,
          something: offer.physicalItem,
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
            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
            }
            break;
          }
          case HANDSHAKE_USER.OWNER: {
            offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];

            break;
          }
        }
        message = intl.formatMessage({ id: 'offerHandShakeExchangeContentMe' }, {
          offerType: offerType,
          something: offer.physicalItem,
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
    console.log('offferes', offer.physical_item)
    return message;
  }

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
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleShakeOffer)}>Shake</Button>
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
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
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
                  <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleWithdrawShakedOffer)}>Withdraw</Button>
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
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleCloseOffer)}>Cancel</Button>
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
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.SELL &&
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
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
                  <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleWithdrawShakedOffer)}>Withdraw</Button>
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

  ///Start Offer store
  ////////////////////////

  calculateFiatAmountOfferStore(amount, type, currency, percentage) {
    const { listOfferPrice } = this.props;
    let fiatAmount = 0;

    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, type, currency);
      if (offerPrice) {
        fiatAmount = amount * offerPrice.price || 0;
        fiatAmount += fiatAmount * percentage / 100;
      } else {
        // console.log('aaaa', offer.type, offer.currency);
      }
    }

    return fiatAmount;
  }

  getContentOfferStore = () => {
    const {intl, status} = this.props;
    const { offer } = this;
    const { buyAmount, sellAmount, currency, buyPercentage, sellPercentage } = offer;
    let message = '';
    let fiatAmountBuy = this.calculateFiatAmountOfferStore(buyAmount, EXCHANGE_ACTION.SELL, currency, buyPercentage);
    let fiatAmountSell = this.calculateFiatAmountOfferStore(sellAmount, EXCHANGE_ACTION.BUY, currency, sellPercentage);
    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
        message = intl.formatMessage({id: 'offerStoreHandShakeContent'}, {
          offerTypeBuy: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
          offerTypeSell: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL],
          amountBuy: offer.buyAmount,
          amountSell: offer.sellAmount,
          currency: offer.currency,
          fiatAmountCurrency: offer.fiatCurrency,
          fiatAmountBuy: formatMoney(fiatAmountBuy),
          fiatAmountSell: formatMoney(fiatAmountSell),
        });

        break;
      }
    }

    return message;
  }

  getActionButtonsOfferStore = () => {
    const {intl} = this.props;
    const { offer } = this;
    let status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
    let actionButtons = null;

    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE: {
        let message = intl.formatMessage({id: 'closeOfferConfirm'}, {});
        actionButtons = (
          <div>
            <Button block className="mt-2"
                    onClick={() => this.confirmOfferAction(message, this.deleteOfferItem)}>Close</Button>
          </div>
        );
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
        break;
      }
    }

    return actionButtons;
  }

  deleteOfferItem = async () => {
    const { offer } = this;
    const { currency, sellAmount } = offer;
    console.log('deleteOfferItem', offer);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (sellAmount > 0) {
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          return;
        }
      }
    }

    this.showLoading();
    this.props.deleteOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      METHOD: 'DELETE',
      qs: { currency: offer.currency},
      successFn: this.handleDeleteOfferItemSuccess,
      errorFn: this.handleDeleteOfferItemFailed,
    });
  }

  handleDeleteOfferItemSuccess = async (responseData) => {
    const { intl, refreshPage } = this.props;
    const { data } = responseData;
    const { offer } = this;
    const { currency, sellAmount } = offer;

    console.log('handleDeleteOfferItemSuccess', responseData);

    const offerStore = Offer.offer(data);

    //Update status to redux
    this.responseExchangeDataChangeOfferStore(offerStore);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (sellAmount > 0) {
        const wallet = MasterWallet.getWalletDefault(currency);

        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

        let result = null;

        result = await exchangeHandshake.closeByShopOwner(data.hid, data.id);

        console.log('handleDeleteOfferItemSuccess', result);
      }
    } else if (currency === CRYPTO_CURRENCY.BTC) {

    }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'deleteOfferItemSuccessMassage' }, {
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        if (refreshPage) {
          refreshPage();
        }
      },
    });
  }

  handleDeleteOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  ///End Offer store
  ////////////////////////

  ///Start Offer store shake
  ////////////////////////

  calculateFiatAmount = (offer) => {
    const { listOfferPrice } = this.props;
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
    }
    return fiatAmount;
  }

  getContent = (fiatAmount) => {
    const {intl, status} = this.props;
    const { offer } = this;
    let offerType = '';

    let idMessage = '';
    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED: {

            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
            }

            idMessage = 'offerHandShakeContentMe';

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {

            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
            }

            idMessage = 'offerHandShakeContentMeDone';

            break;
          }
        }

        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED: {

            offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];

            idMessage = 'offerHandShakeContentMe';

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {

            offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];

            idMessage = 'offerHandShakeContentMeDone';

            break;
          }
        }
      }
    }

    let  message = '';
    if (idMessage) {
      message = intl.formatMessage({ id: idMessage }, {
        offerType: offerType,
        amount: formatAmountCurrency(offer.amount),
        currency: offer.currency,
        currency_symbol: offer.fiatCurrency,
        total: formatMoney(fiatAmount),
        // fee: offer.feePercentage,
        payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
      });
    }

    return message;
  }

  getActionButtons = () => {
    const {intl, status} = this.props;
    const offer = this.offer;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
            message = intl.formatMessage({id: 'acceptOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleAcceptShakedOffer)}>Accept</Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.SELL &&
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
                }
              </div>
            );
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
            let message = intl.formatMessage({id: 'cancelOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleCancelShakeOffer)}>Cancel</Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
                }
              </div>
            );
            break;
          }
        }
        break;
      }
    }

    return actionButtons;
  }

  getEmail = () => {
    const { offer } = this;
    let email = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        email = offer.email ? offer.email : offer.contactPhone ? offer.contactPhone : offer.contactInfo;
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        email = offer.toEmail ? offer.toEmail : offer.toContactPhone ? offer.toContactPhone : offer.toContactInfo;
        break;
      }
    }

    return email;
  }

  getChatUserName = () => {
    const { offer } = this;
    let chatUserName = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        chatUserName = offer?.chatUsername;
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        chatUserName = offer?.toChatUsername;
        break;
      }
    }

    return chatUserName;
  }

  ////////////////////////

  handleRejectShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const { id, currency, type } = offer;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          return;
        }
      }
    }

    this.showLoading();
    this.props.rejectOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${id}`,
      METHOD: 'DELETE',
      successFn: this.handleRejectShakedOfferSuccess,
      errorFn: this.handleRejectShakedOfferFailed,
    });
  }

  handleRejectShakedOfferSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { hid, currency, type, offChainId } = offerShake;

    console.log('handleRejectShakedOfferSuccess', responseData);

    //Update status to redux
    this.responseExchangeDataChange(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);

        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

        let result = null;

        result = await exchangeHandshake.reject(hid, offChainId);

        console.log('handleRejectShakedOfferSuccess', result);
      }
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="rejectOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleRejectShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////
  handleCancelShakeOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const { id, currency, type } = offer;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { //shop buy
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          return;
        }
      }
    }

    this.showLoading();
    this.props.cancelOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${id}/cancel`,
      METHOD: 'POST',
      successFn: this.handleCancelShakeOfferSuccess,
      errorFn: this.handleCancelShakeOfferFailed,
    });
  }

  handleCancelShakeOfferSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { hid, currency, type, offChainId } = offerShake;

    console.log('handleCancelShakeOfferSuccess', responseData);

    //Update status to redux
    this.responseExchangeDataChange(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { //shop buy
        const wallet = MasterWallet.getWalletDefault(currency);

        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

        let result = null;

        result = await exchangeHandshake.cancel(hid, offChainId);

        console.log('handleCancelShakeOfferSuccess', result);
      }
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="cancelOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleCancelShakeOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCompleteShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const { id, currency, type } = offer;

    if (currency === CRYPTO_CURRENCY.ETH) {
      if ((type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) ||
      (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED)){
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          return;
        }
      }
    }

    this.showLoading();
    this.props.completeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${id}/complete`,
      METHOD: 'POST',
      successFn: this.handleCompleteShakedOfferSuccess,
      errorFn: this.handleCompleteShakedOfferFailed,
    });
  }

  handleCompleteShakedOfferSuccess = async (responseData) => {
    const { offer } = this;
    const { initUserId, refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { hid, currency, type, offChainId, totalAmount } = offerShake;

    console.log('handleDeleteOfferItemSuccess', responseData);

    //Update status to redux
    this.responseExchangeDataChange(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if ((type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) ||
        (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED)){
        const wallet = MasterWallet.getWalletDefault(currency);
        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);
        let result = null;

        if (type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) {
          result = await exchangeHandshake.releasePartialFund(hid, offer.userAddress , totalAmount, initUserId, offChainId);
        } else if (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED){
          result = await exchangeHandshake.finish(hid, offChainId);
        }

        console.log('handleCompleteShakedOfferSuccess', result);
      }
    }

    // console.log('data', data);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="completeOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleCompleteShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleAcceptShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      if (offer.type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(offer.currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
          return;
        }
      }
    }

    this.showLoading();
    this.props.acceptOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}/accept`,
      METHOD: 'POST',
      successFn: this.handleAcceptShakedOfferSuccess,
      errorFn: this.handleAcceptShakedOfferFailed,
    });
  }

  handleAcceptShakedOfferSuccess = async (responseData) => {
    console.log('handleDeleteOfferItemSuccess', responseData);
    const { refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const { hid, currency, type, offChainId } = offerShake;

    //Update status to redux
    this.responseExchangeDataChange(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);

        const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

        let result = await exchangeHandshake.shake(hid, offChainId);

        console.log('handleAcceptShakedOfferSuccess', result);
      }
    }

    // console.log('data', data);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="acceptOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleAcceptShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ///End Offer store shake
  ////////////////////////

  handleActionFailed = (e) => {
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
  }

  isMovingCoin = () => {
    const { offer } = this;
    const { status } = this.props;
    let result = false;

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.INSTANT: {
        result = false;
        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING: {
            result = true;
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {

            break;
          }
        }

        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE: {

        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING: {

            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  result = true;
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  result = true;
                }

                break;
              }
            }

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {

            break;
          }
        }

        break;
      }
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.CREATED:
          case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING:
          case HANDSHAKE_EXCHANGE_STATUS.REJECTING: {

            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  result = true;
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  result = true;
                }

                break;
              }
            }

            break;
          }

          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE:
          case HANDSHAKE_EXCHANGE_STATUS.CLOSED:
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW:
          case HANDSHAKE_EXCHANGE_STATUS.REJECTED: {
            break;
          }
        }

        break;
      }
    }

    return result;
  }

  render() {
    const {intl, initUserId, shakeUserIds, location, state, status, mode = 'discover', ipInfo: { latitude, longitude, country }, initAt, review, reviewCount, ...props} = this.props;
    const offer = this.offer;
    // console.log('render',offer);
    const {listOfferPrice} = this.props;
    console.log('review, reviewCount',review, reviewCount);
    let modalContent = this.state.modalContent;

    let email = '';
    let statusText = '';
    let message = '';
    let message2 = '';
    let actionButtons = null;
    let from = 'From';
    let showChat = false;
    let chatUsername = '';
    // let buyerSeller = this.getBuyerSeller();
    let nameShop = offer.username;

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.INSTANT: {
        email = APP_USER_NAME;
        statusText = HANDSHAKE_EXCHANGE_CC_STATUS_NAME[status];
        let just = ' ';

        var hours = Math.abs(Date.now() - (initAt * 1000)) / 36e5;

        if (hours < 4) {
          just = ' just ';
        }

        let fiatAmount = this.calculateFiatAmount(offer);

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
      case EXCHANGE_FEED_TYPE.OFFER_STORE: {
        email = offer.email ? offer.email : offer.contactPhone ? offer.contactPhone : offer.contactInfo;
        let statusValue = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[offer.status];
        statusText = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_NAME[statusValue];

        message = this.getContentOfferStore();

        actionButtons = this.getActionButtonsOfferStore();

        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE: {
        from = 'With';
        email = this.getEmail();
        statusText = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_NAME[status];
        showChat = true;
        chatUsername = this.getChatUserName();

        let fiatAmount = this.calculateFiatAmount(offer);

        message = this.getContent(fiatAmount);

        actionButtons = this.getActionButtons();
        break;
      }
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];
        nameShop = 'About';
        const fiatAmount = this.calculateFiatAmount(offer);

        from = this.getFromExchange();

        message = this.getContentExchange(fiatAmount);

        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING:
          case HANDSHAKE_EXCHANGE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW:
          case HANDSHAKE_EXCHANGE_STATUS.REJECTED: {

            showChat = true;

            chatUsername = this.getChatUserName();

            break;
          }
        }

        actionButtons = this.getActionButtonsExchange();
        break;
      }
    }

    /*const phone = offer.contactPhone;*/
    const address = offer.contactInfo;


    let distanceKm = 0;

    if (location) {
      const latLng = location.split(',')
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1])
    }
    const isCreditCard = offer.feedType === EXCHANGE_FEED_TYPE.INSTANT;

    const phone = offer.contactPhone;
    const phoneDisplayed = phone.replace(/-/g, '');

    const isMovingCoin = this.isMovingCoin();

    return (
      <div className="feed-me-exchange">
        {/*<div>userType: {this.userType}</div>*/}
        {/*<div>status: {status}</div>*/}
        <div className="mb-1">
          <span style={{ color: '#C8C7CC' }}>{from}</span> <span style={{ color: '#666666' }}>{email}</span>
          <span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>
        </div>
        <Feed
          className="feed text-white"
          // background={`${mode === 'discover' ? '#FF2D55' : '#50E3C2'}`}
          background="linear-gradient(-225deg, #EE69FF 0%, #955AF9 100%)"
        >
          <div className="d-flex mb-4">
            <div className="headline">{message}</div>
            {
              !isCreditCard && showChat && (
                <div className="ml-auto pl-2 pt-2" style={{ width: '50px' }}>                {/* to-do chat link */}
                  <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                    <img src={iconChat} width='35px' />
                  </Link>
                </div>
              )
            }

          </div>

          <div className="mb-1 name-shop">{nameShop}</div>
          {/*
          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconPhone} width={20}/>
                <div className="media-body">
                  <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }

          <div className="media mb-1 detail">
            <img className="mr-2" src={iconLocation} width={20}/>
            <div className="media-body">
              <div>{address}</div>
            </div>
          </div>
          */}

          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconPhone} width={20}/>
                <div className="media-body">
                  <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }
          {
            address && (
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconLocation} width={20}/>
                <div className="media-body">
                  <div>{address}</div>
                </div>
              </div>
            )
          }
          { isMovingCoin && (<div className="mt-2">Moving your coin to escrow. This may take a few minutes.</div>) }

          {/*
            !isCreditCard && (
              <div className="media detail">
                <img className="mr-2" src={iconLocation} width={20} />
                <div className="media-body">
                  <div>
                    <FormattedMessage id="offerDistanceContent" values={{
                      // offerType: offer.type === 'buy' ? 'Buyer' : 'Seller',
                      distance: getLocalizedDistance(distanceKm, country_code)
                      // distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
                      // distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
                    }}/>
                  </div>
                </div>
              </div>
            )
          */}
        </Feed>
        {/*<Button block className="mt-2">Accept</Button>*/}
        {actionButtons}
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

FeedMe.propTypes = {
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

  rejectOfferItem,
  completeOfferItem,
  cancelOfferItem,
  acceptOfferItem,
  deleteOfferItem,
  responseExchangeDataChange,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMe));
