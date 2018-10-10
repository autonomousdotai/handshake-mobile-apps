import React from 'react';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import LuckyDrawBanner from '@/assets/images/luckydraw/lucky_draw_banner.png';
import LuckyDrawGuide from '@/assets/images/luckydraw/lucky_draw_mechanic.png';

import './LuckyDrawMechanic.scss';

class LuckyDrawMechanic extends React.Component {
  renderHeader() {
    return (
      <div className="wrapperHeader">
        <div className="headerLink">Product/Lucky Draw</div>
        <div className="headerImage">
          <Image src={LuckyDrawBanner} alt="LuckyDrawBanner" />
        </div>
      </div>
    );
  }
  renderTemCondition() {
    return (
      <div className="wrapperTermCondition">
        <div>Terms & Condition</div>
        <div>Only entrants with a valid email associated with their account will be entered into the prize draw. One entry per real bet. 10x prizes of 1ETH to be won. The draw will take place when we reach 1000 real bets.</div>
      </div>
    );
  }
  renderLuckyDraw() {
    return (
      <div className="wrapperLuckyDraw">
        <div className="wrapperContent">
          <div className="wrapperluckyDrawTitle">
            <div className="luckyDrawTitle">Lucky Draw</div>
            <span className="yellowLine one" />
            <span className="yellowLine two" />
          </div>
          <div className="luckyDrawContent">
            <p>Every ‘real’ bet will enter that Ninja into the prize draw once. Ninjas may earn multiple prize draw entries by betting multiple times.</p>
            <p>When we reach 1000 real bets, we will draw 10 winners using a true random number generator (TRNG) and drop 1ETH into each of their wallets.</p>
            <p>To be eligible, participants must associate their email address with their Ninja profile in order to be notified about winnings. We can’t let you know that you’ve won if we can’t contact you! Only entrants with a valid email address associated with their accounts will be entered into the prize draw.</p>
            {this.renderTemCondition()}
          </div>
        </div>
        <div className="wrapperImage">
          <Image src={LuckyDrawGuide} alt="LuckyDrawGuide" width="350" />
        </div>
      </div>
    );
  }
  renderMechanics() {
    return (
      <div className="wrapperMechanic">
        <div className="mechanicTitle">Mechanics</div>
        <div className="mechanicContent">
          <p>RANDOM.ORG will pick the 10x winners using true randomness. The drawing records will be ‘Entrant-accessible’ for transparency. This means that entrants who know their unique identifier (wallet address) can query the record to check to see that they were entered and whether they were picked as winners</p>
          <p>Wallet and email addresses will not appear publicly in any records of the lucky draw.</p>
          <p>For more information about RANDOM.ORG and true randomness, visit www.random.org/faq/.</p>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="wrapperMechanicLuckyDraw">
        {this.renderHeader()}
        {this.renderLuckyDraw()}
        {this.renderMechanics()}
      </div>

    );
  }
}
export default LuckyDrawMechanic;
