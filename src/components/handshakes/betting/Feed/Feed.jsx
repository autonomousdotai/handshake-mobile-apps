import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, SIDE} from './BetHandshakeHandler.js';
import momment from 'moment';

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
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';


class FeedBetting extends React.Component {
  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
      super(props);

      this.state = {
        actionTitle: null,
        isAction: false,
        role: null,
        isMatch: false,
      };


  }

  get isMatch(){
    const {shakeCount} = this.props;
    if(shakeCount){
      return shakeCount > 0 ? true : false;

    }
    return false;
  }

  componentDidMount() {
    const {status, side} = this.props;
    console.log('Props:', this.props);
    console.log('Status:', status);
    const hardCodeStatus = 2;
    const role = side;
    const isMatch = this.isMatch;
    const result = BetHandshakeHandler.getStatusLabel(hardCodeStatus, role, isMatch);
    const {title, isAction} = result;
    this.setState({
      actionTitle: title,
      isAction,
      role,
      isMatch,
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  get extraData(){
    const {extraData} = this.props
    console.log(extraData);
    try {
      return JSON.parse(extraData);
    }catch(e){
      console.log(e);
      return {}
    }
  }

  render() {
    const {actionTitle, isAction} = this.state;
    const {event_name, event_predict, event_odds, event_bet,event_date, balance} = this.extraData;

    return (
      <div>
        {/* Feed */}
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick} background="white">
          <div className="wrapperBettingFeed">
            <div className="description">
              <p>{event_name}</p>
              <p className="eventInfo">{event_predict}</p>
            </div>
            <div className="bottomWrapper">
              <p className="odds">1:{event_odds}</p>
              <div className="item">
              <Image src={ethereumIcon} alt="ethereum icon" />
              <p className="content">{event_bet} ETH <span>pool</span></p>
              </div>
            </div>
          </div>
        </Feed>
        {/* Shake */}
        {actionTitle && <Button block disabled={!isAction} onClick={() => { this.clickActionButton(actionTitle); }}>{actionTitle}</Button>}
        {/* Modal */}
        {/*<ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
    </ModalDialog>*/}
      </div>
    );

  }
  changeOption(value){
    console.log('Choose option:', value)
    //TO DO: Choose an option
  }
  
  clickActionButton(title){
    const {id, outcome_id, side, extraData, hid, odds} = item;
    const {event_bet, event_odds} = JSON.parse(extraData);
    //const hid = outcome_id;
    const stake = event_bet;
    const payout = stake * odds;
    const offchain = id;
    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        BettingShake.cancelBet(hid, side,stake,payout,offchain);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        BettingHandshake.withdraw(hid, offchain);
        break;

    }
    

  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
});
export default connect(mapState, mapDispatch)(FeedBetting);

