import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, SIDE, BETTING_STATUS_LABEL, ROLE, MESSAGE, BET_BLOCKCHAIN_STATUS} from './BetHandshakeHandler.js';
import momment from 'moment';
import {MasterWallet} from '@/models/MasterWallet';

import local from '@/services/localStore';
import {FIREBASE_PATH, HANDSHAKE_ID, API_URL, APP} from '@/constants';
import { uninitItem, collect, refund, collectFree, rollback, uninitItemFree } from '@/reducers/handshake/action';
import { loadMyHandshakeList, updateBettingChange} from '@/reducers/me/action';


// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';
import {showAlert} from '@/reducers/app/action';
import {getMessageWithCode, isRightNetwork, getId, 
  getShakeOffchain, getBalance, getEstimateGas, isSameAddress, foundShakeList} from '@/components/handshakes/betting/utils.js';


// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();
const ROUND = 1000000;
const ROUND_ODD = 10;
const BACKGROUND_COLORS = [
  'linear-gradient(-135deg, #FFA7E7 0%, #EA6362 100%)',
  'linear-gradient(-135deg, #17EAD9 0%, #6078EA 100%)',
  'linear-gradient(-135deg, #23BCBA 0%, #45E994 100%)',
  'linear-gradient(-135deg, #FFDEA7 0%, #EA6362 100%)',
  'linear-gradient(-133deg, #9B3CB7 0%, #FF396F 100%)',
  'linear-gradient(-133deg, #004B91 0%, #78CC37 100%)',
  'linear-gradient(-135deg, #38B8F2 0%, #843CF6 100%)',
  'linear-gradient(-135deg, #E35C67 0%, #381CE2 100%)',
  'linear-gradient(-135deg, #EFBFD5 0%, #9D61FD 100%)',
  'linear-gradient(-135deg, #45E0A7 0%, #D5E969 100%)',
  'linear-gradient(45deg, #FBC79A 0%, #D73E68 100%)',
  'linear-gradient(45deg, #F6AB3E 0%, #8137F7 100%)',
];

class FeedBetting extends React.Component {

  backgroundCss(background) {
    return background ? background : this.BACKGROUND_COLORS[Math.floor(Math.random() * this.BACKGROUND_COLORS.length)];
  }

  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
      super(props);

      this.state = {
        actionTitle: null,
        statusTitle: null,
        isAction: false,
        role: null,
        itemInfo: props,
        amountMatch: 0,
        winMatch: 0,
      };


  }

  get isMatch(){
    const {shakeUserIds} = this.props;
    if(shakeUserIds){
      return shakeUserIds.length > 0 ? true : false;

    }
    return false;
  }

  isShakeUser(shakeIds, userId){
    //console.log('User Id:', userId);
    //console.log('ShakeIds:', shakeIds);

    if(shakeIds){

      if(shakeIds.indexOf(userId) > -1){
        return true;

      }

    }
  }

  handleStatus(props){

    const {result, shakeUserIds, id, amount, remainingAmount, odds} = props; // new state

    const profile = local.get(APP.AUTH_PROFILE);
    const isUserShake = this.isShakeUser(shakeUserIds, profile.id);
    const isMatch = this.isMatch;
    let amountMatch = 0;
    let winMatch = 0;
    let itemInfo = props;
    if(isMatch){
      amountMatch = amount - remainingAmount;
      winMatch = amountMatch * odds;
    }
    
    console.log('Amount,RemainingAmount, AmountMatch:', amount,remainingAmount,  amountMatch);
    if(isUserShake){
      /*
      const extraData = this.extraData;
      console.log('Extra data:', extraData);
      const {shakers} = extraData;
      */
      //const idOffchain = getId(id);

      /*
      if(shakers){
        const foundShakedItem = shakers.find(element => element.shaker_id === profile.id && element.handshake_id === idOffchain);
        //console.log('Found Shaked Item:', foundShakedItem);
        if(foundShakedItem){
          itemInfo = foundShakedItem;

        }
      }
      */
     const shakedItemList = foundShakeList(props, id);
     if(shakedItemList.length > 0){
       itemInfo = shakedItemList[0];
       amountMatch = itemInfo.amount;
       winMatch = amountMatch * itemInfo.odds;
     }
    }
    const status = itemInfo.status;
    const side = itemInfo.side;

    const role = isUserShake ? ROLE.SHAKER : ROLE.INITER;
    //const blockchainStatusHardcode = 5;
    //const isMatch = true;
    //const hardCodeResult = 2;
    console.log('Is Match:', isMatch);

    const statusResult = betHandshakeHandler.getStatusLabel(status, result, role,side, isMatch);
    const {title, isAction} = statusResult;
    this.setState({
      actionTitle: title,
      statusTitle: statusResult.status,
      isAction,
      role,
      itemInfo,
      amountMatch,
      winMatch
    })
  }

  randomItemInList(list) {
    return list[Math.floor(Math.random() * list.length)]
  }

  componentDidMount() {
    this.handleStatus(this.props);

  }

  componentWillReceiveProps(nextProps) {
    console.log('Feeding Next Props:', nextProps);

    this.handleStatus(nextProps);
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

  renderStatus = () => {
    const { statusTitle } = this.state;
    return <div className="statusBetting">{statusTitle || ''}</div>;
  }

  render() {
    const {actionTitle , isAction, itemInfo, amountMatch, winMatch } = this.state;
   
    const {amount, odds, side, remainingAmount } = itemInfo;
    const {event_name, event_predict} = this.extraData;
    const winValue = amount * odds;
    const remainingValue = remainingAmount || 0;
    const displayAmount = Math.floor(amount * ROUND)/ROUND;
    const displayMatchedAmount = Math.floor(amountMatch * ROUND)/ROUND;
    const displayRemaining = Math.floor(remainingValue * ROUND)/ROUND;

    const styleEventName = {
      background: this.randomItemInList(BACKGROUND_COLORS),
    };
    const colorBySide = side === 1 ? `support` : 'oppose';

    let eventName = event_name ? event_name: '';
    if(eventName.indexOf('Event') === -1){
      eventName = `Event: ${eventName}`;
    }
    let predictName = event_predict ? event_predict : '';
    if(predictName.indexOf('Outcome')!== -1) {
      predictName = event_predict.slice(8);
    }
    console.log('Remaining Amount:', remainingAmount);
    let buttonClassName = "cancel";
    switch(actionTitle){

      case BETTING_STATUS_LABEL.CANCEL:
      break;

      case BETTING_STATUS_LABEL.WITHDRAW:
      buttonClassName= "withdraw";

        break;
      case BETTING_STATUS_LABEL.REFUND:
      buttonClassName= "refund";

      break;
      default:
      break;

    }

    return (
      <div>
        {/* Feed */}
        <Feed
          className="wrapperBettingFeedMe"
          handshakeId={this.props.id}
          onClick={this.props.onFeedClick}
          background="white"
        >
          <div className="eventName" style={styleEventName}>
            {eventName}
          </div>

          <div className={`predictName`}>
            <span className={colorBySide}>{side === 1 ? `Support: ` : 'Oppose: '}</span>{predictName}
          </div>

          <div className="bettingInfo">
            <div>
              <div className="description">Matched bet (ETH)</div>
              {/*<div className="value">{amount.toFixed(6)} ETH</div>*/}
              {<div className="value">{displayMatchedAmount}/{displayAmount}</div>}

            </div>
            <div>
              <div className="description">On odds</div>
              <div className={`value ${colorBySide}`}> {Math.floor(odds*ROUND_ODD)/ROUND_ODD}</div>
            </div>
            <div>
              <div className="description">You could win</div>
              <div className="value">{Math.floor(winMatch * ROUND) / ROUND} ETH</div>
              {/*winMatch > 0 && <div className="value">{Math.floor(winMatch * ROUND) / ROUND} ETH matched</div>*/}
            </div>
          </div>
          {remainingAmount > 0 && <div className="bettingInfo">
              <div className="value"> Remaining {displayRemaining} ETH</div>
          </div>}

          <div className="bottomDiv">
            {this.renderStatus()}
             {actionTitle && <Button block className={buttonClassName} disabled={!isAction} onClick={() => { this.clickActionButton(actionTitle); }}>{actionTitle}</Button>}
          </div>
        </Feed>
      </div>
    );

  }
  changeOption(value){
    //console.log('Choose option:', value)
    //TO DO: Choose an option
  }
  handleActionFree(title, id){
    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        this.uninitItem(realId);
        break;
      case BETTING_STATUS_LABEL.WITHDRAW:
        this.collectFree(id);
        break;

    }
  }
  handleActionReal(title, offchain, hid){
    const realId = getId(offchain);
    const {itemInfo} = this.state;

    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        const {side, amount, odds} = itemInfo;

        betHandshakeHandler.cancelBet(hid, side, amount, odds, offchain);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        //this.collect(id);
        //this.rollback(id);
        betHandshakeHandler.withdraw(hid, offchain);
        break;
      case BETTING_STATUS_LABEL.REFUND:
      this.refund(realId);
      break;

    }
  }

  async clickActionButton(title){
    const balance = await getBalance();
    const estimatedGas = await getEstimateGas();
    let message = null;
    const {id, shakeUserIds, freeBet, fromAddress, hid} = this.props; // new state
    let idCryptosign = id;
    let isFreeBet = freeBet;
    let userFromAddress = fromAddress;
    const profile = local.get(APP.AUTH_PROFILE);
    const isUserShake = this.isShakeUser(shakeUserIds, profile.id);
    if(isUserShake){
      /*
      const extraData = this.extraData;
      const {shakers} = extraData;
      const idOffchain = getId(id);

      if(shakers){
        const foundShakedItem = shakers.find(element => element.shaker_id === profile.id && element.handshake_id === idOffchain);
        console.log('Found Shaked Item:', foundShakedItem);
        if(foundShakedItem){
          idCryptosign = getShakeOffchain(foundShakedItem.id);
          isFreeBet = foundShakedItem.free_bet;
          userFromAddress = foundShakedItem.from_address;
        }
        
      }
      */
     const shakedItemList = foundShakeList(this.props, id);
     if(shakedItemList.length > 0){
       let shakeItem = shakedItemList[0];
       idCryptosign = getShakeOffchain(shakeItem.id);
        isFreeBet = shakeItem.free_bet;
        userFromAddress = shakeItem.from_address;
     }
    }
    console.log("idCryptosign, isFreeBet, isUserShaker, fromAddress: ", idCryptosign, 
    isFreeBet, isUserShake, userFromAddress);
    //userFromAddress = "abc";
    if(!isRightNetwork()){
      message = MESSAGE.RIGHT_NETWORK;
    }else if (!isSameAddress(userFromAddress)){
      message = MESSAGE.DIFFERENCE_ADDRESS;
    }
    else {
      if(isFreeBet){
        this.handleActionFree(title,idCryptosign);
      }
      else {
        if(estimatedGas > balance){
          message = MESSAGE.NOT_ENOUGH_GAS;

        }else {
          this.handleActionReal(title, idCryptosign, hid);

        }
      }

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
  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }
  /*
  async uninitItem(id){
    const balance = await getBalance();
    console.log('Balance:', balance);
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE.concat(`/${id}`);
    this.props.uninitItem({PATH_URL: url, METHOD:'POST',
    successFn: this.uninitHandshakeSuccess,
    errorFn: this.uninitHandshakeFailed
  });
  }
  uninitHandshakeSuccess= async (successData)=>{
    console.log("uninitHandshakeSuccess", successData);
    const {status, data} = successData
    if(status && data){
      const {hid, side, amount, odds, offchain, status} = data;

      const {itemInfo} = this.state;
      let updateInfo = Object.assign({}, itemInfo);
      //updateInfo.bkStatus = itemInfo.status;
      updateInfo.status = status;

      //this.handleStatus(updateInfo);
      this.props.updateBettingChange(updateInfo);

      const stake = amount;
      //const payout = stake * odds;
      const result = await betHandshakeHandler.cancelBet(hid, side, stake, odds, offchain);
      // const {hash} = result;
      // if(hash === -1){
      //   this.rollback(offchain);
      // }
      //this.loadMyHandshakeList();

    }
  }
  uninitHandshakeFailed = (error) => {
    console.log('uninitHandshakeFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

  }
  */
  async uninitItemFree(id){
    const balance = await getBalance();
    console.log('Balance:', balance);
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE_FREE.concat(`/${id}`);
    this.props.uninitItemFree({PATH_URL: url, METHOD:'POST',
    successFn: this.uninitHandshakeFreeSuccess,
    errorFn: this.uninitHandshakeFreeFailed
  });
  }
  uninitHandshakeFreeSuccess= async (successData)=>{
    console.log("uninitHandshakeFreeSuccess", successData);
    const {status} = successData
    if(status){
      const {itemInfo} = this.state;

      let updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
      this.props.updateBettingChange(updateInfo);

    }
  }
  uninitHandshakeFreeFailed = (error) => {
    console.log('uninitHandshakeFreeFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }
  
  }
  collectFree(id){
    console.log('Call Collect Free');
    let params = {
      offchain: id
    }
    this.props.collectFree({PATH_URL: API_URL.CRYPTOSIGN.COLLECT_FREE, METHOD:'POST',data: params,
    successFn: this.collectFreeSuccess,
    errorFn: this.collectFreeFailed
  });
  }

  collectFreeSuccess = async (successData)=>{
    console.log('collectFreeSuccess', successData);
    const {status} = successData
    if(status){
      this.props.showAlert({
        message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        }
      });
      const {itemInfo} = this.state;

      let updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
      this.props.updateBettingChange(updateInfo);

    }
  }
  collectFreeFailed = (error) => {
    console.log('collectFreeFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }
  }

  /*
  collect(id){
    console.log('Withdraw');
    let params = {
      offchain: id
    }
    this.props.collect({PATH_URL: API_URL.CRYPTOSIGN.COLLECT, METHOD:'POST',data: params,
    successFn: this.collectSuccess,
    errorFn: this.collectFailed
  });
  }

  collectSuccess = async (successData)=>{
    console.log('collectSuccess', successData);
    const {status} = successData
    if(status){
      const {hid, id, status, shakeUserIds} = this.props;
      const profile = local.get(APP.AUTH_PROFILE);
      const isUserShake = this.isShakeUser(shakeUserIds, profile.id);
      const {itemInfo} = this.state;
      let offchain = id;
      if(isUserShake){
        //offchain = betHandshakeHandler.getShakeOffchain(itemInfo.id);
        const extraData = this.extraData;
      const {shakers} = extraData;
      const idOffchain = betHandshakeHandler.getId(id);

      if(shakers){
        const foundShakedItem = shakers.find(element => element.shaker_id === profile.id && element.handshake_id === idOffchain);
        //console.log('Found Shaked Item:', foundShakedItem);
        if(foundShakedItem){
          offchain = betHandshakeHandler.getShakeOffchain(foundShakedItem.id);
        }
      }
      }
      let updateInfo = Object.assign({}, itemInfo);
      //updateInfo.bkStatus = itemInfo.status;
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
      

      //this.handleStatus(updateInfo);
      this.props.updateBettingChange(updateInfo);


      this.setState({
        itemInfo: updateInfo
      });
      console.log('Withdraw hid, offchain:', hid, offchain);
     const result = await betHandshakeHandler.withdraw(hid, offchain);
     const {blockHash} = result;
     if(blockHash){
      this.props.showAlert({
        message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        }
      });
     }
     //  const {hash} = result;
    //  if(hash === -1){
    //    // Error, rollback
    //    this.rollback(offchain);
    //  }
     //this.loadMyHandshakeList();

    }
  }
  collectFailed = (error) => {
    console.log('collectFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = betHandshakeHandler.getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

  }
  */

  refund(id){
    const url = API_URL.CRYPTOSIGN.REFUND.concat(`/${id}`);
    this.props.refund({PATH_URL: API_URL.CRYPTOSIGN.REFUND, METHOD:'POST',
    successFn: this.refundSuccess,
    errorFn: this.refundFailed
  });
  }

  refundSuccess = async (successData)=>{
    console.log('refundSuccess', successData);
    const {status} = successData
    if(status){
      const {hid, id, status} = this.props;
      const {itemInfo} = this.state;
      let updateInfo = Object.assign({}, itemInfo);
      updateInfo.bkStatus = itemInfo.status;
      updateInfo.status = status;

      //this.handleStatus(updateInfo);
      this.props.updateBettingChange(updateInfo);


      const offchain = id;
      const result = await betHandshakeHandler.refund(hid, offchain);
      // const {hash} = result;
      // if(hash === -1){
      //   // Error, rollback
      //   this.rollback(offchain);
      // }
      //this.loadMyHandshakeList();

    }
  }
  refundFailed = (error) => {
    console.log('refundFailed', error);
    const {status, code} = error;
    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

  }

  
  rollback(offchain){
    const params = {
      offchain
    }
    this.props.rollback({PATH_URL: API_URL.CRYPTOSIGN.ROLLBACK, METHOD:'POST', data: params,
    successFn: this.rollbackSuccess,
    errorFn: this.rollbackFailed
  });
  }
  rollbackSuccess = async (successData)=>{
    console.log('rollbackSuccess', successData);
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
    const {status, code} = error;

    if(status == 0){
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }
  }
  
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
  loadMyHandshakeList,
  updateBettingChange,
  uninitItem,
  collect,
  collectFree,
  refund,
  rollback,
  showAlert,
  uninitItemFree
});
export default connect(mapState, mapDispatch)(FeedBetting);
