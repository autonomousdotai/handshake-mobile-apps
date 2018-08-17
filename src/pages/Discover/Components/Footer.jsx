import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import './Footer.scss'

class Footer extends React.Component {



  render() {
    return (
      <div className="cash-footer">
        <button className="btn btn-outline-primary">Wallet</button>
        &nbsp;
        <button className="btn btn-primary">My ATM</button>
      </div>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Footer));
