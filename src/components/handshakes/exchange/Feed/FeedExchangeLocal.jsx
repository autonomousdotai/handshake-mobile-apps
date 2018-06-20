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

class FeedExchangeLocal extends React.PureComponent {
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
            <Button className="mt-2" block onClick={() => this.handleConfirmAction(actionConfirm)}><FormattedMessage id="ex.btn.confirm"/></Button>
            <Button block className="btn btn-secondary" onClick={this.cancelAction}><FormattedMessage id="ex.btn.notNow"/></Button>
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
    let result = true;

    if (process.env.isProduction && !process.env.isStaging) {
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        result = true;
      } else {
        const message = <FormattedMessage id="requireDefaultWalletOnMainNet" />;
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
      this.props.showAlert({
        message: <div className="text-center">
          <FormattedMessage id="notEnoughCoinInWallet" values={ {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: currency,
          } }/>
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
    const {status} = this.props;

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
            from = <FormattedMessage id="ex.me.label.with"/>;

            break;
          }
          case HANDSHAKE_USER.OWNER: {
            from = <FormattedMessage id="ex.me.label.from"/>;

            break;
          }
        }

        break;
      }
      default: {
        switch (this.userType) {
          case HANDSHAKE_USER.SHAKED: {
            from = <FormattedMessage id="ex.me.label.with"/>;

            break;
          }
          case HANDSHAKE_USER.OWNER: {
            from = <FormattedMessage id="ex.me.label.from"/>;

            break;
          }
        }
        break;
      }
    }

    return from;
  }

  getContentExchange(fiatAmount) {
    const {status} = this.props;
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
        message = <FormattedMessage id="offerHandShakeExchangeContentMeDone"
                                    values={ {
                                      offerType: offerType,
                                      something: offer.physicalItem,
                                      amount: formatAmountCurrency(offer.amount),
                                      currency: offer.currency,
                                      currency_symbol: offer.fiatCurrency,
                                      total: formatMoneyByLocale(fiatAmount,offer.fiatCurrency),
                                      fee: offer.feePercentage,
                                      payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
                                    } } />;

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

        message = <FormattedMessage id="offerHandShakeExchangeContentMe"
                                    values={ {
                                      offerType: offerType,
                                      something: offer.physicalItem,
                                      amount: formatAmountCurrency(offer.amount),
                                      currency: offer.currency,
                                      currency_symbol: offer.fiatCurrency,
                                      total: formatMoneyByLocale(fiatAmount,offer.fiatCurrency),
                                      fee: offer.feePercentage,
                                      payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
                                    } } />;

        break;
      }
    }
    console.log('offferes', offer.physical_item)
    return message;
  }

  getActionButtonsExchange = () => {
    const {status} = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            message = <FormattedMessage id="handshakeOfferConfirm"
                                        values={ {
                                          type: offer.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] : EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
                                          amount: formatAmountCurrency(offer.amount),
                                          currency: offer.currency,
                                          currency_symbol: offer.fiatCurrency,
                                          total: formatMoneyByLocale(fiatAmount,offer.fiatCurrency),
                                        } } />;
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleShakeOfferExchange)}><FormattedMessage id="btn.shake"/></Button>
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

  ////////////////////////
  handleShakeOfferExchange = async () => {
    const { authProfile } = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;

    const wallet = MasterWallet.getWalletDefault(offer.currency);
    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(10, true);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

    if (offer.type === EXCHANGE_ACTION.BUY && this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
      return;
    } else if (offer.currency === CRYPTO_CURRENCY.ETH && this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
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
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}`,
      METHOD: 'POST',
      data: offerShake,
      successFn: this.handleShakeOfferExchangeSuccess,
      errorFn: this.handleShakeOfferExchangeFailed,
    });
  }

  handleShakeOfferExchangeSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    const { offer } = this;
    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);
      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);
      let amount = 0;

      if (offer.type === EXCHANGE_ACTION.BUY) {
        amount = data.total_amount;
      }
      const result = await exchangeHandshake.shake(data.hid, amount, data.id);

      console.log('handleShakeOfferExchangeSuccess', result);
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

  getMessageMovingCoin = () => {
    const { status } = this.props;
    const { offer } = this;

    let idMessage = '';

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.INSTANT: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING: {
            idMessage = 'movingCoinFromEscrow';
            break;
          }
        }
        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED: {
            idMessage = 'movingCoinToEscrow';
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING: {
            idMessage = 'movingCoinFromEscrow';
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
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.CANCELLING: {

            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  idMessage = 'movingCoinToEscrow';
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  idMessage = 'movingCoinToEscrow';
                }

                break;
              }
            }

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING: {
            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  idMessage = 'movingCoinFromEscrow';
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  idMessage = 'movingCoinFromEscrow';
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
          case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_STATUS.COMPLETING: {

            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  idMessage = 'movingCoinToEscrow';
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  idMessage = 'movingCoinToEscrow';
                }

                break;
              }
            }

            break;
          }

          case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
          case HANDSHAKE_EXCHANGE_STATUS.REJECTING: {
            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop buy
                  idMessage = 'movingCoinFromEscrow';
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop sell
                  idMessage = 'movingCoinFromEscrow';
                }

                break;
              }
            }

            break;
          }

          case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING: {

            switch (this.userType) {
              case HANDSHAKE_USER.NORMAL: {
                break;
              }
              case HANDSHAKE_USER.SHAKED: {//user shake
                if (offer.type === EXCHANGE_ACTION.SELL) {//shop buy
                  idMessage = 'movingCoinFromEscrow';
                }

                break;
              }
              case HANDSHAKE_USER.OWNER: {//shop
                if (offer.type === EXCHANGE_ACTION.BUY) {//shop sell
                  idMessage = 'movingCoinFromEscrow';
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

    let message = '';
    if (idMessage) {
      message = <FormattedMessage id={idMessage} values={ {} } />;
    }

    return message;
  }


  render() {
    const {intl, initUserId, shakeUserIds, location, state, status, mode = 'discover', ipInfo: { latitude, longitude, country }, initAt, ...props} = this.props;
    const offer = this.offer;
    // console.log('render',offer);
    const {listOfferPrice} = this.props;

    let modalContent = this.state.modalContent;

    let email = '';
    let statusText = '';
    let message = '';
    let message2 = '';
    let actionButtons = null;
    let from = <FormattedMessage id="ex.me.label.from"/>;
    let showChat = false;
    let chatUsername = '';
    // let buyerSeller = this.getBuyerSeller();
    let nameShop = offer.username;

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];
        nameShop = <FormattedMessage id="ex.me.label.about"/>;
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

    const messageMovingCoin = this.getMessageMovingCoin();

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
          { messageMovingCoin && (<div className="mt-2">{messageMovingCoin}</div>) }

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

FeedExchangeLocal.propTypes = {
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
  showAlert,
  showLoading,
  hideLoading,

  responseExchangeDataChange,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchangeLocal));
