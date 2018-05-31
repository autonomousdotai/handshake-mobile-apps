import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {BigNumber} from 'bignumber.js';
import {AMOUNT_DECIMAL, PRICE_DECIMAL} from "@/constants";
import {API_URL} from "../../../../constants";
import ModalDialog from "../../../core/controls/ModalDialog/ModalDialog";
import {connect} from "react-redux";
import {
  cancelShakedOffer, closeOffer, completeShakedOffer, getListOfferPrice, getListOffers, getOffer,
  shakeOffer
} from "../../../../reducers/exchange/action";
import getSymbolFromCurrency from 'currency-symbol-map';
import Offer from "../../../../models/Offer";
import {MasterWallet} from "../../../../models/MasterWallet";

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    const { extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.state = {
      modalContent: '',
      offer: offer,

      listMainWalletBalance: [],
      listTestWalletBalance: [],
    };
  }

  async componentDidMount() {
    const offer = this.state.offer;
    // this.props.getListOffers({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleGetListOffersSuccess,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.getOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleGetOfferSuccess,
    //   // errorFn: this.handleGetOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.shakeOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleShakeOfferSuccess,
    //   // errorFn: this.handleShakeOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.closeOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCloseOfferSuccess,
    //   // errorFn: this.handleCloseOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.completeShakedOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCompleteShakedOfferSuccess,
    //   // errorFn: this.handleCompleteShakedOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });
    // this.props.cancelShakedOffer({
    //   BASE_URL: API_URL.EXCHANGE.BASE,E
    //   PATH_URL: API_URL.EXCHANGE.OFFERS,
    //   successFn: this.handleCancelShakedOfferSuccess,
    //   // errorFn: this.handleCancelShakedOfferFailed,
    //   errorFn: this.handleGetListOffersFailed,
    // });

    // this.props.getListOfferPrice({
    //   BASE_URL: API_URL.EXCHANGE.BASE,
    //   PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
    //   qs: {fiat_currency: offer.fiatCurrency},
    //   successFn: this.handleGetPriceSuccess,
    //   errorFn: this.handleGetPriceFailed,
    // });

    //Get wallet
    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false){
      listWallet = await MasterWallet.createMasterWallet();
    }

    await this.splitWalletData(listWallet)

    await this.getListBalance();
  }

  // handleGetPriceSuccess = (data) => {
  //   console.log('handleGetPriceSuccess', data);
  // }
  //
  // handleGetPriceFailed = (e) => {
  //   console.log('handleGetPriceFailed', e);
  // }

  splitWalletData(listWallet){

    let listMainWallet = [];
    let listTestWallet = [];

    listWallet.forEach(wallet => {
      // is Mainnet
      if (wallet.network == MasterWallet.ListCoin[wallet.className].Network.Mainnet){
        listMainWallet.push(wallet);
      }
      else{
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

  handleGetListOffersSuccess = (data) => {
    console.log('data', data);
    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{'action success'}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleActionSuccess}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleGetOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleShakeOfferSuccess = (data) => {
    console.log('handleShakeOfferSuccess', data);
  }

  handleCloseOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCompleteShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleCancelShakedOfferSuccess = (data) => {
    console.log('data', data);
  }

  handleGetListOffersFailed = (e) => {
    console.log('e', e);
    this.setState({modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{e.response?.data?.message}</div>
              </div>
            </Feed>
            <Button block className="btn btn-secondary mt-2" onClick={this.handleActionFailed}>Dismiss</Button>
          </div>
        )
    }, () => {
      this.modalRef.open();
    });
  }

  handleActionSuccess = () => {
    this.modalRef.close();
  }

  handleActionFailed = () => {
    this.modalRef.close();
  }

  confirmShakeOffer = () => {
    const { intl } = this.props;
    const offer = this.state.offer;
    console.log('offer', offer);


    const totalAmount = offer.amount * offer.price || 0;
    const message = intl.formatMessage({ id: 'handshakeOfferConfirm' }, {
      type: offer.type === 'buy' ? 'Sell' : 'Buy',
      amount: new BigNumber(offer.amount).toFormat(6),
      currency: offer.currency,
      currency_symbol: getSymbolFromCurrency(offer.fiatCurrency),
      total: new BigNumber(totalAmount).toFormat(2),
    });

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '75px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            <Button className="mt-2" block onClick={() => this.shakeOffer(offer)}>Confirm</Button>
            <Button block className="btn btn-secondary" onClick={this.cancelShakeOffer}>Not now</Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  shakeOffer = (offer) => {
    this.modalRef.close();

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
      fiat_amount: '',
      address: address
    };

    this.props.shakeOffer({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.OFFERS + '/' + offer.id,
      METHOD: 'POST',
      data: offerShake,
      successFn: this.handleShakeOfferSuccess,
      // errorFn: this.handleShakeOfferFailed,
      errorFn: this.handleGetListOffersFailed,
    });
  }

  cancelShakeOffer = () => {
    this.modalRef.close();
  }

  render() {
    const {init_user_id, location, state, status, ...props } = this.props;

    console.log('asfad', this.props);
    const offer = this.state.offer;
    // let geolocation = location.split(',');

    let modalContent = this.state.modalContent;
    return (
      <div>
        <Feed className="feed p-2 text-white" background="#FF2D55">
          <h5>
            <FormattedMessage id="offerHandShakeContent" values={{ offerType: offer.type === 'buy' ? 'Buy': 'Sell',
            amount: new BigNumber(offer.amount).toFormat(AMOUNT_DECIMAL), currency: offer.currency,
              currency_symbol: getSymbolFromCurrency(offer.fiatCurrency),
              total: new BigNumber(offer.fiatAmount || 0).toFormat(PRICE_DECIMAL)
            }}/>
          </h5>
          <div className="media">
            <img className="mr-1" src={iconLocation} width={22} />
              <div className="media-body">
                {/*<h6 className="mt-0">{offer.contactInfo}</h6>*/}
                <div>
                  <small>
                    <FormattedMessage id="offerDistanceContent" values={{ offerType: offer.type === 'buy' ? 'Buyer': 'Seller',
                      distance: 100}} />
                  </small>
                </div>
              </div>
          </div>
        </Feed>
        <Button block className="mt-2" onClick={this.confirmShakeOffer}>Shake now</Button>
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
});

const mapDispatch = ({
  getListOffers,
  getOffer,
  shakeOffer,
  closeOffer,
  completeShakedOffer,
  cancelShakedOffer,
  getListOfferPrice
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
