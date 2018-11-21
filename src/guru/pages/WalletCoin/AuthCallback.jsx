import React from 'react';
import qs from 'querystring';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { loginCoinbase } from '@/guru/pages/Home/action';
import { authCoinbaseSelector } from '@/guru/pages/Home/selector';

const stateConstant = 'sa123456';

class AuthCallback extends React.Component {
  static propTypes = {
    authCoinbase: PropTypes.object
  }
  static defaultProps = {
    authCoinbase: {}
  }
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
    const { authCoinbase } = this.props;
    const { access_token: accessToken = '', refresh_token: refreshToken = '' } = authCoinbase;
    return (
      <div >
        <div>AccessToken: {accessToken}</div>
        <div>RefeshToken: {refreshToken}</div>

      </div>
    );
  }
}
export default injectIntl(connect(
  (state) => {
    return {
      authCoinbase: authCoinbaseSelector(state),

    };
  },
)(AuthCallback));
