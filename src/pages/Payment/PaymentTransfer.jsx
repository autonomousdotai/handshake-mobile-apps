import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import TransferToken from '@/components/Wallet/TransferToken';

import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField';
import { change, clearFields } from 'redux-form';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import Complete from './Complete';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import qs from 'querystring';


class PaymentTransfer extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      msgError: '',
      modalTransfer: '',
      modalComplete: '',
      fullBackUrl: ''
    };
  }

  componentDidMount() {
    this.getTokenData();
  }

  async getTokenData() {
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    let { to:toAddress, amount, gas_limit:gasLimit , order_id, data, confirm_url } = this.querystringParsed;

    if (!toAddress && !amount && !data) {
      this.showModalError("Missing parameters");
      return;
    }

    let fullBackUrl = `${confirm_url}?order_id=${order_id}&status=0`;
    this.setState({
      fullBackUrl: fullBackUrl,
      modalTransfer: <TransferToken
        coinName="ETH"
        toAddress={toAddress}
        amount={amount}
        gasLimit={gasLimit}
        data={data}
        onFinish={result => { this.successTransfer(result); }}
      />
      }, () => {
        this.modalTransferRef.open();
      }
    );
  }

  cancelTransfer = () => {
    if(this.state.fullBackUrl && this.state.modalTransfer){
      window.location.href = this.state.fullBackUrl;
    }
  }

  successTransfer = (data) => {
    this.setState({
      modalComplete: <Complete
        data={data}
      />,
      modalTransferRef: ''
      }, () => {
        this.modalCompleteRef.open();
      }
    );
  }

  showModalError = (msg) => {
    this.setState({msgError: msg}, ()=> {
      this.modalErrorRef.open();
    });
  }


  render = () => {
    const { messages } = this.props.intl;
    const { modalTransfer, modalComplete } = this.state;

    return (
      <div className="wallet-transfer">

        <Modal title="Transfer Token" onRef={modal => this.modalTransferRef = modal}  onClose={() => this.cancelTransfer()}>
          {modalTransfer}
        </Modal>

        <Modal title="Error" onRef={modal => this.modalErrorRef = modal}>
          <div className="msg-error">{this.state.msgError}</div>
        </Modal>

        <ModalDialog className="complete-wrapper" title="Payment complete" onRef={modal => this.modalCompleteRef = modal}>
          {modalComplete}
        </ModalDialog>

      </div>
    );
  }
}

const mapState = (state) => ({

});

const mapDispatch = ({
  showAlert,
  showLoading,
  hideLoading,
  change,
  clearFields,
});


export default injectIntl(withRouter(PaymentTransfer));
