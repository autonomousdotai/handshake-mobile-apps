import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { bindActionCreators } from "redux";
import { showLoading, hideLoading } from '@/reducers/app/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';

class Refers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      referCollapse: false,
      total: 0,
      amount: 0
    }
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

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
  }

  render() {

    return (
      <div className="collapse-custom">
        <div className="head" onClick={() => this.showInfo()}>
          <p className="label">
            Your clan
            <span>Track your referrals and rewards here.</span>
          </p>
          <div className="extend">
            <span className="badge badge-success"></span>
            <Image className={this.state.referCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${this.state.referCollapse ? '' : 'd-none'}`}>
          <p className="text">{this.state.total} ninja{this.state.total != 1 ? "s" : ""} you've brought in.</p>
          <p className="text">{this.state.amount} Shurikens straight into your pocket, when new ninjas bet through your referral link.</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  referredInfo: bindActionCreators(referredInfo, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Refers));
