import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import { URL } from '@/config';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import Category from '@/components/core/controls/Category';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
import FeedSeed from '@/components/handshakes/seed/Feed';
import FeedCreditCard from '@/components/handshakes/exchange/Feed/FeedCreditCard';
import Tabs from '@/components/handshakes/exchange/components/Tabs';
import NoData from '@/components/core/presentation/NoData';
// style
import './Discover.scss';
import {getListOfferPrice} from "../../reducers/exchange/action";

const maps = {
  [HANDSHAKE_ID.PROMISE]: FeedPromise,
  [HANDSHAKE_ID.BETTING]: FeedBetting,
  [HANDSHAKE_ID.EXCHANGE]: FeedExchange,
  [HANDSHAKE_ID.SEED]: FeedSeed,
};

class DiscoverPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      handshakeIdActive: '',
      tabIndexActive: 1,
    };
    this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE });
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.clickTabItem = this.clickTabItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.firebaseUser);
  }

  async componentDidMount() {
    this.getListOfferPrice();
    this.intervalCountdown = setInterval(() => {
      this.getListOfferPrice();
    }, 30000);
  }

  getListOfferPrice = () => {
    this.props.getListOfferPrice({
      BASE_URL: API_URL.EXCHANGE.BASE,
      PATH_URL: API_URL.EXCHANGE.GET_LIST_OFFER_PRICE,
      qs: {fiat_currency: 'VND'},
      // successFn: this.handleGetPriceSuccess,
      // errorFn: this.handleGetPriceFailed,
    });
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  get getHandshakeList() {
    const { list } = this.props.discover;
    if (list && list.length > 0) {
      return list.map((handshake) => {
        const FeedComponent = maps[handshake.type];
        if (FeedComponent) {
          return (
            <Col key={handshake.id} md={12} className="feed-wrapper">
              <FeedComponent {...handshake} onFeedClick={() => this.clickFeedDetail(handshake.id)} />
            </Col>
          );
        }
      });
    } else {
      return <NoData message="NO DATA AVAILABLE" />;
    }
  }

  searchChange(query) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE, qs: { query: query.trim() } });
    }, 500);
  }

  clickFeedDetail(id) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${id || ''}`);
  }

  clickCategoryItem(category) {
    const { id } = category;
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // do something
        break;
      case HANDSHAKE_ID.SEED:
        // do something
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // do something
        break;
      default:
        // is promise
    }
    // filter list
    this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE, qs: { type: id } });
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
    });
  }

  clickTabItem(index) {
    this.setState({ tabIndexActive: index });
    this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE, qs: { public: 0, chain_id: 4 } });
  }

  render() {
    const { handshakeIdActive, tabIndexActive } = this.state;

    return (
      <Grid className="discover">
        <Row>
          <Col md={12} xs={12}>
            <SearchBar onSuggestionSelected={() => {}} onInputSearchChange={this.searchChange}/>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={6}>
            <Category className="category-wrapper" onItemClick={this.clickCategoryItem} />
          </Col>
        </Row>
        {
          handshakeIdActive === HANDSHAKE_ID.EXCHANGE && (
            <div>
              <Tabs
                activeId={this.state.tabIndexActive}
                onClickTab={this.clickTabItem}
                list={[
                  { id: 1, text: 'Buy' },
                  { id: 2, text: 'Sell' },
                ]}
              />
              { tabIndexActive === 1 && (
                <div className="feed-wrapper">
                  <FeedCreditCard {...this.props} ipInfo={this.state.ipInfo}/>
                </div>)
              }
            </div>
          )
        }
        <Row>
          {this.getHandshakeList}
        </Row>
      </Grid>
    );
  }
}

DiscoverPage.propTypes = {
  discover: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loadDiscoverList: PropTypes.func.isRequired,
};

const mapState = state => ({
  discover: state.discover,
  firebaseUser: state.firebase.data,
});

const mapDispatch = ({
  loadDiscoverList,
  getListOfferPrice
});

export default connect(mapState, mapDispatch)(DiscoverPage);
