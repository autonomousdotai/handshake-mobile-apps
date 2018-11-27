import React from 'react';
import Icon from '@/guru/components/Icon/Icon';
import { URL, SOCIAL, EXT } from '@/constants';
import { Link } from 'react-router-dom';

// Icons
import LogoWhite from '@/assets/images/pex/extension/logo-white.svg';
import LogoBlack from '@/assets/images/pex/extension/logo-black.svg';
import MacSVG from '@/assets/images/pex/extension/mac.svg';
import ethToWallet from '@/assets/images/pex/extension/eth-to-wallet.svg';
import chooseMarket from '@/assets/images/pex/extension/choose-market.svg';
import makePrediction from '@/assets/images/pex/extension/make-prediction.svg';
import ninjas from '@/assets/images/pex/extension/2ninjas.svg';
import screens from '@/assets/images/pex/extension/screens.png';

import SubscribeEmail from './subscribeEmail';
import './styles.scss';

function header() {
  return (
    <header>
      <Icon className="Logo" path={LogoWhite} />
      <div className="LeftBlock">
        <h1 className="HeadLine">
          NINJA <br />
          CHROME EXTENSION
        </h1>
        <h3 className="SubHeadLine">Outsmart the Internet</h3>
        <p className="DescHeadline">
          Predict the future of politics, technology, <br />
          money, sports and anything else you can think of!
        </p>
        <a href={EXT.URL} className="btn AddChromeBtn" target="_blank">
          <i className="fab fa-chrome" />
          <span>Add to Chrome</span>
        </a>
        <p className="OrOpen">
          or open{' '}
          <a href={URL.HANDSHAKE_PREDICTION} target="_blank">
            ninja.org/prediction
          </a>
        </p>
      </div>
      <div className="RightBlock">
        <Icon className="Macbook" path={MacSVG} />
      </div>
    </header>
  );
}

function howToPlay() {
  return (
    <section className="HowToPlay">
      <div className="TitleWrapper">
        <h4 className="NavTitle">How to play</h4>
        <h2 className="Title">As EASY AS 1-2-3</h2>
        <div className="SmallLine" />
      </div>
      <div className="BlockContent">
        <div className="Item">
          <div className="ItemImage">
            <Icon path={ethToWallet} />
          </div>
          <p className="ItemTitle">Add ETH to wallet</p>
          <p className="ItemDesc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
            ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
            accumsan lacus vel facilisis.
          </p>
        </div>
        <div className="Item">
          <div className="ItemImage">
            <Icon path={chooseMarket} />
          </div>
          <p className="ItemTitle">Choose a market</p>
          <p className="ItemDesc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
            ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
            accumsan lacus vel facilisis.
          </p>
        </div>
        <div className="Item">
          <div className="ItemImage">
            <Icon path={makePrediction} />
          </div>
          <p className="ItemTitle">Make your prediction</p>
          <p className="ItemDesc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
            ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
            accumsan lacus vel facilisis.
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
          className="Join btn btn-primary"
          href={SOCIAL.TELEGRAM}
          target="_blank"
        >
          <i className="fab fa-telegram" />
          <span>Join our telegram</span>
          <i className="far fa-arrow-right" />
        </a>
        <a
          className="Goto btn btn-white"
          href={URL.HANDSHAKE_PREDICTION}
          target="_blank"
        >
          Go to Ninja app
        </a>
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
        <h2 className="AddTitle">Let&#39;s start predicting today</h2>
        <p className="Desc">
          Do not wait any longer. Download this extension now and start
          predicting and creating on any events you could imagine.
        </p>
        <a href={EXT.URL} className="btn AddChromeBtn" target="_blank">
          <i className="fab fa-chrome" />
          <span>Add to Chrome now</span>
        </a>
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
          Need more information? check out our{' '}
          <Link to={`${URL.HANDSHAKE_PREDICTION}#faq`}>FAQ</Link> and{' '}
          <Link to={URL.PEX_INSTRUCTION_URL}>instructions</Link> on how to play.{' '}
          <br />
          Copyright &#9400; 2018. All Rights Reserved. Legal.
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
      {howToPlay()}
      {aboutUs()}
      {addExtension()}
      {footer()}
    </div>
  );
}

export default Extension;
