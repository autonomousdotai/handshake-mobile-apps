import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import BrowserDetect from '@/services/browser-detect';
import { updateModal } from '@/reducers/app/action';
// components
import HeaderBar from '@/modules/HeaderBar/HeaderBar';
import MainHeader from '@/components/Header/MainHeader';
import Navigation from '@/components/core/controls/Navigation/NewNavigation';
import Alert from '@/components/core/presentation/Alert';
import Loading from '@/components/core/controls/Loading';
import WalletPasscode from '@/components/Wallet/WalletPasscode'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import QRCodeScan from '@/components/Wallet/QRCodeScan/QRCodeScan';

class MainLayout extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      app: this.props.app,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.app.showHeader !== prevState.app.showHeader) {
      return { app: nextProps.app };
    }
    return null;
  }

  handleToggleModal = () => {
    this.props.updateModal({ show: false });
  }

  renderHeaderBar = () => {
    const { isDesktop } = BrowserDetect;
    const headerBarProps = {
      className: 'HeaderBarContainer',
      titleBar: 'Prediction',
    };
    if (isDesktop) return null;
    return (
      <HeaderBar {...headerBarProps} />
    );
  }

  renderNavigation = (props) => {
    const { isDesktop } = BrowserDetect;
    const { name } = (window.name !== '' && JSON.parse(window.name));
    if (isDesktop || name) return null;
    return (
      <Navigation location={props.location} />
    );
  }

  render() {
    const isDesktop = BrowserDetect.isDesktop;
    const { modal: { className, show, body, title, centered } } = this.props;
    return (
      <div className={`${isDesktop ? '' : 'app'} ${this.state.app.showHeader ? 'show-header' : 'hide-header'}`}>
        {(window.self !== window.top) && this.renderHeaderBar()}
        <MainHeader />
        <div className="content">
          {this.props.children}
        </div>
        {this.renderNavigation(this.props)}
        <Alert />
        <Loading />
        <WalletPasscode />
        <QRCodeScan />
        <Modal isOpen={show} toggle={this.handleToggleModal} className={className} centered={centered}>
          {title && <ModalHeader toggle={this.handleToggleModal}>{title}</ModalHeader>}
          <ModalBody>
            {body}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapState = (state) => ({
  app: state.app,
  modal: state.app.modal,
});

const mapDispatch = ({
  updateModal
});

export default connect(mapState, mapDispatch)(MainLayout);
