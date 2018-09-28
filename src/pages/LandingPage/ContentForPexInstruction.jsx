import React from 'react';
import { injectIntl } from 'react-intl';
import Image from '@/components/core/presentation/Image';

import './ContentForPexInstruction.scss';
import AvatarIcon from '@/assets/images/landing/prediction/pex_avatar_ins.svg';
import StepOne1 from '@/assets/images/landing/prediction/pex_step1_1.png';
import StepOne2 from '@/assets/images/landing/prediction/pex_step1_2.png';
import StepOne3 from '@/assets/images/landing/prediction/pex_step1_3.png';

import StepTwo1 from '@/assets/images/landing/prediction/pex_step2_1.png';
import StepTwo2 from '@/assets/images/landing/prediction/pex_step2_2.png';

import StepThree1 from '@/assets/images/landing/prediction/pex_step3_1.png';
import StepThree2 from '@/assets/images/landing/prediction/pex_step3_2.png';

import StepFourth1 from '@/assets/images/landing/prediction/pex_step4_1.png';
import StepFourth2 from '@/assets/images/landing/prediction/pex_step4_2.png';

import StepFifth1 from '@/assets/images/landing/prediction/pex_step5_1.png';


import imgCheckOut from '@/assets/images/landing/prediction/pex_check_out.svg';
import imgSetting from '@/assets/images/landing/prediction/ico_setting.png';


class ContentForPexInstruction extends React.Component {
  renderIntroduce() {
    return (
      <div className="wrapperPexIntroducer">
        <Image src={AvatarIcon} alt="AvatarIcon" />
        <p>Hello!</p>
        <p>Cian here from the Prediction team. We’ve built the world a shiny new prediction exchange.</p>
        <p>If you’re thinking, <i>‘That’s great and all. But, how does it work and where do I start?’</i></p>
        <p>You’ve landed in the right place.</p>
        <p>In this piece, we’ll cover everything to help you get started with <strong>Prediction</strong>.</p>
      </div>
    );
  }
  renderTopContent() {
    return (
      <div className="wrapperPexTopContent">
        <div className="pexHeadline">How does the Prediction Exchange work?</div>
        <p><strong>Prediction</strong> is a electronic prediction system that allows any two anonymous parties from anywhere in the world to bet directly against each other without the need for a trusted third party.</p>
        <p>It’s been designed so anyone, anywhere can easily place bets and create their own markets.</p>
        <p><strong>ICE.</strong></p>
        <p><strong>BROKEN.</strong></p>
        <p><strong><i>Now let’s get you up and running.</i></strong></p>
      </div>
    );
  }
  renderStep1() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">1</div>
        <div className="pexHeadline">Backup Your Wallet</div>
        <p className="content"><strong>First the Important stuff!</strong></p>
        <p className="content">The entire <strong>Prediction</strong> platform is decentralized (which is awesome) but, that also means that you’re the one responsible for your wallet. Unfortunately, we can’t do anything for you, if something happens. It’s always better to be safe than sorry, so please backup your wallet.</p>
        <p className="content">On your mobile device, open <a href="https://ninja.org/wallet">ninja.org/wallet</a></p>
        <div className="wrapperGuideCenter">
          <div className="imageBlock">
            <div className="content">Figure 1.1</div>
            <img src={StepOne1} width="450" alt="StepOne1" />
          </div>
          <p className="content">Tap the settings cog {' '}
            <span className="icCheckOut">
              <Image src={imgSetting} alt="imgSetting" width="50px" />
            </span>icon in the top right corner. <i>(Figure 1.1)</i>
          </p>
          <div className="imageBlock">
            <div className="content">Figure 1.2</div>
            <img src={StepOne2} width="450" alt="StepOne2" />
          </div>
          <p className="content">Tap <strong>Backup wallets.</strong> <i>(Figure 1.2)</i></p>
          <div className="imageBlock">
            <div className="content">Figure 1.3</div>
            <img src={StepOne3} width="450" alt="StepOne3" />
          </div>
          <p className="content">You’ll see your private key code. Tap <strong>Copy it somewhere safe.</strong>{' '}<i>(Figure 1.3)</i></p>
        </div>
        <br />
        <p className="content">Congrats, your wallet is now backed up! (You should store your code somewhere super, super safe...like a vault or something).</p>

      </div>
    );
  }


  renderStep2() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">2</div>
        <div className="pexHeadline">Play with Ether or Bitcoin</div>
        <p className="content">If you have already have Ether or Bitcoin, you can just transfer it straight from your wallet into our in-app one.</p>
        <div className="wrapperGuideCenter">
          <div className="imageBlock">
            <div className="content">Figure 2.1</div>
            <img src={StepTwo1} width="450" alt="StepTwo1" />
          </div>
          <div className="imageBlock">
            <div className="content">Figure 2.2</div>
            <img src={StepTwo2} width="450" alt="StepTwo2" />
          </div>
        </div>
        <p className="content">Or you can copy over the address to buy from popular coin exchanges like <strong>Coinbase</strong> or <strong>Binance</strong>. <i>(Figure 2.1, Figure 2.2)</i></p>
      </div>
    );
  }


  renderStep3() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">3</div>
        <div className="pexHeadline">Top Up By Credit Card</div>
        <p className="content">On your mobile device, open <a href="https://ninja.org/buy-by-credit-card">ninja.org/buy-by-credit-card</a></p>
        <div className="wrapperGuideCenter">
          <div className="imageBlock">
            <div className="content">Figure 3.1</div>
            <img src={StepThree1} width="450" alt="StepThree1" />
          </div>
          <p className="content">Choose a coin and enter the amount you’re buying. Tap the <strong>Buy</strong> button. <i>(Figure 3.1)</i></p>
          <div className="imageBlock">
            <div className="content">Figure 3.2</div>
            <img src={StepThree2} width="450" alt="StepThree2" />
          </div>
          <p className="content">Enter your credit card details and tap <strong>Pay Now.</strong> <i>(Figure 3.2)</i></p>
        </div>
      </div>
    );
  }

  renderStep4() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">4</div>
        <div className="pexHeadline">Place a bet.</div>
        <p className="content">Open <a href="https://ninja.org/pex">ninja.org/pex</a></p>
        <p className="content">First, pick an <strong>event</strong> (i.e. Man. City— Newcastle), the <strong>outcome</strong> (Man. City wins) and the side (support or bet against the outcome).</p>
        <div className="wrapperGuideCenter wrapperImages">
          <div className="imageBlock">
            <div className="content">Figure 4.1</div>
            <img src={StepFourth1} width="450" alt="StepThree1" />
          </div>
          <div className="imageBlock">
            <div className="content">Figure 4.2</div>
            <img src={StepFourth2} width="450" alt="StepThree2" />
          </div>
        </div>
        <br />
        <div className="content">
          <p>Then enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 4.0). <i>(Figure 4.1, Figure 4.2)</i></p>
          <p><strong>Example</strong>: The odds 4.0 means you could win 3 ETH for every 1 ETH you put down.Total winnings: 1 ETH + 3TH = 4ETH</p>
          <p>Tap <strong>Bet Now.</strong></p>
          <p>The stake will be put into an escrow smart contract. The <strong>Prediction Matching Engine</strong> will then find another user to bet against the odds you’ve set.</p>
          <p><a target="__blank" className="landing-link" href="https://www.youtube.com/watch?v=fvjpNkvbQdQ&t=1m34s">
            <span className="icCheckOut">
              <Image src={imgCheckOut} alt="imgCheckOut" />
            </span>Check out our video for more information on the odds and the simple and advanced options.</a></p>
        </div>
      </div>
    );
  }
  renderStep5() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">5</div>
        <div className="pexHeadline">Wait for the result.</div>
        <p className="content">Once the event ends, the reporter of the market will report the result within the reporting window (set by the market creator).</p>
        <div className="wrapperGuideCenter wrapperImages imageBlock" >
          <div className="content">Figure 5.1</div>
          <img src={StepFifth1} width="450" alt="StepFifth1" />
        </div>
        <br />
        <div className="content">
          <p>There will be a short window to dispute the result (again set by the market creator).</p>
          <p>After which the result will be final and verified. If you win, your winnings will be automatically transferred from the escrow smart contract to your account. <i>(Figure 5.1)</i></p>
          <p>Or if the result was successfully disputed, you’ll be completely refunded.</p>
          <p>And that’s it!</p>
          <p><strong>Happy forecasting Ninjas!</strong></p>
          <div className="line" />
          <p>Check out <a target="__blank" className="landing-link" href="https://ninja.org/prediction">ninja.org/prediction</a> on your mobile</p>
          <p>Connect with us on telegram: <a target="__blank" className="landing-link" href="https://t.me/ninja_org">http://t.me/ninja_org</a></p>
        </div>
      </div>
    );
  }
  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="wrapperContentPexInstruction mt-5">
        <div className="row mt-5">
          <div className="col">
            {this.renderIntroduce()}
            {this.renderTopContent()}
            {this.renderStep1()}
            {this.renderStep2()}
            {this.renderStep3()}
            {this.renderStep4()}
            {this.renderStep5()}
          </div>
        </div>
      </div>
    );
  }
}

ContentForPexInstruction.propTypes = {};

export default injectIntl(ContentForPexInstruction);
