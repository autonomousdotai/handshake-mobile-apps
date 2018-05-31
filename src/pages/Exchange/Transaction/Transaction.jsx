import React from 'react';
import {connect} from 'react-redux';
// service, constant
import {getUserTransaction} from '@/reducers/exchange/action';
// components
import {Col, Grid, Row} from 'react-bootstrap';
import Feed from '@/components/core/presentation/Feed';
import {handShakeList} from '@/data/shake.js';
// style
import './Transaction.scss';
import {API_URL} from "@/constants";


class Transaction extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUserTransaction({PATH_URL: API_URL.EXCHANGE.GET_USER_TRANSACTION, headers: {'Custom-Uid': 'megalodon'}});
  }

  feedHtml = () => {
    const {userTransaction} = this.props;
    console.log('feedHtml', userTransaction);
    return userTransaction.data.map(handShake => (
      <Col md={12} xs={12} key={handShake.id} className="feedWrapper">
        <Feed className="feed">
          <p className="description">{handShake.from}</p>
          <p className="email">{handShake.amount}{handShake.currency}</p>
          <p className="email">{handShake.fiat_amount}{handShake.fiat_currency}</p>
        </Feed>
      </Col>
    ));
  }

  render() {
    console.log('render');
    return (
      <Grid>
        <Row>
          {this.feedHtml()}
        </Row>
      </Grid>
    );
  }
}

Transaction.propTypes = {
};

const mapStateToProps = (state) => ({
  userTransaction: state.exchange.userTransaction || {data: []},
});

const mapDispatchToProps = ({
  getUserTransaction
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
