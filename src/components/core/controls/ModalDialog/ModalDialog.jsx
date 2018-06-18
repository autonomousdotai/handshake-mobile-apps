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

  open() {
    this.modalRef && this.modalRef.classList.add('modal-custom-show');
    this.contentRef && this.contentRef.classList.add('zoomIn');
    document.body.classList.add('hide-scroll');
  }

  close() {
    this.modalRef && this.modalRef.classList.remove('modal-custom-show');
    this.contentRef && this.contentRef.classList.remove('zoomIn');
    document.body.classList.remove('hide-scroll');
  }

  onClosePanel() {
    if (this.props.isDismiss) {
      this.close();
    }
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }


  render() {
    const { title, children, className } = this.props;
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
};

ModalDialog.defaultProps = {
  isDismiss: true,
};

export default ModalDialog;
