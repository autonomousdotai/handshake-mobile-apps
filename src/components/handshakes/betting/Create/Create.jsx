import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import history from '@/services/history';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { initHandshake } from '@/reducers/handshake/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import  { BetHandshakeHandler} from '@/components/handshakes/betting/Feed/BetHandshakeHandler.js';
import { URL } from '@/config';

// components
import Button from '@/components/core/controls/Button';
import Input from '@/components/core/forms/Input/Input';
import DatePicker from '@/components/handshakes/betting/Create/DatePicker';
import { InputField } from '../form/customField';
import {MasterWallet} from '@/models/MasterWallet';

// self
import './Create.scss';

import Neuron from '@/services/neuron';

const neuron = new Neuron(4);

const nameFormBettingCreate = 'bettingCreate';
const BettingCreateForm = createForm({
  propsReduxForm: {
    form: nameFormBettingCreate,
  },
});

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;

class ErrorBox extends React.PureComponent {
  render() {
    return (
      <div className="text-danger">
        {this.props.children}
      </div>
    );
  }
}

class BettingCreate extends React.PureComponent {
  static propTypes = {
    item: PropTypes.object.isRequired,
    toAddress: PropTypes.string.isRequired,
    isPublic: PropTypes.bool.isRequired,
    industryId: PropTypes.number.isRequired,
    onClickSend: PropTypes.func,
    initHandshake: PropTypes.func.isRequired,
  }

  static defaultProps = {
    item: {
      "backgroundColor": "#332F94",
      "desc": "[{\"key\": \"event_name\", \"label\": \"Event\", \"placeholder\": \"event name\", \"type\": \"input\"}] [{\"key\": \"event_date\", \"label\": \"Date\", \"placeholder\": \"11/6/2018\", \"type\": \"date\"}] [{\"key\": \"event_predict\", \"label\": \"I predict\", \"placeholder\": \"Brazil will win\"}] [{\"key\": \"event_odds\", \"label\": \"Odds\", \"placeholder\": \"10\"}] [{\"key\": \"event_bet\", \"label\": \"Bet\", \"placeholder\": \"10 ETH\", \"type\": \"number\"}]",
      "id": 18,
      "message": null,
      "name": "Bet",
      "order_id": 5,
      "public": 1
    },
    toAddress: "sa@autonomous.nyc",
    isPublic: true,
    industryId: 18,
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {},
      address: null,
      privateKey: null,
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderDate = ::this.renderDate;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;
  }
  componentDidMount(){
    console.log('Betting Create Props:', this.props, history);
    const wallet = MasterWallet.getWalletDefault();
    console.log("Address, Private Key:", wallet.address, wallet.privateKey);
    this.setState({
      address: wallet.address,
      privateKey: wallet.privateKey,
    })
  }

  onSubmit(dict) {
    const {address, privateKey, values} = this.state;
    console.log("values", values);

    let content = this.content;
    const inputList = this.inputList;
    let extraParams = values;
    console.log('Before Content:', content);

    inputList.forEach(element => {
      const item = JSON.parse(element.replace(regexReplace, ''));
      console.log('Element:', item);
      const {key, placeholder, type} = item;
      const valueInputItem = key === 'event_date' ? this.datePickerRef.value : values[key];
      content = content.replace(
        regexReplacePlaceholder,
        valueInputItem ? valueInputItem : ''
      );
    });
    console.log('After Content:', content);
    //console.log("this", this.datePickerRef.value);

    //const {toAddress, isPublic, industryId} = this.props;

    //const fromAddress = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
    const fromAddress = address;
    this.initHandshake(extraParams, fromAddress);
  }

  get inputList() {
    const content = this.content;
    return content ? content.match(regex) : [];
  }

  get content() {
    const { desc } = this.props.item;
    return desc || '';
  }

  changeText(key, text) {
    const {values} = this.state;
    values[key] = text;
    this.setState({values});
  }

  renderInput(item, index) {
    const {key, placeholder, type} = item;
    const className = 'form-control-custom input';
    return (
      <Field
        component={InputField}
        type="text"
        placeholder={placeholder}
        className={className}
        name={key}
        validate={[required]}
        ErrorBox={ErrorBox}
        onChange={(evt) => {
          this.changeText(key, evt.target.value)
        }}
      />
    );
  }

  renderDate(item) {
    const {key, placeholder, type} = item;

    return (
      <DatePicker
        onChange={(selectedDate) => {
          console.log('SelectedDate', selectedDate);
          console.log('Key:', key);
          const {values} = this.state;
          values[key] = selectedDate.format();
          this.setState({values}, ()=>console.log(values));
            
        }}
        inputProps={{
          readOnly: true,
          className: 'form-control-custom input',
          name: key,
        }}
        defaultValue={new Date()}
        dateFormat="D/M/YYYY"
        timeFormat="HH:mm"
        closeOnSelect
        ref={(component) => {this.datePickerRef = component;}}
      />
    );
  }

  renderNumber(item) {
    const {key, placeholder} = item;

    return (
      <Field
        className="form-control-custom input"
        name={key}
        component={InputField}
        type="number"
        //min="0.0001"
        //step="0.0002"
        placeholder={placeholder}
        validate={[required]}
        ErrorBox={ErrorBox}
        onChange={(evt) => {
          this.changeText(key, evt.target.value)
        }}
      />
    );
  }

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {key, placeholder, type, label} = item;
    let itemRender = this.renderInput(item, index);
    switch (type) {
      case 'date':
        itemRender = this.renderDate(item, index);
        break;
      case 'number':
        itemRender = this.renderNumber(item, index);
        break;
      default:
        itemRender = this.renderInput(item, index);
    }

    return (
      <div key={index} className={`rowWrapper ${key === 'event_odds' ? 'oddField' : ''}`}>
        <label className="label">{label || placeholder}</label>
        <div className={key === 'event_odds' ? 'oddInput' : ''}>
          {itemRender}
        </div>
      </div>
    );
  }

  renderForm() {
    const inputList = this.inputList;
    return (
      <BettingCreateForm className="wrapperBetting" onSubmit={this.onSubmit}>
        {inputList.map((field, index) =>
          this.renderItem(field, index)
        )}
        <Button type="submit" block>Sign & Send</Button>
      </BettingCreateForm>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }

  //Service
  initHandshake(fields, fromAddress){
    const params = {
      //to_address: toAddress ? toAddress.trim() : '',
      //public: isPublic,
      //description: content,
      // description: JSON.stringify(extraParams),
      //industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      //type: 3,
      //extra_data: JSON.stringify(fields),
      extra_data: JSON.stringify(fields),
      from_address: fromAddress,
      chain_id: 4
    };


    this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
    successFn: this.initHandshakeSuccess,
    errorFn: this.handleGetCryptoPriceFailed
  });

  }
   initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
    const {status, data} = successData
    const {values} = this.state;
    const eventDate = this.datePickerRef.value;
    const escrow = values['event_bet'];
    const event_odds = 1/parseInt(values['event_odds']);
    console.log("eventDate", eventDate.format(), eventDate.unix());
    console.log('Event Date: ', eventDate);
    console.log('Escrow:', escrow);
    console.log('Event Odds:', event_odds);

    if(status){
      const {id} = data;
      const offchain = id;
      const result = await BetHandshakeHandler.initItem(escrow, event_odds,eventDate, offchain);
      if(result){
          history.push(URL.HANDSHAKE_DISCOVER);
      }
    }

  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
  }


  //Blockchain
  /*
  async initBet(escrow, odd, eventDate){

    const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
    const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
    const acceptors = [];
    const goal = escrow*odd;
    const currentDate = new Date();
    const deadline = (eventDate.getTime() / 1000 - currentDate.getTime() / 1000);
    const offchain = 'abc1';
    const data = await neuron.bettingHandshake.initBet(address, privateKey, acceptors, goal, escrow, deadline, offchain);
    console.log('Init Betting:', data);

  }*/
}

const mapDispatch = ({
  initHandshake,
});

export default connect(null, mapDispatch)(BettingCreate);
