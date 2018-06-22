import React from 'react';
import { connect } from 'react-redux';
import {Ethereum} from '@/models/Ethereum.js'
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import './Wallet.scss';
import WalletTransaction from './WalletTransaction';
import { showLoading, hideLoading } from '@/reducers/app/action';
import Modal from '@/components/core/controls/Modal';

const moment = require('moment');

class WalletHistory extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      transactions: this.props.transactions,
      transaction_detail: null
    };
  }

  componentDidUpdate(){
    const {transactions} = this.props
    if (transactions != this.state.transactions){
      this.setState({transactions: transactions});
    }
  }

  cooked_transaction(data){
    const wallet = this.props.wallet;

    if(wallet.name == "ETH"){//for ETH json
      let value = 0, transaction_date = new Date(), addresses = [],
      is_sent = true, is_error = false;

      try{
        value = Number(data.value / 1000000000000000000);
        transaction_date = new Date(data.timeStamp*1000);
        is_sent = String(data.from).toLowerCase() == wallet.address.toLowerCase();
        is_error = Boolean(data.isError == "1");
      }
      catch(e){
        console.error(e);
      }

      let cssLabel = `label-${is_sent ? "sent" : "received"}`,
          cssValue = `value-${is_sent ? "sent" : "received"}`;

      let addr = data.from;
      if(is_sent) addr = data.to;
      addresses.push(addr.replace(addr.substr(4, 34), '...'));

      return {
        value: value,
        transaction_no: data.hash,
        transaction_date: transaction_date,
        transaction_relative_time:  moment(transaction_date).fromNow(),
        addresses: addresses,
        is_sent: is_sent,
        is_error: is_error,
        cssLabel: cssLabel,
        cssValue: cssValue
      };
    }
    else{//for BTC json
      let vin = data.vin, vout = data.vout,
        is_sent = false, value = 0, cssLabel = "", cssValue = "",
        addresses = [], confirmations = data.confirmations,
        transaction_date = data.time ? new Date(data.time*1000) : "";

      try{
        //check transactions are send
        for(let tin of vin){
          if(tin.addr.toLowerCase() == wallet.address.toLowerCase()){
            is_sent = true;

            for(let tout of vout){
              if(tout.scriptPubKey.addresses){
                let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();
                if(tout_addresses.indexOf(wallet.address.toLowerCase()) < 0){
                  value += Number(tout.value);
                  addresses.push(tout_addresses.replace(tout_addresses.substr(4, 26), '...'));
                }
              }

            }

            break;
          }
        }

        //check transactions are receive
        if(!is_sent){
          for(let tout of vout){
            if(tout.scriptPubKey.addresses){
              let tout_addresses = tout.scriptPubKey.addresses.join(" ").toLowerCase();
              if(tout_addresses.indexOf(wallet.address.toLowerCase()) >= 0){
                value += tout.value;
              }
              else{
                addresses.push(tout_addresses.replace(tout_addresses.substr(4, 26), '...'));
              }
            }
          }
        }

        cssLabel = `label-${is_sent ? "sent" : "received"}`;
        cssValue = `value-${is_sent ? "sent" : "received"}`;
      }
      catch(e){
        console.error(e);
      }

      return {
        value: value,
        transaction_no: data.txid,
        transaction_date: transaction_date,
        addresses: addresses,
        transaction_relative_time:  transaction_date ? moment(transaction_date).fromNow() : "",
        confirmations: confirmations,
        is_sent: is_sent,
        cssLabel: cssLabel,
        cssValue: cssValue
      };
    }
  }

  get list_transaction() {
    const wallet = this.props.wallet;
    if (wallet && this.state.transactions.length==0)
      return <div className="history-no-trans">No transactions yet</div>;

      return this.state.transactions.map((res) => {
        let tran = this.cooked_transaction(res);
        return (
        <div key={tran.transaction_no} className="row" onClick={() =>{this.show_transaction(res)}}>
          <div className="col3">
            <div className="time">{tran.transaction_relative_time}</div>
            <div className={tran.cssValue}>{tran.is_sent ? "-" : ""} {Number(tran.value)} {wallet.name}</div>
            {tran.confirmations <= 0 ? <div className="unconfirmation">Unconfirmed</div> : ""}
            {tran.is_error ? <div className="unconfirmation">Failed</div> : ""}
          </div>
          <div className="col1"><img className="iconDollar" src={tran.is_sent ? iconSent : iconReceived} /></div>
          <div className="col2 address">
            <div className={tran.cssLabel}>{tran.is_sent ? "Sent" : "Received"}</div>
            {
              tran.addresses.map((addr) => {
                return <div key={addr}>{addr}</div>
              })
            }
          </div>

        </div>)
      });
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

  async show_transaction(data){
    const wallet = this.props.wallet;
    if(wallet && data){
      this.modalTransactionRef.open();
      this.showLoading();
      this.setState({transaction_detail: data});
      this.hideLoading();
    }
  }

  get detail_transaction() {
    const wallet = this.props.wallet;

    return (
      <Modal title="Transaction details" onRef={modal => this.modalTransactionRef = modal} onClose={this.closeDetail}>
        <WalletTransaction wallet={wallet} transaction_detail={this.state.transaction_detail}  />
      </Modal>
    );
  }

  get load_balance(){
    const wallet = this.props.wallet;
    return wallet ?
    (
      <div className="history-balance">
        Balance: {wallet.balance} {wallet.name}
        <br/>
        Transactions: {wallet.transaction_count}
      </div>
    ) : "";
  }

	render(){
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.load_balance}
        {this.list_transaction}
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

export default connect(mapState, mapDispatch)(WalletHistory);
