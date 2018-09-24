import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";

import Button from '@/components/core/controls/Button';

import Modal from '@/components/core/controls/Modal';

import QrReader from 'react-qr-reader';

import { hideScanQRCode } from '@/reducers/app/action';

import './QRCodeScan.scss';

import BrowserDetect from '@/services/browser-detect';
import BackChevronSVGWhite from '@/assets/images/icon/back-chevron-white.svg';

class QRCodeScan extends React.Component {
  
  static propTypes = {
    app: PropTypes.object,  
    onFinish: PropTypes.func,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {   
      isShow: false,                
      delay: 300,            
      data: '',      
      legacyMode: false,
      onFinish: null,
    }
  }

  componentWillReceiveProps(nextProps) {     
    let props = nextProps.app.scanQRCodeData || {};
    if (props.isShow){      
       this.openQrcode(props);
    }
  }

  componentDidMount() {
    let legacyMode = (BrowserDetect.isChrome && BrowserDetect.isIphone); // show choose file or take photo
    this.setState({legacyMode: legacyMode});                
  }  


  onFinish = (data) => {
    const { onFinish } = this.state;
    
    if (onFinish) {
      onFinish(data);
      this.modalScanQrCodeMainRef.close();
    }
    else{

    }
    
    
  }   

// For Qrcode:
handleScan=(data) =>{  
  if(data){
    this.onFinish(data);
  }
}

handleError(err) {
  console.log('error scan qrcode: ', err);
}

oncloseQrCode=() => {  
  this.setState({ isShow: false, onFinish: null }, () => {
    this.props.hideScanQRCode();
  });  
  
}

openQrcode = (props) => {
  if (!this.state.legacyMode){
    this.setState({ isShow: true, onFinish: props.onFinish });
    this.modalScanQrCodeMainRef.open();
  }
  else{
    this.setState({ onFinish: props.onFinish });
    this.openImageDialog();
  }
}
openImageDialog = () => {
  this.refs.qrReaderScan.openImageDialog();
}

render() {  
  
  const { messages } = this.props.intl;    
  
  {/* QR code dialog */}
  return (        
        <Modal onClose={() => this.oncloseQrCode()} title={messages.wallet.action.transfer.label.scan_qrcode} onRef={modal => this.modalScanQrCodeMainRef = modal} customBackIcon={BackChevronSVGWhite} modalHeaderStyle={{color: "#fff", background: "#546FF7"}} modalBodyStyle={{"padding": 0}} >
          {this.state.isShow || this.state.legacyMode ?
            <QrReader
              ref="qrReaderScan"
              delay={this.state.delay}
              onScan={(data) => { this.handleScan(data); }}
              onError={this.handleError}
              style={{ width: '100%', height: '100%' }}
              legacyMode={this.state.legacyMode}
              showViewFinder={false}
            />
            : ''}
        </Modal>    
    )
  }
}

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  hideScanQRCode,
});

export default injectIntl(connect(mapState, mapDispatch)(QRCodeScan));