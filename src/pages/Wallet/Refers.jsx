import React from 'react';
import { connect } from 'react-redux';

// components
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import {
    fieldInput
  } from '@/components/core/form/customField';
import { verifyEmail, submitEmail, checkJoinTelegram, checkFollowTwitter, completeProfile, authUpdate } from '@/reducers/auth/action';
import {required} from '@/components/core/form/validation';
import {change, Field, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import createForm from '@/components/core/form/createForm';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import local from '@/services/localStore';
import {APP} from '@/constants';
import "./Refers.scss";

  // 3 step Form
const nameFormStep1 = 'referStep1';
const Step1Form = createForm({ propsReduxForm: { form: nameFormStep1}});

const nameFormStep2 = 'referStep2';
const Step2Form = createForm({ propsReduxForm: { form: nameFormStep2}});

const nameFormStep3 = 'referStep3';
const Step3Form = createForm({ propsReduxForm: { form: nameFormStep3}});

const nameFormStep4 = 'referStep4';
const Step4Form = createForm({ propsReduxForm: { form: nameFormStep4}});

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

class Refers extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      step1_value: "",
      step1: false,
      step2_value: "",
      step2: false,
      step3_value: "",
      step3: 0,
      profile: {},
      end: false
    }
  }

  componentDidMount(){
    this.resetForm();
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter" style={{"word-wrap": "break-word"}}>{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 3000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 4000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  resetForm(){
    // clear form:
    this.props.clearFields(nameFormStep1, false, false, "telegram_username");
    this.props.clearFields(nameFormStep2, false, false, "twitter_username");
    this.props.clearFields(nameFormStep3, false, false, "refer_email");

    // fill link ref:
    const profile = local.get(APP.AUTH_PROFILE);
    this.setState({profile: profile});

    if(profile && profile.email){
      this.setState({step3: 2, step3_value: profile.email});
      this.props.rfChange(nameFormStep3, 'refer_email', profile && profile.email ? profile.email : '');
    }

    let refers = local.get(APP.REFERS);
    if(refers){
      if(refers.step1){
        this.setState({step1: true, step1_value: refers.step1_value});
      }

      if(refers.step2){
        this.setState({step2: true, step2_value: refers.step2_value});
      }

      if(profile && profile.email) {
        refers.step3 = 2;
        refers.step3_value = profile.email;
        local.save(APP.REFERS, refers);
      }
      else if(refers.step3){
        this.setState({step3: refers.step3, step3_value: refers.step3_value});
      }

      this.props.rfChange(nameFormStep1, 'telegram_username', refers && refers.step1 ? refers.step1_value : '');
      this.props.rfChange(nameFormStep2, 'twitter_username', refers && refers.step2 ? refers.step2_value : '');
      this.props.rfChange(nameFormStep3, 'refer_email', refers && refers.step3_value ? refers.step3_value : '');

      if(refers.step1 && refers.step2 && refers.step3 == 2){
        let referLink = profile && profile.username ? "https://ninja.org/wallet?ref=" + profile.username : '';
        this.setState({referLink: referLink});
        this.props.rfChange(nameFormStep4, 'refer_link', referLink);
      }
    }
    else{
      if(profile && profile.email) {
        refers = {};
        refers.step3 = 2;
        refers.step3_value = profile.email;
        local.save(APP.REFERS, refers);
      }
    }
  }

  submitStep1 = async () => {
    let result = await this.checkJoinTelegram(this.state.step1_value);
    const { messages } = this.props.intl;

    if(!result){
      this.showError(messages.wallet.refers.error.submit_telegram);
    }
    else{
      this.setState({step1: true});
      let refers = local.get(APP.REFERS);
      if(!refers)
        refers = {};

      refers.step1 = this.state.step1;
      refers.step1_value = this.state.step1_value;
      local.save(APP.REFERS, refers);
      this.showSuccess(messages.wallet.refers.success.submit_telegram);
    }
  }

  submitStep2 = async() => {
    const { messages } = this.props.intl;

    if(await this.checkFollowTwitter()){
      this.setState({step2: true});
      let refers = local.get(APP.REFERS);
      if(!refers)
        refers = {};

      refers.step2 = true;
      refers.step2_value = this.state.step2_value;
      local.save(APP.REFERS, refers);
      this.showSuccess(messages.wallet.refers.sucess.submit_twitter);
    }
    else{
      this.showError(messages.wallet.refers.error.submit_twitter);
    }
  }

  submitStep3 = () => {
    const { messages } = this.props.intl;
    let refers = local.get(APP.REFERS);
    if(!refers) refers = {};

    if(this.state.step3 && this.state.step3 == 1){

      let code = this.state.step3_value, email = this.state.email;
      this.props.submitEmail({
        PATH_URL: `user/verification/email/check`,
        qs: { email, code },
        METHOD: 'POST',
        successFn: () => {
          const params = new URLSearchParams();
          params.append('email', email);

          this.props.authUpdate({
            PATH_URL: 'user/profile',
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            METHOD: 'POST',
            successFn: () => {
              const profile = local.get(APP.AUTH_PROFILE);

              refers.step3 = 2;
              refers.step3_value = email;
              local.save(APP.REFERS, refers);
              this.setState({isShowVerificationEmailCode: false,
                step3: refers.step3, step3_value: refers.step3_value,
                referLink: profile && profile.username ? "https://ninja.org/wallet?ref=" + profile.username : ''});

              this.props.rfChange(nameFormStep3, 'refer_email', email);
              this.showSuccess(messages.wallet.refers.success.confirm_code);
            },
            errorFn: (e) => {
              console.error(e);
              this.showError(messages.wallet.refers.error.confirm_code);
            },
          });
        },
        errorFn: (e) => {
          console.error(e);
          this.showError();
        },
      });
    }
    else{
      let email = this.state.step3_value;
      this.props.verifyEmail({
        PATH_URL: `user/verification/email/start?email=${email}`,
        METHOD: 'POST',
        successFn: (data) => {
          if (data.status) {
            this.showToast(messages.wallet.refers.success.verify_code);
            local.save(APP.EMAIL_NEED_VERIFY, email);
            this.setState({step3: 1, email: email});

            this.props.rfChange(nameFormStep3, 'refer_email', "");
            this.props.clearFields(nameFormStep3, false, false, "refer_email");
          }
        },
        errorFn: (e) => {
          console.error(e);
          this.showError(messages.wallet.refers.error.verify_code);
        },
      });
    }
  }


  checkJoinTelegram(username) {
    return new Promise((resolve, reject) => {
      let result = false;
      this.props.checkJoinTelegram({
        PATH_URL: 'telegram/chat-member',
        qs: { user_name: username, chat_id: '-1001320226748'},
        successFn: (res) => {
          if(res && res.data){
            resolve(true);
          }
          else{
            resolve(false);
          }
        },
        errorFn: (e) =>{
          reject(e);
        }
      });
    });
  }

  checkFollowTwitter(){
    return new Promise((resolve, reject) => {
      let result = false;
      this.props.checkFollowTwitter({
        PATH_URL: 'twitter/'+ this.state.step2_value,
        successFn: (res) => {
          if(res && res.data){
            resolve(true);
          }
          else{
            resolve(false);
          }
        },
        errorFn: (e) =>{
          reject(e);
        }
      });
    });
  }

  updateTelegramUsernameValue = (evt) => {
    let txt = evt.target.value.trim();
    if(txt) txt = txt.replace("@", "");
    this.setState({
      step1_value: txt,
    });
  }

  updateEmailValue= (evt) => {
    this.setState({
      step3_value: evt.target.value.trim(),
    });
  }

  updateTwitterUsernameValue = (evt) => {
    let txt = evt.target.value.trim();
    if(txt) txt = txt.replace("@", "");

    this.setState({
      step2_value: txt,
    });
  }

  resetStep3 = () => {
    this.props.clearFields(nameFormStep3, false, false, "refer_email");
    let refers = local.get(APP.REFERS);
    if(!refers) refers = {};

    this.setState({step3_value: "", step3:0});
    refers.step3 = 0;
    refers.step3_value = "";
    local.save(APP.REFERS, refers);
  }

renderStep1 = () => {
  const { messages } = this.props.intl;

  return (!(this.state.end) ?
  <Step1Form onSubmit={this.submitStep1} className="refers-wrapper">
    <h6><a href="https://t.me/ninja_org" target="_blank">{messages.wallet.refers.text.telegram}</a> {messages.wallet.refers.text.telegram2}</h6>
    <div className="col2">
      <Button isLoading={this.state.isLoading} disabled={this.state.step1} block type="submit">{this.state.step1 ? messages.wallet.refers.button.verified :messages.wallet.refers.button.verify}</Button>
    </div>
    <div className="col1">
      <Field
        name="telegram_username"
        type="text"
        className="form-control"
        placeholder={messages.wallet.refers.placeholder.telegram_username}
        component={fieldInput}
        value={this.state.step1_value}
        onChange={evt => this.updateTelegramUsernameValue(evt)}
        validate={[required]}
        disabled={this.state.step1}
      />
    </div>
  </Step1Form>
  :"")
}

renderStep2= () => {
  const { messages } = this.props.intl;

  return (!(this.state.end) ?
  <Step2Form onSubmit={this.submitStep2} className="refers-wrapper">
    <h6>{messages.wallet.refers.text.twitter2} <a href="https://twitter.com/ninja_org" target="_blank">{messages.wallet.refers.text.twitter}</a>.</h6>
    <div className="col2">
        <Button isLoading={this.state.isLoading} block disabled={this.state.step2} type="submit">{this.state.step2 ? messages.wallet.refers.button.verified :messages.wallet.refers.button.verify}</Button>
    </div>
    <div className="col1">
      <Field
        name="twitter_username"
        type="text"
        className="form-control"
        placeholder={messages.wallet.refers.placeholder.twitter_username}
        component={fieldInput}
        value={this.state.step2_value}
        onChange={evt => this.updateTwitterUsernameValue(evt)}
        validate={[required]}
        disabled={this.state.step2}
      />
    </div>
  </Step2Form>
  : "")
}

renderStep3= () => {
  const { messages } = this.props.intl;
  return (!(this.state.end) ?
  <Step3Form onSubmit={this.submitStep3} className="refers-wrapper">
    <h6>{messages.wallet.refers.text.ninja_name}</h6>
    <div className="col2"> {this.renderStep3_labelButton()}</div>
    <div className="col1">
      <Field
          name="refer_email"
          type="text"
          className="form-control padding-right-10"
          placeholder={this.state.step3 > 0 ? messages.wallet.refers.placeholder.email : messages.wallet.refers.placeholder.email2}
          component={fieldInput}
          value={this.state.step3_value}
          onChange={evt => this.updateEmailValue(evt)}
          validate={[required]}
          disabled={this.state.step3 && this.state.step3 > 1}
      />
    </div>
    {
      this.state.step3 == 1 ?
      <div className="col100">
        <a className="reset-link" onClick={() => {this.resetStep3()}}>{messages.wallet.refers.button.reset_email}</a>
      </div> : ""
    }
    {
      this.state.step1 && this.state.step2 && this.state.step3 > 1 && !this.state.end ?
      <div className="col100 token">
        <Button block type="button" onClick={() => {this.submitEndStep()}}>{messages.wallet.refers.button.get_token}</Button>
      </div> : ""
    }

  </Step3Form>
  :"")
}

completeRefers() {
  return new Promise((resolve, reject) => {
    let result = false;
    this.props.completeProfile({
      PATH_URL: 'user/complete-profile',
      METHOD: 'POST',
      successFn: (res) => {
        if(res){
          resolve(res);
        }
        else{
          resolve(null);
        }
      },
      errorFn: (e) =>{
        reject(e);
      }
    });
  });
}

submitEndStep= async () => {
  const { messages } = this.props.intl;

  let result = await this.completeRefers();
  if(result){
    if(result.data){
      let refers = local.get(APP.REFERS);
      if(!refers) refers = {};

      this.setState({end: true})
      refers.end = 1;
      local.save(APP.REFERS, refers);

      this.showSuccess(messages.wallet.refers.success.get_token);
    }
    else{
      this.showError(result.message);
    }
  }
  else{
    this.showError(messages.wallet.refers.error.get_token);
  }
}

renderStep3_labelButton= () => {
  const { messages } = this.props.intl;

  switch(this.state.step3) {
    case 1:
      return <Button isLoading={this.state.isLoading} block type="submit">{messages.wallet.refers.button.confirm}</Button>
    case 2:
      return <Button isLoading={this.state.isLoading} block disabled type="submit">{messages.wallet.refers.button.verified}</Button>
    default:
      return <Button isLoading={this.state.isLoading} block type="submit">{messages.wallet.refers.button.verify}</Button>
  }
}

renderLinkRefer = () => {
  const { messages } = this.props.intl;

  return (this.state.end ?
  <Step4Form className="refers-wrapper refers-wrapper-border">
    <h6>{messages.wallet.refers.text.referral_link}</h6>
    <div className="col100">
        <Field
            name="refer_link"
            type="text"
            className="form-control"
            placeholder=""
            component={fieldInput}
            validate={[required]}
            onFocus={() => { Clipboard.copy(this.state.referLink); this.showToast(messages.wallet.refers.success.copy_link); }}
        />
    </div>
  </Step4Form> :
  "")
}

  render() {

    const {formAddress, toAddress, amount, coinName } = this.props;
    const { messages } = this.props.intl;
    return (
      <div className="refers">
          <h5>{messages.wallet.refers.text.title}</h5>
          {this.renderStep1()}
          {this.renderStep2()}
          {this.renderStep3()}
          {this.renderLinkRefer()}
        </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  verifyEmail: bindActionCreators(verifyEmail, dispatch),
  submitEmail: bindActionCreators(submitEmail, dispatch),
  checkJoinTelegram: bindActionCreators(checkJoinTelegram, dispatch),
  checkFollowTwitter: bindActionCreators(checkFollowTwitter, dispatch),
  completeProfile: bindActionCreators(completeProfile, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Refers));
