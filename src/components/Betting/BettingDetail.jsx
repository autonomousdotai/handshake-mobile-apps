import React from 'react';
import PropTypes from 'prop-types';
import Input from '@/components/core/forms/Input/Input';
import Button from '@/components/core/controls/Button/Button';
import {Formik} from 'formik';
import Datetime from 'react-datetime';
//require('react-datetime');

import './css/BettingDetail.scss';
const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;
const regexReplacePlaceholder = /\[.*?\]/;


class BettingDetail extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        toAddress: PropTypes.string.isRequired,
        isPublic: PropTypes.bool.isRequired,
        industryId: PropTypes.number.isRequired,
        onClickSend:PropTypes.func
      }
    static defaultProps = {
        item: {
            "backgroundColor": "#332F94",
            "desc": "[{\"key\": \"event_date\", \"placeholder\": \"Event date\", \"type\": \"date\"}] [{\"key\": \"event_info\", \"placeholder\": \"Event info\"}] [{\"key\": \"outcome\", \"placeholder\": \"Outcome\"}] [{\"key\": \"odd\", \"placeholder\": \"Odd\"}] [{\"key\": \"bet\", \"placeholder\": \"Bet in ETH\", \"type\": \"number\"}]",
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
            values: []
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }
    onSubmit(values, {setSubmitting, setErrors /* setValues and other goodies */}) {
        console.log("Submit");
      }
    validateForm(values) {
    // same as above, but feel free to move this into a class method now.
    let errors = {};
    return errors;
    }
    renderInput(item, index){
        const {key, placeholder, type} = item;
        var className = "form-control-custom input";
        var plusClassName = key === "odd" ?  " oddInput" : '';
        className = className +  plusClassName;
        console.log('Classname: ', className);
        return (
            <Input className={className}  name={key} onChange={(evt) => { this.changeText(key, evt.target.value)}}/>

          );
    }
    renderDate(item, index){
        const {key, placeholder, type} = item;

        return (
            <Datetime inputProps={{ className:"form-control-custom input" }}
            onChange={(error)=> console.log(error)}
            closeOnSelect={true}/>
          );
    }
    renderNumber(item, index){
        const {key, placeholder, type} = item;

        return (
            <Input className="form-control-custom input"  name={key} type='number' min='0.0001' defaultValue='1' onChange={(evt) => { this.changeText(key, evt.target.value)}}/>

          );
    }
  
    renderItem(field, index) {
        console.log('Field:', field);
        //var item = field.length > 0 ? field[0] : {}
        //console.log('Item:', item);
        const item = JSON.parse(field.replace(regexReplace, ''));
        console.log('item:', item);
        const {key, placeholder, type} = item;
        console.log('Key:', key);
        console.log('Type:', type);
        var itemRender = this.renderInput(item, index);
        switch(type){
            case 'date':
            itemRender = this.renderDate(item, index);
            break;
            case 'number':
            itemRender = this.renderNumber(item, index);
            break;
            

        }
        
        return (
            <div key={index} className="rowWrapper">
            <label className="label">{placeholder}</label>
            {key === "odd" &&  <label className="oddLabel">{"1 : "}</label>
        }
            {itemRender}
            </div>
        );
    }
    get inputList(){
        const content = this.content;
        return content ? content.match(regex) : [];
    }

    get content(){
        const {item} = this.props;
        const {desc} = item;
        const content = desc ? desc : '';
        return content;
    }
    onClickSendButton(){
        console.log('onClickSendButton');
        const {values} = this.state;
        var content = this.content;
        const inputList = this.inputList;
        //const listBlank = content ? content.match(regex) : [];
        //console.log('List Blank:', listBlank);
        console.log('Values:', values);
        let extraParams = values;
        console.log('Before Content:', content);

        inputList.forEach(element => {
            const item = JSON.parse(element.replace(regexReplace, ''));
            console.log('Element:', item);
            const {key, placeholder, type} = item;
            const valueInputItem = values[key];

            content = content.replace(
                regexReplacePlaceholder,
                valueInputItem ? valueInputItem : ''
              );
        });
        console.log('After Content:', content);

        const {toAddress, isPublic, industryId} = this.props;

        //this.props.onClickSend(params);
        const params = {
            to_address: toAddress ? toAddress.trim() : '',
            public: isPublic,
            description: content,
            industries_type: industryId,
            //source: Platform.OS
          };

          
    }
    changeText(key, text){
        console.log('Text:', text);
        const {values} = this.state;
        values[key] = text;
        this.setState({
            values
        })
    }
    renderForm({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) {
        const inputList = this.inputList;
      console.log('Input List:', inputList);
        return (
            <form className="wrapper" onSubmit={handleSubmit}>         
              {inputList.map((field, index)=>
              this.renderItem(field, index)
           )}
           <Button type="submit" block onClick={()=> this.onClickSendButton()}>Sign & Send</Button>

           
           </form>
        );
    }
  render() {
      
    return (
        <Formik
            initialValues={{
              amount: 1,
            }}
            validate={this.validateForm}
            onSubmit={this.onSubmit}
            render={this.renderForm}
          />
    );
  }
}

export default BettingDetail;
