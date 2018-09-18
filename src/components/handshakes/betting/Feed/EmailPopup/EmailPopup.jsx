import React from 'react';
import Button from '@/components/core/controls/Button';
import PropTypes from 'prop-types';
import Image from '@/components/core/presentation/Image';
import IconOKSVG from '@/assets/images/luckypool/ic_ok.svg';
import CloseIcon from '@/assets/images/icon/close.svg';
import isEmail from 'validator/lib/isEmail';
import { submitEmailSubcribe } from '@/reducers/auth/action';
import { API_URL } from '@/constants';
import { connect } from 'react-redux';
import {
  getMessageWithCode,
} from '@/components/handshakes/betting/utils.js';

import GA from '@/services/googleAnalytics';

import './EmailPopup.scss';

class EmailPopup extends React.Component {
  static propTypes = {
    onButtonClick: PropTypes.func,

  }
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      isValidEmail: true,
      errorMessage: '',
    };
  }

  changeText(text) {
    this.setState({
      email: text,
    });
  }

  sendEmail() {
    const { email } = this.state;
    if (!isEmail(email)) {
      this.setState({
        isValidEmail: false,
        errorMessage: 'Please enter right email format',
      });
    } else {
      this.submitEmail(email);
    }
  }
  submitEmail(email) {
    GA.clickNotifyMe(email);

    const params = {
      email,
    };
    this.props.submitEmailSubcribe({
      PATH_URL: API_URL.CRYPTOSIGN.SUBCRIBE_EMAIL_PREDICTION,
      METHOD: 'POST',
      data: params,
      successFn: ((successData)=> {
        this.props.onButtonClick();
      }),
      errorFn: ((error)=> {
        const { status, code } = error;
        if (status === 0) {
          const message = getMessageWithCode(code);
          console.log(error);
          this.setState({
            isValidEmail: false,
            errorMessage: message,
          });
        }
      }),
    });
  }

  renderErrorField() {
    const { errorMessage } = this.state;
    return (
      <div className="errorField">*{errorMessage}</div>
    );
  }

  render() {
    const { isValidEmail } = this.state;
    return (
      <div className="wrapperEmailPopup">
        <div className="emailPopupContent">
          <div
          className="emailPopupClose"
          onClick={() => {
            this.props.onButtonClick();
          }}
          >
            <Image src={CloseIcon} alt="CloseIcon" />
          </div>
          <Image className="bannerIcon" src={IconOKSVG} alt="iconOK"/>
          <div className="emailPopupDes">Success!</div>
          <div className="emailPopupSmallDes">Your bet has been placed.</div>
        </div>
         <div className="contentSmallDes">Check back here for the<br/>results or we can email them to you :)</div>
         {!isValidEmail && this.renderErrorField()}
        <input
            className="emailPopupInput"
            type='text'
            autoComplete="off"
            id='email'
            placeholder="Enter your email"
            onChange={(evt) => {
              this.changeText(evt.target.value);
            }}
          />
        <Button
          className="emailPopupButton"
          isLoading={this.props.fetching}
          onClick={() => {
            this.sendEmail();
          }}
        >
        Notify me
          </Button>
      </div>
    );
  }
}
const mapState = state => ({
  fetching: state.auth.fetching,
});
const mapDispatch = ({
  submitEmailSubcribe,

});

export default connect(mapState, mapDispatch)(EmailPopup);
