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
import {FIREBASE_PATH} from '@/constants';
// style
import './Discover.scss';

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
    };
    this.props.loadDiscoverList({ PATH_URL: API_URL.DISCOVER.BASE });
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
    this.searchChange = this.searchChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.firebaseUser);
  }

  get getHandshakeList() {
    return this.props.discover.list.map((handshake) => {
      const FeedComponent = maps[handshake.type];
      if (FeedComponent) {
        return (
          <Col key={handshake.id} md={12} className="feed-wrapper">
            <FeedComponent {...handshake} onFeedClick={() => this.clickFeedDetail(handshake.slug)} />
          </Col>
        );
      }
      return null;
    });
  }

  searchChange() {
    // TODO: search feed
  }

  clickFeedDetail(slug) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${slug || ''}`);
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

  render() {
    const { handshakeIdActive } = this.state;
    

    return (
      <Grid className="discover">
        <Row>
          <Col md={12} xs={12}>
            <SearchBar onSuggestionSelected={this.searchChange} />
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
                activeId={1}
                onClickTab={(index) => console.log('indexx', index)}
                list={[
                  { id: 1, text: 'Buy' },
                  { id: 2, text: 'Sell' },
                ]}
              />
              <div className="feed-wrapper">
                <FeedCreditCard {...this.props} />
              </div>
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
});

export default connect(mapState, mapDispatch)(DiscoverPage);
