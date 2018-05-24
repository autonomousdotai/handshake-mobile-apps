import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Creates, { maps as createMaps } from '@/components/Create';

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seletedId: 0
    }

    this.change = ::this.change;
  }

  change(e) {
    this.setState({ seletedId: parseInt(e.target.value) });
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} xs={12}>
            <div>
              <select defaultValue={this.state.seletedId} onChange={this.change}>
                {createMaps.map(
                  (item, index) => (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  )
                )}
              </select>
            </div>
            <Creates id={this.state.seletedId} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Create;
