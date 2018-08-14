import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import {
  API_URL,
  CASH_SORTING_CRITERIA,
  CASH_SORTING_LIST,
  DISCOVER_GET_HANDSHAKE_RADIUS,
  EXCHANGE_COOKIE_READ_INSTRUCTION,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  SORT_ORDER,
  URL,
} from '@/constants';
import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
import Helper from '@/services/helper';

// components
import { Col, Grid, Row } from 'react-bootstrap';
// import SearchBar from '@/components/core/controls/SearchBar';
import ModalDialog from '@/components/core/controls/ModalDialog';

// import FeedPromise from '@/components/handshakes/promise/Feed';
// import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
// import FeedExchangeLocal from '@/components/handshakes/exchange/Feed/FeedExchangeLocal';
// import FeedSeed from '@/components/handshakes/seed/Feed';
import BlockCountry from '@/components/core/presentation/BlockCountry';
import Maintain from '@/components/core/presentation/Maintain';
// import NavigationBar from '@/modules/NavigationBar/NavigationBar';
// import Tabs from '@/components/handshakes/exchange/components/Tabs';
import NoData from '@/components/core/presentation/NoData';
import { getFreeStartInfo, getListOfferPrice, setFreeStart } from '@/reducers/exchange/action';
import { updateShowedLuckyPool } from '@/reducers/betting/action';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import OfferShop from '@/models/OfferShop';
// import ninjaLogoSVG from '@/assets/images/logo.png';
//
// import DiscoverBetting from '@/components/handshakes/betting/Discover/Discover';
import LuckyLanding from '@/pages/LuckyLanding/LuckyLanding';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { change, Field } from 'redux-form';
// style
import '@/components/handshakes/exchange/Feed/FeedExchange.scss';
import './Discover.scss';
// import { Helmet } from "react-helmet";
// import icon2KuNinja from '@/assets/images/icon/2_ku_ninja.svg';
const maps = {
  // [HANDSHAKE_ID.PROMISE]: FeedPromise,
  // [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  // [HANDSHAKE_ID.EXCHANGE_LOCAL]: FeedExchangeLocal,
  // [HANDSHAKE_ID.SEED]: FeedSeed,
};

const nameFormFilterFeeds = 'formFilterFeeds';
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds,
  },
});

const PRICE_SORTS = [
  {
    id: 'buy_eth_d',
    text: <FormattedMessage id="ex.sort.price.buy.eth" />,
  },
  {
    id: 'sell_eth_d',
    text: <FormattedMessage id="ex.sort.price.sell.eth" />,
  },
  {
    id: 'buy_btc_d',
    text: <FormattedMessage id="ex.sort.price.buy.btc" />,
  },
  {
    id: 'sell_btc_d',
    text: <FormattedMessage id="ex.sort.price.sell.btc" />,
  },
];

const TAG = 'DISCOVER_PAGE';
class DiscoverPage extends React.Component {
  static propTypes = {
    discover: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadDiscoverList: PropTypes.func.isRequired,
    getListOfferPrice: PropTypes.func.isRequired,
    app: PropTypes.object.isRequired,
    exchange: PropTypes.object.isRequired,
    ipInfo: PropTypes.any.isRequired,
    isBannedCash: PropTypes.bool.isRequired,
    isBannedPrediction: PropTypes.bool.isRequired,
    setFreeStart: PropTypes.func.isRequired,
    firebaseApp: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    getFreeStartInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const handshakeDefault = HANDSHAKE_ID.EXCHANGE;
    const utm = this.getUtm();
    const program = this.getProgram();

    this.state = {
      handshakeIdActive: handshakeDefault,
      // tabIndexActive: '',
      query: '',
      isLoading: true,
      exchange: this.props.exchange,
      modalContent: <div />, // type is node
      propsModal: {
        // className: "discover-popup",
        // isDismiss: false
      },
      lat: 0,
      lng: 0,
      isBannedCash: this.props.isBannedCash,
      isBannedPrediction: this.props.isBannedPrediction,
      utm,
      program,
      isLuckyPool: true,
      sortIndexActive: CASH_SORTING_CRITERIA.DISTANCE,
      sortPriceIndexActive: '',
      sortOrder: '',
    };

    if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
      this.state.isLoading = false;
    } else if (this.state.isBannedPrediction) {
      this.state.isLoading = false;
      this.state.handshakeIdActive = HANDSHAKE_ID.EXCHANGE;
    }

    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    // this.searchChange = this.searchChange.bind(this);
    this.getUtm = this.getUtm.bind(this);
    this.getProgram = this.getProgram.bind(this);
    this.onFreeStartClick = this.onFreeStartClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const { ipInfo, rfChange } = this.props;

    // Listen event scroll down
    window.addEventListener('scroll', this.handleScroll);

    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude); // fallback

    let url = '';
    if (this.state.utm === 'earlybird') {
      url = `exchange/info/offer-store-free-start/${this.state.program}`;
    }

    if (this.state.utm === 'earlybird') {
      this.props.getFreeStartInfo({
        PATH_URL: url,
        successFn: (res) => {
          const { data } = res;
          if (data.reward) {
            this.setState({
              propsModal: {
                className: 'popup-intro-free-coin',
              },
              modalContent: (
                <div className="text-center">
                  <div className="intro-header">
                    <FormattedHTMLMessage id="ex.earlyBird.label.1" />
                  </div>
                  <div className="intro-text mt-2">
                    <FormattedHTMLMessage id="ex.earlyBird.label.2" values={{ freeETH: data?.reward }} />
                  </div>
                  <button className="btn btn-open-station" onClick={this.onFreeStartClick}>
                    <FormattedMessage id="ex.earlyBird.btn" />
                  </button>
                </div>
              ),
            }, () => {
              this.modalRef.open();
            });
          }
        },
        errorFn: () => { },
      });
    }

    rfChange(nameFormFilterFeeds, 'sortType', CASH_SORTING_CRITERIA.DISTANCE);
    this.setState({ sortIndexActive: CASH_SORTING_CRITERIA.DISTANCE });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }


  onFreeStartClick() {
    this.modalRef.close();
    this.props.setFreeStart({ data: true });
    this.props.history.push(`${URL.HANDSHAKE_CREATE}?id=${HANDSHAKE_ID.EXCHANGE}`);
  }

  getUtm() {
    const { utm_campaign: utm } = Helper.getQueryStrings(window.location.search);

    return utm;
  }

  getProgram() {
    const { free: program } = Helper.getQueryStrings(window.location.search);

    return program;
  }

  // getDefaultHandShakeId() {
  //   return HANDSHAKE_ID.EXCHANGE;
  //
  //   // if (window.location.pathname.indexOf(URL.HANDSHAKE_CASH) >= 0) {
  //   //   return HANDSHAKE_ID.EXCHANGE;
  //   // }
  //   // let seletedId = HANDSHAKE_ID_DEFAULT;
  //   // let { id } = Helper.getQueryStrings(window.location.search);
  //   // id = parseInt(id, 10);
  //   // if (id && Object.values(HANDSHAKE_ID).indexOf(id) !== -1) {
  //   //   seletedId = id;
  //   // }
  //   // return seletedId;
  // }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng }, () => {
      if (this.state.handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
        this.loadDiscoverList();
      }
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.exchange.listOfferPrice.updatedAt !== prevState.exchange.listOfferPrice.updatedAt) {
      if (prevState.handshakeIdActive !== 3) {
        //
        const {
          handshakeIdActive,
          query,
          sortIndexActive,
          sortPriceIndexActive,
          sortOrder,
        } = prevState;
        const { ipInfo } = nextProps;
        const qs = { };

        // const pt = `${prevState.lat},${prevState.lng}`;
        //
        // qs.location_p = { pt, d: DISCOVER_GET_HANDSHAKE_RADIUS };

        qs.pt = `${prevState.lat},${prevState.lng}`;
        qs.d = DISCOVER_GET_HANDSHAKE_RADIUS;

        if (handshakeIdActive) {
          qs.type = handshakeIdActive;

          if (handshakeIdActive === HANDSHAKE_ID.EXCHANGE) {
            qs.custom_query = ` -offline_i:1 `;

            if (sortIndexActive === CASH_SORTING_CRITERIA.PRICE) {
              qs.c_sort = sortPriceIndexActive;
              qs.t_sort = sortOrder;
            }
          }
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

    if (nextProps.firebaseApp.config?.maintainChild?.betting && prevState.handshakeIdActive === HANDSHAKE_ID.BETTING) {
      return {
        isLoading: false,
      };
    }
    return null;
  }


  getHandshakeList() {
    const { authProfile } = this.props;
    const { messages } = this.props.intl;
    const { list } = this.props.discover;
    const {
      handshakeIdActive, lat, lng, sortIndexActive, sortPriceIndexActive,
    } = this.state;
    const sortPriceIndexArr = sortPriceIndexActive.split('_');

    if (list && list.length > 0) {
      let myHandShake;
      const resultList = list.map((handshake) => {
        if (handshake.id.includes(authProfile?.id)) {
          myHandShake = handshake;

          return null;
        }
        const FeedComponent = maps[handshake.type];
        const offer = OfferShop.offerShop(JSON.parse(handshake.extraData));
        const allowRender = sortIndexActive === CASH_SORTING_CRITERIA.PRICE ? offer.itemFlags[sortPriceIndexArr[1].toUpperCase()] && !this.isEmptyBalance(offer.items[sortPriceIndexArr[1].toUpperCase()]) : true;
        if (FeedComponent && allowRender) {
          return (
            <Col key={handshake.id} className="col-12 feed-wrapper px-0">
              <FeedComponent
                {...handshake}
                history={this.props.history}
                onFeedClick={extraData => this.clickFeedDetail(handshake, extraData)}
                refreshPage={this.loadDiscoverList}
                latitude={lat}
                longitude={lng}
                modalRef={this.modalRef}
                offer={offer}
                setLoading={this.setLoading}
                sortPriceIndexActive={sortPriceIndexActive}
              />

            </Col>
          );
        }
        return null;
      });

      // Handle my handshake
      if (myHandShake) {
        const FeedComponent = maps[myHandShake.type];

        const offer = OfferShop.offerShop(JSON.parse(myHandShake.extraData));
        if (FeedComponent) {
          resultList.unshift(
            <Col key={myHandShake.id} className="col-12 feed-wrapper px-0">
              <FeedComponent
                {...myHandShake}
                history={this.props.history}
                onFeedClick={extraData => this.clickFeedDetail(myHandShake, extraData)}
                refreshPage={this.loadDiscoverList}
                latitude={lat}
                longitude={lng}
                modalRef={this.modalRef}
                offer={offer}
                ownerStation
              />

            </Col>,
          );
        }
      }

      return resultList;
    }

    let message = '';
    switch (handshakeIdActive) {
      case HANDSHAKE_ID.EXCHANGE:
        message = messages.discover.noDataMessageCash;
        break;
      case HANDSHAKE_ID.EXCHANGE_LOCAL:
        message = messages.discover.noDataMessageSwap;
        break;

      default:
      // is promise
    }

    return <NoData style={{ height: '50vh' }} message={message} />;
  }

  isEmptyBalance = (item) => {
    const { sortPriceIndexActive } = this.state;
    const { buyBalance, sellBalance } = item;
    if (sortPriceIndexActive.includes('buy')) {
      return buyBalance <= 0;
    }
    return sellBalance <= 0;
  }

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  showLuckyPool() {
    const { handshakeIdActive } = this.state;
    const { showedLuckyPool } = this.props;
    if (handshakeIdActive === HANDSHAKE_ID.BETTING) {
      if (showedLuckyPool === false) {
        console.log('Action Lucky Pool:', showedLuckyPool);
        this.props.updateShowedLuckyPool(true);
        setTimeout(() => {
          this.modalLuckyPoolRef.open();
        }, 2 * 1000);
      }
    }
  }

  handleScroll() {
    this.showLuckyPool();
  }


  // searchChange(query) {
  //   clearTimeout(this.searchTimeOut);
  //   this.searchTimeOut = setTimeout(() => {
  //     this.setState({ query }, () => {
  //       this.loadDiscoverList();
  //     });
  //   }, 500);
  // }

  clickFeedDetail(handshake, extraData) {
    const { type } = handshake;
    switch (type) {
      case HANDSHAKE_ID.EXCHANGE: {
        const { modalContent, modalClassName } = extraData;
        gtag.event({
          category: taggingConfig.cash.category,
          action: taggingConfig.cash.action.clickFeed,
          label: handshake.id,
        });
        if (modalContent) {
          this.setState({ modalContent, propsModal: { className: modalClassName } }, () => {
            this.modalRef.open();
          });
        }
        break;
      }
      default:
    }
    // this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  // handleCloseExchangePopupIntro = () => {
  //   Cookies.set(EXCHANGE_COOKIE_READ_INSTRUCTION.name, true, EXCHANGE_COOKIE_READ_INSTRUCTION.option);
  //   this.modalRef.close();
  // }

  // showWelcomePopup = () => {
  //   if (Cookies.get(EXCHANGE_COOKIE_READ_INSTRUCTION.name) !== 'true') {
  //     setTimeout(() => {
  //       this.setState({
  //         modalContent: (
  //           <div>
  //             <div className="text-right pr-2 pt-1">
  //               <a className="d-inline-block" onClick={this.handleCloseExchangePopupIntro}>&times;</a>
  //             </div>
  //             <div className="exchange-popup-intro">
  //               <div className="logo"><img className="w-100" src={ninjaLogoSVG} alt="" /></div>
  //               <p className="headline">Ninja, welcomes you to the Dojo!</p>
  //               <p>We are the first to offer a completely decentralized platform to buy and sell Bitcoin and Ethereum.</p>
  //               <p>We support credit, debit card and cash.</p>
  //               <div className="my-3">
  //                 <div className="highlight-text">How to use:</div>
  //                 <div className="usage">
  //                   - (
  //                   <Link className="link" to={{ pathname: URL.HANDSHAKE_CREATE_INDEX, search: '?id=2' }}>
  //                     Become a shop
  //                   </Link>
  //                   ) to buy and sell BTC/ETH
  //                 </div>
  //                 <div className="highlight-text">Or</div>
  //                 <div className="usage">- Swipe through all the shops to find <a className="link" onClick={this.handleCloseExchangePopupIntro}>the most suitable price.</a></div>
  //               </div>
  //               <p>Chat and meet up at the store to fulfill your exchange.</p>
  //               <p><strong>Have fun trading!</strong></p>
  //               <button className="btn btn-primary btn-block" onClick={this.handleCloseExchangePopupIntro}>Got it!</button>
  //             </div>
  //           </div>
  //         ),
  //       }, () => {
  //         this.modalRef.open();
  //       });
  //     }, 1500);
  //   }
  // }

  clickCategoryItem(category) {
    console.log('clickCategoryItem');
    const { rfChange } = this.props;
    const { id } = category;
    gtag.event({
      category: taggingConfig.common.category,
      action: taggingConfig.common.action.chooseCategory,
      label: id,
    });
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
        rfChange(nameFormFilterFeeds, 'sortType', CASH_SORTING_CRITERIA.DISTANCE);
        this.setState({ sortIndexActive: CASH_SORTING_CRITERIA.DISTANCE });
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

  loadDiscoverList = () => {
    const { ipInfo } = this.props;
    const {
      handshakeIdActive,
      query,
      sortIndexActive,
      sortPriceIndexActive,
      sortOrder,
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
        qs.custom_query = ` -offline_i:1 `;

        if (sortIndexActive === CASH_SORTING_CRITERIA.PRICE) {
          qs.c_sort = sortPriceIndexActive;
          qs.t_sort = sortOrder;
        } else if (sortIndexActive === CASH_SORTING_CRITERIA.RATING) {
          qs.c_sort = 'review_d';
          qs.t_sort = SORT_ORDER.DESC;
        }
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

  onSortChange = (e, newValue) => {
    const { rfChange } = this.props;
    const { sortIndexActive } = this.state;
    console.log('onSortChange', newValue);
    if (sortIndexActive !== newValue) {
      this.setLoading(true);
      this.setState({ sortIndexActive: newValue, sortPriceIndexActive: '' }, () => {
        this.loadDiscoverList();
      });
    }
  }

  onSortPriceChange = (e, item) => {
    const { sortPriceIndexActive } = this.state;
    console.log('onSortPriceChange', sortPriceIndexActive, item);

    if (sortPriceIndexActive !== item.id) {
      this.setLoading(true);
      const sortOrder = item.id.includes('buy') ? SORT_ORDER.ASC : SORT_ORDER.DESC;
      this.setState({ sortIndexActive: CASH_SORTING_CRITERIA.PRICE, sortPriceIndexActive: item.id, sortOrder }, () => {
        this.loadDiscoverList();
      });
    }
  }

  render() {
    const {
      // handshakeIdActive,
      // tabIndexActive,
      propsModal,
      modalContent,
      sortIndexActive,
    } = this.state;
    const { messages } = this.props.intl;
    const { intl } = this.props;

    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <Grid className="discover">
          <React.Fragment>
            {/*
                <Helmet>
                  <title>{intl.formatMessage({ id: 'ex.seo.title' })}</title>
                  <meta name="description" content={intl.formatMessage({ id: 'ex.seo.meta.description' })} />
                </Helmet>
                */}
            <div className="mt-2 mb-1">
              <FormFilterFeeds>
                <div className="d-table w-100">
                  <div className="d-table-cell"><label className="label-filter-by"><FormattedMessage id="ex.discover.label.sortby" /></label></div>
                  <div className="d-table-cell">
                    <Field
                      name="sortType"
                      component={fieldRadioButton}
                      type="tab-5"
                      fullWidth={false}
                      list={CASH_SORTING_LIST}
                      // validate={[required]}
                      onChange={this.onSortChange}
                    />
                    <Field
                      name="sortType"
                      component={fieldDropdown}
                      classNameWrapper=""
                      defaultText={<FormattedMessage id="ex.sort.price" />}
                      classNameDropdownToggle={`dropdown-sort bg-white ${sortIndexActive === CASH_SORTING_CRITERIA.PRICE ? 'dropdown-sort-selected' : ''}  `}
                      list={PRICE_SORTS}
                      onChange={this.onSortPriceChange}
                    />
                  </div>
                </div>

              </FormFilterFeeds>
            </div>
            <div>
              <div className="ex-sticky-note">
                <div className="mb-2"><FormattedMessage id="ex.discover.banner.text" /></div>
                <div>
                  <Link to={{ pathname: URL.HANDSHAKE_CREATE, search: `?id=${HANDSHAKE_ID.EXCHANGE}` }}>
                    <button className="btn btn-become"><FormattedMessage id="ex.discover.banner.btnText" /></button>
                  </Link>
                </div>
              </div>
            </div>
          </React.Fragment>
          <Row>
            {!this.state.isBannedCash && !this.props.firebaseApp.config?.maintainChild?.exchange && this.getHandshakeList()}
            {
              this.state.isBannedCash
                ? (
                  <BlockCountry />
                )
                : this.props.firebaseApp.config?.maintainChild?.exchange ? <Maintain /> : null
            }
          </Row>
          <Row className="info">
            {messages.product_info}
          </Row>
        </Grid>
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }} {...propsModal}>
          {modalContent}
        </ModalDialog>
        <ModalDialog className="modal" onRef={(modal) => { this.modalLuckyPoolRef = modal; return null; }}>
          <LuckyLanding onButtonClick={() => {
            this.modalLuckyPoolRef.close();
          }}
          />
        </ModalDialog>
      </React.Fragment>
    );
  }
}

const mapState = state => ({
  discover: state.discover,
  app: state.app,
  ipInfo: state.app.ipInfo,
  exchange: state.exchange,
  isBannedCash: state.app.isBannedCash,
  isBannedPrediction: state.app.isBannedPrediction,
  firebaseApp: state.firebase.data,
  freeStartInfo: state.exchange.freeStartInfo,
  showedLuckyPool: state.betting.showedLuckyPool,
  authProfile: state.auth.profile,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  loadDiscoverList: bindActionCreators(loadDiscoverList, dispatch),
  getListOfferPrice: bindActionCreators(getListOfferPrice, dispatch),
  setFreeStart: bindActionCreators(setFreeStart, dispatch),
  getFreeStartInfo: bindActionCreators(getFreeStartInfo, dispatch),
  updateShowedLuckyPool: bindActionCreators(updateShowedLuckyPool, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(DiscoverPage));
