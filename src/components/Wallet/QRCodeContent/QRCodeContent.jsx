import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";

import Button from '@/components/core/controls/Button';

import ModalDialog from '@/components/core/controls/ModalDialog';

import './QRCodeContent.scss';
import { showAlert, hideQRCodeContent } from '@/reducers/app/action';

import { MasterWallet } from '@/services/Wallets/MasterWallet';


window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));


class QRCodeContent extends React.Component {
  
  static propTypes = {
    app: PropTypes.object,  
    onFinish: PropTypes.func,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    

    this.state = {   
      isShow: false,                      
      title: "text",      
      content: "",
      data: null,
      onTransfer: null,      
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

  // console.log (MasterWallet.getQRCodeDetail("bitcoin:2342342342342342?amount=234"));
  //   console.log (MasterWallet.getQRCodeDetail("ninja-redeem:2342342342342342?value=234"));
  //   console.log (MasterWallet.getQRCodeDetail("17h4HQEiJRkYNBk1XJK3YpDYZQ1rXkfQJi"));
  //   console.log (MasterWallet.getQRCodeDetail("https://ga.com"));
  //   console.log (MasterWallet.getQRCodeDetail("esfeswrewre"));

  componentWillReceiveProps(nextProps) { 

    let props = nextProps.app.qRCodeContentData || {};        
    
    if (props.isShow){   
      let data = props.data;
      if (data){
        let qrCodeType = data['type'];
        switch(qrCodeType) {
          case MasterWallet.QRCODE_TYPE.URL:
              this.setURLContent(data);
              break;
          case MasterWallet.QRCODE_TYPE.REDEEM:
              this.callBackRedeem(data.data);
              this.props.hideQRCodeContent();
              break;
              
              break;
          case MasterWallet.QRCODE_TYPE.TRANSFER:
              this.callBackTransfer(data.data);
              this.props.hideQRCodeContent();
              break;
          
          case MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS:
              this.setAddressContent(data);
              break;
          default:
              // unknow or text
              this.setTextContent(data);
              break;
        }
      }
    }
  }

  setRedeemContent(result){

  }
  
  setURLContent(result){
    let title = "Website";
    let url = result.data;
    const { messages } = this.props.intl;
    let content = (
      <div className={"box-qrcode-content"}>
        <div className="item">
          <img className="icon" style={{opacity: .7}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJqSURBVFhH7Zi7ahVRFEAvCCJa2Cgi2mlUNNiqhfjIH+QLFHwUaqtF1CTYqYGgnVpbh+hH+MIP8NFoJ/hGxSZxrRs2HIeZmxnunHubWbBI7snMPXvOY5896XV0dIyXHTiLL/Er/sH3+AiP4li5gD9xdYCPcQuOnDuYBvICF/E2LuEvjL85uptxZCxgdP4BT2CRnbiMcZ0jORJuYHT6BndhFRvwCXrtCmZfk1NoR3b4FgcFF3iNG8d7HtqQE9eSHX3HfTbU5CnGQ2XjANqJ3rKhAXfR+xzJbJzFCHDShgbcR+/73P+UiWsYAaZ5bRpn1n6t5DV63/P+p0xcQTv5hJtsAIP7i7a7u8twY8WDXbchFyfR4A71P/0fnD/9XGQ3fkSvcWNtx1bYj645p9WRO41O60GUOsGZXsyTMXrncGicjlcYXxo6ck2C24umlLjf429oXEORhFPrTKtrciOaiubwG8b9HotDk56tfvlNNBHbadmGSIMzeB8i7g992FY2RVqVOC17sEhVcE57WXBWNmUFRGMuYnxp1cE/KDhLqFN4Ga/iGZzAVrAS/oF2bCowJRSpCi6m1dSTjXmM0TtuQwmuxWJwrsmY1ks25CIqk/WOHxd6BCdbMR7Mac3GF7QTy/QmHMYI0DWXjSgi3cVNsNSKAFvbEGX4amgnvuDUxSMwNlbWykQsv+3oN/qCsx6moDi+TMKt5LlBHEM7U9++fMGponjwZy2bUnwVTIMsG0kTcZRM2srZWhdPgrR6cbpdk26ce1isbFqpSppinZeOZJn+e+M8jpUj+ADfoSnIF5xnaBm2DTs6OsZDr/cPf1TptIQu25IAAAAASUVORK5CYII=" />
          <div className="name"><label>{url}</label></div>          
        </div>
        <div className="item" onClick={()=>{window.open(url, '_blank');}}>
          <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFfSURBVGhD7Zm9SsRAHAeDioUgIoIogq2NjdjaWYrYKL6AD6GFxYG9pY2tKDY+gHa2PoGtYKfYCH6AOr/cCeG4NXtmd8nCf2DIbkKyTKqQLQzDMAYxitMJnMQozOAFvuJ3Ih9wD4NyiXr4Bz4n8AW13heuYxDG8A3fcV4nErGPijkpZwGYQj1QbyklG6h1z8pZACykIRbiwkIaYiEuLKQhFuLCQhpiIS4spCFJQ8ZxdQiX0JekIYuoa77eoi9JQ+bwrkbd1/qQOnbwE7MOqUZc9Y7ZhWzjb8QBrvXGWYX0R4jsQgZFiKxCXBEim5C/IkQWIXURovUhPhGiVSH6O17FN0Is4zUelzM/ooQ84Uo56zJMxH8JHjKBqSNE8JAqqSJEtJCUEWILg4e4IrTxo4/D0O7iDWq9DgbjFPsjFvAedT6WjziLwdBu7mZ3WDKCR6i9xRie4yEGjTAMw2gLRfEDjBVAygs87g0AAAAASUVORK5CYII=" />
          <div className="name"><label>Open Website</label></div>          
        </div>
        <div className="item" onClick={()=> {Clipboard.copy(url);this.showToast(messages.wallet.action.copy.message);}}>
          <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACuSURBVEhL7c0xCoNAEAXQPXaKnMAUqYMp0okewBN4IkkIpIjycYRFdnRmd4qE3Q+/+zPP/UVOl/uk6fn6GOg0LXg2fiZRsa3q9muCa+Hn622Da2FkF8dI01vTBzG/2K1hcX90FGyrujvEtz+DuBZenuzj2HElVg8jEjzUZBiJwU1gRIsnwVxD0LbYEauDuRSYa4HpPD4F5lpgOo9PnrC0xNrB9E6ePGGL0rtfjnMzL6TZzGCR4V8AAAAASUVORK5CYII=" />
          <div className="name"><label>Copy to clipboard</label></div>          
        </div>        
        <div className="item" onClick={this.modalScanQrCodeContentRef.close}>
            <img style={{opacity: .6}} className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVEhL7ZBBCoAwEAP7Cf+o6HM9+BvdoIEe6tJs21sHAkWaCTZNIqyW5T1KoIOuy265LadFGcFddNCF45f8Yu2I3FEKspzUFMNy4gma5aQk6iYnufD60k1OIKKYQ93kYOgARMOeKJdTWPoWwhM1j9QIwiNKUR6RC4bUOSzyLxv5CBwum0WRE3TQnSik9ADh1VZJAfi/HQAAAABJRU5ErkJggg==" />
            <div className="name"><label>Cancel</label></div> 
        </div>
      </div>
    );
    this.setState({title: title, content: content, isShow: true}, ()=>{
      this.modalScanQrCodeContentRef.open();
    })
  }
  setTextContent(result){
    let title = "Text";
    let text = result.text;
    const { messages } = this.props.intl;
    let content = (
      <div className={"box-qrcode-content"}>
        <div className="item">    
          {/* <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACZSURBVEhL7Y2xDYAwEAMzNgUTQMEAUNCyByOB6ABZ+gJFhCf+NFFykgtHeZ+rgKafLibtMK8ywYGRWHDTjctpkrPibT9sclYMTHKLGNByqxhQclYciszq4HMqqvgTX4wekyfoMqvjH1vIU4z+J2/gXWZ1QiMMeYrRY/IEXWZ1/GMLeYrR/+QNvMusTmiEoYo/KVOcMjJbNM7dlkMYXKQcUGAAAAAASUVORK5CYII=" />       */}
          <div className="name">{text}</div>          
        </div>        
        <div className="item" onClick={()=> {Clipboard.copy(text);this.showToast(messages.wallet.action.copy.message);}}>
          <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACuSURBVEhL7c0xCoNAEAXQPXaKnMAUqYMp0okewBN4IkkIpIjycYRFdnRmd4qE3Q+/+zPP/UVOl/uk6fn6GOg0LXg2fiZRsa3q9muCa+Hn622Da2FkF8dI01vTBzG/2K1hcX90FGyrujvEtz+DuBZenuzj2HElVg8jEjzUZBiJwU1gRIsnwVxD0LbYEauDuRSYa4HpPD4F5lpgOo9PnrC0xNrB9E6ePGGL0rtfjnMzL6TZzGCR4V8AAAAASUVORK5CYII=" />
          <div className="name"><label>Copy to clipboard</label></div>          
        </div>
        <div className="item" onClick={this.modalScanQrCodeContentRef.close}>
            <img style={{opacity: .6}} className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVEhL7ZBBCoAwEAP7Cf+o6HM9+BvdoIEe6tJs21sHAkWaCTZNIqyW5T1KoIOuy265LadFGcFddNCF45f8Yu2I3FEKspzUFMNy4gma5aQk6iYnufD60k1OIKKYQ93kYOgARMOeKJdTWPoWwhM1j9QIwiNKUR6RC4bUOSzyLxv5CBwum0WRE3TQnSik9ADh1VZJAfi/HQAAAABJRU5ErkJggg==" />
            <div className="name"><label>Cancel</label></div> 
        </div>
      </div>
    );
    this.setState({title: title, content: content, isShow: true}, ()=>{
      this.modalScanQrCodeContentRef.open();
    })
  }
  callBackRedeem=(dataRedeem)=>{    
    this.props.onRedeemClick(dataRedeem);
    this.modalScanQrCodeContentRef.close();
  }
  callBackTransfer=(dataAddress)=>{    
    this.props.onTransferClick(dataAddress);
    this.modalScanQrCodeContentRef.close();
  }
  setAddressContent(result){    
    const dataAddress = result.data;
   
    let title = dataAddress.name + " Address";
    let address = dataAddress.address;
    const { messages } = this.props.intl;
    
    let icon = require("@/assets/images/wallet/icons/coins/eth.svg");
    try{ icon = require("@/assets/images/wallet/icons/coins/" + dataAddress.symbol.toLowerCase() + ".svg" );} catch (e){};

    let content = (
      <div className={"box-qrcode-content"}>
        <div className="item">          
          <img className="icon" src={icon} />
          <div className="name short">{address}</div>
        </div>          
        
        <div className="item" onClick={()=>{this.callBackTransfer(dataAddress);}}>
          <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGySURBVEhL7dVJLwNhHMfxWoOIfScO7iKxhMS+XBBnB2uIJQhnXoAgHOxxcHIUYgsRy8nyDhy9Ft9fHyOjnYmWmZ58k0/67yTNtM88Mw3852NZn68xqRQLeMKBDvhZCeZxj1MMYAtd8LxizOEOZxhEBmpQjWckwpOKMItbnGMYmbBqh369TvznZS7EDHSyC4zAadO0QV8iDsvoRNQVYBo62SVGkQ23aqFNpZOqFySY8efyMYUbXGEMOfipMui6WmmZ983oXh4moJNdYxy5iLQ09JjxqxV0mNG9brxD1/A3aSeHpt0c0TLrW69Cy1uhAxGkzwyZ8Vu61ntmjLxK6AGwhGQdcEnXtNeMYekH6JaKunhMQsvVrAMhWQ8Ht6LazU7p3j3CIazNZj0c3KrDrhn/np61+hXaRCmw7lOn1tBqRm9KxQmagu+c0xd6hS6Vp2npdd2Tgu/C0zJvm9H79AhdNGNY62gxo/dpGR8Req/7tsz2qqA/DXv12DSjv2n39psx2Aac7nnPS4eW1vrv1e3m6zLb68MOGhCTZbZ3jAc0Bt/FMP1ZvCFmy2yv/PP1P4cCgQ9v3zlbObfqVgAAAABJRU5ErkJggg=="/>
          <div className="name"><label>Send payment to this address</label></div>          
        </div>
        
        <div className="item" onClick={()=> {Clipboard.copy(address);this.showToast(messages.wallet.action.copy.message);}}>
          <img className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACuSURBVEhL7c0xCoNAEAXQPXaKnMAUqYMp0okewBN4IkkIpIjycYRFdnRmd4qE3Q+/+zPP/UVOl/uk6fn6GOg0LXg2fiZRsa3q9muCa+Hn622Da2FkF8dI01vTBzG/2K1hcX90FGyrujvEtz+DuBZenuzj2HElVg8jEjzUZBiJwU1gRIsnwVxD0LbYEauDuRSYa4HpPD4F5lpgOo9PnrC0xNrB9E6ePGGL0rtfjnMzL6TZzGCR4V8AAAAASUVORK5CYII=" />
          <div className="name"><label>Copy to clipboard</label></div>          
        </div>
        <div className="item" onClick={this.modalScanQrCodeContentRef.close}>
            <img style={{opacity: .6}} className="icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVEhL7ZBBCoAwEAP7Cf+o6HM9+BvdoIEe6tJs21sHAkWaCTZNIqyW5T1KoIOuy265LadFGcFddNCF45f8Yu2I3FEKspzUFMNy4gma5aQk6iYnufD60k1OIKKYQ93kYOgARMOeKJdTWPoWwhM1j9QIwiNKUR6RC4bUOSzyLxv5CBwum0WRE3TQnSik9ADh1VZJAfi/HQAAAABJRU5ErkJggg==" />
            <div className="name"><label>Cancel</label></div> 
        </div>
      </div>
    );
    this.setState({title: title, content: content, isShow: true}, ()=>{
      this.modalScanQrCodeContentRef.open();
    })
  }


  componentDidMount() {    
    
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

oncloseQrData=() => {   
  this.setState({ isShow: false, onTransfer: null, data: null, content: '' }, () => {
    this.props.hideQRCodeContent();
  });    
}

render() {  
  
  const { messages } = this.props.intl;
  
  {/* QR code dialog content */}
  return (        
        <ModalDialog onClose={() => this.oncloseQrData()} title={this.state.title} onRef={modal => this.modalScanQrCodeContentRef = modal} >
          {this.state.isShow && this.state.content}            
        </ModalDialog>    
    )
  }
}

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  showAlert, hideQRCodeContent
});

export default injectIntl(connect(mapState, mapDispatch)(QRCodeContent));