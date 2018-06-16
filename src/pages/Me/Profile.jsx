import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// services
import createForm from '@/components/core/form/createForm';
import { setHeaderTitle, showAlert } from '@/reducers/app/action';
import { verifyPhone, submitPhone, verifyEmail, checkUsernameExist, authUpdate } from '@/reducers/auth/action';
import COUNTRIES from '@/data/country-dial-codes';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
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
      phone: props.auth.profile.phone,
      email: props.auth.profile.email,
      sms: '',
      successMessage: '',
      isShowVerificationCode: false,
    };
    // bind
    this.onSubmitVerifyPhone = ::this.onSubmitVerifyPhone;
    this.onSubmitVerifyEmail = ::this.onSubmitVerifyEmail;
    this.selectPhoneRegionCode = ::this.selectPhoneRegionCode;
    this.filterCountries = ::this.filterCountries;
    this.onTextFieldChange = ::this.onTextFieldChange;
    this.addUsername = ::this.addUsername;

    if (props.auth.profile.phone) {
      const selectedCountry = COUNTRIES.filter(country => country.dialCode === props.auth.profile.phone.substr(0, props.auth.profile.phone.indexOf(' ')))[0];
      this.state.countryCode = selectedCountry;
    }

    this.UsernameForm = createForm({
      propsReduxForm: {
        form: 'UsernameForm',
        initialValues: { username: props.auth.profile.username },
      },
    });
    this.NumberPhoneForm = createForm({
      propsReduxForm: {
        form: 'NumberPhoneForm',
        initialValues: {
          phone: props.auth.profile.phone
            ? props.auth.profile.phone.substr(props.auth.profile.phone.indexOf(' ') + 1)
            : '',
        },
      },
    });

    this.EmailForm = createForm({
      propsReduxForm: {
        form: 'EmailForm',
        initialValues: { email: props.auth.profile.email },
      },
    });
  }

  onTextFieldChange(name, value) {
    this.setState(() => ({ [name]: value }));
  }

  onSubmitVerifyPhone() {
    const {
      countryCode, phone, phoneStart, sms,
    } = this.state;
    if (phoneStart !== phone) {
      this.props.verifyPhone({
        PATH_URL: 'user/verification/phone/start',
        qs: {
          country: `${countryCode.dialCode.replace('+', '')}`,
          phone,
        },
        METHOD: 'POST',
        successFn: () => {
          this.setState(() => ({ phoneStart: phone, isShowVerificationCode: true }));
          this.props.showAlert({
            message: <div className="text-center">We sent the secret code to your phone.</div>,
            timeOut: 3000,
            type: 'success',
          });
        },
        errorFn: () => {
          this.props.showAlert({
            message: <div className="text-center">That’s not a real number. Try harder.</div>,
            timeOut: 3000,
            type: 'danger',
          });
        },
      });
    } else {
      this.props.submitPhone({
        PATH_URL: 'user/verification/phone/check',
        qs: {
          country: `${countryCode.dialCode.replace('+', '')}`,
          phone,
          code: sms,
        },
        METHOD: 'POST',
        successFn: () => {
          const params = new URLSearchParams();
          params.append('phone', `${countryCode.dialCode} ${phone}`);
          this.props.authUpdate({
            PATH_URL: 'user/profile',
            data: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            METHOD: 'POST',
            successFn: () => {
              this.setState({ isShowVerificationCode: false });
              this.props.showAlert({
                message: <div className="text-center">Phone number securely saved.</div>,
                timeOut: 3000,
                type: 'success',
              });
            },
            errorFn: () => {
              this.props.showAlert({
                message: <div className="text-center">Enter the secret code sent to your phone.</div>,
                timeOut: 3000,
                type: 'danger',
              });
            },
          });
        },
        errorFn: () => {
          this.props.showAlert({
            message: <div className="text-center">That’s not a real number. Try harder.</div>,
            timeOut: 3000,
            type: 'danger',
          });
        },
      });
    }
  }

  onSubmitVerifyEmail() {
    const { email } = this.state;
    if (email) {
      if (valid.email(email)) {
        this.props.showAlert({
          message: <div className="text-center">A valid email would work better.</div>,
          timeOut: 3000,
          type: 'danger',
        });
        return;
      }
      this.props.verifyEmail({
        PATH_URL: `user/verification/email/start?email=${email}`,
        METHOD: 'POST',
        successFn: (data) => {
          if (data.status) {
            this.props.showAlert({
              message: <div className="text-center">Tap the verification link we just sent to your email.</div>,
              timeOut: 3000,
              type: 'success',
            });
            local.save(APP.EMAIL_NEED_VERIFY, email);
          }
        },
        errorFn: () => {
          this.props.showAlert({
            message: <div className="text-center">A valid email would work better.</div>,
            timeOut: 3000,
            type: 'danger',
          });
        },
      });
    } else {
      this.props.showAlert({
        message: <div className="text-center">A valid email would work better.</div>,
        timeOut: 3000,
        type: 'danger',
      });
    }
  }

  addUsername(values) {
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
                  message: <div className="text-center">Your alias is recorded.</div>,
                  timeOut: 3000,
                  type: 'success',
                });
                // chatInstance.updateUserName(values.username);
              },
            });
          } else {
            this.props.showAlert({
              message: <div className="text-center">username has existed!</div>,
              timeOut: 3000,
              type: 'danger',
            });
          }
        },
      });
    } else {
      this.props.showAlert({
        message: <div className="text-center">Username is required</div>,
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
      countryCode, countries, sms, email,
    } = this.state;
    const { UsernameForm, NumberPhoneForm, EmailForm } = this;
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
                  Alias
                </p>
                <div className="extend">
                  <Image className={this.state.usernameCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.usernameCollapse ? '' : 'd-none'}`}>
                <p className="text">What do they call you?</p>
                <UsernameForm onSubmit={this.addUsername}>
                  <Field
                    name="username"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                  />
                  <Button cssType="anonymous" className="submit-btn">Save</Button>
                </UsernameForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({ phoneCollapse: !state.phoneCollapse }))}>
                <p className="label">
                  Phone Number
                  <span>
                    To send you free ETH sometimes, we’ll need your phone number to verify that you are not a robot. This is optional.
                  </span>
                </p>
                <div className="extend">
                  <span className="badge badge-success">{ this.props.auth.profile.phone ? 'Verified' : '' }</span>
                  <Image className={this.state.phoneCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.phoneCollapse ? '' : 'd-none'}`}>
                <p className="text">We only send humans rewards.</p>
                <p className="text">Please verify your phone number.</p>
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
                    <Button cssType="anonymous" className="send-btn">Send</Button>
                  </div>
                  <div className={this.state.isShowVerificationCode ? '' : 'd-none'}>
                    <p className="text">Enter the secret code sent to your phone.</p>
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
                    <Button cssType="anonymous" className="submit-btn">Verify your number</Button>
                  </div>
                </NumberPhoneForm>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="collapse-custom">
              <div className="head" onClick={() => this.setState(state => ({ emailCollapse: !state.emailCollapse }))}>
                <p className="label">
                  Email Verification
                  <span>You may prefer to receive updates and notifications via email. This is also optional.</span>
                </p>
                <div className="extend">
                  <span className="badge badge-success">{ this.props.auth.profile.email ? 'Verified' : '' }</span>
                  <Image className={this.state.emailCollapse ? 'rotate' : ''} src={ExpandArrowSVG} alt="arrow" />
                </div>
              </div>
              <div className={`content ${this.state.emailCollapse ? '' : 'd-none'}`}>
                <p className="text">Prefer to receive notifications and updates via email?</p>
                <p className="text">Enter your email</p>
                <EmailForm onSubmit={this.onSubmitVerifyEmail}>
                  <Field
                    name="email"
                    className="form-control-custom form-control-custom-ex w-100"
                    component={fieldCleave}
                    onChange={(evt, value, unknown, name) => {
                      this.onTextFieldChange(name, value);
                    }}
                    value={email}
                  />
                  <Button cssType="anonymous" className="submit-btn">Verify your email</Button>
                </EmailForm>
              </div>
            </div>
          </Col>
        </Row>
        <ModalDialog onRef={(modal) => { this.modalVerifyRef = modal; return null; }}>
          <div className="modal-verify">
            <Image src={CheckedSVG} alt="checked" />
            <p>Successed!</p>
            <p>{ this.state.successMessage ? this.state.successMessage : 'Your authentication is verified' }</p>
          </div>
        </ModalDialog>
      </Grid>
    );
  }
}

const mapState = state => ({
  auth: state.auth,
});

const mapDispatch = ({
  setHeaderTitle,
  verifyPhone,
  submitPhone,
  verifyEmail,
  showAlert,
  checkUsernameExist,
  authUpdate,
});

export default connect(mapState, mapDispatch)(Profile);
