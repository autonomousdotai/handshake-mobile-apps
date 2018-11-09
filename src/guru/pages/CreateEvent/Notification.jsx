import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { ErrMsg } from '@/guru/components/Form';
import { sendEmailCode, verifyEmailCode, updateEmailProfile } from './action';

class Notification extends Component {
  static displayName = 'Notification';
  static propTypes = {
    formProps: PropTypes.any.isRequired,
    sendEmailCode: PropTypes.func.isRequired,
    verifyEmailCode: PropTypes.func.isRequired,
    updateEmailProfile: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    isEmailVerified: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailSent: false,
    };
  }

  sendEmail = email => {
    this.props.sendEmailCode({ email });
    this.setState({ isEmailSent: true });
  };

  isValidCodeRegex = code => /^[0-9]{4}/g.exec(code);

  verifyCode = (email, code) => {
    if (this.isValidCodeRegex(code)) {
      const { setFieldError } = this.props.formProps;
      this.props.verifyEmailCode({
        METHOD: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        PATH_URL: `user/verification/email/check?email=${email}&code=${code}`,
        successFn: () => {
          this.props.updateEmailProfile({ email });
        },
        errorFn: () => {
          setFieldError('emailCode', 'incorrect Code');
        }
      });
    }
  };

  renderEmailBox = (props, state) => {
    const { errors, touched, values } = props.formProps;
    const disabled =
      touched.email === undefined ||
      (errors.email && touched.email) ||
      state.isEmailSent;
    return (
      <div className="FlexRow">
        <Field
          name="email"
          placeholder="e.g. ninja@gmail.com"
          disabled={state.isEmailSent}
        />
        <button
          type="button"
          disabled={disabled}
          className="btn btn-primary"
          onClick={() => this.sendEmail(values.email)}
        >
          Get code
        </button>
        <ErrMsg name="email" />
      </div>
    );
  };

  renderCodeBox = (props, state) => {
    if (!state.isEmailSent) return null;
    const { values } = props.formProps;
    return (
      <React.Fragment>
        <span className="GroupNote">Enter the secret code</span>
        <div className="FlexRow">
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
          <ErrMsg name="emailCode" />
        </div>
      </React.Fragment>
    );
  };

  renderHasEmail = props => {
    return (
      <React.Fragment>
        <span className="GroupNote">Ninja will send you notifications via</span>
        <input
          name="email"
          type="text"
          disabled
          value={props.email}
        />
      </React.Fragment>
    );
  };

  renderComponent = (props, state) => {
    if (props.email && props.isEmailVerified) {
      return this.renderHasEmail(props, state);
    }
    return (
      <React.Fragment>
        <span>Get creator updates on your bet.</span>
        {this.renderEmailBox(props, state)}
        {this.renderCodeBox(props, state)}
      </React.Fragment>
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
  }, { sendEmailCode, verifyEmailCode, updateEmailProfile }
)(Notification);
