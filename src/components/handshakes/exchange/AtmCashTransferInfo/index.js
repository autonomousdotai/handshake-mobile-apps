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
import ClockCount from './components/ClockCount';
import ExtraInfo from './components/ExtraInfo';
import './styles.scss';

const DATA_TEMPLATE = {
  'CUSTOMER AMOUNT': {
    intlKey: 'customer_amount',
    text: '--- USD',
    className: 'money',
  },
  'YOUR AMOUNT': {
    intlKey: 'amount',
    text: '--- USD',
    className: 'money',
    extraInfo: {
      intlKey: 'amount_info',
    },
  },
  'ACCOUNT NAME': { intlKey: 'account_name', text: '---' },
  'ACCOUNT NUMBER': { intlKey: 'account_number', text: '---', copyable: true },
  'BANK NAME': { intlKey: 'bank_name', text: '---', copyable: true },
  'BANK ID': { intlKey: 'bank_id', text: '---', copyable: true },
  'REFERENCE CODE': { intlKey: 'reference_code', text: '---', className: 'reference-code', copyable: true },
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
    amount && fiatCurrency && (newData['YOUR AMOUNT'].text = `${Number.parseFloat(amount).toFixed(2)} ${fiatCurrency}`);
    customerAmount && fiatCurrency && (newData['CUSTOMER AMOUNT'].text = `${Number.parseFloat(customerAmount).toFixed(2)} ${fiatCurrency}`);
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
    try {
      const { country } = this.props.ipInfo;
      const { data } = this.state;
      this.props.getCashCenterBankInfo({
        PATH_URL: `${API_URL.EXCHANGE.GET_CASH_CENTER_BANK}/${country}`,
        METHOD: 'GET',
        successFn: (res) => {
          const info = res?.data[0]?.information || {};
          const newData = { ...data };
          newData['ACCOUNT NAME'].text = info.account_name;
          newData['ACCOUNT NUMBER'].text = info.account_number;
          newData['BANK ID'].text = info.bank_id;
          newData['BANK NAME'].text = info.bank_name;
          this.setState({ data: newData });

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

  saveReceipt() {
    this.showLoading(true);
    const { receipt } = this.props;
    const { imgUploaded } = this.state;
    const data = {
      receipt_url: imgUploaded.url,
    };
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
        {Object.entries(data).map(([name, value]) => (
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
        ))}
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
          <div className="row-item payment-detail">
            <div>
              <span className="title">{atm_cash_transfer_info.payment_detail}</span>
            </div>
            <div>
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
};

const mapState = (state) => {
  return {
    ipInfo: state.app.ipInfo,
  };
};

export default injectIntl(connect(mapState, { uploadReceipAtmCashTransfer, showAlert, getCashCenterBankInfo })(AtmCashTransferInfo));
