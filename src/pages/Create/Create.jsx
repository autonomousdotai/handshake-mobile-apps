import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { HANDSHAKE_ID, HANDSHAKE_NAME, HANDSHAKE_ID_DEFAULT } from '@/constants';
import CreatePromise from '@/components/handshakes/promise/Create';
import CreateBetting from '@/components/handshakes/betting/Create';
import CreateExchange from '@/components/handshakes/exchange/Create';
import CreateSeed from '@/components/handshakes/seed/Create';

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

    this.change = ::this.change;
  }

  get getArrayHandshakeId() {
    this.ids = [];

    const handshakesIds = Object.keys(HANDSHAKE_NAME);

    handshakesIds.forEach((id) => {
      this.ids.push((<option id={id} key={id} value={id}>{HANDSHAKE_NAME[id]}</option>));
    });

    return this.ids;
  }

  change(e) {
    this.setState({ seletedId: parseInt(e.target.value, 10) });
  }

  render() {
    const CreateComponent = maps[this.state.seletedId];

    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div>
              <select defaultValue={this.state.seletedId} onChange={this.change}>
                {
                  this.getArrayHandshakeId
                }
              </select>
            </div>
            <CreateComponent />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Create;
