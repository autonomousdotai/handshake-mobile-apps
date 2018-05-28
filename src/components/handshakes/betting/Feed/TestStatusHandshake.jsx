import React from 'react';
import PropTypes from 'prop-types';
import Button from '@/components/core/controls/Button';
import  {StatusHandler, BETTING_STATUS} from './StatusHandler.js';
import FeedBetting from '@/components/handshakes/betting/Feed';

const payeeEmail = 'sa@autonomous.nyc';
const payerEmail = 'trong@autonomous.nyc';
const guestEmail = 'hieu@autonomous.nyc';

const handshake = {
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
    "status": BETTING_STATUS.NOT_CREATE,
    "term": 0,
    "to_address": "0x5eE2A7BF750Ad8103F04ec62FAbE502e3e3f93B4",
    "to_email": "trong1@autonomous.nyc",
    "user_id_shaked": 3,
    "balance": 0
}
class TestStatusHanshake extends React.Component {
  static propTypes = {
    
  }
static defaultProps = {
   

}
constructor(props) {
    super(props);
    this.state = {
        item: null,
    };
}
createHandshake(){
    let item = handshake;
    item.status = BETTING_STATUS.INITING;
    item.from_email = payeeEmail;
    item.to_email = payerEmail;
    this.setState({
        item:handshake
    }, ()=>{
        setTimeout(function(){ //After a time change to inited
            console.log('Inited Item');
            let initedItem = this.state.item;
            initedItem.status = BETTING_STATUS.INITED;
            this.setState({
                item: initedItem,
            })
       }.bind(this),2*1000);

    }) 
}
updateItem(item){
    this.setState({
        item
    })
}
  render() {
    const {item} = this.state;
    return (
      <div>
      <Button  block onClick={()=> this.createHandshake()}>Create a Betting</Button>
      <label>Payee: {payeeEmail}</label>
      {item && <FeedBetting item={item} userEmail={payeeEmail} updatedItem={(item)=> this.updateItem(item)}/> }
      <label>Payer: {payerEmail}</label>
      {item && <FeedBetting item={item} userEmail={payerEmail} updatedItem={(item)=> this.updateItem(item)}/> }
      <label>Guest: {guestEmail}</label>
      {item && <FeedBetting item={item} userEmail={guestEmail} updatedItem={(item)=> this.updateItem(item)}/> }
      </div>
    );
  }
}

export default TestStatusHanshake;

