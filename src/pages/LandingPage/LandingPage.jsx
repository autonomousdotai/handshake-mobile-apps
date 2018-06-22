/**
 * Handshake component.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service
import axios from 'axios';
import qs from 'qs';
import { showAlert } from '@/reducers/app/action';
import Helper from '@/services/helper';

import Alert from '@/components/core/presentation/Alert';
import ninjaStarHtml from '../../assets/images/ninja-star/index.html';
import lineIcon from '../../assets/images/icon/landingpage/line-.svg';
import logoNinjaIcon from '../../assets/images/icon/landingpage/logo-ninja.svg';
import telegramIcon from '../../assets/images/icon/landingpage/ico-telegram.svg';
import petNinja2Icon from '../../assets/images/icon/landingpage/pet-ninja2.png';
import ninjaIcon from '../../assets/images/icon/landingpage/ninja_icon.png';
import moneyBagIcon from '../../assets/images/icon/landingpage/money-bag-icon.svg';
import shurikenYIcon from '../../assets/images/icon/landingpage/shuriken-y-icon.svg';
import labelIcon from '../../assets/images/icon/landingpage/label.svg';
import screenIcon from '../../assets/images/icon/landingpage/screen.png';
import neymarIcon from '../../assets/images/icon/landingpage/neymar.png';
import flowerIcon from '../../assets/images/icon/landingpage/flower.svg';
import shurikenBackground from '../../assets/images/icon/landingpage/shuriken-background.svg';

// style
import './LandingPage.scss';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';
let left = 0;
let isMoveBack = false;

class Handshake extends React.Component {
  constructor(props) {
    super(props);
    this.injectFontPage = this.injectFontPage.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.isEmail = this.isEmail.bind(this);
    this.renderFillInForm = this.renderFillInForm.bind(this);
    this.submitFillForm = this.submitFillForm.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.injectFontPage();
    // if (window.addEventListener) { window.addEventListener('load', this.injectFontPage, false); } else if (window.attachEvent) { window.attachEvent('onload', this.injectFontPage); } else window.onload = this.injectFontPage;
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillReceiveProps() {
    this.injectFontPage();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  productId = 1296;
  productIdFillForm = 1300;

  handleScroll() {
    const theta = (window.scrollY / 250) % Math.PI;
    if (this.imageRef) {
      this.imageRef.style.transform = `rotate(${theta}rad)`;
      this.imageRef.style.position = 'relative';
      this.imageRef.style.left = `${left}%`;
      if (left === 105) {
        isMoveBack = true;
      } else if (left === -55) {
        isMoveBack = false;
      }
      if(isMoveBack) {
        left -= 1;
      } else {
        left += 1;
      }
    }
  }

  showAlertMessage({ message, type = 'danger' }) {
    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 3000,
      type,
      callBack: () => {
      },
    });
  }

  isEmail(email = '') {
    const RE_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return RE_EMAIL.test(email);
  }

  submitEmail(inputRef) {
    console.log('inputRef', inputRef);
    const emailValue = this[inputRef].value.trim();
    console.log('inputRef', inputRef);
    // validation email
    if (!emailValue) {
      this.showAlertMessage({ message: 'Email is empty!' });
      return;
    }
    if (!this.isEmail(emailValue)) {
      this.showAlertMessage({ message: 'Email is invalid.' });
      return;
    }

    // const ref = Helper.getValueParamURLQueryByName('ref') || '';
    const params = {
      ref: '',
      email: emailValue,
      has_options: 1,
    };

    // ga('send', 'event', 'ShakeNinja', 'submit register email');
    const backOrder = axios({
      method: 'post',
      url: `https://www.autonomous.ai/api-v2/order-api/order/back-order/${this.productId}?${qs.stringify(params)}`,
      data: {},
    });
    backOrder.then((backOrderResult) => {
      if (backOrderResult.data.status > 0) {
        this.showAlertMessage({ message: 'Success!', type: 'success' });
      } else {
        this.showAlertMessage({ message: backOrderResult.data.message });
      }
    }).catch((error) => {
      this.showAlertMessage({ message: error });
    });
  }

  submitFillForm() {
    const alias = this.aliasRef.value.trim();
    const telegram = this.telegramRef.value.trim();
    const email = this.emailFillRef.value.trim();
    const phone = this.phoneRef.value.trim();

    // validation email
    if (!alias || !telegram) {
      this.showAlertMessage({ message: 'Ninja alias or Telegram handle are empty!' });
      return;
    }

    if (email && !this.isEmail(email)) {
      this.showAlertMessage({ message: 'Email is invalid.' });
      return;
    }

    // const ref = Helper.getValueParamURLQueryByName('ref') || '';
    const params = {
      ref: '',
      email: `${alias};${telegram};${email};${phone}`,
      has_options: 1,
    };

    // ga('send', 'event', 'ShakeNinja', 'submit register email');
    const backOrder = axios({
      method: 'post',
      url: `https://www.autonomous.ai/api-v2/order-api/order/back-order/${this.productIdFillForm}?${qs.stringify(params)}`,
      data: {},
    });
    backOrder.then((backOrderResult) => {
      if (backOrderResult.data.status > 0) {
        this.showAlertMessage({ message: 'Success!', type: 'success' });
      } else {
        this.showAlertMessage({ message: backOrderResult.data.message });
      }
    }).catch((error) => {
      this.showAlertMessage({ message: error });
    });
  }

  injectFontPage() {
    console.log("here");
    // add animation css
    if (!document.getElementById('daneden-animate')) {
      const danedenAnimate = document.createElement('link');
      danedenAnimate.id = 'daneden-animate';
      danedenAnimate.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css';
      danedenAnimate.rel = 'stylesheet';
      document.body.appendChild(danedenAnimate);
    }

    // add wowJS
    if (!document.getElementById('wowjs') && !Helper.isSmallScreen) {
      const wowJS = document.createElement('script');
      wowJS.id = 'wowjs';
      wowJS.src = 'https://wowjs.uk/dist/wow.min.js';
      document.body.appendChild(wowJS);
      setTimeout(() => {
        new WOW().init();
        this.forceUpdate();
      }, 2000);
    }
  }

  renderInputForm({ id, onSubmit, refName }) {
    return (
      <form className="registerEmail" onSubmit={onSubmit}>
        <input
          className="email"
          name="email"
          type="text"
          id={id}
          placeholder="Enter your email"
          ref={(input) => { this[refName] = input; return null; }}
        />
        <button className="btnSubmit" onClick={onSubmit}>
          <span>Join mailing list</span>
        </button>
      </form>
    );
  }

  renderFillInForm() {
    return (
      <form className="fillInForm" onSubmit={() => this.submitFillForm()}>
        <div className="form-group row">
          <label className="col-lg-4 col-md-12 required">Ninja alias</label>
          <input
            className="col-lg-6 col-md-12"
            name="alias"
            type="text"
            id="email-input"
            // placeholder="Enter your email"
            ref={(input) => {this.aliasRef = input;}}
          />
        </div>
        <div className="form-group row">
          <label className="col-lg-4 col-md-12 required">Telegram handle</label>
          <input
            className="col-lg-6 col-md-12"
            name="telegram"
            type="text"
            id="alias-input"
            // placeholder="Enter your email"
            ref={(input) => {this.telegramRef = input;}}
          />
        </div>
        <div className="form-group row">
          <label className="col-lg-4 col-md-12">Email</label>
          <input
            className="col-lg-6 col-md-12"
            name="email-fill"
            type="text"
            id="email-input"
            // placeholder="Enter your email"
            ref={(input) => {this.emailFillRef = input;}}
          />
        </div>
        <div className="form-group row">
          <label className="col-lg-4 col-md-12">Phone number</label>
          <input
            className="col-lg-6 col-md-12"
            name="email"
            type="tel"
            id="email-input"
            // placeholder="Enter your email"
            ref={(input) => {this.phoneRef = input;}}
          />
        </div>

        <div className="row">
          <button className="btn btn-y btn-lg mt30 col-lg-6 offset-lg-4" onClick={() => this.submitFillForm()} type="button">
            <span>Yes, I'm in</span>
          </button>
        </div>
      </form>
    );
  }

  // render() {
  //   return (
  //     <div className="root">
  //       <Alert />
  //       <div className="banner">
  //         <div className="container mainContent">
  //           <div className="row rowEqHeight">
  //             <div className="col-lg-6 col-md-12 d-none d-lg-block">
  //               {/* <img src={appScreenIcon} alt="app screen" className={`img-fluid ${s.appScreen}`} /> */}
  //               <div className="appScreen">
  //                 {/* <video src={appScreenVideo} autoPlay="autoplay" loop="loop" muted="muted" className={s.appScreenVideo} /> */}
  //               </div>
  //             </div>
  //             <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
  //               <div className="headerLandingpage">
  //                 <img src={ninjaIcon} alt="ninja icon" />
  //                 <div>
  //                   <img src={shakeNinjaText} alt="ninja text icon" />
  //                   <p>THE ANONYMOUS EXCHANGE OF ANYTHING hh</p>
  //                 </div>
  //               </div>
  //               <h1>Meet <span className="blue">Shuriken</span>, the native coin of the Ninja network.</h1>
  //               <p className="subTitle">
  //                 You can use Shuriken to pay for any fees on the Ninja network such as betting fees, exchange fees, and market creation fees.
  //                 <br />
  //                 <br />
  //                 Paying with Shuriken allows you to slash fees and unlock the best rates.
  //               </p>
  //               <a
  //                 className="readTheWhitePaper"
  //                 href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 <span>Read the whitepaper</span>
  //                 <img src={arrowsRightIcon} alt="arrow right icon" />
  //               </a>
  //               <p className="telegramDescription">
  //                 Coming soon.  To receive updates on token sales and airdrops:
  //               </p>
  //               <a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" rel="noopener noreferrer" className="btnTelegram">
  //                 <img src={telegramAppIcon} alt="telegram app icon" />
  //                 <span>Join the conversation on telegram</span>
  //               </a>
  //               <div className="or text-center">- or -</div>
  //               {
  //                 this.renderInputForm({
  //                   id: 'email-1',
  //                   onSubmit: (e) => {
  //                     if (e) e.preventDefault();
  //                     this.submitEmail(inputRefOne);
  //                   },
  //                   refName: inputRefOne,
  //                 })
  //               }
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="container blockChainContent">
  //         <div className="row">
  //           <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
  //             <h3>Slash fees.</h3>
  //             <p className="text-left">Early adopters of Shuriken will benefit from large discounts on all the network fees. 2018 users will
  //               receive a <span className="green">100% discount and play completely free</span>. Preferred pricing will end in 2023. Shuriken is an
  //               ERC20 token and tradable on the blockchain. There will only be 100 million Shurikens. Ninja’s oath.
  //             </p>
  //           </div>
  //           <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
  //             <img src={blockchainDescriptionImage} alt="block chain description" className="img-fluid" />
  //           </div>
  //         </div>
  //       </div>
  //       <div className="container text-center countdownBlock">
  //         <div className="row">
  //           <div className="col-md-12 col-sm-12 col-xs-12">
  //             <h3>Get Shuriken. Play for free.</h3>
  //             <a
  //               href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="btnTelegram"
  //             >
  //               <img src={telegramAppIcon} alt="telegram app icon" />
  //               <span>Join Telegram channel</span>
  //             </a>
  //             {
  //               this.renderInputForm({
  //                 id: 'email-2',
  //                 onSubmit: (e) => {
  //                   if (e) e.preventDefault();
  //                   this.submitEmail(inputRefTwo);
  //                 },
  //                 refName: inputRefTwo,
  //               })
  //             }
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    if(!Helper.isSmallScreen && typeof WOW === 'undefined') return <div />;
    return (
      <div className="root">
        <Alert />
        <section className="first-page d-none d-lg-block">
          <iframe width="100%" className="fadeIn" src="/ninja-star/index.html" />
          <div className="content-first col-lg-12 col-md-12">
            <div className="img-screen wow animated slideInLeft col-lg-6 col-md-12 text-right d-none d-lg-block" data-wow-delay="6.6s">
              <div className="label-100 wow animated zoomIn" data-wow-delay="8s">
                <img width="70" src={labelIcon}/>
              </div>
              <div className="screen-app"><img width="210" src={screenIcon}/></div>
              <div className="neymar wow animated slideInLeft" data-wow-delay="7s">
                <img width="140" src={neymarIcon}/>
              </div>
              <div className="flower  wow animated zoomIn" data-wow-delay="7s"><img width="320" src={flowerIcon}/>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 wow animated slideInLeft" data-wow-delay="6.7s">
              <div className="col-lg-9">
                <div className="logo wow animated fadeInUp" data-wow-delay="0.2s">
                  <img height="45" src={logoNinjaIcon}/>
                </div>
                <h2 className="text-up text-y mt20 wow animated fadeInUp" data-wow-delay="1.5s">Our token is the
                  Shuriken (SHURI). <br/>
                  No, there is no ICO.</h2>
                <div className="mt20  wow animated fadeInUp" data-wow-delay="3s">
                  <p className="logo">Use it to slash fees. Increase your likelihood of matching bets. Unlock first
                    access to bounties, bonuses and new features.
                  </p>
                </div>
                <div className="mt20  wow animated fadeInUp" data-wow-delay="4s">
                  <p className="logo">
                    Our <a className="text-link"
                           href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
                           target="_blank"
                           rel="noopener noreferrer"
                  >
                    whitepaper
                  </a> wasn’t written to confuse.
                    <br/>
                    Our <a className="text-link"
                           href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
                           target="_blank"
                           rel="noopener noreferrer">
                    telegram
                  </a> discusses the actual working product</p>
                </div>
                <div className=" wow animated fadeInUp" data-wow-delay="5s">
                  <p className="logo wow animated fadeInUp mt20">Coming soon. To receive updates on token sales and
                    airdrops:</p>
                  <a className="btn-lg btn-y wow animated fadeInUp btn-block"
                     href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                    <img height="25" src={telegramIcon}/> Join the conversation on telegram
                  </a>
                </div>

                <div className=" wow animated fadeInUp mt20" data-wow-delay="6s">
                  <p>We’ll send you an airdrop invitation.</p>

                  <div className="input-group email-frm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email"
                      ref={input => this[inputRefOne] = input}
                    />
                    <span className="input-group-btn">
                        <button
                          className="btn btn-y btn-lg"
                          type="button"
                          onClick={() => {
                            this.submitEmail(inputRefOne)
                          }}
                        >
                          I'm in
                        </button>
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="line-down wow animated fadeIn" data-wow-delay="2s">
            <span></span>
          </div>
        </section>

        {/* mobile */}
        <section className="first-page d-lg-none">
          <iframe width="100%" className="fadeIn" src="/ninja-star/index.html"/>
          <div className="content-first col-lg-12 col-md-12">
            <div className="col-lg-6 col-md-12">
              <div className="cnt-w ">
                <div className="logo wow animated fadeInUp">
                  <img height="45" src={logoNinjaIcon}/>
                </div>
                <h2 className="text-up text-y mt20 wow animated fadeInUp">Our token is the
                  Shuriken (SHURI). <br/>
                  No, there is no ICO.</h2>
                <div className="mt20  wow animated fadeInUp">
                  <p className="logo">Use it to slash fees. Increase your likelihood of matching bets. Unlock first
                    access to bounties, bonuses and new features.
                  </p>
                </div>
                <div className="mt20 wow animated fadeInUp">
                  <p className="logo">
                    Our <a className="text-link"
                           href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
                           target="_blank"
                           rel="noopener noreferrer"
                  >
                    whitepaper
                  </a> wasn’t written to confuse.
                    <br/>
                    <br/>
                    Our <a className="text-link"
                           href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
                           target="_blank"
                           rel="noopener noreferrer">
                    telegram
                  </a> discusses the actual working product</p>
                </div>
                <div className="wow animated fadeInUp">
                  <p className="logo mt20">Coming soon. To receive updates on token sales and
                    airdrops:</p>
                  <a className="btn-lg btn-y wow animated fadeInUp btn-block"
                     href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                    <img height="25" src={telegramIcon}/> Join the conversation on telegram
                  </a>
                </div>

                <div className="mt20 wow animated fadeInUp">
                  <p>We’ll send you an airdrop invitation.</p>

                  <div className="input-group email-frm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email"
                      ref={input => this[inputRefTwo] = input}
                    />
                    <span className="input-group-btn">
                        <button
                          className="btn btn-y btn-lg"
                          type="button"
                          onClick={() => {
                            this.submitEmail(inputRefTwo)
                          }}
                        >
                          I'm in
                        </button>
                      </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="line-down wow animated fadeIn" data-wow-delay="7s">
            <span></span>
          </div>
        </section>

        <div className="col-lg-12 text-center mb94">
          <div className="line-ninja">
            <div className="ico-ninja wow animated fadeInUp"/>
            <div className="line-"/>
          </div>
        </div>

        <section className="second-page">
          <div className="shuriken-background">
            <img src={shurikenBackground} ref={imag => this.imageRef = imag}/>
          </div>
          <div className="container">
            <div className="row">

              <div className="col-lg-12 wow animated fadeInUp mw810 mb160">
                <h3 className="h3-y mb48 text-center">Wanna join a clan... of Ninjas?</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-12 content-header">
                    There’s some loot <br/> with your name on it.
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <p className="content-main mb30">All you gotta do is make some noise. The more you like us, the more
                      we like you. As a Ninja ambassador, you’re one of the team. Build the product with us, help us
                      grow Ninja and.. </p>
                    <a className="btn btn-y btn-lg" href="#fillInForm">Make us as cool as you are</a>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 wow animated fadeInUp mw810 mb120">
                <h3 className="h3-y text-center">Plus we’ll give you free stuff.</h3>
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="d-flex mb30">
                      <img src={shurikenYIcon} className="icon-text"/>
                      <div className="content-main">
                        Shurikens <br/>
                        -the multi <br/>
                        -edged Ninja Token
                      </div>
                    </div>

                    <div className="d-flex">
                      <img src={moneyBagIcon} className="icon-text"/>
                      <div className="content-main">
                        Goodies, <br/>
                        merchandise, <br/>
                        bags full of swag
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <p className="content-header mb23">Wanna play a real part in one of the most exciting platforms on
                      the crypto market?</p>
                    <a className="btn btn-y btn-lg" href="#fillInForm">Hell yeah!</a>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 text-center mb80">
                <div className="line-ninja">
                  <div className="ico-ninja wow animated fadeInUp"/>
                  <div className="line-"/>
                </div>
              </div>

              <div className="col-lg-12 wow animated fadeInUp mw810" id="fillInForm">
                <h3 className="h3-gray mb30 text-center">Please fill in this form</h3>
                {this.renderFillInForm()}
              </div>

            </div>
          </div>
        </section>
      </div>
    );
  }
}


Handshake.propTypes = {
  showAlert: PropTypes.func.isRequired,
};


const mapDispatch = ({
  showAlert,
});

export default connect(null, mapDispatch)(Handshake);
