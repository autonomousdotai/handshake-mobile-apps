import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { setLanguage } from '@/reducers/app/action';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Field, formValueSelector } from 'redux-form';
import LandingWrapper from '@/components/LandingWrapper';
import Collapse from '@/components/Collapse';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import $http from '@/services/api';
import { Link } from 'react-router-dom';
import { URL, BASE_API, LANDING_PAGE_TYPE } from '@/constants';
import iconSubmitEmail from '@/assets/images/icon/landingpage/email_submit.svg';

import './styles.scss';
const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});
const selectorFormSubscribeEmail = formValueSelector(nameFormSubscribeEmail);

class Index extends React.PureComponent {
  state = {
    hasSubscribed: false,
  };

  handleSubmit = values => {
    const { name } = this.props;
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

  becomeAtm = () => {
    const { name } = this.props;
    if (name === 'cash') {
      window.location = URL.ATM_FOR_BUSINESS;
    } else if (name === 'cash-for-business') {
      window.location = URL.LANDING_BECOME_ATM;
    }
  }
  scrollToFAQ() {
    const faqNode = ReactDOM.findDOMNode(this.refs.faq)

    if (faqNode && location.href.includes('#faq')) {
      faqNode.scrollIntoView({
          behaviour: 'smooth',
          block: 'start',
          inline: 'center',
      });
    }
  }
  componentDidMount() {
    this.scrollToFAQ();
  }

  renderDisclaim(name) {
    return (
      <div className="row">
        <div className="col">
          <div className="pd-disclaim">Disclaimer</div>
          <div className="pd-small-content">
            <FormattedMessage id={`landing_page.${name}.disclaim`} />
          </div>
          <p className="pd-small-content">Need more information? Check out our <a href="#faq"
          >FAQ</a> and <a href="http://ninja.org/pex/instructions">instructions</a> on how to play.</p>
        </div>
      </div>
    );
  }

  render() {
    const { messages, locale } = this.props.intl;
    const {
      name, img, imgContent, getEmail, intl, type, entireContentComponent, contentComponent, reactHelmetElement, noBreadCrumbs, fullWidthContent = false,
    } = this.props;
    const { hasSubscribed } = this.state;
    const cta1 = messages[`landing_page.${name}.cta1`];
    const cta1Url = messages[`landing_page.${name}.cta1_url`];
    const cta2 = messages[`landing_page.${name}.cta2`];
    const cta2Url = messages[`landing_page.${name}.cta2_url`];

    const textEmail = messages[`landing_page.${name}.textEmail`];
    const btnSubmitEmail =
      messages[`landing_page.${name}.btnSubmitEmail`] || 'Submit';
    const youtubeVideoId = messages[`landing_page.${name}.youtubeVideoId`];
    const faq = messages[`landing_page.${name}.faq`];
    const disclaim = messages[`landing_page.${name}.disclaim`];
    const btnBecomeAtm = messages[`landing_page.${name}.btnBecomeAtm`];
    const btnJoinTelegram = messages[`landing_page.${name}.btnJoinTelegram`];

    const { url: categoryUrl, text: categoryText } = LANDING_PAGE_TYPE[type];
    return (
      <LandingWrapper name={name} fullWidthContent={fullWidthContent}>
        {reactHelmetElement}
        <div className="project-detail">
          {
            messages[`landing_page.${name}.breadcrumb`] && (
              <div className="row mt-5">
                <div className="col">
                  <div className="pd-breadcrumb">
                    {
                      type !== 'landing' && (
                        <React.Fragment>
                          <Link to={categoryUrl}>
                            {categoryText}
                          </Link>
                          <span className="mx-2">/</span>
                        </React.Fragment>
                      )
                    }
                    <span>
                  <FormattedMessage id={`landing_page.${name}.breadcrumb`} />
                </span>
                  </div>
                </div>
              </div>
            )
          }
          {
            entireContentComponent || (
              <React.Fragment>
                <div className="row mt-4">
                  <div className="col-12 col-md-6">
                    <div className="pd-heading">
                      <FormattedMessage id={`landing_page.${name}.heading`} />
                    </div>
                    <div className="pd-subHeading">
                      <FormattedHTMLMessage id={`landing_page.${name}.subHeading`} />
                    </div>
                    <div className="mt-4">
                      {textEmail && (
                        <span>
                    {!hasSubscribed ? (
                      <FormSubscribeEmail onSubmit={this.handleSubmit}>
                      {messages[`landing_page.${name}.label.sendLinkToEmail`] && (
                        <div className="d-table-cell align-top text-send-link">
                          <FormattedMessage id={`landing_page.${name}.label.sendLinkToEmail`} />
                        </div>
                      )
                      }
                        <div className="wrapperEmail">

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
                            <button
                                type="submit"
                                className="btnEmail"
                              >
                                {/*btnSubmitEmail*/}
                                <img src={iconSubmitEmail} alt="iconSubmitEmail" />
                              </button>
                          </div>
                          </div>

                          {
                            btnBecomeAtm ? (
                              <button className="btnTelegram" type="button"
                                      onClick={()=> {
                                        this.becomeAtm();
                                      }}
                              ><FormattedHTMLMessage id={`landing_page.${name}.btnBecomeAtm`} /></button>
                            ) : btnJoinTelegram ?  (
                              <button className="btnTelegram"
                                      onClick={()=> {
                                        this.openTelegram();
                                      }}
                              >Join the dojo on Telegram</button>
                            ) : null
                          }

                        </div>
                        <div className="mt-4 text-email">
                          <FormattedHTMLMessage id={`landing_page.${name}.textEmail`} />
                        </div>
                      </FormSubscribeEmail>
                    ) : (
                      <h5>
                        <strong className="text-success">
                          <FormattedMessage id="landing_page.detail.thanksForSubscribing" />
                        </strong>
                      </h5>
                    )}
                  </span>
                      )}
                      {cta1 && (
                        <a href={cta1Url} className="btn btn-primary-landing">{cta1}</a>
                      )}
                      {cta2 && (
                        <a href={cta2Url} className="btn btn-secondary-landing">{cta2}</a>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    {youtubeVideoId ? (
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&amp;showinfo=0`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    ) : (
                      <img src={img} className="w-100" />
                    )}
                  </div>
                </div>

                {messages[`landing_page.${name}.content`] &&
                <div className="row mt-5">
                  <div className="col">
                    <div className="pd-content">
                      {messages[`landing_page.${name}.content`]}
                    </div>
                  </div>
                </div>}
                {imgContent && (
                  <div className="row mt-5">
                    <div className="col">
                      <img src={imgContent} className="w-100" />
                    </div>
                  </div>
                )}

                {contentComponent}
              </React.Fragment>
            )
          }
          {
            faq && (
              <div className="row mt-5" id="faq" ref="faq" >
                <div className="col">
                  <div className="pd-faq">
                    {messages.COIN_EXCHANGE_LP_FAQ_TITLE}
                  </div>
                  <div>
                    {faq.map((item, index) => (
                      <Collapse
                        label={item.question}
                        content={item.answer}
                        isList={item.isList}
                        theme="white"
                        key={index}
                        index={index + 1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          }
          {disclaim && this.renderDisclaim(name)}
        </div>
      </LandingWrapper>
    );
  }
}

const mapDispatch = {
  setLanguage,
};

export default injectIntl(connect(null, mapDispatch)(Index));
