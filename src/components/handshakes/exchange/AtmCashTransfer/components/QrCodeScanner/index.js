/* eslint camelcase:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React, { Component } from 'react';
import Modal from '@/components/core/controls/Modal';
import QrReader from 'react-qr-reader';
import BrowserDetect from '@/services/browser-detect';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

class QrCodeScanner extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      legacyMode: false,
    };

    this.modalScanQrCodeRef = null;
    this.qrScanner = React.createRef();

    // binding
    this.open = :: this.open;
    this.onCloseModal = :: this.onCloseModal;
  }

  componentDidMount() {
    this.checkLegacyMode();
  }

  onCloseModal() {
    // reset state
    this.setState({
      visible: false,
      legacyMode: false,
    });
  }

  checkLegacyMode() {
    const legacyMode = (BrowserDetect.isChrome && BrowserDetect.isIphone); // show choose file or take photo
    this.setState({ legacyMode });
  }

  open() {
    this.setState({ visible: true }, () => this.modalScanQrCodeRef?.open());
  }

  openImageDialog = () => {
    this.qrScanner?.current?.openImageDialog();
  }

  handleScan = (data) => {
    if (data) {
      // callback
      const { onData } = this.props;
      if (typeof onData === 'function') {
        onData(data);
      }

      // close this modal
      this.modalScanQrCodeRef?.close();
      this.setState({ visible: false });
    }
  }

  render() {
    const { messages: { atm_cash_transfer } } = this.props.intl;
    return (
      <Modal onClose={this.onCloseModal} title={atm_cash_transfer.scan_qr_code} onRef={modal => { this.modalScanQrCodeRef = modal; }}>
        {this.state.visible || this.state.legacyMode ?
          <QrReader
            ref={this.qrScanner}
            delay={300}
            onScan={(data) => { this.handleScan(data); }}
            onError={console.error}
            style={{ width: '100%', height: '100%' }}
            legacyMode={this.state.legacyMode}
            showViewFinder={false}
          /> : ''
        }
      </Modal>
    );
  }
}

QrCodeScanner.propTypes = {
  onData: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(QrCodeScanner, { withRef: true });
