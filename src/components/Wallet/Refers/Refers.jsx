import React from 'react';
import { FormattedDate, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action';
import Image from '@/components/core/presentation/Image';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import { referredInfo } from '@/reducers/auth/action';
import { StringHelper } from '@/services/helper';
import './Refers.scss';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { getReferalInfo } from '@/reducers/exchange/action';
import { shortenUser } from '@/services/offer-util';


window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy;

  function isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  function createTextArea(text) {
    textArea = document.createElement('textArea');
    textArea.value = text;
    document.body.appendChild(textArea);
  }

  function selectText() {
    let range,
      selection;
    if (isOS()) {
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999);
    } else {
      textArea.select();
    }
  }

  function copyToClipboard() {
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }

  copy = function (text) {
    createTextArea(text);
    selectText();
    copyToClipboard();
  };
  return { copy };
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
      amount: 0,
      referLink: '',
    };
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {
      },
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
    this.props.showLoading({ message: '' });
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  getInfoRefer() {
    return new Promise((resolve, reject) => {
      const result = false;
      this.props.referredInfo({
        PATH_URL: 'user/referred',
        METHOD: 'GET',
        successFn: (res) => {
          if (res && res.data) {
            resolve(res.data);
          } else {
            resolve(null);
          }
        },
        errorFn: (e) => {
          console.log(e);
          reject(e);
        },
      });
    });
  }

  showInfo = async () => {
    this.setState({ referCollapse: !this.state.referCollapse });
    const info = await this.getInfoRefer();
    if (info && info.firstbet) { this.setState({ total: info.firstbet.total, amount: info.firstbet.amount }); }

    // get link
    const profile = local.get(APP.AUTH_PROFILE);
    const referLink = profile && profile.username ? `https://ninja.org/?ref=${profile.username}` : '';
    this.setState({ referLink });
    // this.props.rfChange(nameFormStep4, 'refer_link', referLink);

    this.props.getReferalInfo({
      PATH_URL: 'exchange/user/referral-summary',
      METHOD: 'GET',
    });
  }

  render() {
    const { messages } = this.props.intl;
    const { referalInfo } = this.props;

    return (
      <div className="collapse-custom">
        <div className="head" onClick={() => this.showInfo()}>
          <p className="label">
            {messages.wallet.refers.label.menu}
            <span>{messages.wallet.refers.label.menu_description}</span>
          </p>
          <div className="extend">
            <span className="badge badge-success" />
            <Image className={this.state.referCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
          </div>
        </div>
        <div className={`content ${this.state.referCollapse ? '' : 'd-none'}`}>
          <p
            className="text"
          >{this.state.total} {StringHelper.format(messages.wallet.refers.text.menu_total, this.state.total != 1 ? 's' : '')}
          </p>
          <p className="text">{this.state.amount} {messages.wallet.refers.text.menu_amount}</p>
          <div className="refer-link">
            <p>{messages.wallet.refers.text.profile_link}</p>
            <div className="col100">
              <Input
                name="refer_link"
                value={this.state.referLink}
                onFocus={() => {
                  Clipboard.copy(this.state.referLink);
                  this.showToast(messages.wallet.refers.success.copy_link);
                }}
              />
            </div>
          </div>
          {referalInfo && referalInfo.length > 0 && <div>
            <table className="table refer-table">
              <thead>
                <tr className="table-active">
                  {/* <th scope="col">#</th> */}
                  <th scope="col" className="user">{messages.wallet.refers.table.header.user}</th>
                  <th scope="col">{messages.wallet.refers.table.header.date}</th>
                  <th scope="col" className="refer-value-header">{messages.wallet.refers.table.header.referalValue}</th>
                </tr>
              </thead>
              <tbody>
                {
                referalInfo.map(item => {
                  return (
                    <tr key={item.toUid}>
                      {/* <th scope="row">1</th> */}
                      <td>{shortenUser(item.toUsername)}</td>
                      <td>
                        <FormattedDate
                          value={new Date(item.referralCreatedAt)}
                          year="numeric"
                          month="long"
                          day="2-digit"
                        />
                      </td>
                      <td>
                        <div className="refer-value">
                          {
                            item.referalValues.map(item => {
                              return (<div key={item.currency}>{`${item.reward} ${item.currency}`}</div>);
                            })
                          }
                        </div>
                      </td>
                    </tr>
                  );
                })
              }

              </tbody>
            </table>
          </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  referalInfo: state.exchange.referalInfo,
});

const mapDispatchToProps = (dispatch) => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  referredInfo: bindActionCreators(referredInfo, dispatch),
  getReferalInfo: bindActionCreators(getReferalInfo, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Refers));
