import React from 'react';
import PropTypes from 'prop-types';
// style
import './ModalDialog.scss';

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
    // bind
    this.open = ::this.open;
    this.close = ::this.close;
    this.onClosePanel = ::this.onClosePanel;
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  onClosePanel() {
    if (this.props.isDismiss) {
      this.close();
    }
  }

  open() {
    this.modalRef && this.modalRef.classList.add('modal-custom-show');
    this.contentRef && this.contentRef.classList.add('zoomIn');
    this.currentOffset = window.scrollY;
    document.body.classList.add('hide-scroll');
    const freezeStyle = `height: 100%; position: fixed`;
    document.body.setAttribute('style', freezeStyle);
  }

  close() {
    this.modalRef && this.modalRef.classList.remove('modal-custom-show');
    this.contentRef && this.contentRef.classList.remove('zoomIn');
    document.body.classList.remove('hide-scroll');
    document.body.removeAttribute('style');
    window.scrollTo(0, this.currentOffset);
    if (this.props.hasOwnProperty('onClose')) this.props.onClose();
  }

  render() {
    const { title, children, className, close } = this.props;
    return (
      <div className={`modal modal-dialog-custom ${className || ''}`} ref={modal => this.modalRef = modal}>
        <div className="modal-backdrop show"/>
        <div className="position" onClick={this.onClosePanel}>
          <div
            className="modal-dialog-content animated"
            onClick={e => e.stopPropagation()}
            ref={content => this.contentRef = content}
          >
            {
              close && (
                <div className="close" onClick={this.onClosePanel}>
                  <span className="closeIcon">×</span>
                </div>
              )
            }
            {
              title && (
              <div className="modal-custom-header">
                <p className="modal-custom-title">{title}</p>
              </div>
              )
            }
            <div className="modal-custom-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalDialog.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func,
  isDismiss: PropTypes.bool,
  close: PropTypes.bool,
};

ModalDialog.defaultProps = {
  isDismiss: true,
  close: false,
};

export default ModalDialog;
