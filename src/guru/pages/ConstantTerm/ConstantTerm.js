import React from 'react';
import { PropTypes } from 'prop-types';
import qs from 'querystring';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { getAddress } from '@/utils/helpers';
import AppBar from '@/guru/components/AppBar/AppBar';
import ModalDialog from '@/components/core/controls/ModalDialog';
import OuttaMoney from '@/assets/images/modal/outtamoney.png';
import { showAlert } from '@/reducers/app/action';

import Button from '@/components/core/controls/Button';

import {
  getEstimateGas,
  getBalance
} from '@/components/handshakes/betting/utils.js';

import {
  updateApproveConstant
} from './action';

import {
  currentContractSelector,
  constantTokenSelector
} from './selector';

import './styles.scss';

class ConstantTerm extends React.Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      constantToken: PropTypes.object,
      currentContract: PropTypes.object
    };

    static defaultProps = {
      constantToken: undefined,
      currentContract: undefined
    };

    constructor(props) {
      super(props);
      this.state = {
        estimatedGas: 0,
        balance: 0,
        statusPermission: undefined
      };
    }

    async componentDidMount() {
      const estimatedGas = await getEstimateGas();
      const params = this.getParams(this.props);
      const { status } = params;
      const balance = await getBalance();
      this.setState({
        estimatedGas,
        balance,
        statusPermission: status
      });
    }

    getParams = ({ queryStringURL }) => qs.parse(queryStringURL.slice(1));


    handleSubmitAgree = async () => {
      const { constantToken, currentContract } = this.props;
      const handler = BetHandshakeHandler.getShareManager();
      console.log('Current Contract:', currentContract, 'constantToken:', constantToken);
      const contractName = currentContract.json_name;
      const contractAddress = currentContract.contract_address;
      const constantContractAddress = constantToken.contract_address;
      console.log('Contract Name:', contractName, 'contractAddress:', contractAddress, 'constantContractAddress:', constantContractAddress);
      const result = await handler.allowConstant(contractName, contractAddress, constantContractAddress);
      const { hash } = result;
      if (hash !== -1) {
        console.log('Hash:', hash);
        const payload = {
          address: getAddress(),
          hash,
          token_id: '1'
        };
        this.props.dispatch(updateApproveConstant(payload));

        const message = 'Your transaction will appear on etherscan.io in about 30 seconds.';
        this.alertBox({ message, type: 'success' });
      }
    }


    handleAgreeClick = () => {
      console.log('handleAgreeClick');
      const { estimatedGas, balance } = this.state;
      if (estimatedGas < balance) {
        // TO DO: call contract
        this.handleSubmitAgree();
      } else {
        this.modalOuttaMoney.open();
      }
    }

    alertBox = ({ message, type, timeOut = 3000, callBack = () => {} }) => {
      const { dispatch } = this.props;
      const alertProps = {
        timeOut,
        type,
        callBack,
        message: <div className="text-center">{message}</div>
      };
      dispatch(showAlert(alertProps));
    };

    renderAppBar = props => {
      return (
        <AppBar>
          <span
            className="IconLeft BackAction"
            onClick={() => {
                props.history.go(-1);
              }}
          >
            <i className="far fa-angle-left" />
          </span>
          <span className="Title">Term of Constant</span>
        </AppBar>
      );
    };

    renderOuttaMoney = () => {
      return (
        <ModalDialog
          onRef={modal => {
              this.modalOuttaMoney = modal;
            }}
          className="outtaMoneyModal"
          close
        >
          <div className="outtaMoneyContainer">
            <img src={OuttaMoney} alt="" />
            <div className="outtaMoneyTitle">You're outta… money!</div>
            <div className="outtaMoneyMsg">
                To keep forecasting, you’ll need to top-up your wallet.
            </div>
          </div>
        </ModalDialog>
      );
    };

    renderProgressing = (status) => {
      if (status === undefined) return;
      let message = null;
      if (status === -1) message = 'Your transaction is in progressing. Please comeback later';
      // eslint-disable-next-line consistent-return
      return (
        <div className="ConstantProgressing">{message}</div>
      );
    }
    renderAgreeButton = (status) => {
      if (status === -1) return;
      // eslint-disable-next-line consistent-return
      return (
        <div className="NotifiyWrapperButtons">
          <Button className="agreeBtn" onClick={this.handleAgreeClick}>Yes, I agree</Button>
        </div>
      );
    }

    renderNotifiConstant = (props) => {
      const { estimatedGas, statusPermission } = this.state;
      return (
        <div className="ConstantTermContainer">
          <div className="NotifiyDescription">You can place a bet or create event free in CONSTANT. We need your permission and it may take about {estimatedGas} ETH at first time.</div>
          {this.renderAgreeButton(statusPermission)}
          {this.renderProgressing(statusPermission)}
        </div>
      );
    }

    render() {
      return (
        <React.Fragment>
          {this.renderAppBar(this.props)}
          {this.renderNotifiConstant(this.props)}
          {this.renderOuttaMoney()}
        </React.Fragment>

      );
    }
}
export default injectIntl(connect(
  (state) => {
    return {
      constantToken: constantTokenSelector(state),
      currentContract: currentContractSelector(state)
    };
  },
)(ConstantTerm));
