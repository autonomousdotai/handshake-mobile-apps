import React from 'react';
import Button from '@/components/core/controls/Button';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

import { HANDSHAKE_ID } from '@/constants';

import DetailPromise from '@/components/handshakes/promise/Detail';
import DetailBetting from '@/components/handshakes/betting/Detail';
import DetailExchange from '@/components/handshakes/exchange/Detail';
import DetailSeed from '@/components/handshakes/seed/Detail';

import Loading from '@/pages/Loading';

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
      slug: this.props.match.params.slug,
      detail: {},
      isLoading: true
    };
  }

  componentDidMount() {
    // load handshake detail
    // this.props.loadDiscoverDetail({ PATH_URL: `handshake/detail/${this.state.slug}`, successFn: () => {
    //   this.setState({ isLoading: false, detail: this.props.discover.detail });
    // }, errorFn: () => {
    //   this.setState({ isLoading: false });
    // }});

    this.setState({ isLoading: false, detail: {
      'contract_file': 'QmSQ88xFw9kNEHn8MaBqSVjnJ8X1vMZM65z6ntBKQspQcc',
      'contract_file_name': '1525271889_27651cb93dc21eab994da59451587a8d_crypto.pdf',
      'delivery_date': 'Wed, 02 May 2018 14:38:07 GMT',
      'description': 'gerdab is delighted to offer Trong a role as Dev Salary of 1k/mo starting on 2018-05-02.',
      'escrow_date': 'Wed, 02 May 2018 14:38:07 GMT',
      'from_address': '0xf42b9d4A22B13DEbc8723407fD5fA78963D1c1C9',
      'from_email': 'gerdabhav@gmail.com',
      'hid': '349',
      'id': 449,
      'industries_type': this.state.slug === 'betting-1' ? 3 : 1,
      'public': 0,
      'signed_contract_file': 'QmeGBjuEojwojSrun884TriyEAs4SzjbCwL3sumVXaniVZ',
      'source': 'android',
      'status': 4,
      'term': 0,
      'to_address': '0x5eE2A7BF750Ad8103F04ec62FAbE502e3e3f93B4',
      'to_email': 'trong1@autonomous.nyc',
      'user_id_shaked': 3,
      'slug': 'promise-10',
    } });
  }

  get getDetailPage() {
    const DetailComponent = maps[this.state.detail.industries_type];
    return <DetailComponent {...this.state.detail} />;
  }

  render() {
    if (this.state.isLoading) return <Loading />;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            {this.getDetailPage}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DiscoverDetailPage;
