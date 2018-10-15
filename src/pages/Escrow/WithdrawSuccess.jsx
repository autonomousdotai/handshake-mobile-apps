import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { URL } from '@/constants';
import { change } from 'redux-form';
import './Deposit.scss';
import { bindActionCreators } from 'redux';

import bgWithdrawSuccessfully from '@/assets/images/cash/escrow-withdraw-success.svg';

import './CommonStyle.scss';
import './WithdrawSuccess.scss';

class EscrowWithdrawSuccess extends React.Component {
  backToDashboard = () => {
    this.props.history.push(URL.HANDSHAKE_ME);
  }

  render() {
    const { messages } = this.props.intl;
    const { intl, hideNavigationBar } = this.props;
    const { listOfferPrice } = this.props;

    return (
      <div className="escrow-withdraw-success">
        <div>
          <div className="w-50" style={{ paddingTop: '151px', paddingBottom: '100px' }}>
            <h4 className="font-weight-bold">{messages.me.credit.withdrawSuccess.description}</h4>
            <div className="escrow-label">
              {messages.me.credit.withdrawSuccess.descriptionTransfer}
            </div>
          </div>
          <div className="background">
            <img src={bgWithdrawSuccessfully} />
          </div>
        </div>
        <div className="mt-4">
          <button className="btn btn-block btn-escrow-primary" onClick={this.backToDashboard}>
            <span>&larr; {messages.me.credit.withdrawSuccess.buttonTitle}</span>
          </button>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  depositInfo: state.exchange.depositInfo,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(
  connect(mapState, mapDispatch)(EscrowWithdrawSuccess),
);
