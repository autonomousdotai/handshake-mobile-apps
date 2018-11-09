import React from 'react';
import qs from 'querystring';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { loginCoinbase } from '@/guru/pages/Home/action';

const stateConstant = 'sa123456';

class AuthCallback extends React.Component {

  componentDidMount() {
    console.log('componentDidMount');
    const querystring = window.location.search.replace('?', '');
    const querystringParsed = qs.parse(querystring);
    const { code, state } = querystringParsed;
    if (code && state === stateConstant) {
      this.getCoinbaseToken(code);
    }
  }
  getCoinbaseToken(code) {
    this.props.dispatch(loginCoinbase({ code }));
  }
  render() {
    return (
      <div >
      This page callback
      </div>
    );
  }
}
export default injectIntl(connect(
  (state) => {
    return {

    };
  },
)(AuthCallback));
