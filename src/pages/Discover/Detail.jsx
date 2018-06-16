import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// constants, actions
import { loadDiscoverDetail } from '@/reducers/discover/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import DetailPromise from '@/components/handshakes/promise/Detail';
import DetailBetting from '@/components/handshakes/betting/Detail';
import DetailExchange from '@/components/handshakes/exchange/Detail';
import DetailSeed from '@/components/handshakes/seed/Detail';
import Loading from '@/components/core/presentation/Loading';

const maps = {
  [HANDSHAKE_ID.PROMISE]: DetailPromise,
  [HANDSHAKE_ID.BETTING]: DetailBetting,
  [HANDSHAKE_ID.EXCHANGE]: DetailExchange,
  [HANDSHAKE_ID.SEED]: DetailSeed,
};

class DiscoverDetailPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: props.match.params.slug
    };
  }

  componentDidMount() {
    // load handshake detail
    this.props.loadDiscoverDetail({ PATH_URL: `${API_URL.HANDSHAKE.INDEX}/${this.state.id}` });
  }

  get getDetailPage() {
    const { detail } = this.props.discover;
    if (detail && detail.type) {
      const DetailComponent = maps[detail.type];
      return <DetailComponent {...detail} slug={this.state.slug} />;
    }
  }

  render() {
    const { isFetching } = this.props.discover;
    if (isFetching) return <Loading />;
    return (
      <Grid>
        <Row>
          {this.getDetailPage}
        </Row>
      </Grid>
    );
  }
}

DiscoverDetailPage.propType = {
  loadDiscoverDetail: PropTypes.func,
};

const mapState = state => ({
  discover: state.discover,
});

const mapDispatch = ({
  loadDiscoverDetail,
});

export default connect(mapState, mapDispatch)(DiscoverDetailPage);
