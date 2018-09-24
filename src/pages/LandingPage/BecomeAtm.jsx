import React from 'react';
import { connect } from 'react-redux';
import { setLanguage } from '@/reducers/app/action';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import createForm from '@/components/core/form/createForm';
import { fieldInput } from '@/components/core/form/customField';
import { email, required } from '@/components/core/form/validation';
import $http from '@/services/api';
import { BASE_API } from '@/constants';
import PropTypes from 'prop-types';
import ModalDialog from '@/components/core/controls/ModalDialog';
import ShareSocial from '@/components/core/presentation/ShareSocial';
import imgLogo from '@/assets/images/ninja/ninja-header-black.svg';
import icon1 from '@/assets/images/landing/become-atm/landing-become-atm-icon-1.svg';
import icon2 from '@/assets/images/landing/become-atm/landing-become-atm-icon-2.svg';
import icon3 from '@/assets/images/landing/become-atm/landing-become-atm-icon-3.svg';
import './BecomeAtm.scss';

const nameFormSubscribeEmail = 'subscribeEmail';
const FormSubscribeEmail = createForm({
  propsReduxForm: {
    form: nameFormSubscribeEmail,
  },
});

class BecomeAtm extends React.PureComponent {
  constructor() {
    super();

    this.modal = null;
    this.openModal = ::this.openModal;
  }

  openModal() {
    this.modal?.open();

    // set styles
    document.body.style.position = 'initial';
  }

  handleSubmit = values => {
    const formData = new FormData();
    formData.set('email', values.email);
    formData.set('product', 'become-atm');

    $http({
      method: 'POST',
      url: `${BASE_API.BASE_URL}/user/subscribe`,
      data: formData,
    })
      .then(() => {
        this.openModal();
      })
      .catch(err => {
        console.log('err subscribe email', err);
      });
  };

  renderSubheading() {
    const { messages } = this.props.intl;
    const subHeading = messages['landing_page.become_atm.subHeading'];

    if (subHeading) {
      return (
        <ul>
          {
            subHeading.map(sub => (
              <li key={sub}>{sub}</li>
            ))
          }
        </ul>
      );
    }
    return null;
  }

  renderCategoryItem(cat) {
    let icon = null;
    if (cat.label === 'Easy Profit') {
      icon = icon3;
    }
    if (cat.label === 'No Investment') {
      icon = icon2;
    }
    if (cat.label === 'Flexible working hours') {
      icon = icon1;
    }
    return (
      <div key={cat.label} className="category-item col-sm-4">
        <img className="icon" src={icon} alt={cat.label} />
        <span className="label">{cat.label}</span>
        <span className="desc">{cat.desc}</span>
      </div>
    );
  }

  renderCategory() {
    const { messages } = this.props.intl;
    const categories = messages['landing_page.become_atm.categories'];
    if (categories) {
      return (
        <div className="categories row">
          { categories.map(cat => this.renderCategoryItem(cat)) }
        </div>
      );
    }
    return null;
  }

  renderEmailForm(opt = { withDesc: true }) {
    const {
      intl,
    } = this.props;
    const { withDesc } = opt;
    return (
      <span>
        <FormSubscribeEmail onSubmit={this.handleSubmit}>
          {withDesc && (
            <div className="d-table-cell align-top text-send-link emailDesc">
              <FormattedMessage id="landing_page.become_atm.email.desc" />
            </div>)
          }
          <div className="wrapperEmail">
            {withDesc && (
              <div className="d-table-cell align-top text-send-link label">
                <FormattedMessage id="landing_page.become_atm.email.label" />
              </div>)
            }
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
              </div>
              <button className="btnTelegram" type="submit">
                <FormattedHTMLMessage id="landing_page.become_atm.email.submitBtnLabel" />
              </button>
            </div>
          </div>
        </FormSubscribeEmail>
      </span>
    );
  }

  renderSocialShare() {
    const { messages } = this.props.intl;
    return (
      <ShareSocial
        title={messages['landing_page.become_atm.modal.title']}
        className="center-block"
        shareUrl={window.location.href}
      />
    );
  }

  renderModal() {
    return (
      <ModalDialog
        className="become-atm-modal"
        onRef={modal => { this.modal = modal; }}
        onClose={() => {}}
      >
        <div>
          <div className="modal-desc">
            <h4><FormattedMessage id="landing_page.become_atm.modal.content" /></h4>
            <span><FormattedMessage id="landing_page.become_atm.modal.subContent" /></span>
          </div>
          <div>
            {this.renderSocialShare()}
          </div>
        </div>
      </ModalDialog>
    );
  }

  render() {
    const { messages } = this.props.intl;
    const { reactHelmetElement } = this.props;
    const youtubeVideoId = messages['landing_page.become_atm.youtubeId'];
    return (
      <main className="become-atm-container container">
        {reactHelmetElement}
        {this.renderModal()}
        <div className="project-detail">
          <React.Fragment>
            <div className="logoContainer">
              <img src={imgLogo} alt="logo" />
            </div>
            <div className="row mt-4">
              <div className="col-12 col-md-6">
                <div className="pd-heading">
                  <FormattedMessage id="landing_page.become_atm.heading" />
                </div>
                <div className="pd-subHeading">
                  {this.renderSubheading()}
                </div>
                <div className="mt-4 d-md-none d-lg-block">
                  { this.renderEmailForm() }
                </div>
              </div>
              <div className="col-12 col-md-6 video-frame">
                {youtubeVideoId && (
                  <iframe
                    title="youtube-video"
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&amp;showinfo=0`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
            <div className="mt-4 d-none d-md-block d-lg-none" style={{ padding: '0px 40px' }}>
              { this.renderEmailForm() }
            </div>
            {this.renderCategory()}
            <div className="landing-footer">
              <h3>
                <FormattedMessage id="landing_page.become_atm.footer" />
              </h3>
              <div className="mt-4" style={{ maxWidth: '600px' }}>
                { this.renderEmailForm({ withDesc: false }) }
              </div>
            </div>
          </React.Fragment>
        </div>
      </main>
    );
  }
}

const mapDispatch = {
  setLanguage,
};

BecomeAtm.propTypes = {
  intl: PropTypes.object.isRequired,
  reactHelmetElement: PropTypes.any.isRequired,
};
export default injectIntl(connect(null, mapDispatch)(BecomeAtm));
