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

import ninjaIcon from '@/assets/images/icon/landingpage/ninja.svg';
import telegramAppIcon from '@/assets/images/icon/landingpage/telegram_app.svg';
import blockchainDescriptionImage from '@/assets/images/icon/landingpage/chart-discount-time.svg';
import shakeNinjaText from '@/assets/images/icon/landingpage/shakeninjatext.svg';
import arrowsRightIcon from '@/assets/images/icon/landingpage/arrows_long_right.svg';
import Alert from '@/components/core/presentation/Alert';

// style
import './LandingPage.scss';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';

class Handshake extends React.Component {
  constructor(props) {
    super(props);
    this.injectFontPage = this.injectFontPage.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.isEmail = this.isEmail.bind(this);
  }

  componentDidMount() {
    if (window.addEventListener) { window.addEventListener('load', this.injectFontPage, false); } else if (window.attachEvent) { window.attachEvent('onload', this.injectFontPage); } else window.onload = this.injectFontPage;
  }

  componentWillReceiveProps() {
    this.injectFontPage();
  }

  productId = 1296;

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

  injectFontPage() {
    if (!document.getElementById('anonymous-pro')) {
      const PoppinsElement = document.createElement('link');
      PoppinsElement.id = 'anonymous-pro';
      PoppinsElement.href = 'https://use.typekit.net/qow3iea.css';
      PoppinsElement.rel = 'stylesheet';
      document.body.appendChild(PoppinsElement);
    }
    if (!document.getElementById('azo-sans')) {
      const AzoSansElement = document.createElement('link');
      AzoSansElement.id = 'azo-sans';
      AzoSansElement.href = 'https://use.typekit.net/nfr2whb.css';
      AzoSansElement.rel = 'stylesheet';
      document.body.appendChild(AzoSansElement);
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

  render() {
    return (
      <div className="root">
        <Alert />
        <div className="banner">
          <div className="container mainContent">
            <div className="row rowEqHeight">
              <div className="col-lg-6 col-md-12 d-none d-lg-block">
                {/* <img src={appScreenIcon} alt="app screen" className={`img-fluid ${s.appScreen}`} /> */}
                <div className="appScreen">
                  {/* <video src={appScreenVideo} autoPlay="autoplay" loop="loop" muted="muted" className={s.appScreenVideo} /> */}
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div className="headerLandingpage">
                  <img src={ninjaIcon} alt="ninja icon" />
                  <div>
                    <img src={shakeNinjaText} alt="ninja text icon" />
                    <p>THE ANONYMOUS EXCHANGE OF ANYTHING</p>
                  </div>
                </div>
                <h1>Meet <span className="blue">Shuriken</span>, the native coin of the Ninja network.</h1>
                <p className="subTitle">
                  You can use Shuriken to pay for any fees on the Ninja network such as betting fees, exchange fees, and market creation fees.
                  <br />
                  <br />
                  Paying with Shuriken allows you to slash fees and unlock the best rates.
                </p>
                <a
                  className="readTheWhitePaper"
                  href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Read the whitepaper</span>
                  <img src={arrowsRightIcon} alt="arrow right icon" />
                </a>
                <p className="telegramDescription">
                  Coming soon.  To receive updates on token sales and airdrops:
                </p>
                <a href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww" target="_blank" rel="noopener noreferrer" className="btnTelegram">
                  <img src={telegramAppIcon} alt="telegram app icon" />
                  <span>Join the conversation on telegram</span>
                </a>
                <div className="or text-center">- or -</div>
                {
                  this.renderInputForm({
                    id: 'email-1',
                    onSubmit: (e) => {
                      if (e) e.preventDefault();
                      this.submitEmail(inputRefOne);
                    },
                    refName: inputRefOne,
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="container blockChainContent">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <h3>Slash fees.</h3>
              <p className="text-left">Early adopters of Shuriken will benefit from large discounts on all the network fees. 2018 users will
                receive a <span className="green">100% discount and play completely free</span>. Preferred pricing will end in 2023. Shuriken is an
                ERC20 token and tradable on the blockchain. There will only be 100 million Shurikens. Ninja’s oath.
              </p>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
              <img src={blockchainDescriptionImage} alt="block chain description" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="container text-center countdownBlock">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <h3>Get Shuriken. Play for free.</h3>
              <a
                href="https://t.me/joinchat/H5Rflk6xD7xpo81BDbuOww"
                target="_blank"
                rel="noopener noreferrer"
                className="btnTelegram"
              >
                <img src={telegramAppIcon} alt="telegram app icon" />
                <span>Join Telegram channel</span>
              </a>
              {
                this.renderInputForm({
                  id: 'email-2',
                  onSubmit: (e) => {
                    if (e) e.preventDefault();
                    this.submitEmail(inputRefTwo);
                  },
                  refName: inputRefTwo,
                })
              }
            </div>
          </div>
        </div>
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
