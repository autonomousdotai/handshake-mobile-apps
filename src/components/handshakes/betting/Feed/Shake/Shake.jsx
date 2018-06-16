import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import createForm from '@/components/core/form/createForm';
import { required } from '@/components/core/form/validation';
import { Field } from "redux-form";
import { shakeItem, initHandshake, } from '@/reducers/handshake/action';
import {HANDSHAKE_ID, API_URL, APP } from '@/constants';
import {MasterWallet} from '@/models/MasterWallet';
import local from '@/services/localStore';
import moment from 'moment';
import GA from '@/services/googleAnalytics';

// components
import { InputField } from '@/components/handshakes/betting/form/customField';
import Button from '@/components/core/controls/Button';
import Toggle from './../Toggle';
import {showAlert} from '@/reducers/app/action';

import './Shake.scss';
import { BetHandshakeHandler, MESSAGE, SIDE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { Form } from 'reactstrap';


const betHandshakeHandler = BetHandshakeHandler.getShareManager();
const nameFormBettingShake = 'bettingShakeForm';


const defaultAmount = 1;
const titleBySide = { 1: 'Bet for the outcome', 2: 'Bet against the outcome' };
const ROUND = 1000000;
class BetingShake extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    outcomeHid: PropTypes.number,
    matchName: PropTypes.string,
    matchOutcome: PropTypes.string,
    marketSupportOdds: PropTypes.number,
    marketAgainstOdds: PropTypes.number,
    amountSupport: PropTypes.number,
    amountAgainst: PropTypes.number,
    closingDate: PropTypes.any,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
  }

  static defaultProps = {
    outcomeId: -1
  };



  constructor(props) {
    super(props);

    // const BettingShakeForm = createForm({
    //   propsReduxForm: {
    //     form: nameFormBettingShake,

    //     enableReinitialize : true
    //   },
    // });

    this.state = {
      buttonClass: 'btnOK btnBlue',
      isShowOdds: true,
      extraData: {},
      isChangeOdds: false,
      marketOdds: 0,
      oddValue: 0,
      amountValue: 0,
      winValue: 0,
      disable: false,

      //BettingShakeForm

    };


    this.onSubmit = ::this.onSubmit;
    this.onCancel = ::this.onCancel;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){
    // const {extraData} = this.state;
    // const {matchName, matchOutcome, outcomeHid} = this.props;
    // console.log("componentWillReceiveProps Props:", this.props);
    // extraData["event_name"] = matchName;
    // extraData["event_predict"] = matchOutcome;
    // console.log('componentWillReceiveProps Extra Data: ', extraData);
    // this.setState({extraData})
    const {marketSupportOdds, marketAgainstOdds, side, amountSupport, amountAgainst} = nextProps;
    //console.log('Props: ',nextProps );
    //const marketOdds = this.toggleRef.value === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;
    const marketAmount = side === SIDE.SUPPORT ? amountSupport : amountAgainst;
    const winValue = marketAmount * marketOdds;
    const roundMarketAmount = Math.round(marketAmount*ROUND)/ROUND;
    console.log('componentWillReceiveProps: marketOdds, marketAmount, winValue, roundMarketAmount:', marketOdds, marketAmount, winValue, roundMarketAmount);
    this.setState({
      oddValue: Math.round(marketOdds*100)/100,
      amountValue: roundMarketAmount,
      winValue: Math.round(winValue*ROUND)/ROUND
    })
  }

  isExpiredDate(){
    const {closingDate} = this.props;
    //console.log(moment(closingDate).format());
    const newClosingDate = moment.unix(closingDate).add(90, 'minutes');
    //let closingDateUnit = moment.unix(closingDate).utc();
    let dayUnit = newClosingDate.utc();
    let today = moment();
    let todayUnit = today.utc();
    //console.log('Closing Unix:', closingDateUnit.format());
    console.log('New Date Unix:', dayUnit.format());
    console.log('Today Unix:', todayUnit.format());
    if(!todayUnit.isSameOrBefore(dayUnit, "miliseconds") && today){
      console.log('Expired Date');
      return true
    }
    return false;
  }

  async onSubmit(e) {
    console.log("Submit");
    e.preventDefault();
    const values = this.refs;
    console.log('Values:', values);
    const {isShowOdds, isChangeOdds} = this.state;
    const {matchName, matchOutcome, side, marketAgainstOdds, marketSupportOdds, closingDate} = this.props;
    const amount = parseFloat(values.amount.value);
    const odds = parseFloat(values.odds.value);

    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    /*
    if(!isChangeOdds){
      odds = marketOdds;
    }
    */

    console.log("Amount, Side, Odds", amount, side, odds);
    // this.props.onSubmitClick(amount);
    //const side = parseInt(this.toggleRef.value);
    const balance = await betHandshakeHandler.getBalance();
    const estimatedGas = await betHandshakeHandler.getEstimateGas();
    //const estimatedGas = 0.00001;
    const total = amount + parseFloat(estimatedGas);
    console.log('Balance, estimate gas, total:', balance, estimatedGas, total);

    var message = null;

    // send event tracking
    try {
      GA.clickGoButton(matchName, matchOutcome, side);
    } catch (err) {}

    if(!betHandshakeHandler.isRightNetwork()){
      message = MESSAGE.MATCH_OVER;

    }
    else if (betHandshakeHandler.isExpiredDate(closingDate)){
      message = MESSAGE.MATCH_OVER;
    }
    else if(matchName && matchOutcome){
        if(amount > 0){
          if(total <= parseFloat(balance)){
            if(isShowOdds){
              if(odds >1){
                this.initHandshake(amount, odds);
              }else {
                message = MESSAGE.ODD_LARGE_THAN;
              }
            }else {
              //LOGIC new nerver use shake item
              //this.shakeItem(amount, side);

            }
          }else {
            message = MESSAGE.NOT_ENOUGH_BALANCE;
          }
        }else {
          message = MESSAGE.AMOUNT_VALID;
        }
    }else {
      message = MESSAGE.CHOOSE_MATCH;
    }


    if(message){
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }


  }

  onCancel() {
    console.log('Cancel')
    this.props.onCancelClick();
  }

  onToggleChange(id) {
    const {isChangeOdds} = this.state;
    const {marketAgainstOdds, marketSupportOdds, side} = this.props;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;

    if(!isChangeOdds){
      this.setState({
        oddValue: parseFloat(marketOdds).toFixed(2)
      })
    }
    this.setState({buttonClass: `btnOK ${side === 1 ? 'btnBlue' : 'btnRed' }`});

  }

  updateTotal() {
    const {oddValue, amountValue} = this.state;
    const total = oddValue * amountValue;
      this.setState({
        winValue: Math.round(total*ROUND)/ROUND,
      })
  }

  renderInputField(props) {
    const {
      label,
      className,
      id,
      infoText = 'ETH',
      isShowInfoText = true,
      type = 'text',
      value,
      defaultValue,
      isInput = true,
      ...newProps
    } = props;
    const {oddValue, amountValue} = this.state;
    console.log('Label Default Value:',label, defaultValue);
    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <input
              ref={id}
              //component={InputField}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              //defaultValue={defaultValue}
              value={id==="odds" ? oddValue : amountValue}
              //value={value}
              {...newProps}
              onChange= {(evt)=> {
                if (id === 'odds'){
                  console.log('Change Odds');
                  this.setState({
                    oddValue: evt.target.value,
                    isChangeOdds: true
                  }, ()=> this.updateTotal())
                }else {
                  this.setState ({
                    amountValue: evt.target.value
                  }, ()=> this.updateTotal())
                }
              }}
              onClick={event => {event.target.setSelectionRange(0, event.target.value.length)}}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowInfoText && <div className="cryptoCurrency">{infoText}</div>
        }
      </div>
    )
  }

  renderForm() {
    const { total, isShowOdds, marketOdds, isChangeOdds, winValue } = this.state;
    const {side} = this.props;
    console.log('Market Odd render form:', marketOdds);
    /*
    const formFieldData = [

      {
        id: 'you_bet',
        name: 'you_bet',
        label: 'You bet',
        key: 1,
        defaultValue: '1',
        onChange: (evt) => this.updateTotal(parseFloat(evt.target.value)),
      },
      {
        id: 'at_odds',
        name: 'at_odds',
        label: 'At odds',
        isInput: false,
        value: odds,
        className: 'atOdds',
        isShowCurrency: false,
        key: 2,
      },
      {
        id: 'remaining',
        name: 'remaining',
        label: 'Remaining',
        isInput: false,
        value: remaining,
        key: 3,
      },
    ];
    */

    const youCouldWinField = {
      id: 'you_could_win',
      name: 'you_could_win',
      label: 'You could win',
      className: 'total',
      isInput: false,
      value: total || 0,
      readOnly: true,
    };

    const amountField = {
      id: 'amount',
      name: 'amount',
      label: 'Amount',
      className: 'amount',
      placeholder: '0.00',
      type: 'text',
    };
    let oddsField = {
      id: 'odds',
      name: 'odds',
      label: 'Odds',
      className: `odds${isChangeOdds ? ' yourOdds' : ''}`,
      placeholder: '2.0',
      value: 3.0,
      defaultValue: marketOdds,
      infoText: isChangeOdds ? 'Your Odds' : 'Market Odds',
      isShowInfoText: true,
      type: 'text',
    };
    // const {BettingShakeForm} = this.state;
    // console.log('BettingShakeForm:', BettingShakeForm);
    const buttonClass = `btnOK ${side === 1 ? 'btnBlue' : 'btnRed' }`;

    return (
      <form className="wrapperBettingShake" onSubmit={this.onSubmit}>
        <p className="titleForm text-center">{titleBySide[side]}</p>
        {/*<Toggle ref={(component) => {this.toggleRef = component}} onChange={this.onToggleChange} />*/}
        {this.renderInputField(amountField)}
        {isShowOdds && this.renderInputField(oddsField)}
        <div className="rowWrapper">
         <div>Possible winnings</div>
         <div className="possibleWinningsValue">{this.state.winValue}</div>
        </div>
        <Button type="submit" disable={this.state.disable} block className={buttonClass}>
          Go
        </Button>
      </form>
    );
  }


  render() {
    return this.renderForm();
  }




  shakeItem(amount, side){
      const {outcomeId} = this.props;
      const {extraData} = this.state;
      const {matchName, matchOutcome, outcomeHid} = this.props;
      extraData["event_name"] = matchName;
      extraData["event_predict"] = matchOutcome;
      extraData["event_bet"] = amount;
      this.setState({
        extraData
      })
      console.log("Props:", this.props);

      const params = {
        //to_address: toAddress ? toAddress.trim() : '',
        //public: isPublic,
        //description: content,
        // description: JSON.stringify(extraParams),
        //industries_type: industryId,
        type: HANDSHAKE_ID.BETTING,
        //type: 3,
        //extra_data: JSON.stringify(fields),
        outcome_id: outcomeId,
        extra_data: JSON.stringify(extraData),
        amount,
        currency: 'ETH',
        side,
        chain_id: betHandshakeHandler.getChainIdDefaultWallet(),
        from_address: betHandshakeHandler.getAddress()
      };
      console.log(params);

      this.props.shakeItem({PATH_URL: API_URL.CRYPTOSIGN.SHAKE, METHOD:'POST', data: params,
      successFn: this.shakeItemSuccess,
      errorFn: this.shakeItemFailed
    });
  }

  shakeItemSuccess = async (successData)=>{
    console.log('shakeItemSuccess', successData);
    const {status, data, message} = successData;
    if(status){
      /*
      const foundShakeList = this.foundShakeItemList(data);
      console.log('foundShakeList:', foundShakeList);
      foundShakeList.forEach(element => {
        this.shakeContract(element);
      });
      */
     const {outcomeHid} = this.props;
      betHandshakeHandler.controlShake(data, outcomeHid);
     this.props.showAlert({
      message: <div className="text-center">{MESSAGE.CREATE_BET_SUCCESSFUL}</div>,
      timeOut: 3000,
      type: 'success',
      callBack: () => {
      }
    });

    }else {
      // TO DO: Show message, show odd field
      /*
      this.setState({
        isShowOdds: true,
      }, ()=> {
        const {message} = successData
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
      })
      */

     const {message} = successData
     this.props.showAlert({
       message: <div className="text-center">{message}</div>,
       timeOut: 3000,
       type: 'danger',
       callBack: () => {
       }
     });

    }
  }
  shakeItemFailed = (errorData) => {
    console.log('shakeItemFailed', errorData);
    const {status} = errorData;
    if(status === 0){
      this.setState({
        isShowOdds: true,
      }, ()=> {
        const {message} = errorData
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
      })
    }

  }

  initHandshake(amount, odds){
    this.setState({
      disable: true
    })
    const {outcomeId, matchName, matchOutcome, side} = this.props;
    const {extraData} = this.state;
    //const side = this.toggleRef.value;
    const fromAddress = betHandshakeHandler.getAddress();
    extraData["event_name"] = matchName;
    extraData["event_predict"] = matchOutcome;
    extraData["event_odds"] = odds;
    extraData["event_bet"] = amount;
    console.log('Extra Data:', extraData);
    const params = {
      //to_address: toAddress ? toAddress.trim() : '',
      //public: isPublic,
      //description: content,
      // description: JSON.stringify(extraParams),
      //industries_type: industryId,
      type: HANDSHAKE_ID.BETTING,
      //type: 3,
      //extra_data: JSON.stringify(fields),
      outcome_id: outcomeId,
      //odds:  parseFloat(odds),
      //amount: parseFloat(amount),
      odds:`${odds}`,
      amount: `${amount}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side: parseInt(side),
      from_address: fromAddress,
      chain_id: betHandshakeHandler.getChainIdDefaultWallet(),
    };
    console.log("Params:", params);

    
    this.props.initHandshake({PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE, METHOD:'POST', data: params,
    successFn: this.initHandshakeSuccess,
    errorFn: this.initHandshakeFailed
  });
  
  }

  initHandshakeSuccess = async (successData)=>{
    console.log('initHandshakeSuccess', successData);
    const {status, data} = successData

    if(status && data){

     const {outcomeHid} = this.props;
      console.log('OutcomeHid:', outcomeHid);
     betHandshakeHandler.controlShake(data, outcomeHid);
     const isExist = betHandshakeHandler.isExistMatchBet(data);
     let message = MESSAGE.CREATE_BET_NOT_MATCH;
     if(isExist){
       message = MESSAGE.CREATE_BET_MATCHED;
     }
     this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 3000,
      type: 'success',
      callBack: () => {
      }
    });
     // send ga event
      try {
        const {matchName, matchOutcome, side} = this.props;
        GA.createBetSuccess(matchName, matchOutcome, side);
      } catch (err) {}
    }
    this.setState({
      disable: false
    })
    this.props.onSubmitClick();
  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
    this.setState({
      disable: false
    })
  }
}
const mapDispatch = ({
  initHandshake,
  shakeItem,
  showAlert
});
export default connect(null, mapDispatch)(BetingShake);
