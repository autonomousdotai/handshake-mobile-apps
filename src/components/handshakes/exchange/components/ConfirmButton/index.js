import React, { PureComponent } from 'react';
import ModalDialog from '@/components/core/controls/ModalDialog';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './styles.scss';

class ConfirmButton extends PureComponent {
  constructor() {
    super();

    this.modal = null;
    this.onClick = :: this.onClick;
    this.onCancel = :: this.onCancel;
    this.onConfirm = :: this.onConfirm;
  }

  onClick(e) {
    e.preventDefault();
    this.modal.open();
  }

  onConfirm() {
    const { onConfirm } = this.props;
    if (typeof onConfirm === 'function') {
      onConfirm();
    }

    this.modal.close();
  }

  onCancel(e) {
    e.preventDefault();
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }

    this.modal.close();
  }

  render() {
    const { message, confirmText, cancelText, containerClassName, buttonClassName, label, intl: { messages } } = this.props;
    return (
      <div className={`confirm-btn-container ${containerClassName}`}>
        <button className={`btn btn-warning confirm-btn ${buttonClassName}`} onClick={this.onClick}>{label}</button>
        <ModalDialog onRef={modal => { this.modal = modal; }}>
          <div className="confirm-btn-content">
            <span className="confirm-btn-desc">{message || messages.create.atm.confirm_button.desc}</span>
            <div className="confirm-btn-container">
              <button onClick={this.onCancel} className="confirm-btn-cancel">{cancelText || messages.create.atm.confirm_button.cancel}</button>
              <button onClick={this.onConfirm} className="confirm-btn-ok">{confirmText || messages.create.atm.confirm_button.confirm}</button>
            </div>
          </div>
        </ModalDialog>
      </div>
    );
  }
}

ConfirmButton.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
  containerClassName: '',
  buttonClassName: '',
  message: null,
  confirmText: null,
  cancelText: null,
};

ConfirmButton.propTypes = {
  label: PropTypes.string.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  intl: PropTypes.object.isRequired,
  buttonClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  message: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  confirmText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  cancelText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
};

export default injectIntl(ConfirmButton);
