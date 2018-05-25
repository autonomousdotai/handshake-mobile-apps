import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { loadDiscoverList } from '@/reducers/discover/action';
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

import { ACTIONS, success } from '@/reducers/discover/action';

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

    this.props.loadDiscoverList({ PATH_URL: 'handshake?public=0&chain_id=4' });
    this.props.success(handShakeList);
  }


  clickFeedDetail(slug) {
    this.props.history.push(`${URL.HANDSHAKE_DISCOVER}/${slug || ''}`);
  }

  get getHandshakeList() {
    return this.props.discover.list.map((handshake) => {
      const FeedComponent = maps[handshake.industriesType];
      if (FeedComponent) {
        return (
          <Col key={handshake.id} md={12} className="feed-wrapper">
            <FeedComponent {...handshake} onFeedClick={() => {this.clickFeedDetail(handshake.slug)}} />
          </Col>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <SearchBarContainer />
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={6}>
            <Category className="category-wrapper" />
          </Col>
        </Row>
        <Row>
          {this.getHandshakeList}
        </Row>
      </Grid>
    );
  }
}

DiscoverPage.propTypes = {
  discover: PropTypes.object,
  history: PropTypes.object.isRequired,
  loadDiscoverList: PropTypes.func.isRequired,
};

const mapState = state => ({
  discover: state.discover,
});

const mapDispatch = ({
  loadDiscoverList,
  success
});

export default connect(mapState, mapDispatch)(DiscoverPage);
