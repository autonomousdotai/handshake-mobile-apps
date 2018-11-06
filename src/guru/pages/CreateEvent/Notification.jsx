import React, { Component } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { renderField } from '@/pages/CreateMarket/form';
import { codeValidator, emailValidator, required } from '@/pages/CreateMarket/validate';
import { Field, formValueSelector } from 'redux-form';
import { sendEmailCode, verifyEmail } from '@/pages/CreateMarket/action';
import { createEventFormName } from '@/pages/CreateMarket/constants';
import { hasEmail, isValidEmailCode, isEmailVerified } from './selector';

class EmailVerification extends Component {
  static displayName = 'EmailVerification';
  static propTypes = {
    className: PropTypes.string,
    email: PropTypes.string,
    emailCode: PropTypes.string,
    hasEmail: PropTypes.any,
    dispatch: PropTypes.func.isRequired,
    isValidEmailCode: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    email: undefined,
    emailCode: undefined,
    hasEmail: undefined,
    isValidEmailCode: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      isEmailSent: false,
      sentCode: null,
    };
  }

  sendEmail = () => {
    this.props.dispatch(sendEmailCode({
      email: this.props.email,
    }));
    this.setState({
      isEmailSent: true,
    });
  }

  sendCode = () => {
    this.props.dispatch(verifyEmail({
      email: this.props.email,
      code: this.props.emailCode,
    }));
    this.setState({
      sentCode: this.props.emailCode,
    });
  }

  renderEmailBox = (props, state) => {
    return (
      <div className="FlexRow">
        <Field
          name="email"
          type="text"
          fieldClass="form-control"
          placeholder="e.g. ninja@gmail.com"
          component={renderField}
          validate={[required, emailValidator]}
          className="EmailCodeField"
          disabled={state.isEmailSent}
        />
        <button
          type="button"
          className="btn btn-primary EmailBtn"
          onClick={this.sendEmail}
          disabled={emailValidator(props.email || '') || state.isEmailSent}
        >
          Get code
        </button>
      </div>
    );
  }

  renderCodeBox = (props, state) => {
    if (!state.isEmailSent) return null;
    let validate = [required];
    if (props.isValidEmailCode === false && props.emailCode === state.sentCode) {
      validate = [required, codeValidator];
    }
    return (
      <React.Fragment>
        <span>Enter the secret code</span>
        <div className="FlexRow">
          <Field
            name="emailCode"
            type="text"
            fieldClass="form-control"
            placeholder="e.g. 0312"
            component={renderField}
            validate={validate}
            className="EmailCodeField"
          />
          <button
            type="button"
            className="btn btn-primary EmailBtn"
            onClick={this.sendCode}
            disabled={required(props.emailCode) || props.isValidEmailCode}
          >
            Verify
          </button>
        </div>
      </React.Fragment>
    );
  }

  renderHasEmail = (props) => {
    return (
      <React.Fragment>
        <span>Ninja will send you notifications via</span>
        <input
          className="form-control"
          name="email"
          type="text"
          disabled
          value={props.hasEmail}
        />
      </React.Fragment>
    );
  }

  renderComponent = (props, state) => {
    if (props.hasEmail && props.isEmailVerified) {
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
    const cls = cx(EmailVerification.displayName, {
      [this.props.className]: !!this.props.className,
    });
    return (
      <div className={cls}>
        <div className="CreateEventFormGroupTitle">Notification</div>
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}

const formSelector = formValueSelector(createEventFormName);
export default connect(
  (state) => {
    return {
      hasEmail: hasEmail(state),
      isEmailVerified: isEmailVerified(state),
      isValidEmailCode: isValidEmailCode(state),
      email: formSelector(state, 'email'),
      emailCode: formSelector(state, 'emailCode'),
    };
  },
)(EmailVerification);
