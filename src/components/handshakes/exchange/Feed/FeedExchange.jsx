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
import {BigNumber} from 'bignumber.js';
import {AMOUNT_DECIMAL, PRICE_DECIMAL} from "@/constants";
import {API_URL, HANDSHAKE_EXCHANGE_STATUS, HANDSHAKE_USER} from "@/constants";
import ModalDialog from "@/components/core/controls/ModalDialog";
import {connect} from "react-redux";
import {
  cancelShakedOffer,
  closeOffer,
  completeShakedOffer,
  getListOfferPrice,
  shakeOffer,
  withdrawShakedOffer
} from "@/reducers/exchange/action";
import getSymbolFromCurrency from 'currency-symbol-map';
import Offer from "@/models/Offer";
import {MasterWallet} from "@/models/MasterWallet";
import {getHandshakeUserType, getOfferPrice} from "@/services/offer-util";

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const {initUserId, shakeUserIds, extraData} = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.state = {
      modalContent: '',
      offer: offer,
      fiatAmount: 0,
      userType: getHandshakeUserType(initUserId, shakeUserIds),

      listMainWalletBalance: [],
      listTestWalletBalance: [],
    };
  }

  async componentDidMount() {
    //Get wallet
    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false) {
      listWallet = await MasterWallet.createMasterWallet();
    }

    await this.splitWalletData(listWallet)

    await this.getListBalance();
  }

  splitWalletData(listWallet) {

    let listMainWallet = [];
    let listTestWallet = [];

    listWallet.forEach(wallet => {
      // is Mainnet
      if (wallet.network == MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        listMainWallet.push(wallet);
      }
      else {
        // is Testnet
        listTestWallet.push(wallet);
      }
    });

    this.setState({listMainWalletBalance: listMainWallet, listTestWalletBalance: listTestWallet});
  }

  async getListBalance() {

    let listWallet = this.state.listMainWalletBalance.concat(this.state.listTestWalletBalance);

    const pros = []

    listWallet.forEach(wallet => {
      pros.push(new Promise((resolve, reject) => {
        wallet.getBalance().then(balance => {
          wallet.balance = balance;
          resolve(wallet);
        })
      }));
    });

    await Promise.all(pros);

    await this.splitWalletData(listWallet);
  }

  handleActionFailed = (e) => {
    console.log('e', e);
    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{minHeight: '75px'}}>
                <div>{e.response?.data?.message}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleDismissActionFailed}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleDismissActionSuccess = () => {
    this.modalRef.close();
  }

  handleDismissActionFailed = () => {
    this.modalRef.close();
  }

  confirmShakeOffer = (message, actionConfirm) => {
    const {intl,} = this.props;
    const {offer, fiatAmount} = this.state;
    console.log('offer', offer);

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
              <div className="text-white d-flex align-items-center" style={{minHeight: '75px'}}>
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

  ////////////////////////
  handleShakeOffer = () => {
    const {offer, fiatAmount} = this.state;

    let listWallet = [];
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      listWallet = this.state.listTestWalletBalance;
    } else {
      listWallet = this.state.listMainWalletBalance;
    }

    let address = '';
    for (let i = 0; i < listWallet.length; i++) {
      let wallet = listWallet[i];

      if (wallet.name === offer.currency) {
        address = wallet.address;
        break;
      }
    }

    let offerShake = {
      fiat_amount: fiatAmount.toString(),
      address: address
    };

    this.props.shakeOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id,
      METHOD: 'POST',
      data: offerShake,
      successFn: this.handleShakeOfferSuccess,
      errorFn: this.handleShakeOfferFailed,
    });
  }

  handleShakeOfferSuccess = (data) => {
    console.log('handleShakeOfferSuccess', data);
  }

  handleShakeOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCloseOffer = () => {
    const {offer} = this.state;
    this.props.closeOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id,
      METHOD: 'DELETE',
      successFn: this.handleCloseOfferSuccess,
      errorFn: this.handleCloseOfferFailed,
    });
  }

  handleCloseOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCloseOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCompleteShakedOffer = () => {
    const {offer} = this.state;

    this.props.completeShakedOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.SHAKE,
      METHOD: 'POST',
      successFn: this.handleCompleteShakedOfferSuccess,
      errorFn: this.handleCompleteShakedOfferFailed,
    });
  }

  handleCompleteShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCompleteShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCancelShakedOffer = () => {
    const {offer} = this.state;

    this.props.cancelShakedOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.SHAKE,
      METHOD: 'DELETE',
      successFn: this.handleCancelShakedOfferSuccess,
      errorFn: this.handleCancelShakedOfferFailed,
    });
  }

  handleCancelShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCancelShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleWithdrawShakedOffer = () => {
    const {offer} = this.state;

    this.props.cancelShakedOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id + '/' + API_URL.EXCHANGE.WITHDRAW,
      METHOD: 'DELETE',
      successFn: this.handleWithdrawShakedOfferSuccess,
      errorFn: this.handleWithdrawShakedOfferFailed,
    });
  }

  handleWithdrawShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleWithdrawShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////


  getActionButtons = () => {
    const {intl, status} = this.props;
    const {offer, userType, fiatAmount} = this.state;
    let actionButtons = null;
    let message = '';

    // export const HANDSHAKE_EXCHANGE_STATUS = {
    //   CREATED: 0,
    //   ACTIVE: 1,
    //   CLOSED: 2,
    //   SHAKING: 3,
    //   SHAKE: 4,
    //   COMPLETING: 5,
    //   COMPLETED: 6
    // }

    // export const HANDSHAKE_STATUS = {
    //   INITED: 0,
    //   SHAKED: 1,
    //   ACCEPTED: 2,
    //   REJECTED: 3,
    //   DONE: 4,
    //   CANCELLED: 5,
    //   PENDING: -1,
    //   TRANSACTION_FAILED: -2,
    //   NEW: -3,
    //   BLOCKCHAIN_PENDING: -4,
    // };

    // console.log('offer.status', status)

    //   nguoi nhan tien mat -> co nut accept
    //
    // enum S { Inited, Shaked, Accepted, Rejected, Done, Cancelled }
    //   cancel transaction co nguoi shaked roi se bi penanty
    //   phone lay tu profile va user co the edit trong man hinh tao offer

    switch (userType) {
      case HANDSHAKE_USER.NORMAL: {
        switch (status) {
          // case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
          //   title = 'Shake Now';
          //   break;
          // }
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            message = intl.formatMessage({id: 'handshakeOfferConfirm'}, {
              type: offer.type === 'buy' ? 'Sell' : 'Buy',
              amount: new BigNumber(offer.amount).toFormat(6),
              currency: offer.currency,
              currency_symbol: getSymbolFromCurrency(offer.fiatCurrency),
              total: new BigNumber(fiatAmount).toFormat(2),
            });

            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleShakeOffer)}>Shake Now</Button>
              </div>
            );
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
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleCancelShakedOffer)}>Reject</Button>
                {offer.type === 'buy' &&
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message2, this.handleCompleteShakedOffer)}>Complete</Button>
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
            if (offer.type === 'sell') {
              message = intl.formatMessage({id: 'withdrawOfferConfirm'}, {});
              actionButtons = (
                <div>
                  <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleWithdrawShakedOffer)}>Withdraw</Button>
                </div>
              );
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
            message = intl.formatMessage({id: 'cancelOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleCloseOffer)}>Cancel</Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            // actionButtons = 'Cancel';
            //call action cancel
            message = intl.formatMessage({id: 'cancelOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleCloseOffer)}>Cancel</Button>
              </div>
            );
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
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleCancelShakedOffer)}>Reject</Button>
                {offer.type === 'sell' &&
                <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message2, this.handleCompleteShakedOffer)}>Complete</Button>
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
            // neu la nguoi buy coin thi dc withdraw
            if (offer.type === 'buy') {
              actionButtons = (
                <div>
                  <Button block className="mt-2" onClick={() => this.confirmShakeOffer(message, this.handleWithdrawShakedOffer)}>Withdraw</Button>
                </div>
              );
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

    // if (offer.currency === 'BTC') {
    //   switch (status) {
    //     case HANDSHAKE_EXCHANGE_STATUS.CREATED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.SHAKING: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.COMPLETING: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //   }
    // } else if (offer.currency === 'ETH') {
    //   switch (status) {
    //     case HANDSHAKE_STATUS.INITED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.SHAKED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.ACCEPTED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.REJECTED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.DONE: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.CANCELLED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.PENDING: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.TRANSACTION_FAILED: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.NEW: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //     case HANDSHAKE_STATUS.BLOCKCHAIN_PENDING: {
    //       title = 'Shake Now';
    //       break;
    //     }
    //   }
    // }

    return actionButtons;
  }


  render() {
    const {initUserId, shakeUserIds, location, state, status, mode = 'discover', ...props} = this.props;
    const {offer, userType} = this.state;
    const {listOfferPrice} = this.props;
    // let geolocation = location.split(',');
    let fiatAmount = 0;
    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, offer.type, offer.currency);
      fiatAmount = offer.amount * offerPrice.price || 0;
      fiatAmount = fiatAmount + fiatAmount * offer.percentage;
    }
    this.setState({fiatAmount: fiatAmount});

    let modalContent = this.state.modalContent;
    let actionButtons = this.getActionButtons();
    // let userType = getHandshakeUserType(initUserId, shakeUserIds);
    const email = 'abc@mail.com'
    const statusText = 'Done'
    const phone = '01234123498'
    const address = '81 Beuallijfa w'
    return (
      <div>
        {
          mode === 'me' && (
            <div>
              <span style={{ color: '#C8C7CC' }}>From</span> <span style={{ color: '#666666' }}>{email}</span>
              <span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>
            </div>
          )
        }
        <Feed className="feed p-2 text-white" background="#FF2D55">
          <div className="d-flex">
            <div>
              <h5>
                <FormattedMessage id="offerHandShakeContent" values={{
                  offerType: offer.type === 'buy' ? 'Buy' : 'Sell',
                  amount: new BigNumber(offer.amount).toFormat(AMOUNT_DECIMAL), currency: offer.currency,
                  currency_symbol: getSymbolFromCurrency(offer.fiatCurrency),
                  total: new BigNumber(fiatAmount).toFormat(PRICE_DECIMAL)
                }}/>
              </h5>
            </div>
            { mode === 'me' && (
              <div className="ml-auto pl-2" style={{ width: '50px' }}><a href="#"><img src={iconChat} width='35px' /></a></div>
            )}
          </div>
          <span>status: {status}</span><br></br>
          <span>userType: {userType}</span><br></br>
          {
            mode === 'discover' ? (
              <div className="media mb-1">
                <img className="mr-1" src={iconTransaction} width={20}/>
                <div className="media-body">
                  <div>
                    <FormattedMessage id="transactonOfferInfo" values={{
                      success: offer.success, failed: offer.failed
                    }}/>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="media mb-1">
                  <img className="mr-1" src={iconPhone} width={20}/>
                  <div className="media-body">
                    <div>
                      <a href={`tel:${phone}`} className="text-white">{phone}</a>
                    </div>
                  </div>
                </div>
                <div className="media">
                  <img className="mr-1" src={iconLocation} width={20}/>
                  <div className="media-body">
                    <div>{address}</div>
                  </div>
                </div>
              </div>
            )
          }
          <div className="media">
            <img className="mr-1" src={mode === 'discover' ? iconLocation : ''} width={20} />
            <div className="media-body">
              <div>
                <FormattedMessage id="offerDistanceContent" values={{
                  offerType: offer.type === 'buy' ? 'Buyer' : 'Seller',
                  distance: 100
                }}/>
              </div>
            </div>
          </div>
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
});

const mapDispatch = ({
  shakeOffer,
  closeOffer,
  completeShakedOffer,
  cancelShakedOffer,
  getListOfferPrice,
  withdrawShakedOffer
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
