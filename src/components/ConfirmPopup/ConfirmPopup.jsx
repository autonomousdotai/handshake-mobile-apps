import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ConfirmPopup.scss';

class ConfirmPopup extends Component {
  static propTypes = {
    cancelButtonClick: PropTypes.func,
    okButtonClick: PropTypes.func,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    cancelButtonTitle: PropTypes.string.isRequired,
    okButtonTitle: PropTypes.string.isRequired,
  }
  static defaultProps = {
  }
  render() {
    const { title, content, cancelButtonTitle, okButtonTitle } = this.props;
    return (
      <div className="wrapperConfirm">
        <div className="title">{title}</div>
        <div className="content">{content}</div>
        <div className="wrapperButton">
          <button
            className="btn okButton"
            onClick={() => this.props.okButtonClick()}
          >
            {okButtonTitle}
          </button>
          <button
            className="btn cancelButton"
            onClick={() => this.props.cancelButtonClick()}
          >
            {cancelButtonTitle}
          </button>
        </div>
      </div>
    );
  }
}
export default ConfirmPopup;

