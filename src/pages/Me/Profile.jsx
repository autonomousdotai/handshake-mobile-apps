import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle, showAlert } from '@/reducers/app/action';
import {
  authUpdate,
  checkUsernameExist,
  getIdVerification,
  submitEmail,
  submitPhone,
  verifyEmail,
  verifyID,
  verifyPhone,
} from '@/reducers/auth/action';
import COUNTRIES from '@/data/country-dial-codes';
// components
import { Col, Grid, ProgressBar, Row } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import Dropdown from '@/components/core/controls/Dropdown';
import UploadZone from '@/components/core/controls/UploadZone';
import { Field } from 'redux-form';
import { fieldCleave, fieldInput } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import ModalDialog from '@/components/core/controls/ModalDialog';
import local from '@/services/localStore';
import { API_URL, APP } from '@/constants';
import AppBar from '@/guru/components/AppBar/AppBar';

// style
import IDVerificationFrontImageExample from '@/assets/images/id-verification/front-example.svg';
import IDVerificationBackImageExample from '@/assets/images/id-verification/back-example.svg';
import IDVerificationSelfieImageExample from '@/assets/images/id-verification/selfie-example.svg';
// import { chatInstance } from '@/pages/Chat/Chat';
import valid from '@/services/validate';
import { ICON } from '@/styles/images';
import './Profile.scss';
import Feed from '@/components/core/presentation/Feed/Feed';

class Profile extends React.Component {
  static propTypes = {
    showAlert: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    // setHeaderTitle: PropTypes.func.isRequired,
    checkUsernameExist: PropTypes.func.isRequired,
    authUpdate: PropTypes.func.isRequired,
    submitPhone: PropTypes.func.isRequired,
    verifyPhone: PropTypes.func.isRequired,
    verifyEmail: PropTypes.func.isRequired,
    verifyID: PropTypes.func.isRequired,
    getIdVerification: PropTypes.func.isRequired,
    submitEmail: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      countries: COUNTRIES,
      countryCode: COUNTRIES[0], // default is US
      usernameCollapse: false,
      phoneCollapse: false,
      emailCollapse: false,
      isShowCountryCode: false,
      phoneStart: false,
      emailStart: false,
      phone: props.auth.profile.phone,
      email: props.auth.profile.email,
      sms: '',
      code: '',
      successMessage: '',
      isShowVerificationPhoneCode: false,
      isShowVerificationEmailCode: false,
      idVerificationDocumentType: 0,
      idVerificationFrontImage: null,
      idVerificationBackImage: null,
      idVerificationSelfieImage: null,
      idVerified: props.auth.profile.idVerified,
      idVerficationUploadingProgress: 0,
      idVerificationLevel: props.auth.profile.idVerificationLevel,
      idVerifcationUserFullName: '',
      idVerificationIDNumber: '',
      idVerificationEmail: '',
      idVerificationCollapse: false,
      modalContent: '',
    };
    // bind
    this.onSubmitVerifyPhone = :: this.onSubmitVerifyPhone;
    this.onSubmitVerifyEmail = :: this.onSubmitVerifyEmail;
    this.onSubmitIDVerification = :: this.onSubmitIDVerification;
    this.addUsername = :: this.addUsername;
    this.selectPhoneRegionCode = :: this.selectPhoneRegionCode;
    this.filterCountries = :: this.filterCountries;
    this.onTextFieldChange = :: this.onTextFieldChange;
    this.addUsername = :: this.addUsername;

    this.idVerificationDocumentTypes = ['Passport', 'Driver License', 'Government ID Card'];
    if (this.state.idVerificationLevel === 1) {
      this.getIDVerification();
    }

    this.UsernameForm = createForm({
      propsReduxForm: {
        form: 'UsernameForm',
        initialValues: { username: props.auth.profile.username },
      },
    });

    this.localPhone = local.get(APP.PHONE_NEED_VERIFY);
    this.localCountryPhone = local.get(APP.COUNTRY_PHONE_NEED_VERIFY) || '';
    if (props.auth.profile.phone) {
      const selectedCountry = COUNTRIES.filter(country => country.dialCode === props.auth.profile.phone.substr(0, props.auth.profile.phone.indexOf(' ')))[0];
      this.state.countryCode = selectedCountry;
    } else {
      if (this.localCountryPhone) {
        const selectedCountry = COUNTRIES.filter(country => country.dialCode === `+${this.localCountryPhone}`)[0];
        this.state.countryCode = selectedCountry;
      }
      if (this.localCountryPhone && this.localPhone) {
        this.state.phoneStart = this.localPhone;
        this.state.isShowVerificationPhoneCode = true;
        this.state.phoneCollapse = true;
      }
    }
    this.NumberPhoneForm = createForm({
      propsReduxForm: {
        form: 'NumberPhoneForm',
        initialValues: {
          phone: props.auth.profile.phone
            ? props.auth.profile.phone.substr(props.auth.profile.phone.indexOf(' ') + 1)
            : this.localPhone ? this.localPhone : '',
        },
      },
    });
    this.localEmail = local.get(APP.EMAIL_NEED_VERIFY);
    if (!props.auth.profile.email) {
      if (this.localEmail) {
        this.state.emailStart = this.localEmail;
        this.state.isShowVerificationEmailCode = true;
        this.state.emailCollapse = true;
      }
    }
    this.EmailForm = createForm({
      propsReduxForm: {
        form: 'EmailForm',
        initialValues: { email: props.auth.profile.email || local.get(APP.EMAIL_NEED_VERIFY) || '' },
      },
    });
    this.IDVerificationForm = createForm({
      propsReduxForm: {
        form: 'IDVerificationForm',
        initialValues: { verifyStatus: props.auth.profile.id_verified, documentType: -1, frontImage: null, backImage: null, selfieImage: null },
      },
    });
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }

  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }

  showSuccess(mst) {
    this.showAlert(mst, 'success', 4000, ICON.SuccessChecked());
  }

  componentDidMount() {
    const { email } = this.state;
    if (email) {
      this.setState({ idVerificationEmail: email });
    }
  }

  onTextFieldChange(name, value) {
    this.setState(() => ({ [name]: value }));
  }

  onSubmitIDVerification() {
    const {
      idVerificationDocumentType,
      idVerificationFrontImage,
      idVerificationBackImage,
      idVerificationSelfieImage,
      idVerificationLevel,
      idVerifcationUserFullName,
      idVerificationIDNumber,
      idVerificationEmail,
    } = this.state;
    const { messages } = this.props.intl;

    if (idVerificationLevel === 0) {
      if (!idVerifcationUserFullName) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidFullName);
        return;
      }

      if (idVerificationDocumentType < 0) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidDocument);
        return;
      }

      if (!idVerificationIDNumber) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidIDNumber);
        return;
      }

      // if (valid.email(idVerificationEmail)) {
      //   this.showError(messages.me.profile.verify.alert.notValid.client.email);
      //   return;
      // }

      if (!idVerificationFrontImage) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidFrontImage);
        return;
      }

      if (idVerificationDocumentType > 0 && !idVerificationBackImage) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidBackImage);
        return;
      }
    } else if (idVerificationLevel === 1) {
      if (!idVerificationSelfieImage) {
        this.showError(messages.me.profile.verify.alert.notValid.idVerification.invalidSelfieImage);
        return;
      }
    } else {
      this.showError(messages.me.profile.verify.alert.success.idVerification);
      return;
    }

    if (!idVerificationEmail) {
      this.setState({
        modalContent:
          (
            <div className="py-2">
              <Feed className="feed p-2" background="#259B24">
                <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                  <div>{messages.me.profile.verify.alert.notValid.idVerification.invalidEmail}</div>
                </div>
              </Feed>
              <Button className="mt-2" block onClick={() => this.continueIDVerification()}><FormattedMessage id="ex.btn.confirm" /></Button>
              <Button block className="btn btn-secondary" onClick={this.cancelAction}><FormattedMessage id="btn.cancel" /></Button>
            </div>
          ),
      }, () => {
        this.modalRef.open();
      });
    } else {
      this.continueIDVerification();
    }
  }

  continueIDVerification = () => {
    const {
      idVerificationDocumentType,
      idVerificationFrontImage,
      idVerificationBackImage,
      idVerificationSelfieImage,
      idVerificationLevel,
      idVerifcationUserFullName,
      idVerificationIDNumber,
      idVerificationEmail,
    } = this.state;
    const { messages } = this.props.intl;
    const data = new FormData();
    if (idVerificationLevel === 0) {
      data.append('full_name', idVerifcationUserFullName);
      data.append('id_number', idVerificationIDNumber);
      data.append('document_type', idVerificationDocumentType);
      data.append('front_image', idVerificationFrontImage);
      data.append('back_image', idVerificationBackImage);
      data.append('email', idVerificationEmail);
    } else {
      data.append('selfie_image', idVerificationSelfieImage);
    }
    this.setState({
      idVerficationUploadingProgress: 1,
    });
    this.props.verifyID({
      PATH_URL: API_URL.USER.ID_VERIFICATION,
      data,
      METHOD: 'POST',
      onUploadProgress: (progressEvent) => {
        this.setState({ idVerficationUploadingProgress: Math.round((progressEvent.loaded / progressEvent.total) * 100) });
      },
      successFn: () => {
        this.modalRef.close();
        this.setState({ idVerified: 2, idVerficationUploadingProgress: 0 });
        this.showSuccess(messages.me.profile.verify.alert.success.idVerification);
      },
      errorFn: (e) => {
        this.modalRef.close();
        this.setState({ idVerficationUploadingProgress: 0 });
        if (e && e.message) {
          this.showError(`${messages.me.profile.verify.alert.cannot.idVerification2} ${e.message}`);
        } else {
          this.showError(messages.me.profile.verify.alert.cannot.idVerification);
        }
      },
    });
  }

  cancelAction = () => {
    this.modalRef.close();
  }

  onSubmitVerifyPhone() {
    const {
      countryCode, phoneStart, sms,
    } = this.state;
    const { messages } = this.props.intl;
    const phone = this.state.phone || local.get(APP.PHONE_NEED_VERIFY);
    if (phoneStart !== phone) {
      this.props.verifyPhone({
        PATH_URL: 'user/verification/phone/start',
        data: {
          country: `${countryCode.dialCode.replace('+', '')}`,
          phone,
        },
        headers: { 'Content-Type': 'multipart/form-data' },
        METHOD: 'POST',
        successFn: () => {
          this.setState(() => ({ phoneStart: phone, isShowVerificationPhoneCode: true }));
          this.showSuccess(messages.me.profile.verify.alert.send.phone);
          local.save(APP.PHONE_NEED_VERIFY, phone);
          local.save(APP.COUNTRY_PHONE_NEED_VERIFY, countryCode.dialCode.replace('+', ''));
        },
        errorFn: () => {
          this.showError(messages.me.profile.verify.alert.notValid.server.phone);
        },
      });
    } else {
      if (!sms) {
        this.showError(messages.me.profile.verify.alert.require.phone);
        return;
      }
      this.props.submitPhone({
        PATH_URL: 'user/verification/phone/check',
        qs: {
          country: `${countryCode.dialCode.replace('+', '')}`,
          phone,
          code: sms,
        },
        headers: { 'Content-Type': 'multipart/form-data' },
        METHOD: 'POST',
        successFn: () => {
          const data = new FormData();
          data.append('phone', `${countryCode.dialCode} ${phone}`);
          this.props.authUpdate({
            PATH_URL: 'user/profile',
            data,
            headers: { 'Content-Type': 'multipart/form-data' },
            METHOD: 'POST',
            successFn: () => {
              this.setState({ isShowVerificationPhoneCode: false });
              this.showSuccess(messages.me.profile.verify.alert.success.phone);
            },
            errorFn: () => {
              this.showError(messages.me.profile.verify.alert.require.phone);
            },
          });
        },
        errorFn: () => {
          this.showError(messages.me.profile.verify.alert.cannot.phone);
        },
      });
    }
  }

  onSubmitVerifyEmail() {
    const { messages } = this.props.intl;
    const email = (this.state.email || this.localEmail).toLowerCase();
    const { emailStart, code } = this.state;
    if (email) {
      if (valid.email(email)) {
        this.showError(messages.me.profile.verify.alert.notValid.client.email);
        return;
      }
      if (emailStart !== email) {
        this.props.verifyEmail({
          PATH_URL: `user/verification/email/start?email=${email}`,
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: (data) => {
            if (data.status) {
              this.showSuccess(messages.me.profile.verify.alert.send.email);
              this.setState(() => ({ emailStart: email, isShowVerificationEmailCode: true }));
              local.save(APP.EMAIL_NEED_VERIFY, email);
            }
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.notValid.client.email);
          },
        });
      } else {
        if (!code) {
          this.showError(messages.me.profile.verify.alert.require.email);
          return;
        }
        this.props.submitEmail({
          PATH_URL: `user/verification/email/check`,
          qs: {
            email,
            code,
          },
          headers: { 'Content-Type': 'multipart/form-data' },
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
                this.setState({ isShowVerificationEmailCode: false, idVerificationEmail: email });
                this.showSuccess(messages.me.profile.verify.alert.success.email);
              },
              errorFn: () => {
                this.showError(messages.me.profile.verify.alert.require.email);
              },
            });
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.cannot.email);
          },
        });
      }
    } else {
      this.showError(messages.me.profile.verify.alert.notValid.client.email);
    }
  }

  getIDVerification() {
    this.props.getIdVerification({
      PATH_URL: API_URL.ID_VERIFICATION.GET_DOCUMENT,
      successFn: (res) => {
        if (res.status === 1 && res.data) {
          const { data } = res;
          this.setState({
            idVerificationDocumentType: data.id_type,
            idVerificationIDNumber: data.id_number,
            idVerifcationUserFullName: data.name,
          });
        }
      },
    });
  }

  addUsername(values) {
    const { messages } = this.props.intl;
    if (values.username) {
      this.props.checkUsernameExist({
        PATH_URL: 'user/username-exist',
        qs: { username: values.username },
        successFn: (res) => {
          if (!res.data) {
            const params = new URLSearchParams();
            params.append('username', values.username);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {
                this.showSuccess(messages.me.profile.username.success);
              },
            });
          } else {
            this.showError(messages.me.profile.username.exist);
          }
        },
      });
    } else {
      this.showError(messages.me.profile.username.required);
    }
  }

  selectPhoneRegionCode(country) {
    this.setState({
      countryCode: country,
      isShowCountryCode: false,
    });
  }

  filterCountries(value) {
    clearTimeout(this.searchTimeOut);
    this.searchTimeOut = setTimeout(() => {
      const compareCountryName = name => name.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1;
      this.setState({
        countries: COUNTRIES.filter(country => compareCountryName(country.name)),
      });
    }, 200);
  }
  backAction = () => {
    this.props.history.go(-1);
  }

  renderAppBar = (props) => {
    return (
      <AppBar>
        <span className="IconLeft"
          onClick={() => {
          this.backAction();
          }}
        >
          <i className="far fa-angle-left" />
        </span>
        <span className="Title">Me</span>
      </AppBar>
    );
  }

  renderIntroduce = () => {
    const { messages } = this.props.intl;

    return (
      <div className="head_text">
        <span>{messages.me.profile.head_text}</span>
      </div>
    );
  }
  renderEmailVerify = () => {
    const { messages } = this.props.intl;

    const {
      email, code, idVerified, idVerificationLevel,
    } = this.state;
    switch (idVerified) {
      case -1:
        idVerificationStatusBadgeClass = 'badge-danger';
        idVerificationStatusText = messages.me.profile.text.id_verification.status.rejected;
        break;
      case 1:
        idVerificationStatusBadgeClass = 'badge-success';
        switch (idVerificationLevel) {
          case 1: {
            idVerificationStatusText = messages.me.profile.text.id_verification.status.level1;
            break;
          }
          case 2: {
            idVerificationStatusText = messages.me.profile.text.id_verification.status.finished;
          }
          default:
        }
        break;
      case 2:
        idVerificationStatusBadgeClass = 'badge-warning';
        idVerificationStatusText = messages.me.profile.text.id_verification.status.processing;
        break;
      default:
    }
    const { EmailForm } = this;
    return (
      <div className="collapse-custom">
        <div className="head">
          <p className="label">
            {messages.me.profile.text.email.label}
          </p>
          <div className="extend">
            <span className="badge badge-success">{this.props.auth.profile.email ? 'Verified' : ''}</span>
          </div>
        </div>
        <div className="contentProfile">
          <p className="text">{messages.me.profile.text.email.desc2}</p>
          <EmailForm onSubmit={this.onSubmitVerifyEmail}>
            <div className="wrapperInput">
              <Field
              name="email"
              //className="form-control-custom form-control-custom-ex w-100"
              className="emailInput"
              component={fieldCleave}
              onChange={(evt, value, unknown, name) => {
                this.onTextFieldChange(name, value);
              }}
              value={email}
              />
              <Button
              className="submit-btn"
              style={{
                height: '53px',
                marginTop: 0,
                marginLeft: '10px',
              }}
              >
              {messages.me.profile.text.email.button.send}
              </Button>
            </div>
            <div
              className={this.state.isShowVerificationEmailCode ? '' : 'd-none'}
              style={{
                marginTop: '10px',
              }}
            >
              <p className="text">{messages.me.profile.text.email.desc4}</p>
              <Field
                name="code"
                className="form-control-custom form-control-custom-ex w-100"
                component={fieldCleave}
                propsCleave={{
                  options: { blocks: [6], numericOnly: true },
                }}
                onChange={(evt, value, unknown, name) => {
                  this.onTextFieldChange(name, value);
                }}
                value={code}
              />
              <Button className="submit-btn">{messages.me.profile.text.email.button.submit}</Button>
            </div>
          </EmailForm>
        </div>
      </div>

    );
  }

  render() {
    const {
      modalContent
    } = this.state;

    return (
      <div className="profile">
        {this.renderAppBar()}
        {this.renderIntroduce()}
        {this.renderEmailVerify()}

        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }}>
          {modalContent}
        </ModalDialog>
      </div >
    );
  }
}

const mapState = state => ({
  auth: state.auth,
  app: state.app,
});

const mapDispatch = ({
  setHeaderTitle,
  verifyPhone,
  submitPhone,
  verifyEmail,
  verifyID,
  showAlert,
  checkUsernameExist,
  authUpdate,
  submitEmail,
  getIdVerification,
});

export default injectIntl(connect(mapState, mapDispatch)(Profile));
