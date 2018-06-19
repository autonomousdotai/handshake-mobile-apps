import React from 'react';
import { connect } from 'react-redux';

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
  constructor(props) {
    super(props);

    this.state = {
      number_ninjas: 0,
      number_token: 0
    }
  }

  async componentDidMount(){
    console.log("componentDidMount");
    let info = await this.getInfoRefer();
    if(info)
      this.setState({"number_ninjas" : info.total, "number_token": info.amount});
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
          console.log(res);
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

  showInfoRefer = () => (
    <div className="info">
      <div>You brought {this.state.number_ninjas} ninjas to the dojo.</div>
      <div>Total reward: {this.state.number_token} SHURI</div>
    </div>
  )
  handleFocus = (event) =>{
    event.target.select();
  }
  

  renderLinkRefer = () => (
    <Step4Form className="refers-wrapper">
      <h6>This is your super sexy referral link. You get 20 shurikens for every new ninja.</h6>
      <div className="col100">
          <Field
              name="refer_link"
              type="text"
              className="form-control"
              placeholder=""
              component={fieldInput}              
              validate={[required]}
              onFocus={() => { evt => this.handleFocus(evt); Clipboard.copy(this.state.referLink); this.showToast('Referral link copied to clipboard.'); }}
          />
          <div className="note"> Do not change your alias or this link will be unvalid</div>
      </div>
    </Step4Form>
  )


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

export default connect(mapStateToProps, mapDispatchToProps)(RefersDashboard);
