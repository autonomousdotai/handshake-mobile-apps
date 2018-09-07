import React from 'react';
import { connect } from 'react-redux';
import iconExternalLink from '@/assets/images/icon/icon-external-link.svg';
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
import {Tabs} from 'rmc-tabs';

import 'rmc-tabs/assets/index.css';

import imgNoTrans from '@/assets/images/wallet/images/no-transaction.svg';
import iconLoadding from '@/assets/images/icon/loading.gif';
import needBackupWhite from '@/assets/images/wallet/icons/icon-need-backup-white.svg';

const TAB = {
  Transaction: 0,
  Internal: 1
}

class WalletHistory extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

	constructor(props) {

    super(props);
    this.state = {
      transactions: [],
      internalTransactions: [],
      transaction_detail: null,
      tabActive: TAB.Transaction,
      wallet: this.props.wallet,
      pagenoTran: 1,
      pagenoIT: 1,
    };
  }

  getSessionStore(wallet, tab){
    let result = false;
    if(wallet){
      let key = `${wallet.name}_${tab}_${wallet.address}`;
      let data = window.sessionStorage.getItem(key);

      try{
        if(data){
          result = JSON.parse(data);
        }
      }
      catch(e){

      }
    }

    return result;
  }

  setSessionStore(wallet, tab, data){
    let result = false;
    if(wallet && data){
      let key = `${wallet.name}_${tab}_${wallet.address}`;
      window.sessionStorage.setItem(key, JSON.stringify(data));
    }
  }

  async componentDidMount(){
    let wallet = this.state.wallet;
    let pagenoTran = 0, pagenoIT = 0, transactions = [], internalTransactions = [];

    let cTransaction = this.getSessionStore(wallet, TAB.Transaction),
      cInternalTransactions = this.getSessionStore(wallet, TAB.Internal);

    if(cTransaction && cInternalTransactions){
      internalTransactions = cInternalTransactions && cInternalTransactions.length > 0 ? cInternalTransactions : [];
      transactions = cTransaction && cTransaction.length > 0 ? cTransaction : [];
    }
    else{
      wallet.isLoading = true;
    }

    this.setState({wallet: wallet, transactions: transactions, internalTransactions: internalTransactions}, () => {
      this.getNoTransactionYet();
    });

    if(wallet && wallet.name != 'XRP'){
      wallet.balance = await wallet.getBalance();
      wallet.transaction_count = await wallet.getTransactionCount();

      transactions = await wallet.getTransactionHistory(pagenoTran);
      this.setSessionStore(wallet, TAB.Transaction, transactions);

      if(Number(transactions.length) < 20) pagenoTran = 0;
      if(transactions.length > wallet.transaction_count) wallet.transaction_count = transactions.length;

      internalTransactions = await wallet.listInternalTransactions(pagenoIT);
      this.setSessionStore(wallet, TAB.Internal, internalTransactions);

      if(Number(internalTransactions.length) < 20) pagenoIT = 0;
      if(internalTransactions.length > wallet.transaction_count) wallet.transaction_count = transactions.length;

      wallet.isLoading = false;
    }
    else{
      wallet.isHistorySupport = false;
      wallet.isLoading = false;
    }

    this.setState({
      wallet: wallet,
      transactions: transactions,
      internalTransactions: internalTransactions,
      pagenoTran: pagenoTran,
      pagenoIT: pagenoIT
    });
  }

  getNoTransactionYet(text){
    const wallet = this.props.wallet;

    return <div className="history-no-trans">
      {wallet && !wallet.isLoading ?
        <div>
          <img src={imgNoTrans} />
          <div className="header-history-tx">{text}</div>
        </div>
        : <img className="icon-loading-history" src={iconLoadding} />}
    </div>
  }

  get list_transaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    if (wallet && !this.state.transactions.length)
      return this.getNoTransactionYet(messages.wallet.action.history.label.no_trans);
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
            <div className="col2 history-address">
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

    if (wallet && !this.state.internalTransactions.length)
      return this.getNoTransactionYet(messages.wallet.action.history.label.no_internal_trans);
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
            <div className="col2 history-address">
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
      if(wallet.name == "ETH" || wallet.isToken) {
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
      <Modal customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle} title={messages.wallet.action.transaction.header} onRef={modal => this.modalTransactionRef = modal} onClose={this.closeDetail}>
        <WalletTransaction wallet={wallet} transaction_detail={this.state.transaction_detail}  />
      </Modal>
    );
  }

  get load_balance(){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;
    if (wallet){
      var logo = require("@/assets/images/wallet/icons/coins/" + wallet.icon);
      try { logo = require("@/assets/images/wallet/icons/coins/" + wallet.getCoinLogo());} catch (e){};
    }

    return wallet ?
    (
      <div className="clear-fix">
        <div className="wallet-detail">
          <div><img className="logo-detail" src={logo}/></div>
          <div className="balance">{wallet.balance} {wallet.name}</div>

          <div className="box-button">
            {!wallet.isCollectibles ? <div>
              <div className="bt1"><button onClick={this.props.onTransferClick}>Send</button></div>
              <div className="bt2"><button onClick={this.props.onReceiveClick}>Receive</button></div>
            </div>
            : <div className="bt"><button onClick={this.props.onReceiveClick}>Receive</button></div>
            }
          </div>

          {/*wallet.transaction_count > 0 &&
            <div className="header-history-tx">
              <div className="float-left">{wallet.transaction_count} {messages.wallet.action.history.label.transactions}</div>
              {wallet && (wallet.name == "ETH" || wallet.isToken) &&
                <div className="float-right">
                  <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)}>{messages.wallet.action.history.label.view_all_etherscan}</a>
                  <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)} className="ml-1"><img width="18px" src={iconExternalLink} /></a>
                </div>
              }
            </div>
          */}

          {!wallet.protected &&
            <div className="box-warning" onClick={this.props.onWarningClick}>
            {messages.wallet.action.protect.text.need_backup} <img src={needBackupWhite} />
            </div>
          }
        </div>



        {/* <div className="history-balance">
          {messages.wallet.action.history.label.transactions}: {wallet.transaction_count}<br/>
          {wallet && wallet.name == "ETH" ?
            <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)}>{messages.wallet.action.history.label.view_all_etherscan}</a>
            : ""
          }
        </div> */}

          {/* {wallet && wallet.name == "ETH" && (this.state.internalTransactions && this.state.internalTransactions.length > 0) ?

            <ul className="history-tab">
              <li className={this.state.tabActive == 0 ? "active" : ""} onClick={() => this.setState({tabActive: 0})}>{messages.wallet.action.history.label.transactions}</li>
              <li className={this.state.tabActive == 1 ? "active" : ""} onClick={() => this.setState({tabActive: 1})}>{messages.wallet.action.history.label.internal_transactions}</li>
            </ul>
            : <ul className="history-tab"></ul>
          } */}
      </div>
    ) : "";
  }

	render(){
    const wallet = this.state.wallet;
    const { messages } = this.props.intl;
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.load_balance}

        {/* Not support render */}
        {wallet && wallet.isHistorySupport === false ?
          this.getNoTransactionYet(messages.wallet.action.history.label.coming_soon)
        :
          <div className="history-content">
            {wallet && (wallet.name == "ETH" || wallet.isToken) && (this.state.internalTransactions && this.state.internalTransactions.length > 0) ?
            <Tabs onChange={(tab, index) => this.setState({tabActive: index})} tabs={[
                { key: 't1', title: messages.wallet.action.history.label.transactions},
                { key: 't2', title: messages.wallet.action.history.label.internal_transactions},
              ]} initalPage={'t1'}
              >
              <div key="t1">{this.list_internalTransaction}</div>
              <div key="t2">{this.list_transaction}</div>
            </Tabs>
            :
            this.state.tabActive == 0 ? this.list_transaction : this.list_internalTransaction }

          </div>
        }

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
