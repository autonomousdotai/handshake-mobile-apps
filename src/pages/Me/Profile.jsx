import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle, showAlert } from '@/reducers/app/action';
import { verifyPhone, submitPhone, verifyEmail, checkUsernameExist, authUpdate, submitEmail, verifyID } from '@/reducers/auth/action';
import COUNTRIES from '@/data/country-dial-codes';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import Dropdown from '@/components/core/controls/Dropdown';
import UploadZone from '@/components/core/controls/UploadZone';
import { Field } from 'redux-form';
import { fieldCleave } from '@/components/core/form/customField';
import ModalDialog from '@/components/core/controls/ModalDialog';
import local from '@/services/localStore';
import { APP } from '@/constants';
// style
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
import CheckedSVG from '@/assets/images/icon/checked.svg';

// import { chatInstance } from '@/pages/Chat/Chat';
import valid from '@/services/validate';

import './Profile.scss';

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
      idVerificationDocumentType: -1,
      idVerificationFrontImage: null,
      idVerificationBackImage: null,
      idVerificationSelfieImage: null,
      idVerified: props.auth.profile.idVerified,
    };
    // bind
    this.onSubmitVerifyPhone = :: this.onSubmitVerifyPhone;
    this.onSubmitIDVerification = :: this.onSubmitIDVerification;
    this.addUsername = :: this.addUsername;
    this.selectPhoneRegionCode = :: this.selectPhoneRegionCode;
    this.filterCountries = :: this.filterCountries;
    this.onTextFieldChange = :: this.onTextFieldChange;
    this.addUsername = :: this.addUsername;

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

  onTextFieldChange(name, value) {
    this.setState(() => ({ [name]: value }));
  }

  onSubmitIDVerification() {
    const {
      idVerificationDocumentType,
      idVerificationFrontImage,
      idVerificationBackImage,
      idVerificationSelfieImage,
    } = this.state;
    const { messages } = this.props.intl;

    if (idVerificationDocumentType < 0) {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.idVerification.invalidDocument}</div>,
        timeOut: 3000,
        type: 'danger',
      });
      return;
    }

    if (!idVerificationFrontImage) {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.idVerification.invalidFrontImage}</div>,
        timeOut: 3000,
        type: 'danger',
      });
      return;
    }

    if (idVerificationDocumentType > 0 && !idVerificationBackImage) {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.idVerification.invalidBackImage}</div>,
        timeOut: 3000,
        type: 'danger',
      });
      return;
    }

    if (!idVerificationSelfieImage) {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.idVerification.invalidSelfieImage}</div>,
        timeOut: 3000,
        type: 'danger',
      });
      return;
    }

    const data = new FormData();
    data.append('document_type', idVerificationDocumentType);
    data.append('front_image', idVerificationFrontImage);
    data.append('back_image', idVerificationBackImage);
    data.append('selfie_image', idVerificationSelfieImage);
    this.props.verifyID({
      PATH_URL: 'user/id_verification',
      data,
      METHOD: 'POST',
      successFn: () => {
        this.setState(() => ({ idVerified: 2, idVerificationCollapse: false }));
        this.props.showAlert({
          message: <div className="text-center">{messages.me.profile.verify.alert.success.idVerification}</div>,
          timeOut: 3000,
          type: 'success',
        });
      },
      errorFn: () => {
        this.props.showAlert({
          message: <div className="text-center">{messages.me.profile.verify.alert.cannot.idVerification}</div>,
          timeOut: 3000,
          type: 'danger',
        });
      },
    });
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
          this.props.showAlert({
            message: <div className="text-center">{messages.me.profile.verify.alert.send.phone}</div>,
            timeOut: 3000,
            type: 'success',
          });
          local.save(APP.PHONE_NEED_VERIFY, phone);
          local.save(APP.COUNTRY_PHONE_NEED_VERIFY, countryCode.dialCode.replace('+', ''));
        },
        errorFn: () => {
          this.props.showAlert({
            message: <div className="text-center">{messages.me.profile.verify.alert.notValid.server.phone}</div>,
            timeOut: 3000,
            type: 'danger',
          });
        },
      });
    } else {
      if (!sms) {
        this.props.showAlert({
          message: <div className="text-center">{messages.me.profile.verify.alert.require.phone}</div>,
          timeOut: 3000,
          type: 'danger',
        });
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
              this.props.showAlert({
                message: <div className="text-center">{messages.me.profile.verify.alert.success.phone}</div>,
                timeOut: 3000,
                type: 'success',
              });
            },
            errorFn: () => {
              this.props.showAlert({
                message: <div className="text-center">{messages.me.profile.verify.alert.require.phone}</div>,
                timeOut: 3000,
                type: 'danger',
              });
            },
          });
        },
        errorFn: () => {
          this.props.showAlert({
            message: <div className="text-center">{messages.me.profile.verify.alert.cannot.phone}</div>,
            timeOut: 3000,
            type: 'danger',
          });
        },
      });
    }
  }

  onSubmitVerifyEmail() {
    const { messages } = this.props.intl;
    const email = this.state.email || this.localEmail;
    const { emailStart, code } = this.state;
    console.log('emailStart', emailStart);
    console.log('email', email);
    if (email) {
      if (valid.email(email)) {
        this.props.showAlert({
          message: <div className="text-center">{messages.me.profile.verify.alert.notValid.client.email}</div>,
          timeOut: 3000,
          type: 'danger',
        });
        return;
      }
      if (emailStart !== email) {
        this.props.verifyEmail({
          PATH_URL: `user/verification/email/start?email=${email}`,
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: (data) => {
            if (data.status) {
              this.props.showAlert({
                message: <div className="text-center">{messages.me.profile.verify.alert.send.email}</div>,
                timeOut: 3000,
                type: 'success',
              });
              this.setState(() => ({ emailStart: email, isShowVerificationEmailCode: true }));
              local.save(APP.EMAIL_NEED_VERIFY, email);
            }
          },
          errorFn: () => {
            this.props.showAlert({
              message: <div className="text-center">{messages.me.profile.verify.alert.notValid.client.email}</div>,
              timeOut: 3000,
              type: 'danger',
            });
          },
        });
      } else {
        if (!code) {
          this.props.showAlert({
            message: <div className="text-center">{messages.me.profile.verify.alert.require.email}</div>,
            timeOut: 3000,
            type: 'danger',
          });
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
                this.setState({ isShowVerificationEmailCode: false });
                this.props.showAlert({
                  message: <div className="text-center">{messages.me.profile.verify.alert.success.email}</div>,
                  timeOut: 3000,
                  type: 'success',
                });
              },
              errorFn: () => {
                this.props.showAlert({
                  message: <div className="text-center">{messages.me.profile.verify.alert.require.email}</div>,
                  timeOut: 3000,
                  type: 'danger',
                });
              },
            });
          },
          errorFn: () => {
            this.props.showAlert({
              message: <div className="text-center">{messages.me.profile.verify.alert.cannot.email}</div>,
              timeOut: 3000,
              type: 'danger',
            });
          },
        });
      }
    } else {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.verify.alert.notValid.client.email}</div>,
        timeOut: 3000,
        type: 'danger',
      });
    }
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
                this.props.showAlert({
                  message: <div className="text-center">{messages.me.profile.username.success}</div>,
                  timeOut: 3000,
                  type: 'success',
                });
                // chatInstance.updateUserName(values.username);

              },
            });
          } else {
            this.props.showAlert({
              message: <div className="text-center">{messages.me.profile.username.exist}</div>,
              timeOut: 3000,
              type: 'danger',
            });
          }
        },
      });
    } else {
      this.props.showAlert({
        message: <div className="text-center">{messages.me.profile.username.required}</div>,
        timeOut: 3000,
        type: 'danger',
      });
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
    const {
      countryCode, countries, sms, email, code,
    } = this.state;
    const { UsernameForm, NumberPhoneForm, EmailForm, IDVerificationForm } = this;
    const { messages } = this.props.intl;
    return (
      <Grid className="profile">
        <Row>
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
        </Row>
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
              <div className="head" onClick={() => this.setState(state => ({ emailCollapse: !state.emailCollapse }))}>
                <p className="label">
                  {messages.me.profile.text.email.label}
                  <span>{messages.me.profile.text.email.desc1}</span>
                </p>
                <div className="extend">
                  <span className="badge badge-success">{this.props.auth.profile.email ? 'Verified' : ''}</span>
                  <Image className={this.state.emailCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.emailCollapse ? '' : 'd-none'}`}>
                <p className="text">{messages.me.profile.text.email.desc2}</p>
                <p className="text">{messages.me.profile.text.email.desc3}</p>
                <EmailForm onSubmit={this.onSubmitVerifyEmail}>
                  <div>
                    <Row>
                      <div className="col-9">
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
                      <div className="col-3">
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
              <div className="head" onClick={() => this.setState(state => ({ idVerificationCollapse: !state.idVerificationCollapse }))}>
                <p className="label">
                  {messages.me.profile.text.id_verification.label}
                  <span>{messages.me.profile.text.id_verification.desc1}</span>
                </p>
                <div className="extend">
                  <span className={`badge ${this.state.idVerified === 1 ? 'badge-sucess' : (this.state.idVerified === 2 ? 'badge-warning' : '')}`}>{this.state.idVerified === 1 ? 'Verified' : (this.state.idVerified === 2 ? 'Processing' : '')}</span>
                  <Image className={this.state.idVerificationCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.idVerificationCollapse ? '' : 'd-none'}`}>
                <p className="text">{messages.me.profile.text.id_verification.desc2}</p>
                <p className="text">{messages.me.profile.text.id_verification.desc3}</p>
                <p className="text">{messages.me.profile.text.id_verification.desc4}</p>
                <p className="text">{messages.me.profile.text.id_verification.desc5}</p>
                <IDVerificationForm onSubmit={this.onSubmitIDVerification}>
                  <div>
                    <p />
                    <Row>
                      <div className="col-12">
                        <Dropdown
                          placeholder={messages.me.profile.text.id_verification.desc6}
                          name="document_type"
                          className="w-100"
                          defaultId="-1"
                          source={[
                            {
                              id: -1,
                              value: messages.me.profile.text.id_verification.desc6,
                              className: 'disable',
                              disableClick: true,
                            },
                            {
                              id: 0,
                              value: 'Passport',
                            },
                            {
                              id: 1,
                              value: 'Driver License',
                            },
                            {
                              id: 2,
                              value: 'Goverment ID Card',
                            },
                          ]}
                          onItemSelected={(item) => {
                            this.setState({ idVerificationDocumentType: item.id });
                          }
                          }
                        />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <p />
                    <Row>
                      <div className="col-12">
                        <UploadZone
                          name="front_image"
                          className="w-100"
                          acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                          multiple={false}
                          dropLabel={messages.me.profile.text.id_verification.desc7}
                          onDrop={(files) => {
                            this.setState({ idVerificationFrontImage: files[0] });
                          }}
                        />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <p />
                    <Row>
                      <div className="col-12">
                        <UploadZone
                          name="back_image"
                          className="w-100"
                          acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                          multiple={false}
                          dropLabel={messages.me.profile.text.id_verification.desc8}
                          onDrop={(files) => {
                            this.setState({ idVerificationBackImage: files[0] });
                          }}
                        />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <p />
                    <Row>
                      <div className="col-12">
                        <UploadZone
                          name="selfie_image"
                          className="w-100"
                          acceptMimeType={['image/jpeg', 'image/jpg', 'image/png']}
                          multiple={false}
                          dropLabel={messages.me.profile.text.id_verification.desc9}
                          onDrop={(files) => {
                            this.setState({ idVerificationSelfieImage: files[0] });
                          }}
                        />
                      </div>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <div className="col-12">
                        <Button cssType="anonymous" className="submit-btn">{messages.me.profile.text.id_verification.button.submit}</Button>
                      </div>
                    </Row>
                  </div>
                </IDVerificationForm>
              </div>
            </div>
          </Col>
        </Row>
        <ModalDialog onRef={(modal) => { this.modalVerifyRef = modal; return null; }}>
          <div className="modal-verify">
            <Image src={CheckedSVG} alt="checked" />
            <p>Successed!</p>
            <p>{this.state.successMessage ? this.state.successMessage : 'Your authentication is verified'}</p>
          </div>
        </ModalDialog>
      </Grid>
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
});

export default injectIntl(connect(mapState, mapDispatch)(Profile));
