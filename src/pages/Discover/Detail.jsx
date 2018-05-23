import React from 'react';
import Button from '@/components/core/controls/Button';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

class DiscoverDetailPage extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <div><FormattedMessage id="HELLO" values={{ name: 'b' }} /></div>
            params: {this.props.match.params.id}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default DiscoverDetailPage;
