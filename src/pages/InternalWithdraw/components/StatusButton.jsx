
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { API_URL } from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import { completeWithdraw } from '@/reducers/internalWithdraw/action';
import './StatusButton.scss';


class StatusButton extends Component {
  static STATUS = {
    OPEN: 'processing',
    SENT: 'processed',
  };

  constructor() {
    super();
    this.state = {
      transactionID: '',
      isValid: false,
    };
    this.modal = null;
    this.onClickOpen = :: this.onClickOpen;
    this.handleChange = ::this.handleChange;
    this.onCompleteWithdraw = ::this.onCompleteWithdraw;
    this.handleSuccess = ::this.handleSuccess;
  }

  onClickOpen() {
    const { status } = this.props;
    if (status === StatusButton.STATUS.OPEN) {
      this.modal.open();

      // set styles
      document.body.style.position = 'relative';
    }
  }

  async onCompleteWithdraw() {
    const { withdrawId } = this.props;
    await this.props.completeWithdraw({
      PATH_URL: `${API_URL.INTERNAL.COMPLETE_WITHDRAW}/${withdrawId}`,
      METHOD: 'POST',
      data: { processed_id: this.state.transactionID },
      successFn: this.handleSuccess,
    });
  }

  validate() {
    const { transactionID } = this.state;
    if (transactionID.length < 5) {
      this.setState({ isValid: false });
    } else {
      this.setState({ isValid: true });
    }
  }

  handleSuccess() {
    this.modal.close();
  }

  handleChange(e) {
    this.validate();
    let value = String(e?.target?.value);
    value = value.replace(/ /g, '');
    this.setState({
      transactionID: value,
    });
  }

  render() {
    const { status } = this.props;
    const { isValid } = this.state;
    const text = status === StatusButton.STATUS.OPEN ? 'Open' : 'Sent';
    const className = status === StatusButton.STATUS.OPEN ? 'open' : 'sent';
    return (
      <React.Fragment>
        <button
          disabled={status === StatusButton.STATUS.SENT}
          className={`status-btn ${className}`}
          onClick={this.onClickOpen}
        >
          {text}
        </button>
        <ModalDialog className="internal-withdraw-modal" onRef={modal => { this.modal = modal; }}>
          <form className="input-form">
            <FormGroup
              controlId="formBasicText"
            >
              <ControlLabel>Please input Paypal transaction ID (required)</ControlLabel>
              <FormControl
                type="text"
                value={this.state.transactionID}
                placeholder="Transaction ID"
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
              <Button disabled={!isValid} className="submit-btn" bsStyle="primary" onClick={this.onCompleteWithdraw}>OK</Button>
            </FormGroup>
          </form>
        </ModalDialog>
      </React.Fragment>
    );
  }
}

StatusButton.propTypes = {
  status: PropTypes.oneOf(Object.values(StatusButton.STATUS)).isRequired,
  withdrawId: PropTypes.string.isRequired,
  completeWithdraw: PropTypes.func.isRequired,
};

export default connect(null, ({ completeWithdraw }))(StatusButton);
