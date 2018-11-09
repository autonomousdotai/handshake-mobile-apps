import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';


class WalletCoin extends React.Component {
  render() {
    return (
      <div />
    );
  }
}
export default injectIntl(connect(
  (state) => {
    return {

    };
  },
)(WalletCoin));
