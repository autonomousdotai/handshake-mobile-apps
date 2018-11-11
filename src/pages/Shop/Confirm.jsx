import React from 'react';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import qs from 'qs';
import $http from '@/services/api';
import { getJSON } from 'js-cookie';
import { CUSTOMER_ADDRESS_INFO, AUTONOMOUS_END_POINT } from '@/constants';
// style
import './Confirm.scss';

class Confirm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: -1 // pending
    };
    // variable for checking order
    this.orderNum = '';
    this.email = '';
    this.resultOfOrder = -1;
  }

  get resultView() {
    const { status } = this.state;
    if (status === 1) {
      // success
      return (<div>
        Thank you for your order.
        <p>Order number: <strong>{this.orderNum}</strong></p>
        <p>Email: <strong>{this.email}</strong></p>
        {
          this.resultOfOrder === 15 && (
            <p>Your order is pending. It's waiting network.</p>
          )
        }     
        <a href="https://www.autonomous.ai/track-your-order" target="_blank" title="track your order">
          Track your order
        </a>
      </div>);
    } else if (status === 2 || status === 0) {
      // fail
      return <div>Sorry! something happened wrong.</div>
    } else {
      // loading
      return <div>We're checking...</div>;
    }
  }
  
  async componentDidMount() {
    // get status
    const queryObject = qs.parse(location.search.slice(1));
    if (queryObject.status === '1') {
      // call to confirm hash
      const { email, orderNum } = getJSON(CUSTOMER_ADDRESS_INFO);
      this.orderNum = orderNum;
      this.email = email;
      const url = `${AUTONOMOUS_END_POINT.BASE}${AUTONOMOUS_END_POINT.VERIFY_CHARGE_BY_ETH}?order_id=${queryObject.order_id}&email=${email}&hash=${queryObject.transaction}`;
      const { data } = await $http({ url, method: 'POST' });
      if (data.status < 1) {
        // fail
        this.setState({ status: 0 });
      } else {
        // success
        this.resultOfOrder = data.data.status;
        this.setState({ status: 1 });
      }
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

export default injectIntl(withRouter(Confirm));
