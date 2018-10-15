import React from 'react';
import { connect } from 'react-redux';
import iconSelf from '@/assets/images/icon/icon-self.svg';
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconCreate from '@/assets/images/icon/icon-create.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Wallet.scss';
import { HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS } from '@/constants';

const moment = require('moment');

class WalletTransaction extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

	constructor(props) {

    super(props);
    this.state = {
      wallet: props.wallet,
      transaction_detail: props.transaction_detail
    };
  }

  async componentDidUpdate(){
    const {transaction_detail}  = this.props;
    if (transaction_detail != this.state.transaction_detail){
      this.setState({transaction_detail: transaction_detail });
    }
  }

  cooked_transaction(data){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;
    let result = {};

    if(wallet && data){
      if(wallet.name == "ETH"){
        let gas_gwei = 0, gas_price = 0, tx_fee = 0, status = "";
        try{
          if(data.gasPrice){
            gas_gwei = Number(data.gasPrice) / 1000000000;
            if(10- gas_gwei.toFixed(0).length >= 0)
              gas_price = Number(gas_gwei / 1000000000).toFixed(10- gas_gwei.toFixed(0).length);
            else
              gas_price = Number(gas_gwei / 1000000000);
            tx_fee = Number(Number(data.gasUsed) * gas_gwei / 1000000000);
          }

          if(data.pending){
            status = messages.wallet.action.history.label.pending;
          }
          else{
            if(data.txreceipt_status) {
              status = Number(data.txreceipt_status) > 0 ? messages.wallet.action.history.label.success : messages.wallet.action.history.label.failed;
            }
            else {
              if(data.txreceipt_status == undefined) {
                if(data.isError == "1") {
                  status = messages.wallet.action.history.label.error;
                }
                else {
                  status = messages.wallet.action.history.label.success;
                }
              }
            }
          }

          result = {
            header: {
              value: Number(data.value / 1000000000000000000),
              coin: wallet.name,
              confirmations: data.confirmations,
              status: status
            },
            body: {
              hash: data.hash,
              block: data.blockNumber,
              from: data.from,
              to: data.to,
              internal_transactions: data.internal_transactions,
              gas: data.gas,
            }
          };

          if(data.is_sent != undefined) {
            result.header['is_sent'] = data.is_sent;
          }
          else {
            let is_sent = 3;
            if(data.from == data.to) {
              is_sent = 0;
            }
            else if(data.from == wallet.address.toLowerCase()) {
              is_sent = 1;
            }
            else if(data.to == wallet.address.toLowerCase()) {
              is_sent = 2;
            }

            result.header['is_sent'] = is_sent;
          }

          if(gas_price) result.body['gas_price'] = `${gas_price} Ether (${gas_gwei} Gwei)`;
          if(tx_fee) result.body['tx_fee'] = tx_fee + " Ether";
          result.body['gas_used'] = data.gasUsed;
          if(data.nonce != undefined) result.body['nonce'] = data.nonce;
          if(data.transactionIndex) result.body['transaction_index'] = data.transactionIndex;
          if(data.input) result.body['input'] = data.input;
        }
        catch(e){
          console.error(e);
        }
      }
      else{
        let is_sent = 0, value = 0;

        try{
          result = {
            header: {
              coin: "BTC",
              confirmations: data.confirmations,
              is_sent: data.is_sent
            },
            body: {
              transaction: data.txid,
              size: data.size,
              received_time: moment(data.time).format('llll'),
              mined_time: moment(data.blocktime).format('llll'),
              block_hash: data.blockhash,
              fees: data.fees + " BTC",
            }
          };

          for(let i in data.vin){

            let no = Number(i) + 1;
            result.body["from_addr_"+no] = (data.vin[i].addr ? data.vin[i].addr : "Unparsed address")+ " " + data.vin[i].value + " BTC";
            value += Number(data.vin[i].value);
          }

          for(let i in data.vout){
            let no = Number(i) + 1;
            result.body["to_addr_"+no] = (data.vout[i].scriptPubKey.addresses ? data.vout[i].scriptPubKey.addresses.join(" ") : "Unparsed address") + " " + data.vout[i].value + " BTC";
          }

          result.header.value = value;
        }
        catch(e){
          console.error(e);
        }
      }

      return result;
    }

    return false;
  }

  get detail_transaction() {
    const { messages } = this.props.intl;
    const { wallet } = this.props;
    let detail = this.cooked_transaction(this.state.transaction_detail);
    let css_status = detail && detail.header ? "status-" + detail.header.status : "";
    let icon = iconSelf;
    if(detail && detail.header && detail.header.is_sent == 1) {
      icon = iconSent;
    }
    else if (detail && detail.header && detail.header.is_sent == 2) {
      icon = iconReceived;
    }
    else if (detail && detail.header && detail.header.is_sent == 3) {
      icon = iconCreate;
    }

    return detail ?
    (
      <div className="transaction-detail-wrapper" >
        <div className="col1"><img className="iconDollar" src={icon} /></div>
        <div className="col2">
          {detail.header.value} {detail.header.coin}<br />
          <span>{moment(detail.timeStamp).format('llll')}</span>
        </div>
        {
          detail.header.coin == "ETH" &&
            <div className="url"><a target="_blank" href={""+wallet.getAPIUrlTransaction(detail.body.hash)}>{messages.wallet.action.history.label.detail_etherscan}</a></div>
        }
        {
          detail.header.coin == "BTC" &&
            <div className="url"><a target="_blank" href={""+wallet.getAPIUrlTransaction(detail.body.transaction)}>{messages.wallet.action.history.label.detail_blockchaininfo}</a></div>
        }
        <div className="confirmation">
          {
            detail.header.status ? <div className={css_status.toLowerCase()}>{messages.wallet.action.history.label.status} {detail.header.status}</div> : ""
          }
          {
            detail.header.confirmations || detail.header.confirmations == 0 ? <div>{detail.header.confirmations} {messages.wallet.action.history.label.confirmations}</div>
            : ""
          }
        </div>

        {
          Object.keys(detail.body).map((char) => {console.log('')
            let val = detail.body[char] ? detail.body[char] : "";

            return (
              char == "internal_transactions" ?
                (val.length > 0 ?
                  <div className="body" key={char}>
                    <div className="key">{char.replace(/_/g, " ")}</div>
                    <div className="value">
                    {
                      val.map(e => {
                        return <div key={Math.random()} className="value-it">
                          <span className="text-secondary">{messages.wallet.action.history.label.transfer}</span> {e.amount} ETH
                          <span className="text-secondary"> {messages.wallet.action.history.label.from}</span> {e.from}
                          <span className="text-secondary"> {messages.wallet.action.history.label.to}</span> {e.to}
                        </div>
                      })
                    }
                    </div>
                  </div>
                : "")
              :
                <div className="body" key={char}>
                  <div className="key">{char.replace(/_/g, " ")}</div>
                  <div className="value">{val}</div>
                </div>
            )
          })
        }
      </div>
    )
    : "";
  }

	render(){
		return (
      <div>
        {this.detail_transaction}
      </div>
		);
	}
}

WalletTransaction.propTypes = {
  transaction_detail: PropTypes.any
};

const mapState = (state) => ({

});

const mapDispatch = ({
});

export default injectIntl(connect(mapState, mapDispatch)(WalletTransaction));
