import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { renderField } from '@/pages/CreateMarket/form';
import { emailValidator, required } from '@/pages/CreateMarket/validate';
import { Field, reduxForm } from 'redux-form';
import ExtLogo from '@/assets/images/pex/ext-landing-page/logo.svg';
import MacBook from '@/assets/images/pex/ext-landing-page/mac.png';
import { ExtensionSubscribe } from './action';
import { subscribeResultSelector } from './selector';

import './PexExtension.scss';

class PexExtension extends React.Component {
  static displayName = 'PexExtension';
  static propTypes = {
    reactHelmetElement: PropTypes.element,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    reactHelmetElement: null,
  };

  onSubmit = (value) => {
    this.props.dispatch(ExtensionSubscribe(value));
  }

  renderSubscribeForm = (props) => {
    let errMsg;
    if (props.subscribeResult && props.subscribeResult.status) {
      return (
        <span className="SubscribeSuccess">Thank you for subscribing!</span>
      );
    } else if (props.subscribeResult && !props.subscribeResult.status) {
      errMsg = props.subscribeResult.message;
    }
    return (
      <div className="ExtSubscribe">
        <span>The internet is waiting to play with you.</span>
        <form className="EmailRequiredForm" onSubmit={props.handleSubmit(this.onSubmit)}>
          <Field
            name="email"
            type="email"
            className="form-group"
            fieldClass="form-control"
            component={renderField}
            placeholder="Enter your email address"
            validate={[required, emailValidator]}
          />
          <button type="submit" className="btn btn-primary btn-block">
            Ready to rock
          </button>
        </form>
        <span className="SubscribeError">{errMsg}</span>
      </div>
    );
  }

  renderComponent = (props) => {
    return (
      <React.Fragment>
        <div className="LeftSideBar">
          <a href="/"><img src={ExtLogo} alt="Extension logo" className="ExtLogo" /></a>
        </div>
        <div className="MainWrapper">
          <div className="Main">
            <div className="MacBook">
              <img src={MacBook} alt="MacBook" />
            </div>
            <div className="Description">
              <p className="ExtHeader">
                <span>Ninja Predicts Chrome Extension</span>
              </p>
              <p className="ExtQuestion">
                Bet on anything you read online without even leaving the page.
              </p>
              <p className="ExtDescription">
                You use the internet. You have opinions. Ninja9148 thinks you're wrong.
                Create a bet in just one click and win ETH for being right.
                Stay 100% anonymous the entire time.
              </p>
              {this.renderSubscribeForm(props)}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className={PexExtension.displayName}>
        {this.props.reactHelmetElement}
        {this.renderComponent(this.props, this.state)}
      </div>
    );
  }
}


export default connect(
  (state) => {
    return {
      subscribeResult: subscribeResultSelector(state),
    };
  },
)(
  reduxForm({
    form: 'ExtLandingForm',
  })(PexExtension),
);
