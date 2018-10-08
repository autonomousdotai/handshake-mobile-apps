import React from 'react'
import { URL } from '@/constants'
import { Field } from 'redux-form';
import $http from '@/services/api';
import { FormattedMessage, injectIntl } from 'react-intl';
import { email, required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import createForm from '@/components/core/form/createForm';

import './ContentForCashBusiness.scss';
import './ContentForPrediction.scss';

import imgHowToPlay from '@/assets/images/landing/prediction/pex_how_to_play.png';
import imgExtension from '@/assets/images/landing/prediction/pex_extension.png';
import imgMobileIcon from '@/assets/images/landing/prediction/pex_mobile_icon.png';
import imgMobileGuide1 from '@/assets/images/landing/prediction/pex_mobile_guide1.png';
import imgMobileGuide2 from '@/assets/images/landing/prediction/pex_mobile_guide2.png';
import imgMarket from '@/assets/images/landing/prediction/pex_market.png';
import imgAnonymous from '@/assets/images/landing/prediction/pex_anonymous.png';
import imgTransparent from '@/assets/images/landing/prediction/pex_transparent.png';
import imgFeature from '@/assets/images/landing/prediction/pex_feature.png';
import imgMobileShape1 from '@/assets/images/landing/prediction/pex_mobile_shape1.svg';
import imgMobileShape2 from '@/assets/images/landing/prediction/pex_mobile_shape2.svg';
import imgAnonymousShape1 from '@/assets/images/landing/prediction/pex_anonymous_shape1.svg';
import imgAnonymousShape2 from '@/assets/images/landing/prediction/pex_anonymous_shape2.svg';
import imgAnonymousShape3 from '@/assets/images/landing/prediction/pex_anonymous_shape3.svg';
import imgAnonymousShape4 from '@/assets/images/landing/prediction/pex_anonymous_shape4.svg';
import imgIntroduce from '@/assets/images/landing/prediction/pex_introduce.png';

import icPlayTime from '@/assets/images/landing/prediction/pex_play_time.svg';
import icPlaySolution from '@/assets/images/landing/prediction/pex_play_solution.svg';
import iconSubmitEmail from '@/assets/images/icon/landingpage/email_submit.svg';

import PexRoadMap from '@/pages/LandingPage/PexRoadMap';
import { Link } from 'react-router-dom'
import { BASE_API } from '@/constants';

const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});
class ContentForPrediction extends React.Component {
  state = {
    hasSubscribed: false,
  };
  openExtension() {
    window.open('https://chrome.google.com/webstore/detail/pheabihpgpobcfkhkndnpkaencnjjfof', '_blank');
  }
  handleSubmit = values => {
    const name = 'prediction';
    const { email } = values;
    const formData = new FormData();
    formData.set('email', email);
    formData.set('product', name);

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(res => {
        this.setState({ hasSubscribed: true });
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };
  openTelegram = () => {
    window.open('https://t.me/ninja_org', '_blank');
  }
  renderThanksSubcribe() {
    return (
      <h5>
        <p>
          <strong className="text-success">
            <FormattedMessage id="landing_page.detail.thanksForSubscribing" />
          </strong>
        </p>
      </h5>
    );
  }
  renderEmail() {
    return (
      <FormSubscribeEmail onSubmit={this.handleSubmit}>
        <div>For updates, direct from the dojo:</div>
        <div className="wrapperEmail">
          <div className="emailField">
            <Field
              name="email"
              className="form-control control-subscribe-email"
              placeholder="Enter your E-mail address"
              type="text"
              validate={[required, email]}
              component={fieldInput}
            />
            <div className="emailSubmit">
              <button
                type="submit"
                className="btnEmail"
              >
                {/*btnSubmitEmail*/}
                <img src={iconSubmitEmail} alt="iconSubmitEmail" />
              </button>
            </div>
          </div>

          <button className="btnTelegram"
            onClick={()=> {
              this.openTelegram();
            }}
          >Join the dojo on Telegram
          </button>

        </div>
      </FormSubscribeEmail>

    );
  }

  renderIntroduce() {
    const { hasSubscribed } = this.state;
    return (
      <section className="section">
        <div className="wrapperIntroduce">
          <div className="column">
            <p className="pexSmallTitle"><strong>Bet on anything against anyone, anywhere. Guaranteed payout. Your odds. 100% anonymous.</strong></p>
            <p className="pexContent">You create the bets, set the odds, and play directly with other parties. Bet with blockchain technology to bypass the bookies and the books - take down the house and make your own luck.</p>
            {/*this.renderEmail()*/}
            {/*hasSubscribed && this.renderThanksSubcribe()*/}
            <p className="pexContent btnMobileOpen">To play, please open <u>ninja.org/prediction</u> on your mobile browser.</p>
            <p><a href="https://t.me/ninja_org"><u>Join the dojo on Telegram</u></a></p>
          </div>
          <div className="column">
            <img className="" src={imgIntroduce} alt="imgHowToPlay" width="850" />
          </div>
        </div>
      </section>

    );
  }


  renderRoadMap() {
    return (
      <PexRoadMap className="wrapperBlock" />

    );
  }
  renderHowToPlay() {
    return (
      <section className="section wrapperHowToPlay">
        <div className="wrapperBlock">
          <div className="column">
            <img className="imageLeft" src={imgHowToPlay} alt="imgHowToPlay" width="350" />
          </div>
          <div className="column wrapperContentHowToPlay">
            <div className="wrapperSmallBlock">
              <img src={icPlayTime} alt="icPlayTime" width="40" />
              <div className="pexSmallTitle">Time to change the game</div>
              <div className="pexContent">The betting industry has a problem, it’s simply not fair. It’s exclusively run by bookmakers with almost everything stacked in their favor.</div>
            </div>
            <div className="wrapperSmallBlock">
              <img src={icPlaySolution} alt="icPlaySolution" width="40" />
              <div className="pexSmallTitle">The solution</div>
              <div className="pexContent">Prediction allows you to directly bet against each other without going through a bookmaker. It’s all managed by blockchain technology and secured with smart contracts.</div>
            </div>
            <Link to={URL.PEX_INSTRUCTION_URL}>
              <button className="pexButton">Instructions on how to play</button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
  renderExtension() {
    return (
      <section className="section">
        <div className="wrapperExtentsion wrapperBlock">
          <div className="column">
            <img src={imgExtension} alt="imgExtension" width="600" />
          </div>
          <div className="column">
            <div className="wrappeContent">
              <div className="pexHeadLine">Chrome Extension</div>
              <div className="pexContent">Use Ninja Prediction on your desktop, you can browse the web, predict and win ETH with the Chrome Extension.</div>
              <div className="pexContent">With just a click, you can create bets from (almost) anything you read & see online.</div>
            </div>
            {/*<button className="pexButton"
              onClick={() => this.openExtension()}
            >Install our extension
      </button>*/}
          </div>

        </div>
      </section>
    );
  }
  renderMobileGuide() {
    return (
      <section className="section bg-gradient-mobile">
        <span className="mobile_recDown" />
        <span className="mobile_recUp" />
        <img className="mobile_shape1" src={imgMobileShape1} alt="imgMobileShape1" width="160" />
        <img className="mobile_shape2" src={imgMobileShape2} alt="imgMobileShape2" width="400" />

        <div className="wrapperMobile wrapperBlock">
          <div className="contentBlock column ">
            <div className="pexHeadLine">Mobile Web App</div>
            <div className="pexContent">No download or signup required. <br/> Simply open up your browser and you’re ready to go.</div>
            <img className="imageContent" src={imgMobileIcon} alt="imgMobileIcon" width="400" />
          </div>
          <div className="column">
            <img className="rightImageFirst" src={imgMobileGuide1} alt="imgMobileGuide1" width="350" />
            <img className="rightImageSecond" src={imgMobileGuide2} alt="imgMobileGuide2" width="350" />
          </div>
        </div>
      </section>
    );
  }
  renderMarket() {
    return (
      <section className="section">
        <div className="wrapperBlock">
          <div className="column">
            <img src={imgMarket} alt="imgMarket" width="500" />
          </div>
          <div className="column">
            <div className="wrapperSmallBlock">
              <div className="pexHeadLine">Make your market</div>
              <div className="pexContent">Prediction allows anyone to create a prediction market about any future event — be it in sports, politics, science, or literally any other aspect of modern life. You, as the market creator, can set the market fee, the market closing time, the reporter of the outcome, and the reporting deadline.</div>
              <div className="pexContent">Create your own market, please open {' '}
              <Link to={URL.HANDSHAKE_PEX_CREATOR}>
              https://ninja.org/create-pex
              </Link>
              {' '}on your mobile browser.
              </div>
            </div>
            {/*<button className="pexButton">Create your own bet</button>*/}
          </div>
        </div>
      </section>
    );
  }

  renderAnonymous() {
    return (
      <section className="section bg-gradient-anonymous">
        <span className="anonymous_recUp" />
        <span className="anonymous_recDown" />
        <img className="anonymous_shape1" src={imgAnonymousShape1} alt="imgAnonymousShape1" width="30" />
        <img className="anonymous_shape2" src={imgAnonymousShape2} alt="imgAnonymousShape2" width="50" />
        <img className="anonymous_shape3" src={imgAnonymousShape3} alt="imgAnonymousShape3" width="450" />
        <img className="anonymous_shape4" src={imgAnonymousShape4} alt="imgAnonymousShape4" width="450" />


        <div className="wrapperAnonymous wrapperVerticalBlock">
          <div className="contentBlock">
            <div className="pexHeadLine">Anonymous</div>
            <div className="pexContent">The entire system works without any party revealing their identities. It’s 100% anonymous.</div>
            <img src={imgAnonymous} alt="imgAnonymous" width="800" />
          </div>
        </div>
      </section>
    );
  }
  renderTransparency() {
    return (
      <section className="section">
        <div className="wrapperTransparent wrapperBlock">
          <div className="wrapperContent column">
            <div className="pexHeadLine" >Transparency</div>
            <div className="pexContent">Our decentralized, blockchain based approach allows players to benefit from full transparency and total control over their betting experience. We remove the middleman and hand control back to the user.</div>
          </div>
          <div className="column">
            <img src={imgTransparent} alt="imgTransparent" width="500" />
          </div>
        </div>
      </section>
    );
  }
  renderFeature() {
    return (
      <div className="wrapperVerticalBlock">
        <img src={imgFeature} alt="imgFeature" width="100%" />
      </div>
    );
  }

  render() {
    const { messages, locale } = this.props.intl
    return (
      <div className=''>
        {/*<img src={imgPredictionContent} className='w-100' />*/}
        { this.renderIntroduce()}
        {this.renderHowToPlay()}
        {this.renderExtension()}
        {this.renderMobileGuide()}
        {/*this.renderExample()*/}
        {this.renderMarket()}
        {this.renderAnonymous()}
        {this.renderTransparency()}
        {/*this.renderFeature()*/}
        {this.renderRoadMap()}
      </div>
    );
  }
}

ContentForPrediction.propTypes = {}

export default injectIntl(ContentForPrediction);
