import React from 'react';
import Image from '@/components/core/presentation/Image';

import './Reputation.scss';

class Reputation extends React.Component {

  renderProfile() {
    return (
      <div className="wrapperProfile">
        <div className="wrapperAvatar">
          <Image alt="Avatar" />
        </div>
        <div className="wrapperContent">
          <div>Grootsland</div>
          <div>Start</div>
        </div>
      </div>
    );
  }
  renderMarketNumber() {
    return (
      <div />
    );
  }
  renderETHNumber() {
    return (
      <div />
    );
  }
  renderDisputeNumber() {
    return (
      <div />
    );
  }
  renderGroupNumber() {
    return (
      <div className="wrapperGroupNumber">
        {this.renderMarketNumber()}
        {this.renderETHNumber()}
        {this.renderDisputeNumber()}
      </div>
    );
  }
  renderMarketList() {
    return (
      <div />
    );
  }
  render() {
    return (
      <div className="wrapperReputation">
        {this.renderProfile()}
        {this.renderGroupNumber()}
        {this.renderMarketList()}
      </div>
    );
  }
}
export default Reputation;
