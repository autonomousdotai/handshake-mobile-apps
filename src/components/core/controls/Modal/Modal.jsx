import React from 'react';
import PropTypes from 'prop-types';
// component
import Image from '@/components/core/presentation/Image';
// style
import './Modal.scss';
import BackChevronSVG from '@/assets/images/icon/back-chevron.svg';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    // bind
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);    
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }

  open() {
    this.modalRef && this.modalRef.classList.add('modal-custom-show');
  }

  close() {
    this.modalRef && this.modalRef.classList.remove('modal-custom-show');
    if (this.props.hasOwnProperty('onClose')) this.props.onClose();
  }

  render() {
    
    let customBackIcon = this.props.customBackIcon || BackChevronSVG;    
    let modalHeaderStyle = this.props.modalHeaderStyle || {};
    let modalBodyStyle = this.props.modalBodyStyle || {};
    let customRightIcon = this.props.customRightIcon;
        
    
    const { title, children, hideBackButton } = this.props;
    return (
      <div className="modal" ref={modal => this.modalRef = modal}>
        <div className="modal-custom-header" style={modalHeaderStyle}>
          {
            !hideBackButton && <Image src={customBackIcon} onClick={this.close} alt="back"/>
          }
          {
            title && (<p className="modal-custom-title">{title}</p>)
          }
          {
             customRightIcon && <Image className="iconRight" src={customRightIcon} onClick={this.props.customRightIconClick}/>
          }
          
        </div>
        <div className="modal-custom-body" style={modalBodyStyle}>
          {children}
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func,
  onClose: PropTypes.func,
  hideBackButton: PropTypes.bool,

  // custom style:
  customBackIcon: PropTypes.any,// default gray icon: `BackChevronSVG`
  modalHeaderStyle: PropTypes.object, // Modal header style:  {color, background, icon:white/gray}
  modalBodyStyle: PropTypes.object, // Modal Body style.

  // right icon + action
  customRightIcon: PropTypes.any,
  customRightIconClick: PropTypes.func,
};

export default Modal;
