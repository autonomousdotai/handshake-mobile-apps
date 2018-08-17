import React from 'react';
import { connect } from 'react-redux';
import {Ethereum} from '@/services/Wallets/Ethereum.js'
import iconSelf from '@/assets/images/icon/icon-self.svg';
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconCreate from '@/assets/images/icon/icon-create.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Wallet.scss';
import WalletTransaction from './WalletTransaction';
import { showLoading, hideLoading } from '@/reducers/app/action';
import Modal from '@/components/core/controls/Modal';

class WalletHistory extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

	constructor(props) {

    super(props);
    this.state = {
      transactions: this.props.transactions,
      internalTransactions: this.props.internalTransactions,
      transaction_detail: null,
      tabActive: 0,
    };
  }

  componentWillReceiveProps(){
    //this.setState({tabActive:0});
  }

  componentDidUpdate(){
    const {transactions, internalTransactions} = this.props
    if (transactions != this.state.transactions){
      this.setState({transactions: transactions});
    }

    if (internalTransactions != this.state.internalTransactions){
      this.setState({internalTransactions: internalTransactions, tabActive : 0});
    }
  }

  get list_transaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    if (wallet && this.state.transactions.length==0)
      return <div className="history-no-trans">No transactions yet</div>;
    else if(wallet){
      let arr = [];

      return this.state.transactions.map((res) => {
        let tran = wallet.cook(res);
        if(arr.indexOf(tran.transaction_no) < 0)
          arr.push(tran.transaction_no);
        else {
          tran.is_sent = 1;
          return "";
        }

        let cssLabel = "label-self", cssValue = "value-self", icon = iconSelf, label = messages.wallet.action.history.label.self;
        if(tran.is_sent == 1) {
          cssLabel = "label-sent";
          cssValue = "value-sent";
          label = messages.wallet.action.history.label.sent;
          icon = iconSent;
        }
        else if (tran.is_sent == 2) {
          cssLabel = "label-received";
          cssValue = "value-received";
          label = messages.wallet.action.history.label.received;
          icon = iconReceived;
        }
        else if (tran.is_sent == 3) {
          cssLabel = "label-create";
          cssValue = "value-create";
          label = messages.wallet.action.history.label.create;
          icon = iconCreate;
        }

        res.is_sent = tran.is_sent;

        return <div key={tran.transaction_no} className="row" onClick={() =>{this.detailTransaction(res)}}>
            <div className="col3">
              <div className="time">{tran.transaction_relative_time}</div>
              <div className={cssValue}>{tran.is_sent == 1 ? "-" : ""}{Number(tran.value)} {tran.coin_name}</div>
              {tran.confirmations <= 0 ? <div className="unconfirmation">{messages.wallet.action.history.label.unconfirmed}</div> : ""}
              {tran.is_error ? <div className="unconfirmation">{messages.wallet.action.history.label.failed}</div> : ""}
            </div>
            <div className="col1"><img className="iconDollar" src={icon} /></div>
            <div className="col2 address">
              <div className={cssLabel}>{label}</div>
              {
                tran.addresses.map((addr) => {
                  return <div key={addr}>{addr}</div>
                })
              }
            </div>
          </div>
      });
    }
  }

  get list_internalTransaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    if (wallet && this.state.internalTransactions.length==0)
      return <div className="history-no-trans">No internal transactions yet</div>;
    else if(wallet){
      let arr = [];

      return this.state.internalTransactions.map((res) => {
        let tran = wallet.cookIT(res);
        if(!tran) return "";

        if(arr.indexOf(tran.transaction_no) < 0)
          arr.push(tran.transaction_no);
        else {
          return "";
        }

        let cssLabel = "label-self", cssValue = "value-self", icon = iconSelf, label = messages.wallet.action.history.label.self;
        if(tran.is_sent == 1) {
          cssLabel = "label-sent";
          cssValue = "value-sent";
          label = messages.wallet.action.history.label.sent;
          icon = iconSent;
        }
        else if (tran.is_sent == 2) {
          cssLabel = "label-received";
          cssValue = "value-received";
          label = messages.wallet.action.history.label.received;
          icon = iconReceived;
        }
        else if (tran.is_sent == 3) {
          cssLabel = "label-create";
          cssValue = "value-create";
          label = messages.wallet.action.history.label.create;
          icon = iconCreate;
        }

        return <div key={tran.transaction_no} className="row" onClick={() =>{this.detailTransaction(res)}}>
            <div className="col3">
              <div className="time">{tran.transaction_relative_time}</div>
              <div className={cssValue}>{tran.is_sent == 1 ? "-" : ""}{Number(tran.value)} ETH</div>
              {tran.is_error ? <div className="unconfirmation">{messages.wallet.action.history.label.failed}</div> : ""}
            </div>
            <div className="col1"><img className="iconDollar" src={icon} /></div>
            <div className="col2 address">
              <div className={cssLabel}>{label}</div>
              {
                tran.addresses.map((addr) => {
                  return <div key={addr}>{addr}</div>
                })
              }
            </div>
          </div>
      });
    }
  }

  closeDetail = () => {
    this.setState({ transaction_detail: null });
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  async detailTransaction(data){
    const wallet = this.props.wallet;
    if(wallet && data){
      if(wallet.name == "ETH") {
        let it = await wallet.getInternalTransactions(data.hash);
        if(it && it.length > 0) data["internal_transactions"] = it;
      }

      this.modalTransactionRef.open();
      this.showLoading();
      this.setState({transaction_detail: data});
      this.hideLoading();
    }
  }

  get detail_transaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    return (
      <Modal title={messages.wallet.action.transaction.header} onRef={modal => this.modalTransactionRef = modal} onClose={this.closeDetail}>
        <WalletTransaction wallet={wallet} transaction_detail={this.state.transaction_detail}  />
      </Modal>
    );
  }

  get load_balance(){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;
    return wallet ?
    (
      <div className="clear-fix">
        <div className="history-balance">
        {messages.wallet.action.history.label.balance}: {wallet.balance} {wallet.name}
          <br/>
          {messages.wallet.action.history.label.transactions}: {wallet.transaction_count}<br/>
          {wallet && wallet.name == "ETH" ?
            <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)}>{messages.wallet.action.history.label.view_all_etherscan}</a>
            : ""
          }
        </div>

          {wallet && wallet.name == "ETH" && (this.state.internalTransactions && this.state.internalTransactions.length > 0) ?
            <ul className="history-tab">
              <li className={this.state.tabActive == 0 ? "active" : ""} onClick={() => this.setState({tabActive: 0})}>{messages.wallet.action.history.label.transactions}</li>
              <li className={this.state.tabActive == 1 ? "active" : ""} onClick={() => this.setState({tabActive: 1})}>{messages.wallet.action.history.label.internal_transactions}</li>
            </ul>
            : <ul className="history-tab"></ul>
          }
      </div>
    ) : "";
  }

	render(){
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.load_balance}
        { this.state.tabActive == 1 ? this.list_internalTransaction : this.list_transaction }
      </div>
      <div className="historywallet-wrapper">
        {this.detail_transaction}
      </div>
    </div>
		);
	}
}

WalletHistory.propTypes = {
  wallet: PropTypes.any,
  transactions: PropTypes.array
};

const mapState = (state) => ({

});

const mapDispatch = ({
  showLoading,
  hideLoading,
});

export default injectIntl(connect(mapState, mapDispatch)(WalletHistory));
