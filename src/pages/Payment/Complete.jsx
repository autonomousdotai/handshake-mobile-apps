import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import iconSuccess from '@/assets/images/pages/payment/check-circle-solid.svg';
import iconFailed from '@/assets/images/pages/payment/times-circle-solid.svg';
//import { ICON } from '@/styles/images';
import qs from 'querystring';
import './Complete.scss';

class Complete extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      title: '',
      msg: '',
      success: true,
      fullBackUrl: ''
    }
  }

  componentDidMount() {
    this.props.showLoading();
    this.getData();
    this.props.hideLoading();
  }

  getMessage(str){
    const { messages } = this.props.intl;

    let result = "";
    try{
      result = eval(str);
    }
    catch(e){
      console.error(e);
    }

    return result;
  }

  getData = () => {
    const { data } = this.props;
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { order_id, confirm_url } = this.querystringParsed;
    if(data) {
      let icon = '', title = '', msg = '', fullBackUrl = '', success = true;

      if(data.hash){
        icon = iconSuccess;
        title = 'Payment processed!';
        msg = 'Thank you for your purchase!';
        fullBackUrl = `${confirm_url}?order_id=${order_id}&transaction=${data.hash}&status=1`;
        setTimeout(() => {window.location.href = fullBackUrl}, 7000);
      }
      else{
        icon = iconFailed;
        title = 'Payment failed!';
        msg = 'Please click Back and try again.';
        success = false;
        fullBackUrl = `${confirm_url}?order_id=${order_id}&status=2`;
      }

      this.setState({icon: icon, title: title, msg: msg, fullBackUrl: fullBackUrl, success: success});
    }
  }

  goRedirect = () => {
    window.location.href = this.state.fullBackUrl;
  }

  get showPayment(){

    return (
      <div className={this.state.success ? "complete-info" : "complete-info failed"}>
        <div className="icon"><img src={this.state.icon} /></div>
        <div className="title">{this.state.title}</div>
        <div className="msg">{this.state.msg}</div>
        {
          this.state.success && <div className="redirect">Redirecting you back in 5 seconds.</div>
        }

        <button className="btn btn-light" onClick={this.goRedirect}>{this.state.success ? "Close" : "Back to shop"}</button>
      </div>
    )
  }

  render() {
    const { messages } = this.props.intl;
    return (<div>
        {this.showPayment}
      </div>)

  }
}

const mapState = (state) => ({
});

const mapDispatch = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});


export default injectIntl(connect(mapState, mapDispatch)(Complete));
