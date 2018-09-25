import React from "react";
import { Fade, Flip, Zoom, Slide, LightSpeed } from 'react-reveal';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import $http from '@/services/api';
import { BASE_API } from '@/constants';

import imgBTC from '@/assets/images/landing/wallet/btc.svg';
import imgLTC from '@/assets/images/landing/wallet/ltc.svg';
import imgETH from '@/assets/images/landing/wallet/eth.svg';
import imgXRP from '@/assets/images/landing/wallet/xrp.svg';
import imgZEC from '@/assets/images/landing/wallet/zec.svg';
import imgIPHONE from '@/assets/images/landing/wallet/iphone1.png';
import img1 from '@/assets/images/landing/wallet/1.png';
import imgPromo1 from '@/assets/images/landing/wallet/promo-1.png';
import imgLock from '@/assets/images/landing/wallet/lock-solid.svg';
import imgCheck from '@/assets/images/landing/wallet/check-solid.svg';
import iconSubmitEmail from '@/assets/images/icon/landingpage/email_submit.svg';

import './ContentForWallet.css';
import './ContentForWallet.scss';


const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});

class ContentForWallet extends React.Component {

  constructor() {
    super();

    this.state = {
      isSubscribed: false
    }
  }

  handleSubmit = values => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('product', 'wallet');

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(() => {
        this.setState({isSubscribed: true});
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };

  renderEmailForm(opt = { withDesc: true }) {
    const {
      intl,
    } = this.props;
    const { withDesc } = opt;
    return (
      <span>
        <FormSubscribeEmail onSubmit={this.handleSubmit}>
          <div className="">
              <div className="text-white align-top">
                For updates, subscribe your email
              </div>
              <div className="email-control-group">
                <div className="emailField">
                  <Field
                    name="email"
                    className="form-control control-subscribe-email"
                    placeholder={intl.formatMessage({ id: 'landing_page.detail.email_placeholder' })}
                    type="text"
                    validate={[required, email]}
                    component={fieldInput}
                  />
                  <div className="emailSubmit">
                    <button className="btnEmail" type="submit">
                      <img src={iconSubmitEmail} alt="iconSubmitEmail" />
                    </button>
                  </div>
                </div>

              </div>
          </div>
        </FormSubscribeEmail>
      </span>
    );
  }

  render() {
    const { messages, locale } = this.props.intl;
    return (
      <div className="content-for-wallet position-relative">
        <div className="position-relative">
          <section className="section section-mg section-shaped">
            <div className="shape shape-style-1 shape-default">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="container py-lg-md d-flex">
              <div className="col px-0">
                <div className="row">
                  <div className="col-lg-6">
                  <Fade left>
                    <h1 className="display-3 text-white">Ninja Wallet</h1>
                    <p className="text-white">No downloads. No signups. No fees.<br/>A decentralized cryptocurrency wallet that lets you stay 100% anonymous.</p>
                    <p className="text-white">Open <a className="text-info" href="https://www.ninja.org/wallet">ninja.org/wallet</a> on your mobile browser <br />to access Ninja Wallet</p>
                    <div className="btn-wrapper">
                      { this.state.isSubscribed ? <div className="bg card bg-success p-4 text-center">Thank you for subscribing!</div> : this.renderEmailForm() }
                    </div>
                  </Fade>
                  </div>
                  <div className="col-lg-6 main-screen text-center">
                    <Flip right><img width="300" src={imgIPHONE} /></Flip>
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-bottom separator-skew">
              <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
              </svg>
            </div>
          </section>
        </div>

        <section className="section section-lg   section-nucleo-icons pb-50">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-6 order-md-2">
              <Zoom right>
                <div className="icons-container mt-5 on-screen" data-toggle="on-screen">
                  <i className="icon floating"><img src={imgBTC} /></i>
                  <i className="icon floating"><img src={imgXRP} /></i>
                  <i className="icon floating"><img src={imgETH} /></i>
                  <i className="icon floating"><img src={imgZEC} /></i>
                  <i className="icon floating"><img src={imgLTC} /></i>
                </div>
              </Zoom>
              </div>
              <div className="col-md-6 order-md-1">
                <Slide bottom>
                <div className="pr-md-5">
                  <h3>Hold multiple cryptocurrencies with a decentralized wallet </h3>
                  <p>Ninja Wallet - free, no downloads, no sign ups, and no KYC. Allowing users to remain 100% anonymous, with all transactions secured on the blockchain.</p>
                  <p>It currently supports BTC, ETH, BCH, ERC20 tokens, and ERC721 collectibles such as CryptoKitties, CryptoStrikers, CryptoPunks. The currencies XRP, ZEC, LTC… and more will be added soon.</p>
                </div>
                </Slide>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-secondary pt-lg pb-lg">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-7 transform-perspective-left">
              < Flip left><img src={imgPromo1} className="img-fluid" /></ Flip>
              </div>
              <div className="col-md-5">
              <Slide bottom>
                <div className="pl-md-5">
                  <h3>Multiple wallets </h3>
                  <p>Quickly create, import and manage personal, business and testnet wallets in one secure location.</p>
                  <p>We use hierarchical deterministic (HD) address generation for secure in-app wallet generation and back up.</p>
                </div>
                </Slide>
              </div>
            </div>
          </div>
        </section>
        <section className="section pb-lg bg-gradient-default">
          <div className="container">
            <div className="row row-grid align-items-center">
              <div className="col-md-6 order-lg-2 ml-lg-auto">
                <div className="position-relative pl-md-5">
                  <Zoom bottom><img src={img1} className="img-fluid" /></Zoom>
                </div>
              </div>
              <div className="col-lg-6 order-lg-1  pb-100">
                <div className="d-flex">
                <Slide top>
                  <div className="">
                    <h4 className="display-3 text-white">All storage is on your device</h4>
                    <p className="text-white">We want to ensure that our customers have a secure and private experience when using our wallet. That is why we don’t store any of your personal information, private keys, or data on our servers.</p>
                  </div>
                  </Slide>
                </div>

                <Slide top>
                <div className="card shadow shadow-lg--hover mt-5">
                  <div className="card-body">
                    <div className="d-flex px-3">
                      <div>
                        <div className="icon icon-shape bg-gradient-warning rounded-circle text-white">
                          <img src={imgLock} width="16px" />
                        </div>
                      </div>
                      <div className="pl-4">
                        <p>Ninja Wallet uses device-based security. All private keys are stored locally on your device.</p>
                      </div>
                    </div>
                  </div>
                </div>
                </Slide>
              </div>
            </div>
          </div>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-150 pb-150">
          <div className="container">
          <LightSpeed bottom cascade>
            <div className="row justify-content-center text-center">
              <div className="col-lg-8">
                <h2 className="display-3">Don’t forget to backup your wallet</h2>
                <p className="lead text-muted">Keep your cryptocurrencies and crypto assets safe and make sure you backup your Ninja Wallet as soon as you create one.</p>
                <div className="btn-wrapper">
                  <a target="_blank" href="https://medium.com/@ninja_org/how-to-back-up-your-ninja-wallet-its-really-quite-easy-d98a5ec1a671" className="btn btn-primary mb-3 mb-sm-0">Learn how to backup your wallet</a>
                </div>
              </div>
            </div>
            </LightSpeed>
          </div>
        </section>
        <section className="section section-lg bg-gradient-warning pt-150 pb-150">
          <div className="container pb-50">
            <div className="row text-center justify-content-center">
              <Slide bottom cascade>
              <div className="col-lg-10">
                <h2 className="display-3 text-white">More features of Ninja Wallet</h2>


                <ul className="list-unstyled offset-md-2">
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Backup and restore wallet using standard BIP39 recovery phrases</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Payment gateway by Cryptocurrency </h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle ">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Configure gas price, gas</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle ">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Push notifications</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">20+ currency conversion rates</h6>
                        </div>
                      </div>
                    </li>
                    <li className="py-2">
                      <div className="d-flex align-items-center">
                        <div>
                          <div className="badge badge-circle">
                            <img src={imgCheck} className="check-features" />
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-0 text-white">Paper wallet sweep import</h6>
                        </div>
                      </div>
                    </li>
                  </ul>
              </div>
              </Slide>
            </div>
          </div>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <polygon className="fill-white" points="2560 0 2560 100 0 100"></polygon>
            </svg>
          </div>
        </section>
      </div>
    )
  }
}

ContentForWallet.propTypes = {};

export default injectIntl(ContentForWallet);
