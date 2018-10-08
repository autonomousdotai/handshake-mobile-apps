import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { MasterWallet } from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import iconQRCodeBlack from '@/assets/images/wallet/icons/icon-qrcode-black.svg';
import iconQRCodeWhite from '@/assets/images/wallet/icons/icon-qrcode-white.svg';
import iconSelected from '@/assets/images/pages/payment/check-circle-solid.svg';
import './ListCoin.scss';

const QRCode = require('qrcode.react');

class ListCoin extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    walletSelected: PropTypes.any,
    wallets: PropTypes.any,
    crypto: PropTypes.string,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    wallets: null,
    walletSelected: null,
    crypto: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalQRCode: ''
    }
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 5000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  async componentDidMount() {
    let { walletSelected, wallets, crypto } = this.props;
    this.showLoading();
    if(!wallets){
      wallets = await this.getWallets();
    }

    this.setState({wallets, walletSelected}, ()=> {this.hideLoading() });
  }

  getWallets = () => {
    const { crypto } = this.props;
    return new Promise(async (resolve, reject) => {
      let wallets = crypto ? await MasterWallet.getWallets(crypto) : await MasterWallet.getMasterWallet();

      // set name + text for list:
      let listWalletCoin = [];
      if (wallets.length > 0){
        for(let wal of wallets){
          if(!wal.isCollectibles){
            wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
            if (process.env.isLive){
              wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
            }
            wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;

            wal.balance = wal.formatNumber(await wal.getBalance());
            listWalletCoin.push(wal);
          }
        }

        resolve(listWalletCoin);
      }
    });
  }

  getMessage(str){
    const { messages } = this.props.intl;

    let result = "";
    try{
      result = eval(str);
    }
    catch(e){
      console.error(e);
    }

    return result;
  }

  selectCoin = (wallet) => {
    const { onSelect } = this.props;

    if (onSelect) {
      onSelect(wallet);
    }
  }

  onClose = () => {
    this.setState({modalQRCode: ''});
    this.modalQRCodeRef.close();
  }

  openQRCode=(wallet)=>{
    this.setState({
      modalQRCode: <div className="qrBox">
          <p className="address">{wallet.address}</p>
          <div className="div-qr-code">
            <QRCode size={250} value={wallet.address} />
          </div>
          <Button className="btn-dark btn" block={true} onClick={()=> this.onClose() }>Close</Button>
        </div>
      }, ()=> this.modalQRCodeRef.open());
  }

  get showListCoin(){
    const { wallets, walletSelected } = this.state;
    if(wallets){
      return wallets.map(e => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + e.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};
        let isLive = e.network === MasterWallet.ListCoin[e.className].Network.Mainnet;
        let isSelected = walletSelected && e.network == walletSelected.network && e.address == walletSelected.address && e.name == walletSelected.name;

        return <div className={"coinName " + (!isLive && " test") + (isSelected ? " selected" : "")} key={e.name+e.network+e.address}>
            <div className="row">
              <div className="col-2 icon" onClick={()=> this.selectCoin(e)}><img src={isSelected ? iconSelected : icon} /></div>
              <div className="col-5" onClick={()=> this.selectCoin(e)}>
                <div className="name">{e.title}</div>
                <div className="address">{e.getShortAddress()}</div>
              </div>
              <div className="col-5 text-right pr-3">
                <div className="balance" onClick={()=> this.selectCoin(e)}>{e.balance} {e.name}</div>
                <div className="qrcode"><img src={isSelected ? iconQRCodeWhite : iconQRCodeBlack}  onClick={()=> this.openQRCode(e)} /></div>
              </div>
            </div>
          </div>
        }
      );
    }
  }

  render() {

    const { messages } = this.props.intl;
    const { modalQRCode } = this.state;
    return (      
      <div className="listCoin">
        {this.showListCoin}
        <ModalDialog className="qr-wrapper" onRef={modal => this.modalQRCodeRef = modal}>
          {modalQRCode}
        </ModalDialog>
      </div>
    )
  }
}



const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListCoin));
