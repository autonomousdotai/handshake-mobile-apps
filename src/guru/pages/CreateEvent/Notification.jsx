import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { ErrMsg } from '@/guru/components/Form';
import { fetchProfile } from '@/reducers/auth/action';
import { API_URL } from '@/constants';
import { verifyEmailCode, getEmailCode } from './action';

class Notification extends Component {
  static displayName = 'Notification';
  static propTypes = {
    formProps: PropTypes.any.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    getEmailCode: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    isEmailVerified: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailSent: false
    };
  }

  sendEmail = (email, setFieldError) => {
    this.props.getEmailCode({ data: { email } })
      .then(() => {
        this.setState({ isEmailSent: true });
      }).catch(e => {
        console.error(e);
        setFieldError('email', e.message);
      });
  };

  isValidCodeRegex = code => /^[0-9]{4}/g.exec(code);

  verifyCode = (email, code) => {
    if (this.isValidCodeRegex(code)) {
      const { setFieldError } = this.props.formProps;
      this.props.verifyEmailCode({ url: `user/verification/email/check?email=${email}&code=${code}` })
        .then(() => {
          this.props.fetchProfile({
            PATH_URL: API_URL.USER.PROFILE
          });
        })
        .catch(() => {
          setFieldError('emailCode', 'incorrect Code');
        });
    }
  };

  renderEmailBox = (props, state) => {
    const { errors, values, setFieldError, setFieldValue } = props.formProps;
    const disabled = !values.email || errors.email || state.isEmailSent;
    return (
      <React.Fragment>
        <div className="GroupRow">
          <Field
            name="email"
            placeholder="e.g. ninja@gmail.com"
            onChange={(e) => setFieldValue('email', e.target.value.toLowerCase())}
            disabled={state.isEmailSent}
          />
          <button
            type="button"
            disabled={disabled}
            className="btn btn-primary"
            onClick={() => this.sendEmail(values.email, setFieldError)}
          >
            Get code
          </button>
        </div>
        <ErrMsg name="email" />
      </React.Fragment>
    );
  };

  renderCodeBox = (props, state) => {
    if (!state.isEmailSent) return null;
    const { values } = props.formProps;
    return (
      <React.Fragment>
        <span className="GroupNote">Enter the secret code</span>
        <div className="GroupRow">
          <Field
            name="emailCode"
            type="text"
            placeholder="e.g. 0312"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.verifyCode(values.email, values.emailCode)}
            disabled={!this.isValidCodeRegex(values.emailCode)}
          >
            Verify
          </button>
        </div>
        <ErrMsg name="emailCode" />
      </React.Fragment>
    );
  };

  renderHasEmail = props => {
    return (
      <React.Fragment>
        <span className="GroupNote">Ninja will send you notifications via</span>
        <p>{props.email}</p>
      </React.Fragment>
    );
  };

  renderComponent = (props, state) => {
    if (props.email && props.isEmailVerified) {
      return this.renderHasEmail(props, state);
    }
    return (
      <div className="UnVerified">
        <span className="GroupNote">Get creator updates on your bet.</span>
        {this.renderEmailBox(props, state)}
        {this.renderCodeBox(props, state)}
      </div>
    );
  };

  render() {
    return (
      <div className={Notification.displayName}>
        <div className="GroupTitle">Notification</div>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      email: state.auth.profile.email,
      isEmailVerified: !!state.auth.profile.verified
    };
  }, { verifyEmailCode, getEmailCode, fetchProfile }
)(Notification);
