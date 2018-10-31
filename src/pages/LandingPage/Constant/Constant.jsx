import React from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import { email, required } from '@/components/core/form/validation';
import { fieldInput } from '@/components/core/form/customField';
import { BASE_API } from '@/constants';
import $http from '@/services/api';
import cn from '@sindresorhus/class-names';

import logoNinja from '@/assets/images/ninja/logo-ninja-constant.svg.raw';
import humburgerIcon from '@/assets/images/icon/hamburger.svg.raw';
import telegramIcon from '@/assets/images/icon/telegram.svg';
import block1 from '@/assets/images/constant/block1.png';
import block2 from '@/assets/images/constant/block2.png';
import block3 from '@/assets/images/constant/block3.png';
import block4 from '@/assets/images/constant/block4.png';
import block5 from '@/assets/images/constant/block5.png';

import createForm from '@/components/core/form/createForm';

const nameFormSubscribeEmail = 'subscribeEmailConstant';

const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});

class ConstantLandingPage extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  state = {
    hasSubscribed: false,
    showMenu: false,
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  handleScroll = (e) => {
    const block5div = document.getElementById('landing-page-constant-block-5');
    const header = document.getElementById('landing-page-constant-header');
    const { offsetTop } = block5div;
    if (e.type === 'scroll') {
      if (document.documentElement.scrollTop > offsetTop - 50 || document.body.scrollTop > offsetTop - 50) {
        if (!header.classList.contains('block5')) {
          header.classList.add('block5');
        }
      } else {
        header.classList.remove('block5');
      }
    }
  }

  handleSubmit = values => {
    const name = 'constant';
    const { email: emailSub } = values;
    const formData = new FormData();
    formData.set('email', emailSub);
    formData.set('product', name);

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(() => {
        this.setState({ hasSubscribed: true });
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };

  toggleShowMenu = () => {
    const { showMenu } = this.state;
    this.setState({ showMenu: !showMenu });
  }

  render() {
    const { intl } = this.props;
    const { hasSubscribed, showMenu } = this.state;

    return (
      <main className="landing-page-constant">
        <header className="landing-page-constant-header" id="landing-page-constant-header">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="landing-page-constant-logo">
                  <Link to="/"><div dangerouslySetInnerHTML={{ __html: logoNinja }} /></Link>
                </div>
                <div onClick={this.toggleShowMenu} className="landing-page-constant-hamburger" dangerouslySetInnerHTML={{ __html: humburgerIcon }} />
                <div className={
                  cn(
                    'landing-page-constant-menu',
                    { show: showMenu },
                  )
                }
                >
                  <ul>
                    <li>
                      <a href="https://ninja.org/product">Product</a>
                    </li>
                    <li>
                      <a href="https://ninja.org/research">Research</a>
                    </li>
                    {/* <li>
                      <Link to="/">Team</Link>
                    </li> */}
                    <li>
                      <a href="https://ninja.org/recruiting?project=Constant" className="btn-constant">Join the Constant team</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section className="landing-page-constant-block block-1">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5 project-detail">
                <div className="landing-page-constant-heading">
                  Constant
                  <div className="slogan">Untraceable, stable, digital cash.</div>
                </div>
                {/* <p className="main">We&apos;re looking for creative, exceptional people to help build the new currency of the internet.</p> */}
                {/* <p style={{ margin: '38px 0 60px' }}><Link to="/recruiting?project=Constant" className="btn-constant">Join the Constant team</Link></p> */}
                <p style={{ marginTop: '38px', fontWeight: 'bold' }}>Receive curated development and community updates.</p>
                {
                  !hasSubscribed
                    ? (
                      <FormSubscribeEmail onSubmit={this.handleSubmit}>
                        <div className="landing-page-constant-subscribe">
                          <Field
                            name="email"
                            className="form-control landing-page-constant-subscribe-input"
                            placeholder={intl.formatMessage({ id: 'landing_page.detail.email_placeholder' })}
                            type="text"
                            validate={[required, email]}
                            component={fieldInput}
                          />
                          <button type="submit" className="btn-constant">Submit</button>
                        </div>
                      </FormSubscribeEmail>
                    )
                    : (
                      <h5>
                        <strong className="text-success">
                          <FormattedMessage id="landing_page.detail.thanksForSubscribing" />
                        </strong>
                      </h5>
                    )
                }
              </div>
              <div className="col-12 col-lg-7 img-container">
                <img src={block1} alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block block-2">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5">
                <div className="landing-page-constant-heading">Borderless. Stable</div>
                <p>Constant is a different kind of cryptocurrency. Like Bitcoin, it is completely decentralized; nobody owns or controls Constant. Unlike Bitcoin however, Constant is stable, so you can spend it on everyday things. </p>
                <p>People continue to choose paper money for the benefits of privacy, control and autonomy, but it nervously sits under mattresses, and can only travel through multiple hands. Constant is cryptographically-secured, privacy-protected digital paper money - that you can instantly send across borders, not just streets.</p>
                <p>Constant gives you anonymity and control, and complete freedom with your money.</p>
              </div>
              <div className="col-12 col-lg-7 img-container">
                <img src={block2} alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block block-3">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5">
                <div className="landing-page-constant-heading">Autonomous monetary policy</div>
                <p>Cryptocurrencies today are unuseable. You wouldn’t use Bitcoin, or any coin, to buy a cup of coffee, or shop online. Businesses don’t pay salaries or invoices in cryptocurrency because they wouldn’t be accepted. And as for financial services -  offering a loan or taking a deposit in coin is a gamble that few dare take.</p>
                <p>The stability of Constant enables these use cases at scale.</p>
                <p>Our AI scientists and economics researchers are working together to develop an adaptive, self-learning, self-adjusting, autonomous monetary policy that can weather all market conditions, keeping the value of Constant stable at all times.</p>
              </div>
              <div className="col-12 col-lg-7 img-container">
                <img src={block3} alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block block-4">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5">
                <div className="landing-page-constant-heading">Total privacy</div>
                <p>Your entire payment history is public on the blockchain. Transparency is one of the blockchain’s strongest ideals, but in practice, visibility is a vulnerability. Currently, anyone with an internet connection can find out how much money you have, and what you spend it on. </p>
                <p>Constant provides a mechanism for legitimate exchange that also safeguards your privacy. </p>
                <p>At the core of Constant is zero-knowledge cryptography. Your transaction information, including sender, receiver, and transaction value, is never exposed. Constant is untraceable.
                </p>
              </div>
              <div className="col-12 col-lg-7 img-container">
                <img src={block4} alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className="landing-page-constant-block block-5" id="landing-page-constant-block-5">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5">
                <div className="landing-page-constant-heading">Constant is digital money you can actually use.</div>
                <p><a rel="noopener noreferrer" target="_blank" href="https://t.me/ninja_org" className="btn-constant"><img src={telegramIcon} alt="" />Connect with us on Telegram</a></p>
              </div>
              <div className="col-12 col-lg-7 img-container">
                <img src={block5} alt="" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default injectIntl(ConstantLandingPage);
