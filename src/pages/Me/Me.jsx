import React from 'react';
import { URL } from '@/config';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import TestStatusHandshake from '@/components/handshakes/betting/Feed/TestStatusHandshake';
class Me extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
          <TestStatusHandshake/>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Me;
