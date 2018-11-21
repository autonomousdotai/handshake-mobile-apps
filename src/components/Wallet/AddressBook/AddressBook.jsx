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

import iconEdit from '@/assets/images/wallet/icons/icon-edit.svg';


import {Contact} from '@/services/Wallets/Contact/Contact'
import {ContactAddress} from '@/services/Wallets/Contact/ContactAddress'

function validateEmail(email) {  
  const re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  return re.test(email);
}


class AddressBook extends React.Component {
  constructor(props) {
    super(props);   
    
    this.newContact = new Contact("", "", []);
    this.contactAddress = new ContactAddress ('', '', '');
    this.newContact.addContactAddress(this.contactAddress);

    this.state = {      
      listAddressBook: [],
      contactSelected: false,  
      
      needChoice: this.props.needChoice || false,
      
      // add new contact:
      newContact: this.newContact,
      isUpdate: false
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
  
  onFinish(address){
    this.props.onSelected (address);    
  }

  openContact=(item)=>{
    if (this.state.needChoice){
      if (item.addresses.length === 1){
        this.onFinish(item.addresses[0].address);
        return;
      }      
    }
    this.setState({contactSelected: item}, ()=>{
      this.modalAddressBookDetailRef.open();
    })
  }

  openAddNewContact=()=>{
    let newContact = new Contact("", "", []);
    newContact.addContactAddress(new ContactAddress("", "", ""));
    this.setState({newContact: newContact, isUpdate: false}, ()=>{
      this.modaAddNewContactRef.open();
    });    
  }

  openEditContact=()=>{
    let newContactState = this.state.contactSelected;   
    let newContact = new Contact(newContactState.name, newContactState.email, []);
    for (var i = 0; i < newContactState.addresses.length; i ++){
      let contactAddress = new ContactAddress(newContactState.addresses[i].address, newContactState.addresses[i].name, newContactState.addresses.symbol);
      newContact.addContactAddress(contactAddress);
    } 
    this.setState({newContact: newContact, isUpdate: newContact.name}, ()=>{
      this.modaAddNewContactRef.open();
    });    
  }

  onContactNameChange=(evt)=>{
    let value = evt.target.value;
    let newContact = this.state.newContact;
    newContact.name = value;
    this.setState({newContact});
  }
  onContactEmailChange=(evt)=>{
    let value = evt.target.value;
    let newContact = this.state.newContact;
    newContact.email = value;
    this.setState({newContact});
    
  }
  onContactAddressChange=(evt, index)=>{
    let value = evt.target.value;
    
    let newContact = this.state.newContact;    
    let addressCurrent = newContact.addresses[index];
    

    if (value.toString().length > 30){
      let qrCodeResult = MasterWallet.getQRCodeDetail(value);          
      if (qrCodeResult && Object.keys(qrCodeResult.data).length !== 0 ){
        
        if (qrCodeResult['type'] == MasterWallet.QRCODE_TYPE.TRANSFER || qrCodeResult['type'] == MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS){                                  
            newContact.addresses[index] = new ContactAddress(qrCodeResult.data.address, qrCodeResult.data.name, qrCodeResult.data.symbol);
            this.setState({newContact});
        }
      }
      else{
        addressCurrent = new ContactAddress(value, "", "");;
        newContact.addresses[index] = addressCurrent;
        this.setState({newContact});
      }
    }
    else{
      addressCurrent = new ContactAddress(value, "", "");;
      newContact.addresses[index] = addressCurrent;
      this.setState({newContact});
    }    
  }
  onAddNewContactClick=()=>{
    let result = true;
    if (this.state.isUpdate === false){
      result = MasterWallet.addContact(this.state.newContact);
    }
    else{
      result = MasterWallet.updateContact(this.state.newContact, this.state.isUpdate);
      this.setState({contactSelected: this.state.newContact});
    }
    
    if (result !== true){
      this.showError(result);
    }      
    else{
      let listAddressBook = MasterWallet.readContacts();
      this.setState({listAddressBook}, ()=>{
        this.modaAddNewContactRef.close();          
      })
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

  onQRCodeScaned=(data, index)=>{ 
    
    let newContact = this.state.newContact;    
    let addressCurrent = newContact.addresses[index];
    
    let qrCodeResult = MasterWallet.getQRCodeDetail(data); 

    if (qrCodeResult && Object.keys(qrCodeResult.data).length !== 0 ){
      let dataType = qrCodeResult['type'];
      if (dataType == MasterWallet.QRCODE_TYPE.TRANSFER || dataType == MasterWallet.QRCODE_TYPE.CRYPTO_ADDRESS){                        
        newContact.addresses[index] = new ContactAddress(qrCodeResult.data.address, qrCodeResult.data.name, qrCodeResult.data.symbol);
        this.setState({newContact});
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

  onAddNewAddressClick=()=>{
    let newContact = this.state.newContact;    
    newContact.addContactAddress(new ContactAddress ('', '', ''));
    this.setState({newContact});
  }

  onRemoveNewAddressClick=(index)=>{
    let lstAddress = [];
    let newContact = this.state.newContact;    
    for (var i = 0; i < newContact.addresses.length; i ++ ){
      if (i !== index)
        lstAddress.push(newContact.addresses[i]);
    }    
    newContact.addresses = lstAddress;
    this.setState({newContact});
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

    let validAddress = this.state.newContact.addresses.filter(item => item.name !== "" && item.address !== "").length > 0;
    if (validAddress){
      validAddress = this.state.newContact.addresses.filter(item => item.name === "" && item.address !== "").length === 0;
    }
    if(validAddress){
      for (var i = 0; i < this.state.newContact.addresses.length; i ++){
        let adds = this.state.newContact.addresses[i].address;
        if (this.state.newContact.addresses.filter(item => item.address === adds).length > 1){
          validAddress = false;
          break;
        }
      }      
    }
    
    let invalid = !this.state.newContact.name || !validAddress || !(this.state.newContact.email == "" || validateEmail(this.state.newContact.email));
    console.log('this.state.newContact', this.state.newContact);    
    return (

        <div className="box-setting">                         
          <div className="list-address-book">            

            <Modal title={this.state.needChoice ? messages.wallet.action.setting.label.select_an_address : (this.state.contactSelected ? this.state.contactSelected.name : "Detail")} onRef={modal => this.modalAddressBookDetailRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle} modalBodyStyle={this.props.modalBodyStyle} customRightIcon={iconEdit} customRightIconClick={()=>{this.openEditContact()}}>
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

                          {this.state.contactSelected.addresses.map((item, i) => {  
                          return (             
                            <div onClick={()=>{this.onFinish(item.address);}} key={"detail-" + i.toString()} className="item">   
                              <div className="name">
                                  <label>{ item.name + ' ' + messages.wallet.action.setting.label.contact_address}</label>                            
                                  <span className="desc desc-long">{item.address}</span>
                              </div>                                              
                            </div>
                          )})}
                          
                          {!this.state.needChoice && <div>
                           {/* <div className="item header header-empty"></div>
  
                            <div className="item" onClick={()=> {this.onSendMoneyClick();}}>  
                              <div className="name">
                                  <label className="green">{messages.wallet.action.setting.label.contact_send_money}</label>                            
                              </div>                
                            </div> */}
                            <div className="item header header-empty"></div>

                            <div className="item" >  
                              <div className="name" onClick={()=>{this.onRemoveContactClick();}}>
                                  <label className="red">{messages.wallet.action.setting.label.contact_remove}</label>                            
                              </div>                
                            </div>
                          </div>}

                        </div>
                    }
                                  
            </Modal>   
            <Modal title={ this.state.isUpdate === false ?  messages.wallet.action.setting.label.contact_empty_button : messages.wallet.action.setting.label.update_title_text} onRef={modal => this.modaAddNewContactRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle}>
              <div className="add-new-contact">
                  <div>                    
                    <Input placeholder={messages.wallet.action.setting.label.contact_name} maxLength="40" value={this.state.newContact.name} onChange={(evt) => {this.onContactNameChange(evt)}} />
                  </div>
                  <div>                  
                    <Input placeholder={messages.wallet.action.setting.label.contact_email} maxLength="40" value={this.state.newContact.email} onChange={(evt) => {this.onContactEmailChange(evt)}} />
                  </div>
                  {this.state.newContact.addresses.map((item, i) => {  
                  return (             
                    <div key={`address-${i}`} className="qrcode-box">
                      <span onClick={()=> {this.props.showScanQRCode({onFinish: (data) => {this.onQRCodeScaned(data, i);}});}}  className="icon-qr-code-black">{ICON.QRCode()}</span>                  
                      <Input placeholder={`${item.name} ${messages.wallet.action.setting.label.contact_address}`} maxLength="100" value={item.address} onChange={(evt) => {this.onContactAddressChange(evt, i)}} />
                      { i == 0 ? <div className={"add-new-address-label " + (this.state.newContact.addresses.length > 1 ? 'add-new-address-many' : '')}><span onClick={()=>{this.onAddNewAddressClick();}}>{messages.wallet.action.setting.label.add_new_address}</span></div>
                        : <div className={"remove-address-label " + (i == this.state.newContact.addresses.length-1 ? 'remove-last-child': '')}><span onClick={()=>{this.onRemoveNewAddressClick(i);}}>{messages.wallet.action.setting.label.remove_new_address}</span></div>
                      }
                    </div>
                  )})}

                  <button type="button" onClick={()=> {this.onAddNewContactClick();}} disabled={invalid} className="btn button btn-primary button btn-add-new-address">
                    { this.state.isUpdate === false ? messages.wallet.action.setting.label.contact_empty_button : messages.wallet.action.setting.label.update_button_text}
                  </button>
              </div>
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
                          <span className="desc">{item.addresses[0].address}</span>
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
