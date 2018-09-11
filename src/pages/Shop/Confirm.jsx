import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import $http from '@/services/api';
import { getJSON } from 'js-cookie';
import { CUSTOMER_ADDRESS_INFO } from '@/constants';
// style
import './Confirm.scss';

class Confirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: -1 // pending
    };
    this.orderNum = '';
  }

  get resultView() {
    const { status } = this.state;
    if (status === 1) {
      // success
      return <div>thank you for your order. Order number is {this.orderNum}</div>
    } else if (status === 2 || status === 0) {
      // fail
      return <div>something wrong!</div>
    } else {
      // loading
      return <div>loading...</div>;
    }
  }
  
  componentDidMount() {
    // get status
    const queryObject = qs.parse(location.search.slice(1));
    if (queryObject.status === '1') {
      // call to confirm hash
      const { email, orderNum } = getJSON(CUSTOMER_ADDRESS_INFO);
      this.orderNum = orderNum;
      const url = `https://dev.autonomous.ai/api-v2/order-api/order/eth/charges?order_id=${queryObject.order_id}&email=${email}&hash=${queryObject.hash}`;
      const confirmOrder = $http({ url, method: 'POST' });
      confirmOrder.then(result => {
        if (result.data.status < 1) {
          // fail
          this.setState({ status: 0 });
        } else {
          // success
          this.setState({ status: 1 });
        }
      });
    } else {
      this.setState({ status: 0 });
    }
  }

  render() {
    return (
      <div className="Confirm">
        {this.resultView}
      </div>
    );
  }
}

const mapState = state => ({
  // discover: state.discover,
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(null, null)(withRouter(Confirm)));
