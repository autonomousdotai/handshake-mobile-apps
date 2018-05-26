import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList, success } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBarContainer from '@/components/core/controls/SearchBarContainer';
import Category from '@/components/core/controls/Category';
import { handShakeList } from '@/data/shake.js';
import { URL } from '@/config';

import { HANDSHAKE_ID } from '@/constants';
import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed';
import FeedSeed from '@/components/handshakes/seed/Feed';

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
    this.props.loadDiscoverList({ PATH_URL: 'handshake', qs: { public: 0, chain_id: 4 } });
    this.props.success(handShakeList); // temp
    // bind
    this.clickCategoryItem = this.clickCategoryItem.bind(this);
  }

  get getHandshakeList() {
    return this.props.discover.list.map((handshake) => {
      const FeedComponent = maps[handshake.industriesType];
      if (FeedComponent) {
        return (
          <Col key={handshake.id} md={12} className="feed-wrapper">
            <FeedComponent {...handshake} onFeedClick={() => { this.clickFeedDetail(handshake.slug); }} />
          </Col>
        );
      }
      return null;
    });
  }

  clickFeedDetail(slug) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${slug || ''}`);
  }

  clickCategoryItem(category) {
    const { id } = category;
    switch (id) {
      case HANDSHAKE_ID.BETTING:
        // refresh list
        break;
      case HANDSHAKE_ID.SEED:
        // refresh list
        break;
      case HANDSHAKE_ID.EXCHANGE:
        // refresh list
        break;
      default:
        // is promise
    }
    // set feed type activate
    this.setState({
      handshakeIdActive: id,
    });
  }

  render() {
    const { handshakeIdActive } = this.state;
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <SearchBarContainer />
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={6}>
            <Category className="category-wrapper" onItemClick={this.clickCategoryItem} />
          </Col>
        </Row>
        {
          handshakeIdActive === HANDSHAKE_ID.EXCHANGE && (
            <Row className="text-center buy-sell-wrapper">
              <Col md={6}><strong>Buy</strong></Col>
              <Col md={6}><strong>Sell</strong></Col>
            </Row>
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
  success: PropTypes.func.isRequired, // temp
};

const mapState = state => ({
  discover: state.discover,
  router: state.router,
});

const mapDispatch = ({
  loadDiscoverList,
  success, // temp
});

export default connect(mapState, mapDispatch)(DiscoverPage);
