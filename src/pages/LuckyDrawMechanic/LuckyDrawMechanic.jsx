import React from 'react';
import BrowserDetect from '@/services/browser-detect';

import Image from '@/components/core/presentation/Image';
import LuckyDrawBanner from '@/assets/images/luckydraw/lucky_draw_banner.png';
import LuckyDrawGuide from '@/assets/images/luckydraw/lucky_draw_mechanic.png';

import './LuckyDrawMechanic.scss';

class LuckyDrawMechanic extends React.Component {
  renderHeader() {
    return (
      <div className="wrapperHeader">
        <div className="pd-breadcrumb">
          <a href="/product">Product</a>
          <span className="mx-2">/</span>
          <span>Lucky Draw</span>
        </div>
        <div className="headerImage">
          <Image src={LuckyDrawBanner} alt="LuckyDrawBanner" />
        </div>
      </div>
    );
  }
  renderTemCondition() {
    return (
      <div className="wrapperTermCondition">
        <div>Terms & Conditions</div>
        <div>Only entrants with a valid email associated with their account will be entered into the prize draw. One entry per bet. 10x prizes of 1ETH to be won. The draw will take place when we reach 1000 bets.</div>
      </div>
    );
  }
  renderLuckyDraw() {
    const luckyDrawClass = BrowserDetect.isDesktop ? 'wrapperLuckyDraw desktop' : 'wrapperLuckyDraw';
    const luckyDrawContent = BrowserDetect.isDesktop ? 'luckyDrawContentDesktop' : 'luckyDrawContent';
    return (
      <div className={luckyDrawClass}>
        <div className="wrapperContent">
          <div className="wrapperluckyDrawTitle">
            <div className="luckyDrawTitle">Lucky Draw</div>
            {/*<span className="yellowLine one" />
    <span className="yellowLine two" />*/}
          </div>
          <div className={luckyDrawContent}>
            <p>Every bet will enter that Ninja into the prize draw once. Ninjas may earn multiple prize draw entries by betting multiple times.</p>
            <p>When we reach 1000 bets, we will draw 10 winners using a true random number generator (TRNG) and drop 1ETH into each of their wallets.</p>
            <p>To be eligible, participants must associate their email address with their Ninja profile in order to be notified about winnings. We can’t let you know that you’ve won if we can’t contact you! Only entrants with a valid email address associated with their accounts will be entered into the prize draw.</p>
          </div>
        </div>
        <div className="wrapperImage">
          <Image src={LuckyDrawGuide} alt="LuckyDrawGuide" width="450" />
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
          <p>For more information about RANDOM.ORG and true randomness, visit <a href="https://www.random.org/faq/">www.random.org/faq</a>.</p>
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
        {this.renderTemCondition()}

      </div>

    );
  }
}
export default LuckyDrawMechanic;
