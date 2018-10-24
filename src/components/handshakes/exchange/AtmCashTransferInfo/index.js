/* eslint camelcase:0 */

import React, { PureComponent } from 'react';
import { API_URL } from '@/constants';
import PropTypes from 'prop-types';
import ImageUploader from '@/components/handshakes/exchange/components/ImageUploader';
import { connect } from 'react-redux';
import { uploadReceipAtmCashTransfer, getCashCenterBankInfo } from '@/reducers/exchange/action';
import loadingSVG from '@/assets/images/icon/loading.gif';
import Image from '@/components/core/presentation/Image';
import { showAlert } from '@/reducers/app/action';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { injectIntl } from 'react-intl';
import iconCopy from '@/assets/images/icon/icon-copy-white.svg';
import iconUpload from '@/assets/images/icon/icon-upload-white.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import ExtraInfo from '@/components/handshakes/exchange/components/ExtraInfo';
import ClockCount from './components/ClockCount';
import './styles.scss';


const DATA_TEMPLATE = {
  'CUSTOMER AMOUNT': {
    intlKey: 'customer_amount',
    text: null,
    className: 'money',
    copyable: true,
  },
  'YOUR AMOUNT': {
    intlKey: 'amount',
    text: null,
    className: 'money',
    copyable: true,
  },
  'ACCOUNT NAME': { intlKey: 'account_name', text: null, copyable: true },
  'ACCOUNT NUMBER': { intlKey: 'account_number', text: null, copyable: true },
  'BANK NAME': { intlKey: 'bank_name', text: null, copyable: true },
  'BANK ID': { intlKey: 'bank_id', text: null, copyable: true },
  'REFERENCE CODE': { intlKey: 'reference_code', text: null, className: 'reference-code', copyable: true },
};

const STATUS = {
  TRANSFERRING: 'transferring',
};

class AtmCashTransferInfo extends PureComponent {
  constructor() {
    super();
    this.state = {
      data: DATA_TEMPLATE,
      showUploader: false,
      uploaded: false,
      imgUploaded: null,
      isLoading: false,
      expired: false,
    };

    this.uploader = React.createRef();
    this.modalRef = null;

    this.onUpload = :: this.onUpload;
    this.onUploaded = :: this.onUploaded;
    this.onDone = :: this.onDone;
    this.saveReceipt = :: this.saveReceipt;
    this.copied = :: this.copied;
    this.getBankInfo = :: this.getBankInfo;
    this.onExpired = :: this.onExpired;
  }

  static getDerivedStateFromProps({ receipt }, prevState) {
    const newData = { ...prevState?.data };
    const { amount, fiatCurrency, referenceCode, customerAmount } = receipt;
    amount && fiatCurrency && (newData['YOUR AMOUNT'].text = `${formatMoneyByLocale(amount, fiatCurrency, 2)} ${fiatCurrency}`);
    if (customerAmount) {
      fiatCurrency && (newData['CUSTOMER AMOUNT'].text = `${formatMoneyByLocale(customerAmount, fiatCurrency, 2)} ${fiatCurrency}`);
      newData['YOUR AMOUNT'].extraInfo = {
        intlKey: 'amount_info',
      };
    }
    referenceCode && (newData['REFERENCE CODE'].text = referenceCode);
    return { data: newData };
  }

  componentDidMount() {
    this.getBankInfo();
  }

  onUpload() {
    this.setState({ showUploader: true }, () => {
      // get uploader instance
      const uploaderInstance = this?.uploader?.current?.getWrappedInstance()?.getWrappedInstance();
      uploaderInstance.onOpenClick();
    });
  }

  onUploaded(res) {
    const imgUploaded = res && res[0];
    this.setState({ uploaded: true, imgUploaded }, this.saveReceipt);
  }

  onDone() {
    if (typeof this.props.onDone === 'function') {
      typeof this.props.onDone();
    }
  }

  onExpired() {
    this.setState({ expired: true });
  }

  getBankInfo() {
    const { bankInfo } = this.props;
    if (bankInfo !== null && bankInfo !== {}) {
      this.setState({ data: this.updateBankInfoFromData(bankInfo) });
      return;
    }
    try {
      this.showLoading(true);
      const { country } = this.props.ipInfo;
      this.props.getCashCenterBankInfo({
        PATH_URL: `${API_URL.EXCHANGE.GET_CASH_CENTER_BANK}/${country}`,
        METHOD: 'GET',
        successFn: (res) => {
          const info = res?.data[0]?.information || {};
          this.setState({ data: this.updateBankInfoFromData(info) });
          this.showLoading(false);
        },
        errorFn: () => {
          this.showLoading(false);
        },
      });
    } catch (e) {
      console.warn(e);
    }
  }

  updateBankInfoFromData = (info = {}) => {
    const { data } = this.state;
    const newData = { ...data };
    newData['ACCOUNT NAME'].text = info.account_name;
    newData['ACCOUNT NUMBER'].text = info.account_number;
    newData['BANK ID'].text = info.bank_id;
    newData['BANK NAME'].text = info.bank_name;
    return newData;
  }

  saveReceipt() {
    this.showLoading(true);
    const { receipt, saveReceiptHandle } = this.props;
    const { imgUploaded } = this.state;
    const data = {
      receipt_url: imgUploaded.url,
    };

    // override save receipt func
    if (typeof saveReceiptHandle === 'function') {
      saveReceiptHandle({
        data,
        successFn: () => {
          this.showLoading(false);
        },
        errorFn: () => {
          this.showLoading(false);
        },
      });
      return;
    }

    this.props.uploadReceipAtmCashTransfer({
      PATH_URL: `${API_URL.EXCHANGE.SEND_ATM_CASH_TRANSFER}/${receipt?.id}`,
      METHOD: 'PUT',
      data,
      successFn: () => {
        this.showLoading(false);
      },
      errorFn: () => {
        this.showLoading(false);
      },
    });
  }

  showLoading(isLoading = false) {
    this.setState({
      isLoading,
    });
  }

  copied() {
    const { messages: { atm_cash_transfer_info } } = this.props.intl;
    this.props.showAlert({
      message: atm_cash_transfer_info.copied,
      timeOut: 3000,
      isShowClose: true,
      type: 'success',
      callBack: () => { },
    });
  }

  renderCopyIcon(text) {
    return (
      <CopyToClipboard text={text} onCopy={this.copied}>
        <div className="copy-icon"><img alt="copy-icon" src={iconCopy} /></div>
      </CopyToClipboard>
    );
  }

  renderInfo() {
    const { data } = this.state;
    const { messages: { atm_cash_transfer_info } } = this.props.intl;
    return (
      <React.Fragment>
        {Object.entries(data).map(([name, value]) => {
          if (!value.text) {
            return null;
          }
          return (
            <div key={name} className="row-item info-item">
              <div>
                <span className="title">{atm_cash_transfer_info[value.intlKey]}</span>
              </div>
              <div>
                <span className={`value ${value.className && value.className}`}>{value.text}</span>
                {value.copyable && this.renderCopyIcon(value.text)}
                {value.extraInfo && <ExtraInfo info={atm_cash_transfer_info[value.extraInfo.intlKey]} />}
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  render() {
    const { showUploader, uploaded, expired } = this.state;
    const { intl: { messages: { atm_cash_transfer_info } }, receipt: { createdAt, status } } = this.props;
    return (
      <div className="transaction-info-container">
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="item">
          <div className="payment-detail">
            <span className="text">
              {!expired && atm_cash_transfer_info.order_will_expire_in}
              <ClockCount
                startAt={createdAt}
                expiredText="Expired"
                onExpired={this.onExpired}
              />
            </span>
          </div>
        </div>
        <div className="item info-group">
          {this.renderInfo()}
        </div>
        <div className="item notice">
          <span className="notice-tilte">{atm_cash_transfer_info.important}</span>
          <span className="notice-desc">{atm_cash_transfer_info.notice_desc}</span>
        </div>
        <div className="item">
          { showUploader &&
            <ImageUploader
              className="uploader-zone"
              ref={this.uploader}
              onSuccess={this.onUploaded}
              imgSample={null}
              multiple={false}
            />
          }
          {
            (uploaded || status === STATUS.TRANSFERRING) ?
              <button className="btn btn-upload-receipt" onClick={this.onDone}>{atm_cash_transfer_info.done_btn}</button> :
              <button className="btn btn-upload-receipt" onClick={this.onUpload}>
                <img src={iconUpload} height="10px" alt="upload receipt" />
                {atm_cash_transfer_info.upload_btn}
              </button>
          }
        </div>
      </div>
    );
  }
}

AtmCashTransferInfo.defaultProps = {
  /* eslint react/default-props-match-prop-types:0 */
  receipt: {},
  bankInfo: null,
  saveReceiptUrl: null,
  saveReceiptHandle: () => null,
};

AtmCashTransferInfo.propTypes = {
  /* eslint react/no-unused-prop-types:0 */
  receipt: PropTypes.object.isRequired,
  uploadReceipAtmCashTransfer: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  getCashCenterBankInfo: PropTypes.func.isRequired,
  ipInfo: PropTypes.object.isRequired,
  bankInfo: PropTypes.object,
  saveReceiptHandle: PropTypes.func,
};

const mapState = (state) => {
  return {
    ipInfo: state.app.ipInfo,
  };
};

export default injectIntl(connect(mapState, { uploadReceipAtmCashTransfer, showAlert, getCashCenterBankInfo })(AtmCashTransferInfo));
