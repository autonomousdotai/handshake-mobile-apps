import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addTransaction, updateTransaction, getFundAmount } from '@/reducers/invest/action';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import '../ProjectList.scss';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import HedgeFundAPI from '../contracts/HedgeFundAPI';
import { MasterWallet } from '../../../services/Wallets/MasterWallet';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import LoadingGif from '../loading.svg'; 
import createForm from '@/components/core/form/createForm';
import TransactionStorage from '../../../reducers/invest/transactions';
export const CRYPTO_ICONS = {
    ETH: iconEthereum,
    BTC: iconBitcoin,
    USDT: iconUsd,
  };
  
  
  const CRYPTO_CURRENCY_INVEST = {
    USDT: 'USDT',
    BTC: 'BTC',
    ETH: 'ETH',
  };
  const CRYPTO_CURRENCY_NAME = [
    'USDT',
    'BTC',
    'ETH',
  ];

  
const FormInvest = createForm({
    propsReduxForm: {
      form: 'FormInvest',
    },
  });
  
  const ModalBlock = (props) => (
    <div className='project-modal'>
      <div className='project-modal-content'>
        {props.children}
      </div>
    </div>
  );

class VoteStopBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isUserConfirmed: false,
        iSubmitted: false,
        estimateGasValue: null,
      }
      this.hedgeFundApi = new  HedgeFundAPI('latest', false);
      this.runTrx = null;
      this.trxStorage = new TransactionStorage(props.pid);
    }
  
    onFinishedTrx = (hash) => this.setState({
      isSubmitted: false,
      estimateGasValue: null,
      isUserConfirmed: false,
    })

  
    onSubmitVoteStop = async () => {
      this.setState({ isSubmitted: true });
      if (!this.props.pid) {
        alert('Project ID doesnt existed');
        return;
      }
      if (!MasterWallet.getWalletDefault()) {
        MasterWallet.createMasterWallets();
      }
      const wallets = MasterWallet.getWalletDefault();
      const { privateKey } = wallets.ETH || {};
      const { run, estimateGas } = await this.hedgeFundApi.voteStop(privateKey, '0x' + this.props.pid, 1) || {};
      const estimateGasValue = (await estimateGas() * await this.hedgeFundApi.getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
      this.setState({ estimateGasValue });
      this.runTrx = run;
    }
    handleConfirmTransaction = () => {
      this.setState({ isUserConfirmed: true });
      this.runTrx().on('transactionHash', (hash) => {
        this.props.addTransaction(this.props.pid, { hash, status: 'PENDING', type: 'VOTE', amount: this.state.investAmount });
        this.onFinishedTrx(hash);
      }).on('receipt', (receipt) => {
        const { transactionHash: hash } = receipt;
        const status = 'DONE';
        this.props.updateTransaction(this.trxStorage.getPid(), { hash, status });
        this.props.getFundAmount(this.trxStorage.getPid());
      }).on('error', err => console.log('err', err));
    }

    handleCancelTransaction = () => this.setState({ isSubmitted: false })

    render() {
      return (
        <div className="invest-button-form-block">
          <FormInvest>
            <Button disabled={this.state.iSubmitted} className="invest-submit-button" size="lg" onClick={this.onSubmitVoteStop}>Vote Stop</Button>{' '}
          </FormInvest>
          {this.state.isSubmitted && <ModalBlock>
            {!this.state.estimateGasValue &&
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={LoadingGif} style={{ width: '50px', height: '50px' }} />
              </div>}
            {this.state.estimateGasValue && <div>
              <div style={{ textAlign: 'center' }}>{`Do you want to vote to stop investing with ${this.props.trader}`}</div>
              <div style={{ textAlign: 'center' }}>{`ETH Fee: ${this.state.estimateGasValue}`}</div>
              <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleCancelTransaction}>No</button>
              <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleConfirmTransaction} disabled={this.state.isUserConfirmed}>Yes</button>
            </div>}
          </ModalBlock>}
        </div>
      )
    }
  }

  export default connect(null, { addTransaction, updateTransaction, getFundAmount }, null, { withRef: true })(VoteStopBlock);