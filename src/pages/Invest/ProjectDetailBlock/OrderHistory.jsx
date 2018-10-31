import React from 'react';
import { connect } from 'react-redux';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
import { fetchTransactions } from '@/reducers/invest/action';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 2) + '..'+ str.substring(str.length-2, str.length);

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.props.fetchTransactions(props.pid);
        console.log('oreder history contruactor', props);
    }

    render() {
        console.log('rerender', this.props);
        if (this.props.transactions.length === 0) return null;
        return (<React.Fragment>
            <div style={{ marginLeft: '20px' }}><label htmlFor="amountfield" className="fund-label">Order History</label></div>
            <div className="trxHistory">
                <div className="trxHistory-row">
                <div className="trxHistory-row-left fund-label-row-header">Trx</div>
                <div className="trxHistory-row-mid fund-label-row-header">Type</div>
                <div className="trxHistory-row-mid fund-label-row-header">Amount</div>
                <div className="trxHistory-row-right fund-label-row-header">Status</div>
                </div>
                {this.props.transactions.map((e, i) => (
                <div key={i} className="trxHistory-row">
                    <div className="trxHistory-row-left">
                    <a target='_blank' href={linkToEtherScan(e.hash)}>{transformString(e.hash)}</a>
                    </div>
                    <div className="trxHistory-row-mid fund-label-row">{e.type|| ''}</div>
                    <div className="trxHistory-row-mid fund-label-row">{e.amount || ''}</div>
                    <div className="trxHistory-row-right fund-label-row" style={{ color: e.status==='PENDING' ? 'red' : 'green' }}>{e.status}</div>
                </div>
                ))}
            </div>
        </React.Fragment>)
    }
}

const mapState = (state, p) => ({
    transactions: state.invest && state.invest.transactions ? state.invest.transactions : [],
    ...p
});

const mapDispatch = { fetchTransactions }

export default connect(mapState, mapDispatch)(OrderHistory)