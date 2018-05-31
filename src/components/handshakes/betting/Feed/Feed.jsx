import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, ROLE, 
  BETTING_STATUS_LABEL, BETTING_STATUS, 
  REJECT_WINDOWN_DAYS, CANCEL_WINDOWN_DAYS,
  BETTING_OPTIONS_NAME, 
  BETTING_OPTIONS} from './BetHandshakeHandler.js';

import { APP } from '@/constants';
import local from '@/services/localStore';
import {FIREBASE_PATH} from '@/constants';

// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';

// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import BettingHandshake from '@/services/neuron/neuron-bettinghandshake.js';

const date = '2018-06-01';
const eventDate = new Date(date);
const goal = 30;



class FeedBetting extends React.Component {
  static propTypes = {
    userEmail: PropTypes.string,
    updatedItem: PropTypes.func,
  }

  static defaultProps = {
    userEmail: 'trong@autonomous.nyc',

  };

  constructor(props) {
      super(props);

      this.state = {
          role: ROLE.GUEST,
          statusLabel: null,
          statusAction: null,
          isShowOptions: false,
          seletedId: BETTING_OPTIONS.INITIATOR_WON,
      };


  }

  componentDidMount() {
    console.log('Betting Feed:', this.props);
    const item = this.props;
    const {initUserId, shakedUserIds, status, extraData} = item;
    console.log('Extra Data:', this.extraData);
    const profile = local.get(APP.AUTH_PROFILE);
    const token = local.get(APP.AUTH_TOKEN);
    console.log('Token:', token);
    console.log('Profile', profile);
    console.log('InitUserId:', initUserId);
    const isUserShake = this.isShakeUser(shakedUserIds, profile.id);
    console.log('Is User Shake:', isUserShake);

    
    const role = (profile.id === initUserId) ? ROLE.PAYEE :
                isUserShake ? ROLE.PAYER : ROLE.GUEST;
    console.log('Role:', role);

    this.setState({
      role
    });    
    
   //const hardCodeRole = ROLE.PAYEE;
    const hardCodeStatus = 2;

    const result = BetHandshakeHandler.getStatusLabel(hardCodeStatus, role, eventDate)
    console.log('Result:', result);
    if(result){
      this.updateStatus(result);
    }
  }

  componentWillReceiveProps(nextProps) {

  }
  get extraData(){
    const {extraData} = this.props
    try {
      return JSON.parse(extraData);
    }catch(e){
      console.log(e);
      return {}
    }
  }
  isShakeUser(shakeIds, userId){
    console.log('User Id:', userId);
    /*
    if(shakeIds){
      
      if(shakeIds.indexOf(userId) > -1){
        return true;

      }
      
    }
    */
    if(userId == 151){
      return true;
    }

    return false;
  }
  get balance(){
    const {balance} = this.extraData;
    return balance ? balance : 0;
  }

  get getOptionsId() {
    this.ids = [];

    const optionIds = Object.keys(BETTING_OPTIONS_NAME);

    optionIds.forEach((id) => {
      this.ids.push((<option id={id} key={id} value={id}>{BETTING_OPTIONS_NAME[id]}</option>));
    });

    return this.ids;
  }
  renderOptions(){
    return (
      <select defaultValue={this.state.seletedId} onChange={(e)=> this.changeOption(e.target.value)}>
                {
                  this.getOptionsId
                }
      </select>
    );
  }

  render() {
    console.log("render here");
    const {shakeCount} = this.props;
    const {role, statusAction, statusLabel, isShowOptions} = this.state;
    const {event_name, event_predict, event_odds, event_bet,event_date, balance} = this.extraData;
    //const extraData = JSON.parse(item.extraData); 
    
    //const {description, from_email, status, balance} = extraData;
    // const bottomDes = `22 bettors against ${from_email}`;
    const remaining = event_bet - this.balance;

    return (
      <div>
        {/* Feed */}
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick}>
          <div className="wrapperBettingFeed">
              {<p>Role: {`${role}`}</p>}
              {statusLabel && <p>Status: {`${statusLabel}`}</p>}
              {/*<p>Date: {`${date}`}</p>}
              {<p>Bet: {`${goal}`}</p>}
    {<p>Balance: {`${balance}`}</p>*/}

              <div className="description">
                <p>{event_name}</p>
                <p>{event_date}</p>
                <p className="eventInfo">{event_predict}</p>
                <p className="odds">1:{event_odds}</p>
              </div>
              <hr className="line" />
              <div className="bottomWrapper">
                <div>
                  <Image src={conferenceCallIcon} alt="conference call icon" />
                  <p className="content">{shakeCount} <span>ninjas</span></p>
                </div>
                <div>
                  <Image src={ethereumIcon} alt="ethereum icon" />
                  <p className="content">{event_bet} ETH <span>pool</span></p>
                </div>
                <div>
                  <Image src={chipIcon} alt="chip icon" />
                  <p className="content">85% <span>filled</span></p>
                </div>
              </div>
              {isShowOptions && this.renderOptions()}
            </div>
        </Feed>
        {/* Shake */}
        {statusAction && <Button block onClick={() => { this.clickActionButton(statusAction); }}>{statusAction}</Button>}
        {/*<Button block onClick={() => { this.modalBetRef.open(); }}>Shake betting now</Button>*/}
        {/* Modal */}
        {<ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
  </ModalDialog>}
      </div>
    );
    
  }
  changeOption(value){
    console.log('Choose option:', value)
    //TO DO: Choose an option
  }
  clickActionButton(title){
    const {role} = this.state;
    const item = this.props;
    const {id, hid} = item;
    const offchain = id;
    switch(title){
      case BETTING_STATUS_LABEL.SHAKE: 
        this.modalBetRef.open();
        break;
      
      case BETTING_STATUS_LABEL.CLOSE: 
        // TO DO: CLOSE BET
        BetHandshakeHandler.closeItem(role, hid, offchain);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW: 
        // TO DO: WITHDRAW
        BettingHandshake.withdraw(role, hid, offchain);
        break;

      case BETTING_STATUS_LABEL.REJECT: 
        // TO DO: REJECT
        BettingHandshake.rejectItem(role, hid, offchain);
        break;

    }
    
  }
  updateStatus(result){
    this.setState({
      statusLabel: result.status,
      statusAction: result.action,
      isShowOptions: result.isShowOptions,
    })
  }
  receiveStatus(newState){
    //TO DO: update item
    //TO DO:
    const {role} = this.state;
    //const statusLabel = BetHandshakeHandler.getStatusLabel(status, role, eventDate);

    if(newState === BETTING_STATUS.SHAKED || newState === BETTING_STATUS.CLOSED){
        const deadlineResult = (eventDate.getTime() / 1000 - currentDate.getTime() / 1000);
        setTimeout(function(){ //After a time change to inited
          this.autoShowResult(role,eventDate);
    }.bind(this),deadlineResult*1000);

      const deadlineCancel = (eventDate.getTime() / 1000 - currentDate.getTime() / 1000) + CANCEL_WINDOWN_DAYS;
      setTimeout(function(){ //After a time change to inited
        this.autoCancel(role, eventDate);
    }.bind(this),deadlineCancel*1000);
    }
    const statusDict = BetHandshakeHandler.getStatusLabel(newState, role, eventDate);
    this.updateStatus(statusDict);

  }
  autoShowResult(role,eventDate){
    const {item} = this.props;
    const {status} = item;
    const result = BetHandshakeHandler.getStatusLabel(status, role, eventDate)
    if(result){
      this.updateStatus(result);
    }
    
  }
  autoCancel(role,eventDate){
    const item = this.props;
    const {hid, id} = item;
    const offchain = id;
    BettingHandshake.autoCancel(role,eventDate, "state", hid, offchain);
  }
  // autoSetWinner(role,state, eventDate){
  //   const {item} = this.props;
  //   const {status} = item;

  //   const result = BetHandshakeHandler.getStatusLabel(status, role, eventDate)
  //   if(result){
  //     this.updateStatus(result);
  //   }
    
  // }

  submitShake(amount){
    this.modalBetRef.close();
    const {role} = this.state;
    const item = this.props;
    const {hid, id} = item;
    const offchain = id;
    // let newItem = BetHandshakeHandler.shakeItem(role, eventDate, amount,goal,balance, item);
    // this.props.updatedItem(newItem);
    BetHandshakeHandler.shakeItem(role, hid, amount, offchain);

  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
});
export default connect(mapState, mapDispatch)(FeedBetting);

