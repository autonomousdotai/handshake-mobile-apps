import React from 'react';
import { HANDSHAKE_ID, HANDSHAKE_NAME, HANDSHAKE_ID_DEFAULT } from '@/constants';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import SearchBar from '@/components/core/controls/SearchBar';
import CreatePromise from '@/components/handshakes/promise/Create';
import CreateBetting from '@/components/handshakes/betting/Create';
import CreateExchange from '@/components/handshakes/exchange/Create';
import CreateSeed from '@/components/handshakes/seed/Create';
import { handShakeList } from '@/data/shake';

const maps = {
  [HANDSHAKE_ID.PROMISE]: CreatePromise,
  [HANDSHAKE_ID.BETTING]: CreateBetting,
  [HANDSHAKE_ID.EXCHANGE]: CreateExchange,
  [HANDSHAKE_ID.SEED]: CreateSeed,
};

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seletedId: HANDSHAKE_ID_DEFAULT,
    };
    // bind
    this.handshakeChange = this.handshakeChange.bind(this);
  }

  get handShakeList() {
    return Object.entries(HANDSHAKE_NAME).map(([key, value]) => {
      return {
        id: key,
        name: value
      };
    });
  }

  handshakeChange({ suggestion }) {
    const { id } = suggestion;
    this.setState({ seletedId: id });
  }

  render() {
    const CreateComponent = maps[this.state.seletedId];

    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <SearchBar suggestions={this.handShakeList} onSuggestionSelected={this.handshakeChange} />
            <CreateComponent />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Create;
