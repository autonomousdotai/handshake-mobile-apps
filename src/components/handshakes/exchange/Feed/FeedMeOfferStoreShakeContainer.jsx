import React from 'react';
import FeedMeCash from './FeedMeCash';
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_ORDER,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PERSON,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_FEED_TYPE,
  EXCHANGE_METHOD_PAYMENT,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_NAME,
  HANDSHAKE_USER,
  NB_BLOCKS,
} from '@/constants';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { ExchangeCashHandshake } from '@/services/neuron';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserLocation, showAlert } from '@/reducers/app/action';
import { responseExchangeDataChange } from '@/reducers/me/action';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import {
  formatAmountCurrency,
  formatMoneyByLocale,
  getHandshakeUserType,
  getLatLongHash,
  getOfferPrice,
} from '@/services/offer-util';
import Offer from '@/models/Offer';
import {
  acceptOfferItem,
  cancelOfferItem,
  completeOfferItem,
  rejectOfferItem,
  reviewOffer,
  trackingLocation,
} from '@/reducers/exchange/action';
import Rate from '@/components/core/controls/Rate/Rate';

class FeedMeOfferStoreShakeContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initUserId, shakeUserIds, extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;

    this.state = {
      numStars: 0,
    };
  }

  trackingOnchain = (offerStoreId, offerStoreShakeId, txHash, action, reason, currency) => {
    const { trackingOnchain } = this.props;

    if (trackingOnchain) {
      trackingOnchain(offerStoreId, offerStoreShakeId, txHash, action, reason, currency);
    }
  }

  trackingTransfer = (offerStoreId, offerStoreShakeId, txHash) => {
    const { trackingTransfer } = this.props;

    if (trackingTransfer) {
      trackingTransfer(offerStoreId, offerStoreShakeId, txHash);
    }
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { checkMainNetDefaultWallet } = this.props;

    if (checkMainNetDefaultWallet) {
      return checkMainNetDefaultWallet(wallet);
    }

    return true;
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const { showNotEnoughCoinAlert } = this.props;

    if (showNotEnoughCoinAlert) {
      return showNotEnoughCoinAlert(balance, amount, fee, currency);
    }
  }

  trackingLocation = (offerStoreId, offerStoreShakeId, action) => {
    const { trackingLocation, getUserLocation } = this.props;
    getUserLocation({
      successFn: (ipInfo) => {
        const data = {
          data: getLatLongHash(ipInfo?.locationMethod, ipInfo?.latitude, ipInfo?.longitude),
          ip: ipInfo?.ip,
          action,
        };
        trackingLocation({
          PATH_URL: `exchange/offer-stores/${offerStoreId}/shakes/${offerStoreShakeId}/7tHCLp8XpajPJaVh`,
          METHOD: 'POST',
          data,
        });
      },
    });
  }

  calculateFiatAmount = () => {
    const { offer } = this;
    const { listOfferPrice } = this.props;
    let fiatAmount = 0;
    const { currency, fiatCurrency } = offer;

    if (offer.fiatAmount) {
      fiatAmount = offer.fiatAmount;
    } else if (listOfferPrice) {
      let checkType = offer.type;
      if (this.userType === HANDSHAKE_USER.SHAKED) {
        checkType = offer.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY;
      }

      const offerPrice = getOfferPrice(listOfferPrice, checkType, currency, fiatCurrency);
      if (offerPrice) {
        fiatAmount = offer.amount * offerPrice.price || 0;
        fiatAmount += fiatAmount * offer.percentage / 100;
      } else {
        console.log('aaaa', offer.type, offer.currency);
      }
    }
    return fiatAmount;
  }

  getEmail = () => {
    const {
      email, contactPhone, currency, userAddress,
    } = this.offer;

    if (email) { return email; }
    if (contactPhone) { return contactPhone; }
    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = new Ethereum();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    if (currency === CRYPTO_CURRENCY.BTC) {
      const wallet = new Bitcoin();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    return '';
  }

  getChatUserName = () => {
    const { initUserId, shakeUserIds } = this.props;

    let chatUserName = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        chatUserName = initUserId;
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        chatUserName = shakeUserIds && shakeUserIds.length > 0 ? shakeUserIds[0] : '';
        break;
      }
      default: {
        // code
        break;
      }
    }
    return chatUserName?.toString() || '';
  }

  getBuyerSeller = () => {
    const { offer } = this;

    let message = '';
    let cashTitle = '';
    let coinTitle = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        message = EXCHANGE_ACTION_ORDER[offer.type];
        if (offer.type === EXCHANGE_ACTION.BUY) {
          coinTitle = <FormattedMessage id="ex.label.buying" />;
          cashTitle = <FormattedMessage id="ex.label.cost" />;
        } else if (offer.type === EXCHANGE_ACTION.SELL) {
          coinTitle = <FormattedMessage id="ex.label.selling" />;
          cashTitle = <FormattedMessage id="ex.label.receiving" />;
        }
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        if (offer.type === EXCHANGE_ACTION.BUY) {
          message = EXCHANGE_ACTION_ORDER[EXCHANGE_ACTION.SELL];
          coinTitle = <FormattedMessage id="ex.label.selling" />;
          cashTitle = <FormattedMessage id="ex.label.receiving" />;
        } else if (offer.type === EXCHANGE_ACTION.SELL) {
          message = EXCHANGE_ACTION_ORDER[EXCHANGE_ACTION.BUY];
          coinTitle = <FormattedMessage id="ex.label.buying" />;
          cashTitle = <FormattedMessage id="ex.label.cost" />;
        }
        break;
      }
    }

    if (message) {
      message = <FormattedMessage id='ex.shop.shake.buyer.seller' values={{
        buyerSeller: message
      }}/>
    }

    return { message, cashTitle, coinTitle };
  }

  // getMessageContent = (fiatAmount) => {
  //   const { status } = this.props;
  //   const { offer } = this;
  //   let offerType = '';
  //
  //   let idMessage = '';
  //   switch (this.userType) {
  //     case HANDSHAKE_USER.NORMAL: {
  //       break;
  //     }
  //     case HANDSHAKE_USER.SHAKED: {
  //       switch (status) {
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED: {
  //           if (offer.type === EXCHANGE_ACTION.BUY) {
  //             offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
  //           } else if (offer.type === EXCHANGE_ACTION.SELL) {
  //             offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
  //           }
  //
  //           idMessage = 'offerHandShakeContentMe';
  //
  //           break;
  //         }
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {
  //           if (offer.type === EXCHANGE_ACTION.BUY) {
  //             offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
  //           } else if (offer.type === EXCHANGE_ACTION.SELL) {
  //             offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
  //           }
  //
  //           idMessage = 'offerHandShakeContentMeDone';
  //
  //           break;
  //         }
  //       }
  //
  //       break;
  //     }
  //     case HANDSHAKE_USER.OWNER: {
  //       switch (status) {
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED: {
  //           offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];
  //
  //           idMessage = 'offerHandShakeContentMe';
  //
  //           break;
  //         }
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
  //         case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {
  //           offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
  //
  //           idMessage = 'offerHandShakeContentMeDone';
  //
  //           break;
  //         }
  //         default: {
  //           // code
  //           break;
  //         }
  //       }
  //       break;
  //     }
  //   }
  //
  //   let message = '';
  //   if (idMessage) {
  //     message = (<FormattedMessage
  //       id={idMessage}
  //       values={{
  //         offerType,
  //         amount: formatAmountCurrency(offer.amount),
  //         currency: offer.currency,
  //         currency_symbol: offer.fiatCurrency,
  //         total: formatMoneyByLocale(fiatAmount, offer.fiatCurrency),
  //         // fee: offer.feePercentage,
  //         payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
  //       }}
  //     />);
  //   }
  //
  //   return message;
  // }

  getActionButtons = () => {
    const { status, confirmOfferAction } = this.props;
    const { offer } = this;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
            message = <FormattedMessage id="acceptOfferConfirm" values={{ }} />;
            actionButtons = (
              <div className="mt-3">
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-confirm"
                    onClick={() => confirmOfferAction(message, this.handleAcceptShakedOffer)}
                  ><FormattedMessage id="btn.accept" />
                  </button>
                </span>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = <FormattedMessage id="rejectOfferConfirmForShop" values={{ }} />;
            const message2 = <FormattedMessage id="completeOfferConfirm" values={{ }} />;
            actionButtons = (
              <div className="mt-3">
                {offer.type === EXCHANGE_ACTION.SELL &&
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-confirm"
                    onClick={() => confirmOfferAction(message2, this.handleCompleteShakedOffer)}
                  ><FormattedMessage id="btn.complete" />
                  </button>
                </span>
                }
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-cancel"
                    onClick={() => confirmOfferAction(message, this.handleRejectShakedOffer)}
                  ><FormattedMessage id="btn.reject" />
                  </button>
                </span>
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
            message = <FormattedMessage id="cancelOfferConfirm" values={{ }} />;
            actionButtons = (
              <div className="mt-3">
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-cancel"
                    onClick={() => confirmOfferAction(message, this.handleCancelShakeOffer)}
                  ><FormattedMessage id="btn.cancel" />
                  </button>
                </span>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = <FormattedMessage id="rejectOfferConfirm" values={{ }} />;
            const message2 = <FormattedMessage id="completeOfferConfirm" values={{ }} />;
            actionButtons = (
              <div className="mt-3">
                {offer.type === EXCHANGE_ACTION.BUY &&
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-confirm"
                    onClick={() => confirmOfferAction(message2, this.handleCompleteShakedOffer)}
                  ><FormattedMessage id="btn.complete" />
                  </button>
                </span>
                }
                <span className="d-inline-block auto-width">
                  <button
                    className="btn btn-block btn-cancel"
                    onClick={() => confirmOfferAction(message, this.handleRejectShakedOffer)}
                  ><FormattedMessage id="btn.cancel" />
                  </button>
                </span>
              </div>
            );
            break;
          }
        }
        break;
      }
      default: {
        // code
        break;
      }
    }

    return actionButtons;
  }

  // //////////////////////

  handleAcceptShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;

    // if (offer.currency === CRYPTO_CURRENCY.ETH) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     const balance = await wallet.getBalance();
    //     const fee = await wallet.getFee();
    //
    //     if (!this.checkMainNetDefaultWallet(wallet)) {
    //       return;
    //     }
    //
    //     if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
    //       return;
    //     }
    //   }
    // }

    this.props.showLoading();
    this.props.acceptOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}/accept`,
      METHOD: 'POST',
      successFn: this.handleAcceptShakedOfferSuccess,
      errorFn: this.handleAcceptShakedOfferFailed,
    });
  }

  handleAcceptShakedOfferSuccess = async (responseData) => {
    console.log('handleAcceptShakedOfferSuccess', responseData);
    const { initUserId, refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const {
      hid, currency, type, offChainId, status,
    } = offerShake;

    // Update status to redux
    this.responseExchangeDataChange(offerShake);

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (type === EXCHANGE_ACTION.BUY) {
    //     try {
    //       const wallet = MasterWallet.getWalletDefault(currency);
    //
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //
    //       const result = await cashHandshake.shake(hid, offChainId);
    //
    //       console.log('handleAcceptShakedOfferSuccess', result);
    //
    //       this.trackingOnchain(initUserId, offerShake.id, result.hash, status, '', currency);
    //     } catch (e) {
    //       this.trackingOnchain(initUserId, offerShake.id, '', status, e.toString(), currency);
    //       console.log('handleAcceptShakedOfferSuccess', e.toString());
    //     }
    //   }
    // }

    // console.log('data', data);
    this.trackingLocation(initUserId, offerShake.id, status);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="acceptOfferItemSuccessMassage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleAcceptShakedOfferFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////

  handleCompleteShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const {
      id, currency, type, freeStart,
    } = offer;

    this.props.showLoading();

    if (currency === CRYPTO_CURRENCY.ETH) {
      if ((type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER && freeStart === '') ||
        (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED)) {
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          this.props.hideLoading();
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          this.props.hideLoading();
          return;
        }
      }
    }

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
    const {
      hid, currency, type, offChainId, amount, status, userAddress, totalAmount, fee,
    } = offerShake;
    const { freeStart } = offer;

    console.log('handleCompleteShakedOfferSuccess', responseData);

    // Update status to redux
    this.responseExchangeDataChange(offerShake);

    let transferAmount = '';

    if (type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) {
      transferAmount = amount;
    } else if (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED) {
      transferAmount = totalAmount;
    }

    const wallet = MasterWallet.getWalletDefault(currency);
    wallet.transfer(userAddress, transferAmount, NB_BLOCKS).then((success) => {
      console.log('transfer', success);

      const { data: { hash: txHash } } = success;
      this.trackingTransfer(initUserId, offerShake.id, txHash);
    });

    wallet.transfer(process.env.wallets[currency], fee, NB_BLOCKS).then((success) => {
      console.log('transfer', success);
    });

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if ((type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER && freeStart === '') ||
    //     (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED)) {
    //
    //     try {
    //       const wallet = MasterWallet.getWalletDefault(currency);
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //       let result = null;
    //
    //       if (type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) {
    //         result = await cashHandshake.releasePartialFund(hid, offer.userAddress, amount, initUserId, offChainId);
    //       } else if (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED) {
    //         result = await cashHandshake.finish(hid, offChainId);
    //       }
    //
    //       console.log('handleCompleteShakedOfferSuccess', result);
    //       this.trackingOnchain(initUserId, offerShake.id, result.hash, status, '', currency);
    //     } catch (e) {
    //       this.trackingOnchain(initUserId, offerShake.id, '', status, e.toString(), currency);
    //       console.log('handleCompleteShakedOfferSuccess', e.toString());
    //     }
    //   }
    // }

    // console.log('data', data);
    this.trackingLocation(initUserId, offerShake.id, status);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="completeOfferItemSuccessMassage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });

    if (type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED) {
      this.rateRef.open();
    }
  }

  handleCompleteShakedOfferFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////

  handleRejectShakedOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const { id, currency, type } = offer;

    this.props.showLoading();

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (type === EXCHANGE_ACTION.BUY) { // shop buy
    //     const wallet = MasterWallet.getWalletDefault(currency);
    //     const balance = await wallet.getBalance();
    //     const fee = await wallet.getFee();
    //
    //     if (!this.checkMainNetDefaultWallet(wallet)) {
    //       this.props.hideLoading();
    //       return;
    //     }
    //
    //     if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
    //       this.props.hideLoading();
    //       return;
    //     }
    //   }
    // }

    this.props.rejectOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${id}`,
      METHOD: 'DELETE',
      successFn: this.handleRejectShakedOfferSuccess,
      errorFn: this.handleRejectShakedOfferFailed,
    });
  }

  handleRejectShakedOfferSuccess = async (responseData) => {
    const { initUserId, refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const {
      hid, currency, type, offChainId, status,
    } = offerShake;

    console.log('handleRejectShakedOfferSuccess', responseData);

    // Update status to redux
    this.responseExchangeDataChange(offerShake);

    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   if (type === EXCHANGE_ACTION.BUY) { // shop buy
    //     try {
    //       const wallet = MasterWallet.getWalletDefault(currency);
    //
    //       const cashHandshake = new ExchangeCashHandshake(wallet.chainId);
    //
    //       let result = null;
    //
    //       result = await cashHandshake.reject(hid, offChainId);
    //
    //       console.log('handleRejectShakedOfferSuccess', result);
    //
    //       this.trackingOnchain(initUserId, offerShake.id, result.hash, status, '', currency);
    //     } catch (e) {
    //       this.trackingOnchain(initUserId, offerShake.id, '', status, e.toString(), currency);
    //       console.log('handleRejectShakedOfferSuccess', e.toString());
    //     }
    //   }
    // }
    //
    this.trackingLocation(initUserId, offerShake.id, status);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="rejectOfferItemSuccessMassage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleRejectShakedOfferFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////

  handleCancelShakeOffer = async () => {
    const { offer } = this;
    const { initUserId } = this.props;
    const { id, currency, type } = offer;

    this.props.showLoading();

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { // shop buy
        const wallet = MasterWallet.getWalletDefault(currency);
        const balance = await wallet.getBalance();
        const fee = await wallet.getFee();

        if (!this.checkMainNetDefaultWallet(wallet)) {
          this.props.hideLoading();
          return;
        }

        if (this.showNotEnoughCoinAlert(balance, 0, fee, currency)) {
          this.props.hideLoading();
          return;
        }
      }
    }

    this.props.cancelOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${id}/cancel`,
      METHOD: 'POST',
      successFn: this.handleCancelShakeOfferSuccess,
      errorFn: this.handleCancelShakeOfferFailed,
    });
  }

  handleCancelShakeOfferSuccess = async (responseData) => {
    const { initUserId, refreshPage } = this.props;
    const { data } = responseData;
    const offerShake = Offer.offer(data);
    const {
      hid, currency, type, offChainId, status,
    } = offerShake;

    console.log('handleCancelShakeOfferSuccess', responseData);

    // Update status to redux
    this.responseExchangeDataChange(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      if (type === EXCHANGE_ACTION.BUY) { // shop buy
        try {
          const wallet = MasterWallet.getWalletDefault(currency);

          const cashHandshake = new ExchangeCashHandshake(wallet.chainId);

          let result = null;

          result = await cashHandshake.cancel(hid, offChainId);

          console.log('handleCancelShakeOfferSuccess', result);

          this.trackingOnchain(initUserId, offerShake.id, result.hash, status, '', currency);
        } catch (e) {
          this.trackingOnchain(initUserId, offerShake.id, '', status, e.toString(), currency);
          console.log('handleCancelShakeOfferSuccess', e.toString());
        }
      }
    }

    this.trackingLocation(initUserId, offerShake.id, status);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="cancelOfferItemSuccessMassage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleCancelShakeOfferFailed = (e) => {
    this.props.handleActionFailed(e);
  }


  // //////////////////////

  responseExchangeDataChange = (offerShake) => {
    const { id, status } = offerShake;
    const data = {};
    const firebaseOffer = {};

    firebaseOffer.id = id;
    firebaseOffer.status = status;
    firebaseOffer.type = 'offer_store_shake';

    data[`offer_store_shake_${id}`] = firebaseOffer;

    console.log('responseExchangeDataChange', data);

    this.props.responseExchangeDataChange(data);
  }

  getMessageMovingCoin = () => {
    const { status } = this.props;
    const { offer } = this;

    let idMessage = '';
    let showClock = false;

    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING: {
        if (this.userType === HANDSHAKE_USER.OWNER) {
          idMessage = 'ex.shop.explanation.cancelling';
          showClock = true;
        }
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING: {
        if (this.userType === HANDSHAKE_USER.OWNER) {
          idMessage = 'ex.shop.explanation.rejecting';
          showClock = true;
        }
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING: {
        if (this.userType === HANDSHAKE_USER.SHAKED) {
          idMessage = 'ex.shop.explanation.pre_shaking';
          showClock = true;
        }
        break;
      }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
        if (this.userType === HANDSHAKE_USER.SHAKED) {
          idMessage = 'ex.shop.explanation.pre_shake';
          showClock = false;
        }
        break;
      }
      // case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING: {
      //   if (this.userType === HANDSHAKE_USER.SHAKED) {
      //     idMessage = 'ex.shop.explanation.shaking';
      //   }
      //   break;
      // }
      // case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
      //   switch (this.userType) {
      //     case HANDSHAKE_USER.NORMAL: {
      //       break;
      //     }
      //     case HANDSHAKE_USER.SHAKED: { // user shake
      //       if (offer.type === EXCHANGE_ACTION.SELL) { // shop sell
      //         idMessage = 'ex.shop.explanation.shake';
      //       }
      //       break;
      //     }
      //     case HANDSHAKE_USER.OWNER: { // shop
      //       if (offer.type === EXCHANGE_ACTION.BUY) { // shop buy
      //         idMessage = 'ex.shop.explanation.shake';
      //       }
      //       break;
      //     }
      //     default: {
      //       // code
      //       break;
      //     }
      //   }
      // }
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING: {
        switch (this.userType) {
          case HANDSHAKE_USER.NORMAL: {
            break;
          }
          case HANDSHAKE_USER.OWNER: { // shop
            if (offer.type === EXCHANGE_ACTION.BUY) { // shop buy
              idMessage = 'ex.shop.explanation.completing';
              showClock = true;
            }
            break;
          }
          case HANDSHAKE_USER.SHAKED: { // user shake
            if (offer.type === EXCHANGE_ACTION.SELL) { // shop sell
              idMessage = 'ex.shop.explanation.completing';
              showClock = true;
            }
            break;
          }
          default: {
            // code
            break;
          }
        }

        break;
      }
      // case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED:
      // case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLED:
      // case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {
      //   break;
      // }
      default: {
        // code
        break;
      }
    }

    let message = '';
    if (idMessage) {
      message = <FormattedMessage id={idMessage} values={{}} />;
    }

    return { message, showClock };
  }

  // //////////////////////

  handleOnClickRating = (numStars) => {
    this.setState({ numStars });
  }

  handleSubmitRating = () => {
    this.rateRef.close();
    const { offer } = this;
    const { initUserId } = this.props;
    this.props.reviewOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.REVIEWS}/${offer.id}`,
      METHOD: 'POST',
      qs: { score: this.state.numStars },
      successFn: this.handleReviewOfferSuccess,
      errorFn: this.handleReviewOfferFailed,
    });
  }

  handleReviewOfferSuccess = (responseData) => {
    console.log('handleReviewOfferSuccess', responseData);
    const data = responseData.data;
  }

  handleReviewOfferFailed = (e) => {
  }

  render() {
    const {
      extraData, status, getDisplayName,
    } = this.props;

    const offer = Offer.offer(JSON.parse(extraData));
    this.offer = offer;

    const from = <FormattedMessage id="ex.me.label.with" />;
    const email = this.getEmail();
    const statusText = HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS_NAME[status];
    const showInfo = this.userType === HANDSHAKE_USER.SHAKED;
    let showChat = false;
    let chatUsername = '';

    switch (status) {
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
      case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {
        chatUsername = this.getChatUserName();

        showChat = chatUsername.length > 0;

        break;
      }
      default: {
        // code
        break;
      }
    }

    const nameShop = getDisplayName();
    const fiatAmount = this.calculateFiatAmount();
    // const message = this.getMessageContent(fiatAmount);
    const { message, cashTitle, coinTitle } = this.getBuyerSeller();
    const actionButtons = this.getActionButtons();
    const { message: messageMovingCoin, showClock } = this.getMessageMovingCoin();

    const feedProps = {
      from,
      email,
      statusText,
      message,
      cashTitle,
      coinTitle,
      showInfo,
      showChat,
      chatUsername,
      nameShop,
      messageMovingCoin,
      actionButtons,
      amount: offer.amount,
      fiatAmount,
      currency: offer.currency,
      fiatCurrency: offer.fiatCurrency,
      showClock,
    };

    return (
      <div>
        <FeedMeCash {...this.props} {...feedProps} />
        <Rate onRef={e => this.rateRef = e} startNum={5} onSubmit={this.handleSubmitRating} ratingOnClick={this.handleOnClickRating} />
      </div>
    );
  }
}

FeedMeOfferStoreShakeContainer.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = ({
  showAlert,

  reviewOffer,

  acceptOfferItem,
  completeOfferItem,
  rejectOfferItem,
  cancelOfferItem,

  responseExchangeDataChange,
  trackingLocation,
  getUserLocation,
});

export default connect(mapState, mapDispatch)(FeedMeOfferStoreShakeContainer);
