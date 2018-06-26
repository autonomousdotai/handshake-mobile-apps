import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// components
import {
    fieldInput
  } from '@/components/core/form/customField';
import {required} from '@/components/core/form/validation';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { referredInfo } from '@/reducers/auth/action';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import local from '@/services/localStore';
import {APP} from '@/constants';
import createForm from '@/components/core/form/createForm';
import { StringHelper } from '@/services/helper';
import "./Refers.scss"

const nameFormStep4 = 'referStep4';
const Step4Form = createForm({ propsReduxForm: { form: nameFormStep4}});

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

class RefersDashboard extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      number_ninjas: 0,
      number_token: 0
    }
  }

  async componentDidMount(){
    let info = await this.getInfoRefer();
    if(info && info.referral)
      this.setState({"number_ninjas" : info.referral.total, "number_token": info.referral.amount});
    this.getLinkRefer();
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
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

  getInfoRefer() {
    return new Promise((resolve, reject) => {
      let result = false;
      this.props.referredInfo({
        PATH_URL: 'user/referred',
        METHOD: 'GET',
        successFn: (res) => {
          if(res && res.data){
            resolve(res.data);
          }
          else{
            resolve(null);
          }
        },
        errorFn: (e) =>{
          console.log(e);
          reject(e);
        }
      });
    });
  }

  getLinkRefer(){
    const profile = local.get(APP.AUTH_PROFILE);
    let referLink = profile && profile.username ? "https://ninja.org/wallet?ref=" + profile.username : '';
    this.setState({referLink: referLink});
    this.props.rfChange(nameFormStep4, 'refer_link', referLink);
  }

  showInfoRefer = () => {
    const { messages } = this.props.intl;
    return (
    <div className="info">
      <div>{StringHelper.format(messages.wallet.refers_dashboard.text.number_ninjas, this.state.number_ninjas)}</div>
      <div>{StringHelper.format(messages.wallet.refers_dashboard.text.number_total, this.state.number_token)}</div>
    </div>
  )}

  handleFocus = (event) =>{
    event.target.select();
  }


  renderLinkRefer = () => {
    const { messages } = this.props.intl;

    return (<Step4Form className="refers-wrapper">
      <h6>{messages.wallet.refers_dashboard.title}</h6>
      <div className="col100">
          <Field
              name="refer_link"
              type="text"
              className="form-control"
              placeholder=""
              component={fieldInput}
              validate={[required]}
              onFocus={() => { evt => this.handleFocus(evt); Clipboard.copy(this.state.referLink); this.showToast(messages.wallet.refers_dashboard.text.copy_link); }}
          />
          <div className="note">{messages.wallet.refers_dashboard.text.note}</div>
      </div>
    </Step4Form>)
  }

  render() {

    const { } = this.props;

    return (
      <div className="refers-dashboard">
        {this.showInfoRefer()}
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
  referredInfo: bindActionCreators(referredInfo, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RefersDashboard));

