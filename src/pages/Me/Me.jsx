import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import { loadMyHandshakeList, success } from '@/reducers/me/action';
import { handShakeList } from '@/data/shake.js';
// componentimport
import { Grid, Row, Col } from 'react-bootstrap';
import Feed from '@/components/core/presentation/Feed';
import './Me.scss';

class Me extends React.Component {

  componentDidMount() {
    this.props.success(handShakeList); // temp
  }

  getStatusById(id) {
    switch (id) {
      case 2:
        return (<span className="done">Done</span>);
      case 3:
        return (<span className="new">New</span>);
      default:
        return (<span className="pending">Pending</span>);
    }
  }

  render() {
    const { list } = this.props.me;
    return (
      <Grid>
        <Row>
          <Col md={12}>
            {
              list.map(handshake => (
                <div className="my-feed-wrapper" key={handshake.id} onClick={() => alert('show detail')}>
                  <div className="head">
                    <div className="from"><span className="email">From:</span>&nbsp;{handshake.fromEmail}</div>
                    <div className="status">{this.getStatusById(handshake.status)}</div>
                  </div>
                  <Feed className="my-feed">
                    <p className="description">{handshake.description}</p>
                  </Feed>
                </div>
              ))
            }
          </Col>
        </Row>
      </Grid>
    );
  }
}

Me.propTypes = {
  me: PropTypes.object.isRequired,
  loadMyHandshakeList: PropTypes.func.isRequired,
  success: PropTypes.func.isRequired, // temp
};

const mapState = state => ({
  me: state.me,
});

const mapDispatch = ({
  loadMyHandshakeList,
  success, // temp
});

export default connect(mapState, mapDispatch)(Me);
