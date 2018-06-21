import React from 'react';
import { connect } from 'react-redux';
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import './Wallet.scss';

const _ = require('lodash');
const moment = require('moment');

class WalletTransaction extends React.Component {
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
    if(wallet && data){
      if(wallet.name == "ETH"){
        let gas_gwei = 0, gas_price = 0, tx_fee = 0;

        try{
          gas_gwei = Number(data.gasPrice) / 1000000000;
          gas_price = Number(gas_gwei / 1000000000).toFixed(10- gas_gwei.toString().length);
          tx_fee = Number(Number(data.gasUsed) * gas_gwei / 1000000000);
        }
        catch(e){
          console.error(e);
        }

        return {
          header: {
            value: Number(data.value / 1000000000000000000),
            coin: wallet.name,
            confirmations: data.confirmations,
            is_sent: wallet.address.toLowerCase() == String(data.from).toLowerCase(),
            status: Number(data.txreceipt_status) > 0 ? "success" : "failed"
          },
          body: {
            hash: data.hash,
            block: data.blockNumber,
            from: data.from,
            to: data.to,
            gas: data.gas,
            gas_price: `${gas_price} Ether (${gas_gwei} Gwei)` ,
            tx_fee: tx_fee + " Ether",
            gas_used: data.gasUsed,
            nouce: data.nouce,
            transaction_index: data.transactionIndex,
            input: data.input
          }
        };
      }
      else{
        let result = {}, is_sent = false, value = 0;

        result = {
          header: {
            coin: "BTC",
            confirmations: data.confirmations
          },
          body: {
            size: data.size,
            received_time: moment(data.time).format('llll'),
            mined_time: moment(data.blocktime).format('llll'),
            block_hash: data.blockhash,
            fees: data.fees + " BTC",
          }
        };

        for(let i in data.vin){
          if(String(data.vin[i].addr).toLowerCase() == wallet.address.toLowerCase())
            is_sent = true;

          let no = Number(i) + 1;
          result.body["from_addr_"+no] = data.vin[i].addr + " " + data.vin[i].value + " BTC";
          value += Number(data.vin[i].value);
        }

        for(let i in data.vout){
          let no = Number(i) + 1;
          result.body["to_addr_"+no] = data.vout[i].scriptPubKey.addresses.join(" ") + " " + data.vout[i].value + " BTC";
        }

        result.header.value = value;
        result.header.is_sent = is_sent;

        return result;
      }
    }

    return false;
  }

  get detail_transaction() {
    let detail = this.cooked_transaction(this.state.transaction_detail);
    let css_status = detail ? "status-" + detail.header.status : "";

    return detail ?
    (
      <div className="transaction-detail-wrapper" >
        <div className="col1"><img className="iconDollar" src={detail.header.is_sent ? iconSent : iconReceived} /></div>
        <div className="col2">
          {detail.header.value} {detail.header.coin}<br />
          <span>{moment(detail.timeStamp).format('llll')}</span>
        </div>
        <div className="confirmation">
          {
            detail.header.status ? <div className={css_status}>Status {detail.header.status}</div> : ""
          }
          <div>{detail.header.confirmations} confirmations</div>
        </div>

        {
          Object.keys(detail.body).map((char) => {
            return (
              <div className="body" key={char }>
                <div className="key">{_.startCase(_.camelCase(char))}</div>
                <div className="value">{detail.body[char]}</div>
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

export default connect(mapState, mapDispatch)(WalletTransaction);
