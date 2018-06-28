import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {fieldInput} from '@/components/core/form/customField';
import {change, Field} from 'redux-form';
import {bindActionCreators} from 'redux';
import { showLoading, hideLoading } from '@/reducers/app/action';
import {required} from '@/components/core/form/validation';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import { showAlert } from '@/reducers/app/action';
import createForm from '@/components/core/form/createForm';
import './Refers.scss';
import local from '@/services/localStore';
import {APP} from '@/constants';

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
      referCollapse: false,
      total: 0,
      amount: 0
    }
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
    this.showAlert(mst, 'primary', 3000);
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
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

  showInfo = async () => {
    this.setState({referCollapse:!this.state.referCollapse});
    let info = await this.getInfoRefer();
    if(info && info.firstbet)
      this.setState({"total" : info.firstbet.total, "amount": info.firstbet.amount});

    //get link
    const profile = local.get(APP.AUTH_PROFILE);
    let referLink = profile && profile.username ? "https://ninja.org/wallet?ref=" + profile.username : '';
    this.setState({referLink: referLink});
    this.props.rfChange(nameFormStep4, 'refer_link', referLink);
  }

  renderLinkRefer = () => {
    const { messages } = this.props.intl;

    return (
    <Step4Form className="refers-wrapper">
      <p>{messages.wallet.refers.text.profile_link}</p>
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
    </Step4Form>)
  }

  render() {
    const { messages } = this.props.intl;

    return (
      <div className="collapse-custom">
        <div className="head" onClick={() => this.showInfo()}>
          <p className="label">
            {messages.wallet.refers.label.menu}
            <span>{messages.wallet.refers.label.menu_description}</span>
          </p>
          <div className="extend">
            <span className="badge badge-success"></span>
            <Image className={this.state.referCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${this.state.referCollapse ? '' : 'd-none'}`}>
          <p className="text">{this.state.total} {StringHelper.format(messages.wallet.refers.text.menu_total, this.state.total != 1 ? "s" : "")}</p>
          <p className="text">{this.state.amount} {messages.wallet.refers.text.menu_amount}</p>
          <p className="refer-link">{this.renderLinkRefer()}</p>
        </div>

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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Refers));
