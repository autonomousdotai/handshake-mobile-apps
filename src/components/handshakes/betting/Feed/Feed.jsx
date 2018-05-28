import React from 'react';
import PropTypes from 'prop-types';

// services, constants
import  { BetStatusHandler, ROLE } from './StatusHandler.js';

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

const date = '2018-06-18';
const eventDate = new Date(date);
const goal = 30;

class FeedBetting extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    userEmail: PropTypes.string,
    updatedItem: PropTypes.func,
  }

  static defaultProps = {
    item: {
      "contract_file": "QmNSDCSvXJwi34AUgW3pCK9jhP6HY611tb5gUfj4NS2VPp",
      "contract_file_name": "1526386710_2bf702980869bb1a8b0aa0b4126be6f3_crypto.pdf",
      "delivery_date": "Tue, 15 May 2018 12:18:28 GMT",
      "description": "long promises trong to test deploy.",
      "escrow_date": "Tue, 15 May 2018 12:18:28 GMT",
      "from_address": "0xBf7ca460D4D2AE804ade14b2399E2A2d67964983",
      "from_email": "pierre.neter@gmail.com",
      "hid": "442",
      "id": 530,
      "industries_type": 1,
      "public": 0,
      "signed_contract_file": "QmUfXMJhL55Kt8XtiQBkJyuSNYyaWbqpyBYy26rkJUPL7p",
      "source": "android",
      "status": 4,
      "term": 0,
      "to_address": "0x5eE2A7BF750Ad8103F04ec62FAbE502e3e3f93B4",
      "to_email": "trong1@autonomous.nyc",
      "user_id_shaked": 3,
      "balance": 0
    },
    userEmail: 'trong@autonomous.nyc',

  };

  constructor(props) {
      super(props);

      this.state = {
          role: ROLE.GUEST,
      };


  }

  componentDidMount() {
    const {userEmail, item} = this.props;
    console.log('From email: ', item.from_email);
    console.log('To Email:', item.to_email);
    console.log('User Email:', userEmail);
    const role = (userEmail === item.from_email) ? ROLE.PAYEE :
      (userEmail === item.to_email) ? ROLE.PAYER : ROLE.GUEST;
    console.log('Role:', role);
    this.setState({
      role
    });
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    console.log("render here");
    const {role} = this.state;
    const {item} = this.props;
    const {description, from_email, status, balance} = item;
    const bottomDes = `22 bettors against ${from_email}`;
    const remaining = goal - balance;

    const statusLabel = BetStatusHandler.getStatusLabel(status, role, eventDate);
    console.log('Action:', statusLabel.action);
    return (
      <div>
        {/* Feed */}
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick}>
          <div className="wrapperBettingFeed">
              {/*<p>Role: {`${role}`}</p>}
              {statusLabel.status && <p>Status: {`${statusLabel.status}`}</p>}
              {<p>Date: {`${date}`}</p>}
              {<p>Bet: {`${goal}`}</p>}
    {<p>Balance: {`${balance}`}</p>*/}

              <div className="description">
                <p>Birth of the royal baby</p>
                <p className="eventInfo">10 ETH that it is ginger</p>
                <p className="odds">1:10</p>
              </div>
              <hr/>
              <div className="bottomWrapper">
                <div>
                  <Image src={conferenceCallIcon} alt="conference call icon" />
                  <p className="content">22 <span>ninjas</span></p>
                </div>
                <div>
                  <Image src={ethereumIcon} alt="ethereum icon" />
                  <p className="content">10 ETH <span>pool</span></p>
                </div>
                <div>
                  <Image src={chipIcon} alt="chip icon" />
                  <p className="content">85% <span>filled</span></p>
                </div>
              </div>
            </div>
        </Feed>
        {/* Shake */}
        {statusLabel.action && <Button block onClick={() => { this.modalBetRef.open(); }}>{statusLabel.action}</Button>}
        <Button block onClick={() => { this.modalBetRef.open(); }}>Shake betting now</Button>
        {/* Modal */}
        <ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
        </ModalDialog>
      </div>
    );
  }

  submitShake(amount){
    this.modalBetRef.close();
    const {role} = this.state;
    const {item} = this.props;
    const {balance} = item;
    let newItem = BetStatusHandler.shakeItem(role, eventDate, amount,goal,balance, item);
    this.props.updatedItem(newItem);

  }
}

export default FeedBetting;
