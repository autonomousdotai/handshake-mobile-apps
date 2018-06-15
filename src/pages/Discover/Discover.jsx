import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import {
  API_URL,
  DISCOVER_GET_HANDSHAKE_RADIUS,
  // EXCHANGE_ACTION,
  // EXCHANGE_ACTION_NAME,
  HANDSHAKE_ID,
  URL,
  EXCHANGE_COOKIE_READ_INSTRUCTION,
} from '@/constants';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
// components
import { Col, Grid, Row } from 'react-bootstrap';
// import SearchBar from '@/components/core/controls/SearchBar';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Category from '@/components/core/controls/Category';

import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedExchangeLocal from '@/components/handshakes/exchange/Feed/FeedExchangeLocal';
import FeedSeed from '@/components/handshakes/seed/Feed';
// import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import BlockCountry from '@/components/core/presentation/BlockCountry';

// import Tabs from '@/components/handshakes/exchange/components/Tabs';
import NoData from '@/components/core/presentation/NoData';
import BettingFilter from '@/components/handshakes/betting/Feed/Filter';
import { getListOfferPrice } from '@/reducers/exchange/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ninjaLogoSVG from '@/assets/images/logo.png';
import icon2KuNinja from '@/assets/images/icon/2_ku_ninja.svg';

// style
import './Discover.scss';

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.EXCHANGE_LOCAL]: FeedExchangeLocal,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class DiscoverPage extends React.Component {
  static propTypes = {
    discover: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadDiscoverList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    firebaseUser: PropTypes.object,
    exchange: PropTypes.object.isRequired,
    ipInfo: PropTypes.object.isRequired,
    isBannedCash: PropTypes.bool.isRequired,
    isBannedPrediction: PropTypes.bool.isRequired,
    isBannedChecked: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    firebaseUser: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      handshakeIdActive: HANDSHAKE_ID.BETTING, // default show bet
      // tabIndexActive: '',
      query: '',
      isLoading: true,
      exchange: this.props.exchange,
      modalContent: null,
      lat: 0,
      lng: 0,
      isBannedCash: this.props.isBannedCash,
      isBannedPrediction: this.props.isBannedPrediction,
      isBannedChecked: this.props.isBannedChecked,
    };
    // this.loadDiscoverList();
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.clickTabItem = this.clickTabItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentDidMount() {
    const { ipInfo } = this.props;
    navigator.geolocation.getCurrentPosition((location) => {
      const { coords: { latitude, longitude } } = location;
      this.setAddressFromLatLng(latitude, longitude); // better precision
    }, () => {
      this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback
    });
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      if (prevState.handshakeIdActive !== 3) {
        //
        const {
          handshakeIdActive,
          query,
        } = prevState;
        const qs = { };

        // const pt = `${prevState.lat},${prevState.lng}`;
        //
        // qs.location_p = { pt, d: DISCOVER_GET_HANDSHAKE_RADIUS };

        qs.pt = `${prevState.lat},${prevState.lng}`;
        qs.d = DISCOVER_GET_HANDSHAKE_RADIUS;

        if (handshakeIdActive) {
          qs.type = handshakeIdActive;
        }

        if (query) {
          qs.query = query;
        }

        // nextProps.loadDiscoverList({
        //   PATH_URL: API_URL.DISCOVER.INDEX,
        //   qs,
        // });
      }
      return { exchange: nextProps.exchange };
    }
    if (nextProps.isBannedCash !== prevState.isBannedCash) {
      return { isBannedCash: nextProps.isBannedCash };
    }
    if (nextProps.isBannedPrediction !== prevState.isBannedPrediction) {
      return { isBannedPrediction: nextProps.isBannedPrediction };
    }
    if (nextProps.isBannedChecked !== prevState.isBannedChecked) {
      return { isBannedChecked: nextProps.isBannedChecked };
    }
    if (nextProps.isBannedPrediction && nextProps.isBannedChecked) {
      return { isLoading: false };
    }
    return null;
  }

  getHandshakeList() {
    const { list } = this.props.discover;
    if (list && list.length > 0) {
      return list.map((handshake) => {
        const FeedComponent = maps[handshake.type];
        if (FeedComponent) {
          return (
            <Col key={handshake.id} md={12} className="feed-wrapper">
              <FeedComponent
                {...handshake}
                history={this.props.history}
                onFeedClick={() => this.clickFeedDetail(handshake.id)}
                refreshPage={this.loadDiscoverList}
              />
            </Col>
          );
        }
        return null;
      });
    }
    return <NoData style={{ height: '50vh' }} />;
  }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  searchChange(query) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      this.setState({ query }, () => {
        this.loadDiscoverList();
      });
    }, 500);
  }

  clickFeedDetail(id) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  handleCloseExchangePopupIntro = () => {
    Cookies.set(EXCHANGE_COOKIE_READ_INSTRUCTION.name, true, EXCHANGE_COOKIE_READ_INSTRUCTION.option);
    this.modalRef.close();
  }

  showWelcomePopup = () => {
    if (Cookies.get(EXCHANGE_COOKIE_READ_INSTRUCTION.name) !== 'true') {
      setTimeout(() => {
        this.setState({
          modalContent: (
            <div>
              <div className="text-right pr-2 pt-1">
                <a className="d-inline-block" onClick={this.handleCloseExchangePopupIntro}>&times;</a>
              </div>
              <div className="exchange-popup-intro">
                <div className="logo"><img className="w-100" src={ninjaLogoSVG} alt="" /></div>
                <p className="headline">Ninja, welcomes you to the Dojo!</p>
                <p>We are the first to offer a completely decentralized platform to buy and sell Bitcoin and Ethereum.</p>
                <p>We support credit, debit card and cash.</p>
                <div className="my-3">
                  <div className="highlight-text">How to use:</div>
                  <div className="usage">
                    - (
                    <Link className="link" to={{ pathname: URL.HANDSHAKE_CREATE_INDEX, search: '?id=2' }}>
                      Become a shop
                    </Link>
                    ) to buy and sell BTC/ETH
                  </div>
                  <div className="highlight-text">Or</div>
                  <div className="usage">- Swipe through all the shops to find <a className="link" onClick={this.handleCloseExchangePopupIntro}>the most suitable price.</a></div>
                </div>
                <p>Chat and meet up at the store to fulfill your exchange.</p>
                <p><strong>Have fun trading!</strong></p>
                <button className="btn btn-primary btn-block" onClick={this.handleCloseExchangePopupIntro}>Got it!</button>
              </div>
            </div>
          ),
        }, () => {
          this.modalRef.open();
        });
      }, 1500);
    }
  }

  clickCategoryItem(category) {
    const { id } = category;
    if (this.state.handshakeIdActive !== id) {
      this.setLoading(true);
    }
    // let tabIndexActive = '';
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // do something
        break;
      case HANDSHAKE_ID.SEED:
        // do something
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // do something
        // tabIndexActive = 1;
        // this.showWelcomePopup();
        break;
      default:
        // is promise
    }
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
      // tabIndexActive,
    }, () => {
      if (category.id !== 3) {
        this.loadDiscoverList();
      }
    });
    if (category.id === 2 && this.state.isBannedCash) {
      this.setLoading(false);
    }
    if (category.id === 3 && this.state.isBannedPrediction) {
      this.setLoading(false);
    }
  }

  clickTabItem() {
    // index
    this.setState({
      // tabIndexActive: index
    }, () => {
      // if (category.id !== 3) {
      //   this.loadDiscoverList();
      // }
    });
  }

  loadDiscoverList = () => {
    const { ipInfo } = this.props;
    const {
      handshakeIdActive,
      query,
    } = this.state;
    const qs = { };

    // const pt = `${this.state.lat},${this.state.lng}`;
    //
    // qs.location_p = { pt, d: DISCOVER_GET_HANDSHAKE_RADIUS };
    qs.pt = `${this.state.lat},${this.state.lng}`;
    qs.d = DISCOVER_GET_HANDSHAKE_RADIUS;

    if (handshakeIdActive) {
      qs.type = handshakeIdActive;

      if (handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
        qs.custom_query = ` fiat_currency_s:${ipInfo?.currency} AND -offline_i:1 `;
      }
    }

    if (query) {
      qs.query = query;
    }

    this.props.loadDiscoverList({
      PATH_URL: API_URL.DISCOVER.INDEX,
      qs,
      successFn: () => {
        this.setLoading(false);
      },
      errorFn: () => {
        this.setLoading(false);
      },
    });
  }

  render() {
    const {
      handshakeIdActive,
      // tabIndexActive,
      modalContent,
    } = this.state;

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="discover">
          {/* <Row className="search-bar-wrapper">
            <Col md={12} xs={12}>
              <SearchBar onSuggestionSelected={() => {}} onInputSearchChange={this.searchChange} />
            </Col>
          </Row> */}
          <Row>
            <Col md={12} xs={6} style={{ marginBottom: handshakeIdActive === HANDSHAKE_ID.EXCHANGE ? '0px' : '' }}>
              <Category
                idActive={handshakeIdActive}
                className="category-wrapper"
                onRef={(category) => { this.categoryRef = category; return null; }}
                onItemClick={this.clickCategoryItem}
              />
            </Col>
          </Row>
          {
            this.state.isBannedChecked && handshakeIdActive === HANDSHAKE_ID.EXCHANGE && !this.state.isBannedCash && (
              <React.Fragment>
                <Row>
                  <Col md={12} className="exchange-intro">
                    <span className="icon-shop">
                      <img src={icon2KuNinja} alt="" />
                    </span>
                    <span className="text-intro">
                      <div>Sell coin for cash, buy coin with cash. Set your own rates.</div>
                      <div><span className="money">1 ETH welcome bonus.</span></div>
                      <div className="my-3">
                        <Link className="btn btn-sm btn-join-now" to={{ pathname: URL.HANDSHAKE_CREATE_INDEX, search: '?id=2' }}>
                          <span>Open your station</span>
                        </Link>
                      </div>
                    </span>
                  </Col>
                </Row>
                {/* <Row> */}
                  {/* <Col md={12} className="feed-wrapper"> */}
                {/* <FeedCreditCard history={this.props.history} /> */}
                  {/* </Col> */}
                {/* </Row> */}
              </React.Fragment>
            )
          }
          {
              this.state.isBannedChecked && this.state.handshakeIdActive === HANDSHAKE_ID.BETTING && this.state.isBannedPrediction
              ? (
                <BlockCountry />
                // <div>{'Hey Ninja. Your wet blanket IP address won\'t let you play this game.'}</div>
              )
              : null
            }
          {
            this.state.isBannedChecked && this.state.handshakeIdActive === HANDSHAKE_ID.BETTING && !this.state.isBannedPrediction && (
              <React.Fragment>
                <BettingFilter setLoading={this.setLoading} />
                <Row>
                  <Col md={12}>
                    <dl className="faq">
                      <dt>Price (Odds)</dt>
                      <dd>
                        Ninja uses <strong>decimal odds</strong>.  A winning bet at 1.75 would return a total of 1.75 ETH for every ETH staked. An even money bet is expressed as 2.00.
                      </dd>
                      <dt>Pool (ETH)</dt>
                      <dd>
                        The total bets for different price points (odds).  Green: Support orders. Red: Oppose orders.
                      </dd>
                      <dt>Support or Oppose</dt>
                      <dd>
                        Pick a side to bet on.  You can support the outcome or oppose the outcome.
                      </dd>
                      <dt>Market odds</dt>
                      <dd>
                        You can bet with the market odds, which will likely be matched immediately with existing orders on the order book, or set your own odds, which will likely go on the order book to wait for a matching order.
                      </dd>
                      <dt>Market volume</dt>
                      <dd>
                        The total volume of bets on this outcome.
                      </dd>
                      <dt>Market fee</dt>
                      <dd>
                        This is the fee set by the market creator, as a percentage of the winnings.  A market fee of 1% would be 1ETH on a winning payout of 100 ETH.
                      </dd>
                    </dl>
                  </Col>
                </Row>
              </React.Fragment>
            )
          }
          <Row>
            {this.state.isBannedChecked && handshakeIdActive === HANDSHAKE_ID.EXCHANGE && !this.state.isBannedCash && this.getHandshakeList()}
            {
              this.state.isBannedChecked && handshakeIdActive === HANDSHAKE_ID.EXCHANGE && this.state.isBannedCash
              ? (
                <BlockCountry />
                // <div>{'Hey Ninja. Your wet blanket IP address won\'t let you play this game.'}</div>
              )
              : null
            }
          </Row>
        </Grid>
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} className="discover-popup" isDismiss={false} >
          {modalContent}
        </ModalDialog>
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  discover: state.discover,
  firebaseUser: state.firebase.data,
  app: state.app,
  ipInfo: state.app.ipInfo,
  exchange: state.exchange,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  isBannedChecked: state.app.isBannedChecked,
});

const mapDispatch = ({
  loadDiscoverList,
  getListOfferPrice,
});

export default connect(mapState, mapDispatch)(DiscoverPage);
