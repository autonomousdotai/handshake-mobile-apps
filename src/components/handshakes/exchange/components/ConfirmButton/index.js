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
    const { disabled, validate, onFirstClick } = this.props;
    e.preventDefault();
    if (typeof onFirstClick === 'function') {
      onFirstClick();
    }
    if (!disabled) {
      if (typeof validate === 'function') {
        if (validate()) {
          this.modal.open();
        }
      } else {
        this.modal.open();
      }
    }
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
    const { disabled, message, confirmText, cancelText, onFirstClick, containerClassName, buttonClassName, label, intl: { messages } } = this.props;
    return (
      <div className={`confirm-btn-container ${containerClassName}`}>
        <button disabled={disabled && !onFirstClick} className={`btn btn-warning confirm-btn ${buttonClassName}`} onClick={this.onClick}>{label}</button>
        <ModalDialog onRef={modal => { this.modal = modal; }}>
          <div className="confirm-btn-content">
            <span className="confirm-btn-desc">{message || messages.create.atm.confirm_button.desc}</span>
            <div className="confirm-btn-container">
              <button onClick={this.onConfirm} className="confirm-btn-ok">{confirmText || messages.create.atm.confirm_button.confirm}</button>
              <button onClick={this.onCancel} className="confirm-btn-cancel">{cancelText || messages.create.atm.confirm_button.cancel}</button>
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
  validate: null,
  onFirstClick: null,
  containerClassName: '',
  buttonClassName: '',
  message: null,
  confirmText: null,
  cancelText: null,
  disabled: false,
};

ConfirmButton.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  validate: PropTypes.func,
  onFirstClick: PropTypes.func,
  intl: PropTypes.object.isRequired,
  buttonClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
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
  disabled: PropTypes.bool,
};

export default injectIntl(ConfirmButton);
