import React from 'react';
import PropTypes from 'prop-types';
// style
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_FEED_TYPE,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_USER,
  NB_BLOCKS,
  URL
} from "@/constants";
import {connect} from "react-redux";
import {shakeOffer,} from "@/reducers/exchange/action";
import Offer from "@/models/Offer";
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import {formatAmountCurrency, getHandshakeUserType} from "@/services/offer-util";
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import {getDistanceFromLatLonInKm, getErrorMessageFromCode} from '../utils';
import {ExchangeHandshake,} from '@/services/neuron';
import {feedBackgroundColors} from "@/components/handshakes/exchange/config";
import {BigNumber} from "bignumber.js";
import "./FeedExchangeLocal.scss"
import StarsRating from "@/components/core/presentation/StarsRating";
import iconChat from '@/assets/images/icon/chat-icon.svg';

class FeedExchangeLocal extends React.PureComponent {
  constructor(props) {
    super(props);

    const {initUserId, shakeUserIds, extraData} = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;
    console.log('FeedExchangeLocal', this.offer);

    this.state = {
      modalContent: '',
    };
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

  ///Exchange
  ////////////////////////

  getContentExchange() {
    const { offer } = this;
    const { type, physicalItem, amount, currency } = offer;
    let offerType = '';
    offerType = EXCHANGE_ACTION_PRESENT_NAME[type];


    const message = <FormattedMessage id="offerHandShakeExchangeContentMe"
                                values={ {
                                  offerType: offerType,
                                  something: physicalItem,
                                  amount: formatAmountCurrency(amount),
                                  currency: currency,
                                } } />;

    return message;
  }

  getActionButtonsExchange = () => {
    const {status} = this.props;
    const offer = this.offer;
    const { type, physicalItem, amount, currency } = offer;
    const message = <FormattedMessage id="handshakeOfferConfirm"
                                values={ {
                                  type: type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] : EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
                                  something: physicalItem,
                                  amount: formatAmountCurrency(amount),
                                  currency: currency,
                                } } />;
    const actionButtons = (
      <div>
        <Button block className="mt-2" onClick={() => this.confirmOfferAction(message, this.handleShakeOfferExchange)}><FormattedMessage id="btn.shake"/></Button>
      </div>
    );

    return actionButtons;
  }

  ////////////////////////
  handleShakeOfferExchange = async () => {
    const { authProfile } = this.props;
    const { offer } = this;
    const { currency, amount, type } = offer;

    console.log('handleShakeOfferExchange', offer);

    const wallet = MasterWallet.getWalletDefault(currency);
    const balance = await wallet.getBalance();
    const fee = await wallet.getFee(NB_BLOCKS, true);

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return;
    }

    let checkAmount = amount;
    if (currency === CRYPTO_CURRENCY.ETH && type === EXCHANGE_ACTION.SELL) {
      checkAmount = 0;
    }

    if ((currency === CRYPTO_CURRENCY.ETH || (type === EXCHANGE_ACTION.BUY && currency === CRYPTO_CURRENCY.BTC))
      && this.showNotEnoughCoinAlert(balance, checkAmount, fee, currency)) {

      return;
    }

    let offerShake = {
      fiat_amount: '0',
      address: wallet.address,
      email: authProfile.email || '',
      username: authProfile.username || '',
      email: authProfile?.email || '',
      username: authProfile?.name || '',
      chat_username: authProfile?.username || '',
      user_address: wallet.address,
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

  handleShakeOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { offer } = this;
    const { data } = res;
    const { currency, type, system_address, total_amount, id, hid} = data;

    console.log('handleShakeOfferExchangeSuccess',res);

    if (type === EXCHANGE_ACTION.SELL) {
      if (currency === CRYPTO_CURRENCY.ETH) {
        const wallet = MasterWallet.getWalletDefault(currency);
        const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

        const result = await exchangeHandshake.shake(hid, id);

        console.log('handleShakeOfferExchangeSuccess', result);
      }
    } else {
      const wallet = MasterWallet.getWalletDefault(currency);

      if (currency === CRYPTO_CURRENCY.BTC) {
        wallet.transfer(system_address, total_amount, NB_BLOCKS).then(success => {
          console.log('transfer', success);
        });
      } else if (currency === CRYPTO_CURRENCY.ETH) {
        const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

        const result = await exchangeHandshake.initByCoinOwner(total_amount, id);
        console.log('handleShakeOfferExchangeSuccess', result);
      }
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="shakeOfferSuccessMessage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
  }

  handleShakeOfferExchangeFailed = (e) => {
    this.handleActionFailed(e);
  }

  handleActionFailed = (e) => {
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  render() {
    const {intl, initUserId, shakeUserIds, location, state, status, mode = 'discover', ipInfo: { latitude, longitude, country }, initAt, ...props} = this.props;
    const offer = this.offer;
    let modalContent = this.state.modalContent;

    let email = '';
    let statusText = '';
    let message = '';
    let actionButtons = null;
    let from = <FormattedMessage id="ex.me.label.from"/>;
    let showChat = false;
    let chatUsername = '';
    let nameShop = offer.username;

    switch (offer.feedType) {
      case EXCHANGE_FEED_TYPE.EXCHANGE: {
        statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];
        nameShop = <FormattedMessage id="ex.me.label.about"/>;

        from = <FormattedMessage id="ex.me.label.from"/>;

        message = this.getContentExchange();

        showChat = true;

        chatUsername = initUserId;

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

    return (
      <div className="feed-exchange-local">
        <div>
          <span className="message"><span>I want to sell</span> <strong>a pack of cocaine</strong></span>
          <span className="image text-right"><img src={'https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg'} /></span>
        </div>
        <div className="wrapper-info">
          <span className="info-ex-local">
            <div className="amount">0.1 ETH</div>
            <div className="rating"><StarsRating className="d-inline-block" starPoint={2.3} startNum={5} /> (25 reviews)</div>
            <div className="distance">800 meters away</div>
          </span>
          <span className="chat-address">
            <div className="btn-chat">
              <button className="btn" onClick={this.handleChat}>
                <img src={iconChat} />
              </button>
            </div>
            <div className="address">Seller: 0x322</div>
          </span>
        </div>
      </div>
    )

    // return (
    //   <div className="feed-discover-exchange-local">
    //     <div>
    //       <div className="d-flex mb-4">
    //         <div className="headline">{message}</div>
    //         {
    //           !isCreditCard && showChat && (
    //             <div className="ml-auto pl-2 pt-2" style={{ width: '50px' }}>                {/* to-do chat link */}
    //               <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
    //                 <img src={iconChat} width='35px' />
    //               </Link>
    //             </div>
    //           )
    //         }
    //
    //       </div>
    //
    //       <div className="mb-1 name-shop">{nameShop}</div>
    //       {/*
    //       {
    //         phone && phone.split('-')[1] !== '' && ( // no phone number
    //           <div className="media mb-1 detail">
    //             <img className="mr-2" src={iconPhone} width={20}/>
    //             <div className="media-body">
    //               <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
    //             </div>
    //           </div>
    //         )
    //       }
    //
    //       <div className="media mb-1 detail">
    //         <img className="mr-2" src={iconLocation} width={20}/>
    //         <div className="media-body">
    //           <div>{address}</div>
    //         </div>
    //       </div>
    //       */}
    //
    //       {
    //         phone && phone.split('-')[1] !== '' && ( // no phone number
    //           <div className="media mb-1 detail">
    //             <img className="mr-2" src={iconPhone} width={20}/>
    //             <div className="media-body">
    //               <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
    //             </div>
    //           </div>
    //         )
    //       }
    //       {
    //         address && (
    //           <div className="media mb-1 detail">
    //             <img className="mr-2" src={iconLocation} width={20}/>
    //             <div className="media-body">
    //               <div>{address}</div>
    //             </div>
    //           </div>
    //         )
    //       }
    //
    //       {/*
    //         !isCreditCard && (
    //           <div className="media detail">
    //             <img className="mr-2" src={iconLocation} width={20} />
    //             <div className="media-body">
    //               <div>
    //                 <FormattedMessage id="offerDistanceContent" values={{
    //                   // offerType: offer.type === 'buy' ? 'Buyer' : 'Seller',
    //                   distance: getLocalizedDistance(distanceKm, country_code)
    //                   // distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
    //                   // distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
    //                 }}/>
    //               </div>
    //             </div>
    //           </div>
    //         )
    //       */}
    //       {/*<Button block className="mt-2">Accept</Button>*/}
    //       {actionButtons}
    //       <ModalDialog onRef={modal => this.modalRef = modal}>
    //         {modalContent}
    //       </ModalDialog>
    //     </div>
    //     {/*<div>id: {this.offer.id}</div>*/}
    //     {/*<div>userType: {this.userType}</div>*/}
    //     {/*<div>status: {status}</div>*/}
    //     {/*<div className="mb-1">*/}
    //       {/*<span style={{ color: '#C8C7CC' }}>{from}</span> <span style={{ color: '#666666' }}>{email}</span>*/}
    //       {/*<span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>*/}
    //     {/*</div>*/}
    //
    //   </div>
    // );
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
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchangeLocal));
