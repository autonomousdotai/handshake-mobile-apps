import axios from 'axios';
import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { showLoading, hideLoading, showAlert, showScanQRCode, showQRCodeContent } from '@/reducers/app/action';
import QRCodeContent from '@/components/Wallet/QRCodeContent';
import '../WalletPreferences/WalletPreferences.scss';

import './AddressBook.scss';

import iconAvatar from '@/assets/images/icon/avatar.svg';

import { ICON } from '@/styles/images';

import Modal from '@/components/core/controls/Modal';

import { MasterWallet } from '@/services/Wallets/MasterWallet';

import Input from '../Input';

import iconSearch from '@/assets/images/icon/ic_search.svg';


function validateEmail(email) {  
  const re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
}


class AddressBook extends React.Component {
  constructor(props) {
    super(props);    

    this.state = {      
      listAddressBook: [],
      contactSelected: false,  
      
      needChoice: this.props.needChoice || false,
      
      // add new contact:
      newContract: {name: "", email: "", address: {address: '', symbol: "", name: ''}}
    }
  }

  componentDidMount(){    
    this.props.onRef(this)
    let listAddressBook = MasterWallet.readContacts();
    console.log("listAddressBook", listAddressBook);
    this.setState({listAddressBook});
  }    
  componentWillUnmount() {
    this.props.onRef(undefined)
  }      
  
  onFinish(item){
    this.props.onSelected (item);    
  }

  openContact=(item)=>{
    if (this.state.needChoice){
      this.onFinish(item);
      return;
    }
    this.setState({contactSelected: item}, ()=>{
      this.modalAddressBookDetailRef.open();
    })
  }

  openAddNewContact=()=>{
    this.setState({newContract: {"name": '', email: '', address: {address: '', symbol: "", name: ''}}}, ()=>{
      this.modaAddNewContactRef.open();
    });    
  }
  onContactNameChange=(evt)=>{
    let value = evt.target.value;
    let newContract = this.state.newContract;
    newContract.name = value;
    this.setState({newContract});
  }
  onContactEmailChange=(evt)=>{
    let value = evt.target.value;
    let newContract = this.state.newContract;
    newContract.email = value;
    this.setState({newContract});
    
  }
  onContactAddressChange=(evt)=>{
    let value = evt.target.value;
    
    let newContract = this.state.newContract;    

    if (value.toString().length > 30){
      let qrCodeResult = MasterWallet.getQRCodeDetail(value);          
      if (qrCodeResult && Object.keys(qrCodeResult.data).length !== 0 ){
        
        if (qrCodeResult['type'] == MasterWallet.QRCODE_TYPE.TRANSFER || qrCodeResult['type'] == MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS){                      
            newContract.address = qrCodeResult.data;
            this.setState({newContract});
        }
      }
      else{
        newContract.address = {address: value, name: '', symbol: ''};
        this.setState({newContract});
      }
    }
    else{
      newContract.address = {address: value, name: '', symbol: ''};
      this.setState({newContract});
    }    
  }
  onAddNewContactClick=()=>{
    if (this.state.newContract.name && this.state.newContract.address.address){
      let result = MasterWallet.addContact(this.state.newContract);
      if (result != true){
        this.showError(result);
      }      
      else{
        let listAddressBook = MasterWallet.readContacts();
        this.setState({listAddressBook}, ()=>{
          this.modaAddNewContactRef.close();          
        })
      }
    }
  }

  onRemoveContactClick=()=>{
    console.log(this.state.contactSelected);
    if (this.state.contactSelected){
      MasterWallet.removeContact(this.state.contactSelected);
      let listAddressBook = MasterWallet.readContacts();
        this.setState({listAddressBook}, ()=>{
          this.modalAddressBookDetailRef.close();          
        })
    }
    else{
      console.log("no sellect item");
    }
  }

  onQRCodeScaned=(data)=>{    
    let qrCodeResult = MasterWallet.getQRCodeDetail(data);    
    if (qrCodeResult && Object.keys(qrCodeResult.data).length !== 0 ){
      let dataType = qrCodeResult['type'];
      if (dataType == MasterWallet.QRCODE_TYPE.TRANSFER || dataType == MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS){            
            let newContract = this.state.newContract;
            newContract.address = qrCodeResult.data;            
            this.setState({newContract});
      }      
      else{
        this.showError("Crytor address not found");
      }
    }
  }

  onSearchChange=(evt)=>{
   
    let filter = evt.target.value.toUpperCase();

    let ul = document.getElementById("lst-address-book");
    let li = ul.getElementsByTagName('div');
   
    for (var i = 0; i < li.length; i++) {
      let a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
    }
  }

  onSendMoneyClick=()=>{
        
    let data = {type: MasterWallet.QRCODE_TYPE.TRANSFER, data: this.state.contactSelected.address};    
    this.props.showQRCodeContent({
      data: data
    });
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  

  render() {
    const { messages } = this.props.intl;     
    let invalid = !this.state.newContract.name || !this.state.newContract.address.symbol || !(this.state.newContract.email == "" || validateEmail(this.state.newContract.email));
    
    return (

        <div className="box-setting">                         
          <div className="list-address-book">
            <Modal title={messages.wallet.action.setting.label.contact_empty_button} onRef={modal => this.modaAddNewContactRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle}>
              <div className="add-new-contact">
                  <div>                    
                    <Input placeholder={messages.wallet.action.setting.label.contact_name} maxLength="40" value={this.state.newContract.name} onChange={(evt) => {this.onContactNameChange(evt)}} />
                  </div>
                  <div>                  
                    <Input placeholder={messages.wallet.action.setting.label.contact_email} maxLength="40" value={this.state.newContract.email} onChange={(evt) => {this.onContactEmailChange(evt)}} />
                  </div>
                  <div className="qrcode-box">
                    <span onClick={()=> {this.props.showScanQRCode({onFinish: (data) => {this.onQRCodeScaned(data);}});}}  className="icon-qr-code-black">{ICON.QRCode()}</span>                  
                    <Input placeholder={`${this.state.newContract.address.name} ${messages.wallet.action.setting.label.contact_address}`} maxLength="100" value={this.state.newContract.address.address} onChange={(evt) => {this.onContactAddressChange(evt)}} />
                  </div>

                  <button type="button" onClick={()=> {this.onAddNewContactClick();}} disabled={invalid} className="btn button btn-primary button btn-add-new-address">{messages.wallet.action.setting.label.contact_empty_button}</button>
              </div>
            </Modal>

            <Modal title={this.state.contactSelected ? this.state.contactSelected.name : "Detail"} onRef={modal => this.modalAddressBookDetailRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle} modalBodyStyle={this.props.modalBodyStyle}>
                  {this.state.contactSelected &&
                    <div className="contact-detail">

                        <div className="header-box-contact-detail">
                            <img className="avatar-b" src={iconAvatar} />
                        </div>

                        <div className="item header"></div>

                        <div className="item">                        
                            <div className="name">
                              <label>{messages.wallet.action.setting.label.contact_name}</label>                            
                            </div>                
                            <div className="value">
                              <span className="text">{this.state.contactSelected.name}</span>
                            </div>
                          </div>
                          
                          <div className="item">  
                            <div className="name">
                                <label>{messages.wallet.action.setting.label.contact_email}</label>                            
                            </div>                
                            <div className="value">
                                <span className="text">{this.state.contactSelected.email}</span>
                            </div>
                          </div>                         

                          <div className="item">  
                            <div className="name">
                                <label>{ this.state.contactSelected.address.name + ' ' + messages.wallet.action.setting.label.contact_address}</label>                            
                                <span className="desc desc-long">{this.state.contactSelected.address.address}</span>
                            </div>                                              
                          </div>

                           <div className="item header header-empty"></div>
  
                            <div className="item" onClick={()=> {this.onSendMoneyClick();}}>  
                              <div className="name">
                                  <label className="green">{messages.wallet.action.setting.label.contact_send_money}</label>                            
                              </div>                
                            </div>
                            <div className="item header header-empty"></div>

                            <div className="item" >  
                              <div className="name" onClick={()=>{this.onRemoveContactClick();}}>
                                  <label className="red">{messages.wallet.action.setting.label.contact_remove}</label>                            
                              </div>                
                            </div>

                        </div>
                    }
                                  
            </Modal>            
             
              {this.state.listAddressBook.length == 0 ?
              <div className="list-address-emtpy">
                <img src={iconAvatar} />
                <div className="address-emtpy-title">{messages.wallet.action.setting.label.contact_empty_title}</div>
                <div className="address-emtpy-desc">{messages.wallet.action.setting.label.contact_empty_desc}</div>
                <button onClick={()=>{this.openAddNewContact();}} className="address-emtpy-btn btn button btn-primary button">{messages.wallet.action.setting.label.contact_empty_button}</button>
              </div>
              :
              <div className="list-contact-search-box">
                <img src={iconSearch} />
                <input onChange={(evt)=>{this.onSearchChange(evt);}} placeholder={messages.wallet.action.setting.label.contact_add_contact_search_box} type="text" className="form-control-custom form-control-custom-ex w-100" />
              </div>
              }
              <div id="lst-address-book">
              {this.state.listAddressBook.map((item, i) => {  
                return (             
                  <div id={item.email} key={item.email} className="item" onClick={()=> {this.openContact(item)}}>
                      <img className="image" src={iconAvatar} />
                      <a className="name">
                          <label>{item.name}</label>
                          <span style={{display: "none"}}> {item.email} </span>
                          <span className="desc">{item.address.address}</span>
                      </a>                    
                  </div>
                 );
                })}
                </div>
              </div>

        </div>

    )
  }
}

const mapStateToProps = (state) => ({  
});

const mapDispatch = ({    
  showAlert,
  showLoading,
  hideLoading,
  showScanQRCode,
  showQRCodeContent,
});


export default injectIntl(connect(mapStateToProps, mapDispatch)(AddressBook));
