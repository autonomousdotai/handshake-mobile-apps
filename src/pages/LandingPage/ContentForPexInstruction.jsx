import React from 'react';
import { injectIntl } from 'react-intl';
import Image from '@/components/core/presentation/Image';

import './ContentForPexInstruction.scss';
import AvatarIcon from '@/assets/images/landing/prediction/pex_avatar_ins.svg';
import StepOne1 from '@/assets/images/landing/prediction/pex_step1_1.png';
import StepOne2 from '@/assets/images/landing/prediction/pex_step1_2.png';
import StepOne3 from '@/assets/images/landing/prediction/pex_step1_3.png';
import StepOne4 from '@/assets/images/landing/prediction/pex_step1_4.png';
import StepOne5 from '@/assets/images/landing/prediction/pex_step1_5.png';

import StepTwo1 from '@/assets/images/landing/prediction/pex_step2_1.png';
import StepTwo2 from '@/assets/images/landing/prediction/pex_step2_2.png';

import StepThree1 from '@/assets/images/landing/prediction/pex_step3_1.png';
import StepThree2 from '@/assets/images/landing/prediction/pex_step3_2.png';

import StepFourth1 from '@/assets/images/landing/prediction/pex_step4_1.png';


class ContentForPexInstruction extends React.Component {
  renderIntroduce() {
    return (
      <div className="wrapperPexIntroducer">
        <Image src={AvatarIcon} alt="AvatarIcon" />
        <p className="mt-3">Hello!</p>
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
        <div className="pexHeadline">Play with Ether or Bitcoin</div>
        <p>If you have already have Ether or Bitcoin, you can just transfer it straight from your wallet into our in-app one.</p>
        <div>
          <img src={StepOne1} width="30%" alt="StepOne1" />
          <img src={StepOne2} width="30%" alt="StepOne2" />
          <img src={StepOne3} width="30%" alt="StepOne3" />
        </div>
        <br />
        <p>No problem if you don’t, you can buy some directly in-app with your credit card.</p>
        <div>
          <img src={StepOne4} width="30%" alt="StepOne4" />
          <img src={StepOne5} width="30%" alt="StepOne5" />
        </div>
        <p>Or you can also use popular coin exchanges like <a target="__blank" className="landing-link" href="https://www.coinbase.com/">Coinbase</a> or <a className="landing-link" target="__blank" href="https://www.binance.com">Binance</a>.</p>
      </div>
    );

  }
  renderStep2() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">2</div>
        <div className="pexHeadline">Top up your Wallet.</div>
        <p>You can top up funds by transferring your coin into the in-app Wallet. It’s completely decentralized and the private key is held on your phone and only you can access it. Once that’s done, you’re all set to start forecasting.</p>
        <div>
          <img src={StepTwo1} width="30%" alt="StepTwo1" />
          <img src={StepTwo2} width="30%" alt="StepTwo2" />
        </div>
      </div>
    );
  }
  renderStep3() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">3</div>
        <div className="pexHeadline">Place a bet.</div>
        <p>First, pick a market (i.e. Man. City— Newcastle), the outcome (Man. City wins) and the side (support or bet against the outcome).</p>
        <div>
          <img src={StepThree1} width="30%" alt="StepThree1" />
          <img src={StepThree2} width="30%" alt="StepThree2" />
        </div>
        <br />
        <p>Then enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 3/1).</p>
        <p><strong>Example</strong>: The odds 3/1 means you could win 3 ETH for every 1 ETH you put down.</p>
        <p>The stake will be put into an escrow smart contract. The <strong>Prediction Matching Engine</strong> will then find another user to bet against the odds you’ve set.</p>
        <p><a target="__blank" className="landing-link" href="https://www.youtube.com/watch?v=fvjpNkvbQdQ&t=1m34s">Check out our video for more information on the odds and the simple and advanced options.</a></p>
      </div>
    );
  }
  renderStep4() {
    return (
      <div className="wrapperGuideStep">
        <div className="stepNumber">4</div>
        <div className="pexHeadline">Wait for the result.</div>
        <p>Once the event ends, the reporter of the market will report the result within the reporting window (set by the market creator).</p>
        <div>
          <img src={StepFourth1} width="30%" alt="StepFourth1" />
        </div>
        <br />
        <p>Generally, you should expect to have the report within minutes. If you win, your winnings will be automatically transferred from the escrow smart contract to your account.</p>
        <p>And that’s it!</p>
        <p>Easy huh?</p>
        <p><strong>Happy forecasting Ninjas!</strong></p>
        <p>Check out <a target="__blank" className="landing-link" href="https://ninja.org/prediction">ninja.org/prediction</a> on your mobile</p>
        <p>Connect with us on telegram: <a target="__blank" className="landing-link" href="https://t.me/ninja_org">http://t.me/ninja_org</a></p>
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
          </div>
        </div>
      </div>
    );
  }
}

ContentForPexInstruction.propTypes = {};

export default injectIntl(ContentForPexInstruction);
