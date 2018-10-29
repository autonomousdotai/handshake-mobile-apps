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

class FormInvestBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
        investAmount: 0,
        isUserConfirmed: false,
        iSubmitted: false,
        estimateGasValue: null,
        txHashs: [],
      }
      this.hedgeFundApi = new  HedgeFundAPI('latest', false);
      this.runTrx = null;
      this.trxStorage = new TransactionStorage(props.pid);
    }
  
    onFinishedTrx = (hash) => this.setState({
      isSubmitted: false,
      estimateGasValue: null,
      investAmount: 0,
      isUserConfirmed: false,
      txHashs: [...this.state.txHashs, { hash, status: 'Pending' }]
    })

    onChangeAmount = (e) => this.setState({ investAmount: e.target.value })
  
    onSubmitInvest = async () => {
      this.setState({ isSubmitted: true });
      if (!this.props.pid) {
        alert('Project ID doesnt existed');
        return;
      }
      if (!MasterWallet.getWalletDefault()) {
        MasterWallet.createMasterWallets();
      }
      const wallets = MasterWallet.getWalletDefault();
      const { balance, privateKey } = wallets.ETH || {};
      const investAmount = Number(this.state.investAmount);
      const totalBalance = Number(balance);
      if (investAmount === 0) {
        alert('Can not invest amount = 0');
        this.setState({ isSubmitted: false });
        return;
      }
      if (totalBalance <= investAmount) {
        alert(`You dont have enough eth. Please invest amount less than ${balance}`);
        this.setState({ isSubmitted: false });
        return;
      }
      const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x' + this.props.pid) || {};
      const estimateGasValue = (await estimateGas() * await this.hedgeFundApi.getCurrentGasPrice() * 1e-18).toFixed(6) + ' ETH';
      this.setState({ estimateGasValue });
      this.runTrx = run;
    }
    handleConfirmTransaction = () => {
      this.setState({ isUserConfirmed: true });
      this.runTrx().on('transactionHash', (hash) => {
        this.props.addTransaction(this.props.pid, { hash, status: 'PENDING', type: 'SEND', amount: this.state.investAmount });
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
            <label htmlFor="amountfield" className="fund-label">Amount to invest</label>
            <InputGroup className="inputGroupInvestButton">
              <Input value={this.state.investAmount} onChange={this.onChangeAmount} placeholder="Enter Quantity" type="number" className="inputGroupInvestField" />
              <InputGroupAddon addonType="append"className="inputGroupInvestIcon"><img src={CRYPTO_ICONS[CRYPTO_CURRENCY_NAME[0]]} width={24} alt="icon" /></InputGroupAddon>
            </InputGroup>
            <Button disabled={this.state.iSubmitted} className="invest-submit-button" size="lg" onClick={this.onSubmitInvest}>Invest now</Button>{' '}
          </FormInvest>
          {this.state.isSubmitted && <ModalBlock>
            {!this.state.estimateGasValue &&
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={LoadingGif} style={{ width: '50px', height: '50px' }} />
              </div>}
            {this.state.estimateGasValue && <div>
              <div style={{ textAlign: 'center' }}>{`Congrats! Please say “Yes” to invest with ${this.props.trader}`}</div>
              <div style={{ textAlign: 'center' }}>{`ETH Fee: ${this.state.estimateGasValue}`}</div>
              <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleCancelTransaction}>No</button>
              <button style={{ margin: '5%', display: 'inline-block', width: '40%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleConfirmTransaction} disabled={this.state.isUserConfirmed}>Yes</button>
            </div>}
          </ModalBlock>}
        </div>
      )
    }
  }

  export default connect(null, { addTransaction, updateTransaction, getFundAmount }, null, { withRef: true })(FormInvestBlock);