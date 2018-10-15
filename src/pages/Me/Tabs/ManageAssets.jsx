import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { API_URL } from '@/constants';
import { FormattedMessage, injectIntl } from 'react-intl';
// components
import { getCreditATM } from '@/reducers/exchange/action';
// style
import { change } from 'redux-form';
import iconSafeGuard from '@/assets/images/icon/safe-guard.svg';

import Asset from './Asset';
import Withdraw from '@/pages/Escrow/Withdraw';
import Deposit from '@/pages/Escrow/Deposit';
import Modal from '@/components/core/controls/Modal/Modal';

class ManageAssets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      modalTitle: '',
    };
  }

  componentDidMount() {
    this.getCreditATM();
  }

  getCreditATM = () => {
    this.props.getCreditATM({ PATH_URL: API_URL.EXCHANGE.CREDIT_ATM });
  }

  depositCoinATM = (currency) => {
    console.log('depositCoinATM', currency);
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.me.credit.deposit.title,
      modalContent:
        (
          <Deposit setLoading={this.props.setLoading} history={this.props.history} currency={currency} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  withdrawCash = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.me.credit.withdraw.title,
      modalContent:
        (
          <Withdraw setLoading={this.props.setLoading} history={this.props.history} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  render() {
    const { messages } = this.props.intl;
    const { depositInfo, creditRevenue } = this.props;
    const { modalContent, modalTitle } = this.state;
    let assets = [];

    if (depositInfo) {
      const { updatedAt, ...rest } = depositInfo;
      assets = Object.values(rest);
    }

    return (
      <div className="manage-assets">
        <div className="bg-white p-3">
          {
            assets.map(asset => {
              const { currency: id } = asset;
              return (
                <Asset key={id} {...asset} history={this.props.history} setLoading={this.props.setLoading} depositCoinATM={this.depositCoinATM} />
              );
            })
          }
          <div className="asset position-relative">
            <div >
              <div className="mt-4">
                <div className="d-table w-100 mt-2">
                  <div className="d-table-cell text-normal">
                    <FormattedMessage id="dashboard.label.yourBalance" />
                  </div>
                  <div className="d-table-cell text-right black-color">
                    {creditRevenue}
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>

        <div className="mt-3">
          <div className="media">
            <img src={iconSafeGuard} className="mr-2" />
            <div className="media-body font-weight-normal">
              <FormattedMessage id="dashboard.label.deposit.description1" />
              <span style={{ color: '#526AFB' }}><FormattedMessage id="dashboard.label.deposit.description2" /></span>
            </div>
          </div>
          <div className="mt-3">
            <div className="d-inline-block w-50 pr-1">
              <button className="btn primary-button btn-block" onClick={() => this.depositCoinATM()}>
                <FormattedMessage id="dashboard.btn.depositEscrow" />
              </button>
            </div>
            <div className="d-inline-block w-50 pl-1">
              <button className="btn secondary-button btn-block" onClick={this.withdrawCash}>
                <FormattedMessage id="dashboard.btn.withdrawEscrow" />
              </button>
            </div>
          </div>
        </div>
        <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
          {modalContent}
        </Modal>
      </div>
    );
  }
}

const mapState = state => ({
  me: state.me,
  depositInfo: state.exchange.depositInfo,
  creditRevenue: state.exchange.creditRevenue || 0,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  getCreditATM: bindActionCreators(getCreditATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(ManageAssets));
