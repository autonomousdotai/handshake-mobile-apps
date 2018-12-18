import React from 'react';
import Icon from '@/guru/components/Icon/Icon';
import { URL, SOCIAL, EXT } from '@/constants';

import YtbFrame from '@/guru/components/YtbFrame/YtbFrame';

// Icons
import LogoWhite from '@/assets/images/pex/extension/logo-white.svg';
import LogoBlack from '@/assets/images/pex/extension/logo-black.svg';
import MacSVG from '@/assets/images/pex/extension/mac.svg';
import ethToWallet from '@/assets/images/pex/extension/eth-to-wallet.svg';
import yesNo from '@/assets/images/pex/extension/yes-no.svg';
import makePrediction from '@/assets/images/pex/extension/make-prediction.svg';
import ninjas from '@/assets/images/pex/extension/2ninjas.svg';
import iphone from '@/assets/images/pex/extension/iphone.svg';
import whyMode from '@/assets/images/pex/extension/why-mode.svg';
import whyPayout from '@/assets/images/pex/extension/why-payout.svg';
import whyP2p from '@/assets/images/pex/extension/why-p2p.svg';
import screens from '@/assets/images/pex/extension/screens.png';

import SubscribeEmail from './subscribeEmail';
import './Extension.scss';

function clipOnMac() {
  const ytbFrameProps = {
    config: {
      title: 'Chrome Extension Instruction',
      src: EXT.CLIP_SOURCE,
      frameBorder: '0',
      allow: 'autoplay; encrypted-media',
      allowFullScreen: true,
      className: 'videoClip'
    },
    pathFrame: MacSVG
  };
  return <YtbFrame {...ytbFrameProps} />;
}

function addChromeBtn() {
  return (
    <div className="AddChromeSection">
      <a href={EXT.URL} className="btn AddChromeBtn" target="_blank">
        <i className="fab fa-chrome" />
        <span>Add to Chrome</span>
      </a>
      <p className="OrOpen">
        or open{' '}
        <a href={URL.HANDSHAKE_PREDICTION} target="_blank">
          ninja.org
        </a>{' '}
        on your mobile browser
      </p>
    </div>
  );
}

function header() {
  return (
    <header>
      <Icon className="Logo" path={LogoWhite} />
      <div className="LeftBlock">
        <h1 className="HeadLine">
          NINJA
        </h1>
        <h3 className="SubHeadLine">Outsmart the Internet</h3>
        <p className="DescHeadline">
          Predict tomorrow's news. <br />
          Win crypto for being right - about anything.
        </p>
        {addChromeBtn()}
      </div>
      <div className="RightBlock">
        {clipOnMac()}
      </div>
    </header>
  );
}

function whyNinja() {
  return (
    <section className="WhyNinja">
      <div className="TitleWrapper">
        <h4 className="NavTitle">Why Ninja</h4>
        <h2 className="Title">A BETTER WAY TO PLAY</h2>
        <div className="SmallLine" />
      </div>
      <div className="BlockContent">
        <div className="BlockLeft">
          <Icon path={iphone} />
        </div>
        <div className="BlockRight">
          <div className="Item">
            <p className="ItemTitle">
              <Icon path={whyP2p} />
              Decentralized, P2P
            </p>
            <p className="ItemDesc">
              No bookies and no books. Ninja is a platform that directly
              connects users with different opinions, without holding funds or
              taking bets. There is no house, just other ninjas to outsmart.
            </p>
          </div>
          <div className="Item">
            <p className="ItemTitle">
              <Icon path={whyPayout} />
              Guaranteed payouts
            </p>
            <p className="ItemDesc">
              All user funds are held in Escrow, powered by smart contract
              technology. Winnings are automatically distributed without the
              need for a middleman.
            </p>
          </div>
          <div className="Item">
            <p className="ItemTitle">
              <Icon path={whyMode} />
              Ninja stealth mode
            </p>
            <p className="ItemDesc">
              No sign-ups. You hold your own private key, and have full control
              over your privacy. You are undetectable and 100% anonymous. We
              don't hold your data and never will.{' '}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function howToPlay() {
  return (
    <section className="HowToPlay">
      <div className="TitleWrapper">
        <h4 className="NavTitle">How to play</h4>
        <h2 className="Title">READY, SET, PREDICT</h2>
        <div className="SmallLine" />
      </div>
      <div className="BlockContent">
        <div className="Item">
          <div className="ItemImage">
            <Icon path={ethToWallet} />
          </div>
          <p className="ItemTitle">Add ETH to wallet</p>
          <p className="ItemDesc">
            Click the Top Up button (on desktop) or wallet icon (on mobile) to
            get your Ninja wallet address. Transfer funds from an external
            wallet. Remember to back it up!
          </p>
        </div>
        <div className="Item">
          <div className="ItemImage">
            <Icon path={yesNo} />
          </div>
          <p className="ItemTitle">Choose a debate</p>
          <p className="ItemDesc">
            Scroll to see what people are talking about. What will you predict
            on today? If you can't find anything interesting, start a new
            debate.
          </p>
        </div>
        <div className="Item">
          <div className="ItemImage">
            <Icon path={makePrediction} />
          </div>
          <p className="ItemTitle">Make your prediction</p>
          <p className="ItemDesc">
            Tap Yes or No to any question. Enter the amount you'd like to wager.
            You'll see your possible winnings reflected below, and any fees
            involved.
          </p>
        </div>
      </div>
    </section>
  );
}

function aboutUs() {
  return (
    <section className="AboutUs">
      <div className="TitleWrapper">
        <h4 className="NavTitle">About us</h4>
        <h2 className="Title">
          A DECENTRALIZED, SECURED <br /> & PRIVATE PREDICTION PLATFORM
        </h2>
        <div className="SmallLine" />
      </div>
      <p className="Desc">
        Ninja is a constantly evolving project built by a team of mobile
        developers, gamers, blockchain engineers and sci-fi writers, side by
        side a growing community of users from all around the world.
      </p>
      <div className="BtnAction">
        <a
          className="Join btn"
          href={SOCIAL.TELEGRAM}
          target="_blank"
        >
          <i className="fab fa-telegram" />
          <span>Join our telegram</span>
          <i className="far fa-arrow-right" />
        </a>
        {/* <a
          className="Goto btn btn-white"
          href={URL.HANDSHAKE_PREDICTION}
          target="_blank"
        >
          See what's behind the mask
        </a> */}
      </div>
      <Icon path={ninjas} className="NinjaSVG" />
      <p className="Desc">
        Ninja runs on top of the Ethereum blockchain. It matches users that
        support the outcome directly with users that predict otherwise. Their
        stakes are held in an Escrow smart contract, automatically released to
        the winners once the result is determined. This means that Ninja never
        holds funds, that transactions are unstoppable, and payouts are
        guaranteed.
      </p>
    </section>
  );
}

function addExtension() {
  return (
    <section className="AddExtension">
      <div className="BlockLeft">
        <img src={screens} alt="Add to Chrome" />
      </div>
      <div className="BlockRight">
        <h2 className="AddTitle">Ready to start a debate?</h2>
        <p className="Desc">
          Predict the future of money, politics, sports and more. Join the
          hundreds of ninjas already playing on the world's top rated crypto
          dApp. Ninja is available on desktop as a chrome extension, or on the
          original mobile web app. Make crypto for being right.
        </p>
        {addChromeBtn()}
      </div>
    </section>
  );
}

function footer() {
  return (
    <footer>
      <div className="MainInfo">
        <Icon path={LogoBlack} />
        <p>
          Ninja is open-source, decentralized software that never holds user
          data, or user funds. As such, Ninja does not have the power to alter
          or restrict any actions made on the platform and so cannot be
          responsible for policing it.
        </p>
        <p>
          By freely choosing to use Ninja, the user accepts sole responsibility
          for their behavior and agrees to abide by the legalities of their
          governing jurisdiction. Ninja cannot be liable for legal, monetary or
          psychological damages should you do something stupid. Never stake more
          than you are willing to lose. Play safe!
        </p>
        <p>
          {/*Need more information? check out our{' '}*/}
          {/*<Link to={`${URL.HANDSHAKE_PREDICTION}#faq`}>FAQ</Link> and{' '}*/}
          {/*<Link to={URL.PEX_INSTRUCTION_URL}>instructions</Link> on how to play.{' '}*/}
          {/*<br />*/}
          Copyright &#9400; 2018. All Rights Reserved.
        </p>
      </div>
      <div className="SocialBlock">
        <h5>JOIN US ON</h5>
        <ul>
          <li>
            <a href={SOCIAL.FACEBOOK} target="_blank">
              <i className="fab fa-facebook" />
              Facebook
            </a>
          </li>
          <li>
            <a href={SOCIAL.TWITTER} target="_blank">
              <i className="fab fa-twitter" />
              Twitter
            </a>
          </li>
          <li>
            <a href={SOCIAL.LINKEDIN} target="_blank">
              <i className="fab fa-linkedin" />
              Linkedin
            </a>
          </li>
          <li>
            <a href={SOCIAL.GITHUB} target="_blank">
              <i className="fab fa-github" />
              Github
            </a>
          </li>
          <li>
            <a href={SOCIAL.TELEGRAM} target="_blank">
              <i className="fab fa-telegram" />
              Telegram
            </a>
          </li>
        </ul>
        <SubscribeEmail />
      </div>
    </footer>
  );
}

function Extension() {
  return (
    <div className="ChromeExtension">
      {header()}
      {whyNinja()}
      {howToPlay()}
      {aboutUs()}
      {addExtension()}
      {footer()}
    </div>
  );
}

export default Extension;
