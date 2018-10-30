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

  render() {
    const { messages } = this.props.intl;
    const {
      countryCode, countries, sms, email, code, idVerified, idVerficationUploadingProgress, idVerificationLevel, modalContent,
    } = this.state;
    let idVerificationStatusBadgeClass = '';
    let idVerificationStatusText = '';
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
    const { UsernameForm, NumberPhoneForm, EmailForm, IDVerificationForm } = this;

    return (
      <Grid className="profile">
        <Row>
          <div className="head_text">
            <span>{messages.me.profile.head_text}</span>
          </div>
        </Row>
        {/* <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div
                className="head"
                onClick={
                  () => this.setState(state => ({
                    usernameCollapse: !state.usernameCollapse,
                  }))
                }
              >
                <p className="label">
                  {messages.me.profile.text.username.label}
                </p>
                <div className="extend">
                  <Image className={this.state.usernameCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.usernameCollapse ? '' : 'd-none'}`}>
                <p className="text">{messages.me.profile.text.username.desc1}</p>
                <UsernameForm onSubmit={this.addUsername}>
                  <Field
                    name="username"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                  />
                  <Button cssType="anonymous" className="submit-btn">{messages.me.profile.text.username.button.submit}</Button>
                </UsernameForm>
              </div>
            </div>
          </Col>
        </Row> */}
        {/* <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({ phoneCollapse: !state.phoneCollapse }))}>
                <p className="label">
                  {messages.me.profile.text.phone.label}
                  <span>
                    {messages.me.profile.text.phone.desc1}
                  </span>
                </p>
                <div className="extend">
                  <span className="badge badge-success">{ this.props.auth.profile.phone ? 'Verified' : '' }</span>
                  <Image className={this.state.phoneCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.phoneCollapse ? '' : 'd-none'}`}>
                <p className="text">{messages.me.profile.text.phone.desc2}</p>
                <p className="text">{messages.me.profile.text.phone.desc3}</p>
                <NumberPhoneForm onSubmit={this.onSubmitVerifyPhone}>
                  <div className="phone-block">
                    <div className="dropdown country-code">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        onClick={() => this.setState(state => ({ isShowCountryCode: !state.isShowCountryCode }))}
                        type="button"
                      >
                        {countryCode.dialCode}
                      </button>
                      <div className={`dropdown-menu ${this.state.isShowCountryCode ? 'show' : ''}`}>
                        <div className="dropdown-item">
                          <input className="search-country" type="text" onChange={e => this.filterCountries(e.target.value)} />
                        </div>
                        {
                          countries.map(country => (
                            <div
                              key={country.code}
                              className="dropdown-item"
                              onClick={() => this.selectPhoneRegionCode(country)}
                            >
                              {country.flag}{country.name}&nbsp;({country.dialCode})
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <Field
                      name="phone"
                      className="form-control-custom form-control-custom-ex phone-number"
                      component={fieldCleave}
                      propsCleave={{
                        options: { blocks: [4, 4, 4], delimiter: '-', numericOnly: true },
                      }}
                      onChange={(evt, value, unknown, name) => {
                        this.onTextFieldChange(name, value);
                      }}
                    />
                    <Button cssType="anonymous" className="send-btn">{messages.me.profile.text.phone.button.send}</Button>
                  </div>
                  <div className={this.state.isShowVerificationPhoneCode ? '' : 'd-none'}>
                    <p className="text">{messages.me.profile.text.phone.desc4}</p>
                    <Field
                      name="sms"
                      className="form-control-custom form-control-custom-ex w-100"
                      component={fieldCleave}
                      propsCleave={{
                        options: { blocks: [6], numericOnly: true },
                      }}
                      onChange={(evt, value, unknown, name) => {
                        this.onTextFieldChange(name, value);
                      }}
                      value={sms}
                    />
                    <Button cssType="anonymous" className="submit-btn">{messages.me.profile.text.phone.button.submit}</Button>
                  </div>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row> */}
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head">
                <p className="label">
                  {messages.me.profile.text.email.label}
                </p>
                <div className="extend">
                  <span className="badge badge-success">{this.props.auth.profile.email ? 'Verified' : ''}</span>
                </div>
              </div>
              <div className="content">
                <p className="text">{messages.me.profile.text.email.desc2}</p>
                <EmailForm onSubmit={this.onSubmitVerifyEmail}>
                  <div>
                    <Row>
                      <div className="col-10">
                        <Field
                          name="email"
                          className="form-control-custom form-control-custom-ex w-100"
                          component={fieldCleave}
                          onChange={(evt, value, unknown, name) => {
                            this.onTextFieldChange(name, value);
                          }}
                          value={email}
                        />
                      </div>
                      <div
                        className="col-2"
                        style={{
                        paddingLeft: 0,
                      }}
                      >
                        <Button
                          cssType="anonymous"
                          className="submit-btn"
                          style={{
                            height: '53px',
                            marginTop: 0,
                          }}
                        >
                          {messages.me.profile.text.email.button.send}
                        </Button>
                      </div>
                    </Row>
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
                    <Button cssType="anonymous" className="submit-btn">{messages.me.profile.text.email.button.submit}</Button>
                  </div>
                </EmailForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head">
                <p className="label">
                  {messages.me.profile.text.id_verification.label}
                  <span>{messages.me.profile.text.id_verification.desc1}</span>
                  <strong>{idVerificationLevel === 0 ? (
                    messages.me.profile.text.id_verification.desc12
                  ) : idVerificationLevel === 1 ? messages.me.profile.text.id_verification.desc13 : ''}
                  </strong>
                </p>
                <div className="extend">
                  <span className={`badge ${idVerificationStatusBadgeClass} ${idVerificationLevel > 0 ? 'has-level' : ''}`}>{idVerificationStatusText}</span>
                  {/* {idVerificationLevel > 0 ? (
                    <span className="badge badge-success">Lv{idVerificationLevel}</span>
                  ) : ''} */}
                  {/* {this.state.idVerified < 1 || (this.state.idVerified === 1 && this.state.idVerificationLevel < 2) ? (
                    <Image className={this.state.idVerificationCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                  ) : ''} */}
                </div>
              </div>
              <div className="content id-verification">
                {idVerficationUploadingProgress > 0 ? (
                  <div style={idVerficationUploadingProgress > 0 ? {} : { display: 'none' }}>
                    <Row>
                      <div className="col-12">
                        <p className="text label">
                          {messages.me.profile.text.id_verification.uploading}
                        </p>
                        <ProgressBar now={idVerficationUploadingProgress} />
                      </div>
                    </Row>
                  </div>
                ) : (idVerificationLevel < 2 &&
                <IDVerificationForm onSubmit={this.onSubmitIDVerification}>
                  <div>
                    <Row>
                      <div className="col-12">
                        <p className="text label">
                          {messages.me.profile.text.id_verification.desc2}
                        </p>
                        {idVerificationLevel > 0 ? (<h6>{this.state.idVerifcationUserFullName}</h6>) : (
                          <Field
                            name="full_name"
                            type="text"
                            className="form-control-custom form-control-custom-ex w-100"
                            component={fieldInput}
                            value={this.state.idVerifcationUserFullName}
                            validate={[required]}
                            onChange={(evt, value, unknown, name) => { this.setState({ idVerifcationUserFullName: value }); }}
                          />
                            )}
                        <p />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <div className="col-12">
                        <p className="text label">
                          {messages.me.profile.text.id_verification.desc4}
                        </p>
                        {idVerificationLevel > 0 ? (<h6>{this.idVerificationDocumentTypes[this.state.idVerificationDocumentType]}</h6>) : (
                          <Dropdown
                            name="document_type"
                            className="w-100"
                            defaultId={this.state.idVerificationDocumentType.toString()}
                            afterSetDefault={(item) => {
                                  if (item.id !== this.state.idVerificationDocumentType) {
                                    this.setState({ idVerificationDocumentType: item.id });
                                  }
                                }}
                            source={[
                                  {
                                    id: 0,
                                    value: this.idVerificationDocumentTypes[0],
                                  },
                                  {
                                    id: 2,
                                    value: this.idVerificationDocumentTypes[2],
                                  },
                                ]}
                            onItemSelected={(item) => {
                                  this.setState({ idVerificationDocumentType: item.id });
                                }
                                }
                          />
                            )}
                        <p />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <div className="col-12">
                        <p className=" text label">
                          {messages.me.profile.text.id_verification.desc3}
                        </p>
                        {idVerificationLevel > 0 ? (<h6>{this.state.idVerificationIDNumber}</h6>) : (
                          <Field
                            name="id_number"
                            type="text"
                            className="form-control-custom form-control-custom-ex w-100"
                            component={fieldInput}
                            value={this.state.idVerificationIDNumber}
                            validate={[required]}
                            onChange={(evt, value, unknown, name) => { this.setState({ idVerificationIDNumber: value }); }}
                          />
                            )}
                        <p />
                      </div>
                    </Row>
                  </div>
                  {/* {!this.state.email &&
                      <div>
                        <Row>
                          <div className="col-12">
                            <p className=" text label">
                              {messages.me.profile.text.email.label}
                            </p>
                              <Field
                                name="email"
                                type="text"
                                className="form-control-custom form-control-custom-ex w-100"
                                component={fieldInput}
                                value={this.state.idVerificationEmail}
                                validate={[required, validateEmail]}
                                onChange={(evt, value, unknown, name) => { this.setState({ idVerificationEmail: value }); }}
                              />
                            <p />
                          </div>
                        </Row>
                      </div>
                      } */}

                  {idVerificationLevel === 0 ? (
                    <div>
                      <div>
                        <Row>
                          <div className="col-12">
                            <p className="text label">
                              {messages.me.profile.text.id_verification.desc11}
                              <span>{messages.me.profile.text.id_verification.desc6}</span>
                            </p>
                          </div>
                        </Row>
                      </div>
                      <div>
                        <Row>
                          <div className="col-12">
                            <p className="text label">
                              {messages.me.profile.text.id_verification.desc5}
                            </p>
                            <UploadZone
                              name="front_image"
                              dropZoneRef={(node) => { this.imageFrontRef = node; }}
                              className="w-100 hide_upload_zone"
                              acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                              multiple={false}
                              dropLabel={messages.me.profile.text.id_verification.desc5}
                              onDrop={(files) => {
                                    this.setState({ idVerificationFrontImage: files[0] });
                                  }}
                            />
                            <button type="button" className="btn btn-primary w-100" onClick={() => { this.imageFrontRef.open(); }}>{messages.me.profile.text.id_verification.button.upload}</button>
                            <Row>
                              <div className="col-12">
                                <p />
                                <Image src={this.state.idVerificationFrontImage ? this.state.idVerificationFrontImage.preview : IDVerificationFrontImageExample} />
                              </div>
                            </Row>
                          </div>
                        </Row>
                      </div>
                      {this.state.idVerificationDocumentType !== 0 ? (
                        <div>
                          <p />
                          <Row>
                            <div className="col-12">
                              <p className="text label">
                                {messages.me.profile.text.id_verification.desc7}
                              </p>
                              <UploadZone
                                name="back_image"
                                dropZoneRef={(node) => { this.imageBackRef = node; }}
                                className="w-100 hide_upload_zone"
                                acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                                multiple={false}
                                dropLabel={messages.me.profile.text.id_verification.desc7}
                                onDrop={(files) => {
                                      this.setState({ idVerificationBackImage: files[0] });
                                    }}
                              />
                              <button type="button" className="btn btn-primary w-100" onClick={() => { this.imageBackRef.open(); }}>{messages.me.profile.text.id_verification.button.upload}</button>
                              <Row>
                                <div className="col-12">
                                  <p />
                                  <Image src={this.state.idVerificationBackImage ? this.state.idVerificationBackImage.preview : IDVerificationBackImageExample} />
                                </div>
                              </Row>
                            </div>
                          </Row>
                        </div>
                      ) : ''}
                    </div>
                      ) : (
                        <div>
                          <Row>
                            <div className="col-12">
                              <p className="text label">
                                {messages.me.profile.text.id_verification.desc8}
                                <span>{messages.me.profile.text.id_verification.desc9}</span>
                              </p>
                              <UploadZone
                                name="selfie_image"
                                dropZoneRef={(node) => { this.imageSelfieRef = node; }}
                                className="w-100 hide_upload_zone"
                                acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                                multiple={false}
                                dropLabel={messages.me.profile.text.id_verification.desc9}
                                onDrop={(files) => {
                                    this.setState({ idVerificationSelfieImage: files[0] });
                                  }}
                              />
                              <button type="button" className="btn btn-primary w-100" onClick={() => { this.imageSelfieRef.open(); }}>{messages.me.profile.text.id_verification.button.upload}</button>
                              <Row>
                                <div className="col-12">
                                  <p />
                                  <Image src={this.state.idVerificationSelfieImage ? this.state.idVerificationSelfieImage.preview : IDVerificationSelfieImageExample} />
                                </div>
                              </Row>
                            </div>
                          </Row>
                        </div>
                        )}
                  <div>
                    <Row>
                      <div className="col-12">
                        <Button
                          cssType="anonymous"
                          className="submit-btn"
                        >{messages.me.profile.text.id_verification.button.submit}
                        </Button>
                      </div>
                    </Row>
                  </div>
                </IDVerificationForm>
                  )}
              </div>
            </div>
          </Col>
        </Row>
        <ModalDialog onRef={(modal) => { this.modalRef = modal; return null; }}>
          {modalContent}
        </ModalDialog>
      </Grid >
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
