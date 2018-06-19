/**
 * Trade component.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// service
import axios from 'axios';
import qs from 'qs';
import { showAlert } from '@/reducers/app/action';
import { injectIntl } from 'react-intl';

import Alert from '@/components/core/presentation/Alert';

// style
import './Trade.scss';
import ninjaIcon from '@/assets/images/icon/landingpage/trading-ninja.svg';
import tradeCoinExchange from '@/assets/images/icon/landingpage/trade-coin-exchange.svg';
import tradeCoinExchangeRussia from '@/assets/images/icon/landingpage/trade-coin-exchange-russia.svg';
import tradeThirdContainer from '@/assets/images/icon/landingpage/trade-third-container.svg';
import paymentMethodIcon from '@/assets/images/icon/landingpage/trade-payment-method.svg';
import safeIcon from '@/assets/images/icon/landingpage/trade-safe.svg';
import fastAnOnIcon from '@/assets/images/icon/landingpage/trade-fast-and-on.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow-white.svg';

const inputRefOne = 'emailRef';
const inputRefTwo = 'emailRefTwo';

class Collapse extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggle = ::this.toggle;
  }

  toggle() {
    this.setState(state => ({isCollapsed: !state.isCollapsed}));
  }

  render() {
    const { isCollapsed } = this.state;
    const { label, content, isList, index } = this.props;
    return (
      <div className="collapse-custom">
        <div
          className="head"
          onClick={this.toggle}
        >
          <div className="label">
            <div className="index">{index}{index > 9 ? '.' : '. '}</div><div>{label}</div>
          </div>
          <div className="extend">
            <img className={isCollapsed ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${isList ? '' : 'noList'} ${!isCollapsed ? '' : 'd-none'}`}>
          {isList ? (
            <dl>
              {content.map((item, index) => [
                <dt>{item.title}</dt>,
                <dd>{item.content}</dd>
              ])}
            </dl>
          ) : content}
        </div>
      </div>
    )
  }
}

class Handshake extends React.Component {
  constructor(props) {
    super(props);
    this.injectFontPage = this.injectFontPage.bind(this);
    this.submitEmail = this.submitEmail.bind(this);
    this.renderInputForm = this.renderInputForm.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.isEmail = this.isEmail.bind(this);
  }
  productId = 1297;

  componentDidMount() {
    if (window.addEventListener)
      window.addEventListener('load', this.injectFontPage, false);
    else if (window.attachEvent)
      window.attachEvent('onload', this.injectFontPage);
    else window.onload = this.injectFontPage;
  }

  componentWillReceiveProps() {
    this.injectFontPage();
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
    const RE_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return RE_EMAIL.test(email);
  }

  submitEmail(inputRef) {
    console.log("inputRef", inputRef);
    const emailValue = this[inputRef].value.trim();
    console.log("inputRef", inputRef);
    // validation email
    if (!emailValue) {
      this.showAlertMessage({message: 'Email is empty!'});
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
        this.showAlertMessage({message: 'Success!', type: 'success'});
      } else {
        this.showAlertMessage({message: backOrderResult.data.message});
      }
    }).catch(error => {
      this.showAlertMessage({message: error});
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

  renderInputForm({id, onSubmit, refName}) {
    const { messages, locale } = this.props.intl;
    return (
      <form className="registerEmail" onSubmit={onSubmit}>
        <input
          className="email"
          name="email"
          type="text"
          id={id}
          placeholder={messages.COIN_EXCHANGE_LP_PLACEHOLDER_INPUT}
          ref={input => this[refName] = input}
        />
        <button className="btnSubmit" onClick={onSubmit}>
          <span>{messages.COIN_EXCHANGE_LP_TITLE_SUBMIT_BT}</span>
        </button>
      </form>
    )
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="root">
        <Alert />
        <div className={`container firstContainer`}>
          <div className={`row rowEqHeight`}>
            <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12">
              <img src={ninjaIcon} alt="ninja icon" className="bannerIcon" />
              <h1>{messages.COIN_EXCHANGE_LP_TRADE_EASY_TRADE_SAFE.title}</h1>
              <dl>
                {
                  messages.COIN_EXCHANGE_LP_TRADE_EASY_TRADE_SAFE.info.map((item, index) => (
                    [
                      <dt key={`dt-${index}`}>{item.title}</dt>,
                      <dd key={`dd-${index}`}>{item.description}</dd>,
                    ]
                  ))
                }
              </dl>

              <div className={`row bottomBox${locale === 'ru' ? ' russia' : ''}`}>
                <div className={`${locale === 'ru' ? 'col-lg-10' : 'col-lg-4'} col-md-12 col-sm-12 col-xs-12`}>
                  <a href="/"
                     className="btnStartTrading"
                  >
                    <span>{messages.COIN_EXCHANGE_LP_START_TRADING_NOW}</span>
                  </a>
                </div>
                <div className={`${locale === 'ru' ? 'col-lg-10' : 'col-lg-8'} col-md-12 col-sm-12 col-xs-12`}>
                  {
                    this.renderInputForm({
                      id: 'email-1',
                      onSubmit: (e) => {
                        e && e.preventDefault();
                        this.submitEmail(inputRefOne);
                      },
                      refName: inputRefOne,
                    })
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 d-none d-lg-block">
              {/*<img src={appScreenIcon} alt="app screen" className={`img-fluid ${s.appScreen}`} />*/}
              <div className="appScreen">
                {/*<video src={appScreenVideo} autoPlay="autoplay" loop="loop" muted="muted" className={s.appScreenVideo} />*/}
              </div>
            </div>
          </div>
        </div>
        <div className={`container secondContainer`}>
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <img src={tradeCoinExchange} alt="trade coin exchange icon" className="img-fluid" />
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_SECOND_BOX_TITLE}</p>
              <p className="description">
                {messages.COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_1} <br />
                {messages.COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_2} <br />
                {messages.COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_3}
              </p>
            </div>
          </div>
        </div>
        <div className={`container thirdContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <img src={locale === 'ru' ? tradeCoinExchangeRussia : tradeThirdContainer} alt="third container" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className={`container fourContainer text-center`}>
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={paymentMethodIcon} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_1.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_1.description}</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={fastAnOnIcon} width={80} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_2.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_2.description}</p>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12">
              <img src={safeIcon} width={70} height={80} />
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_THIRD_BOX_3.title}</p>
              <p className="description">{messages.COIN_EXCHANGE_LP_THIRD_BOX_3.description}</p>
            </div>
          </div>
        </div>

        <div className={`container fiveContainer`}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <p className="subTitle">{messages.COIN_EXCHANGE_LP_FAQ_TITLE}</p>
              <div>
                {messages.COIN_EXCHANGE_LP_FAQ.map((item, index) => <Collapse label={item.question} content={item.answer} isList={item.isList} key={index} index={index + 1} />)}
              </div>
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

export default injectIntl(connect(null, mapDispatch)(Handshake));
