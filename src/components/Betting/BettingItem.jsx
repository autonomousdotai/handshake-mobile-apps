import React from 'react';
import PropTypes from 'prop-types';
import './css/BettingItem.scss';
class BetingItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
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
            "user_id_shaked": 3
          }

    }
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }
    render() {
        const {item} = this.props;
        const {description, from_email} = item;
        const bottomDes = `22 bettors against ${from_email}`;
        return (
            <div>
            <p className="description">{description}</p>
            <div className="bottomWrapper">
                <div className="email">{bottomDes}</div>
                <div className="email">80%</div>
            </div>
            </div>
        );
    }
}
export default BetingItem;

