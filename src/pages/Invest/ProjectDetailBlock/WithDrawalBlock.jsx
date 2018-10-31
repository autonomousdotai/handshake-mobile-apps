import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withdrawFund, addTransaction, updateTransaction, getFundAmount } from '@/reducers/invest/action';
import '../ProjectList.scss';
import LoadingGif from '../loading.svg';
import TransactionStorage from '../../../reducers/invest/transactions';
import HedgeFundAPI from '../contracts/HedgeFundAPI';
const ModalBlock = (props) => (
  <div className='project-modal'>
    <div className='project-modal-content'>
      {props.children}
    </div>
  </div>
);

class WithDrawalBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserConfirmed: false,
      isSubmitted: false,
      estimateGasValue: null,
    }
    this.runTrx = null;
    this.trxStorage = new TransactionStorage(props.pid);
    this.hedgeFundApi = new  HedgeFundAPI('latest', false);
  }

  onFinishedTrx = (hash) => this.setState({
    isSubmitted: false,
    estimateGasValue: null,
    isUserConfirmed: false,
  })

  onSubmitWithDrawal = async () => {
    this.setState({ isSubmitted: true });
    if (!this.props.pid) {
      alert('Project ID doesnt existed');
      return;
    }
    const { run, estimateGas } = await withdrawFund(this.props.pid)() || {};
    const estimateGasValue = (await estimateGas() * await this.hedgeFundApi.getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
    this.setState({ estimateGasValue });
    this.runTrx = run;
  }
  handleConfirmTransaction = () => {
    this.setState({ isUserConfirmed: true });
    this.runTrx().on('transactionHash', (hash) => {
      this.props.addTransaction(this.props.pid, { hash, status: 'PENDING', type: 'WITHDRAW', amount: this.props.fundAmount });
      this.onFinishedTrx(hash);
    }).on('receipt', (receipt) => {
      console.log(receipt);
      this.props.updateTransaction(this.trxStorage.getPid(), { hash: receipt.transactionHash, status: 'DONE' });
      this.props.getFundAmount(this.trxStorage.getPid());
    }).on('error', err => console.log('err', err));
  }
  handleCancelTransaction = () => this.setState({ isSubmitted: false })

  render() {
    return (
      <div className="invest-button-form-block">
        {this.state.isSubmitted && <ModalBlock>
          {!this.state.estimateGasValue &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={LoadingGif} style={{ width: '50px', height: '50px' }} />
            </div>}
          {this.state.estimateGasValue && <div>
            <div style={{ textAlign: 'center' }}>{`Do you want to vote to stop investing with ${this.props.trader}`}</div>
            <div style={{ textAlign: 'center' }}>{`ETH Fee: ${this.state.estimateGasValue}`}</div>
            <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleCancelTransaction}>No</button>
            <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleConfirmTransaction} disabled={this.state.isUserConfirmed} >Yes</button>
          </div>}
        </ModalBlock>}
      </div>
    )
  }
}


export default connect(null, { addTransaction, updateTransaction, getFundAmount }, null, { withRef: true })(WithDrawalBlock);