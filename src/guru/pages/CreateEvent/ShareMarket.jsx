import React from 'react';
import { Link } from 'react-router-dom';
import { URL } from '@/constants';

export default class ShareMarket extends React.PureComponent {
  renderCheckmark = () => (
    <span className="checkmark">
      <div className="checkmark_circle" />
      <div className="checkmark_stem" />
      <div className="checkmark_kick" />
    </span>
  );

  renderMessage = () => {
    return (
      <div className="ShareEventMessage">
        <p>Your event was created successfully!</p>
        <p>It usually takes around an hour to verify and publish new events.</p>
        <p>You will receive an update by email along with a link to share your event with friends.</p>
        <p><Link to={URL.HANDSHAKE_PREDICTION}>Back to Homepage</Link></p>
      </div>
    );
  }

  render() {
    return (
      <div className="ShareMarketContainer">
        {this.renderCheckmark()}
        {this.renderMessage(this.props)}
      </div>
    );
  }
}
