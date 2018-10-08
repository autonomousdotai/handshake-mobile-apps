/* eslint react/prop-types:0 */
/* eslint react/sort-comp:0 */

import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '@/components/core/controls/Button';
import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldPhoneInput, fieldRadioButton } from '@/components/core/form/customField';
import { required, requiredPhone } from '@/components/core/form/validation';
import { change, clearFields, Field, formValueSelector, reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import COUNTRIES from '@/data/country-dial-codes.js';
import { API_URL, ATM_STATUS, ATM_TYPE, HANDSHAKE_ID, TIME_FORMAT } from '@/constants';
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog';
import { hideLoading, showAlert, showLoading, showPopupGetGPSPermission } from '@/reducers/app/action';
import { createStoreATM, getStoreATM, getTransactionCashStore, updateStoreATM } from '@/reducers/exchange/action';
import { getAddressFromLatLng, getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import moment from 'moment';
import Feed from '@/components/core/presentation/Feed/Feed';
import 'rc-time-picker/assets/index.css';
import { fieldAtmStatus, fieldTimePicker, fieldTypeAtm, mapField } from './reduxFormFields';
import './CreateStoreATM.scss';
import '../styles.scss';
import Transaction from './components/Transaction';
import { addressValidation } from './validation';

export const CASH_ATM_TAB = {
  INFO: 'INFO',
  TRANSACTION: 'TRANSACTION',
};

const DEFAULT_TIME = {
  OPEN: '08:00',
  CLOSE: '17:00',
};

const nameFormFilterFeeds = 'formFilterFeeds';
const FormFilterFeeds = createForm({
  propsReduxForm: {
    form: nameFormFilterFeeds,
    initialValues: {
      'cash-show-type': CASH_ATM_TAB.INFO,
    },
  },
});

const nameFormExchangeCreate = 'exchangeCreate';
const FormExchangeCreate = createForm({
  propsReduxForm: {
    destroyOnUnmount: false,
    form: nameFormExchangeCreate,
    initialValues: {
      selectedDay: {},
      atmType: ATM_TYPE.STORE,
      startTime: moment(DEFAULT_TIME.OPEN, TIME_FORMAT),
      endTime: moment(DEFAULT_TIME.CLOSE, TIME_FORMAT),
      atmStatus: ATM_STATUS.OPEN,
      position: {},
    },
  },
});
const selectorFormExchangeCreate = formValueSelector(nameFormExchangeCreate);

const textColor = '#000000';

class Component extends React.Component {
  static propTypes = {
    // setLoading: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      lat: 0,
      lng: 0,
      cashTab: CASH_ATM_TAB.INFO,
      cashStore: this.props.cashStore,
      showMap: false,
    };

    this.handleUpdateSuccess = :: this.handleUpdateSuccess;
  }

  static getDerivedStateFromProps(nextProps) {
    /* eslint camelcase:0 */
    const { rfChange, position } = nextProps;
    if (position) {
      rfChange(nameFormExchangeCreate, 'address', position?.address);
      const state = { cashStore: { ...nextProps?.cashStore } };
      position?.address && (state.cashStore.address = position.address);
      position?.lat && (state.lat = position.lat);
      position?.lng && (state.lng = position.lng);
      return state;
    }
    return null;
  }

  componentDidMount() {
    const {
      ipInfo, options,
    } = this.props;
    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude, ipInfo?.addressDefault);

    // open default tab
    if (options && options.defaultTab) {
      this.changeTab(options.defaultTab);
    }

    // show popup to get GPS permission
    this.props.showPopupGetGPSPermission();

    this.getStoreATM();
  }

  componentWillUnmount() {
    // reset form
    this.props.rfReset();
  }

  detectPhonePrefix = () => {
    const { rfChange, ipInfo } = this.props;
    const { cashStore } = this.state;
    // auto fill phone number from user profile
    let detectedCountryCode = '';
    const foundCountryPhone = COUNTRIES.find(
      i => i.code.toUpperCase() === ipInfo?.country?.toUpperCase());
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode;
    }
    rfChange(
      nameFormExchangeCreate,
      'phone',
      cashStore?.phone || `${detectedCountryCode}-`,
    );
  }

  onSubmit = (values) => {
    const { messages } = this.props.intl;
    const { cashStore } = this.props;
    const { lat, lng } = this.state;
    const { username, phone, address, atmType, atmStatus, startTime, endTime } = values;
    const data = {
      name: username,
      address,
      phone,
      business_type: atmType,
      longitude: lng,
      latitude: lat,
    };

    if (atmType === ATM_TYPE.PERSONAL) {
      data.status = atmStatus;
    } else if (atmType === ATM_TYPE.STORE) {
      data.information = { open_hour: startTime.format(TIME_FORMAT), close_hour: endTime.format(TIME_FORMAT) };
    }

    let message = '';
    if (cashStore) {
      message = messages.create.atm.text.confirmUpdateAtm;
    } else {
      message = messages.create.atm.text.confirmCreateAtm;
    }

    this.setState({
      modalContent:
        (
          <div className="py-2">
            <Feed className="feed p-2" background="#259B24">
              <div className="text-white d-flex align-items-center" style={{ minHeight: '50px' }}>
                <div>{message}</div>
              </div>
            </Feed>
            {
              cashStore ? (
                <Button className="mt-2" block onClick={() => this.updateOffer(data)}><FormattedMessage id="ex.btn.confirm" /></Button>
              ) : (
                <Button className="mt-2" block onClick={() => this.createOffer(data)}><FormattedMessage id="ex.btn.confirm" /></Button>
              )
            }
            <Button block className="btn btn-secondary" onClick={this.cancelCreateOffer}><FormattedMessage id="ex.btn.notNow" /></Button>
          </div>
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  onCashTabChange = (e, newValue) => {
    console.log('onTypeChange', newValue);
    if (this.state.cashTab !== newValue) {
      this.changeTab(newValue);
    }
  }

  changeTab = (tab) => {
    if (Object.values(CASH_ATM_TAB).indexOf(tab) === -1) {
      console.warn('tab must be one of ', Object.values(CASH_ATM_TAB).join('|'));
      return;
    }
    const { rfChange } = this.props;
    rfChange(nameFormFilterFeeds, 'cash-show-type', tab);
    this.setState({ cashTab: tab }, () => {
      if (tab === CASH_ATM_TAB.TRANSACTION) {
        this.getTransactionCreditATM();
      }
    });
  }

  setAddressFromLatLng = (lat, lng, addressDefault) => {
    this.setState({ lat, lng });
    const { rfChange } = this.props;
    rfChange(nameFormExchangeCreate, 'position', {
      lat,
      lng,
    });
    if (addressDefault) {
      setTimeout(() => {
        rfChange(nameFormExchangeCreate, 'address', addressDefault);
      }, 0);
    } else {
      getAddressFromLatLng({ lat, lng }).then(address => {
        rfChange(nameFormExchangeCreate, 'address', address);
      });
    }
  }

  handleGetStoreFailed = (e) => {
    console.warn(e);
    this.detectPhonePrefix();
  }

  getStoreATM() {
    this.props.getStoreATM({
      PATH_URL: `${API_URL.EXCHANGE.CASH_STORE_ATM}`,
      successFn: this.handleGetStoresSuccess,
      errorFn: this.handleGetStoreFailed,
    });
  }

  showLoading = () => {
    // this.props.setLoading(true);
    this.props.showLoading();
  }

  hideLoading = () => {
    // this.props.setLoading(false);
    this.props.hideLoading();
  }

  showAlert = (message) => {
    this.props.showAlert({
      message: (
        <div className="text-center">
          {message}
        </div>
      ),
      timeOut: 5000,
      type: 'danger',
      callBack: () => {
      },
    });
  }

  cancelCreateOffer = () => {
    this.modalRef.close();
  }

  createOffer = (offer) => {
    this.showLoading();
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  updateOffer = (offer) => {
    this.showLoading();
    this.modalRef.close();
    console.log('createOffer', offer);

    this.props.createStoreATM({
      PATH_URL: API_URL.EXCHANGE.CASH_STORE_ATM,
      data: offer,
      METHOD: 'PUT',
      successFn: this.handleUpdateSuccess,
      errorFn: this.handleCreateOfferFailed,
    });
  }

  handleCreateOfferSuccess = async (responseData, opt = {}) => {
    const { intl: { messages }, closeModal, onAtmCreated } = this.props;
    let text = messages.create.atm.text.createdAtmSuccess;
    opt.isUpdate && (text = messages.create.atm.text.updatedAtmSuccess);
    console.log('handleCreateOfferSuccess', responseData);

    if (typeof onAtmCreated === 'function') {
      // refresh new cash store data from server (for diplaying on map)
      onAtmCreated();
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{text}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        if (typeof closeModal === 'function') {
          closeModal();
        }
      },
    });
  }

  handleUpdateSuccess = () => {
    const { intl: { messages }, closeModal, onAtmUpdated } = this.props;
    if (typeof onAtmUpdated === 'function') {
      // refresh new discover ata from server (for diplaying on map)
      onAtmUpdated();
    }
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{messages.create.atm.text.updatedAtmSuccess}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        if (typeof closeModal === 'function') {
          closeModal();
        }
      },
    });
  }

  handleCreateOfferFailed = (e) => {
    console.log('handleCreateOfferFailed', e);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  setAddress = (address) => {
    if (address) {
      const { rfChange } = this.props;
      rfChange(nameFormExchangeCreate, 'address', address);
    }
  }

  handleGetStoresSuccess = ({ data }) => {
    if (data) {
      /* eslint camelcase:0 */
      const { rfChange } = this.props;
      const { name, address, phone, status, business_type, information, latitude, longitude } = data;
      rfChange(nameFormExchangeCreate, 'username', name);
      rfChange(nameFormExchangeCreate, 'phone', phone);
      rfChange(nameFormExchangeCreate, 'address', address);
      rfChange(nameFormExchangeCreate, 'atmType', business_type);
      rfChange(nameFormExchangeCreate, 'atmStatus', status === ATM_STATUS.OPEN ? ATM_STATUS.OPEN : ATM_STATUS.CLOSE);
      if (business_type === ATM_TYPE.STORE) {
        rfChange(nameFormExchangeCreate, 'startTime', moment(information.open_hour ? information.open_hour : DEFAULT_TIME.OPEN, TIME_FORMAT));
        rfChange(nameFormExchangeCreate, 'endTime', moment(information.close_hour ? information.close_hour : DEFAULT_TIME.CLOSE, TIME_FORMAT));
      }
      if (latitude && longitude) {
        rfChange(nameFormExchangeCreate, 'position', {
          lat: latitude,
          lng: longitude,
        });
      }
      const cashStore = {
        name, phone, address, businessType: business_type, information,
      };
      this.setState({ cashStore }, this.detectPhonePrefix);
    }
  }

  toggleGoogleMap = () => {
    this.setState({ showMap: !this.state.showMap }, () => {
      const { showMap } = this.state;
      if (showMap) {
        // scroll map to top
        const containerEl = document.getElementsByClassName('create-store-atm-container');
        const modelEl = containerEl && containerEl[0]?.offsetParent;
        setTimeout(() => {
          modelEl && modelEl.scrollTo({
            behavior: 'smooth',
            left: 0,
            top: modelEl.offsetHeight,
          });
        }, 500);
      }
    });
  }

  renderMap = () => {
    const { showMap } = this.state;
    if (!showMap) return null;
    return (
      <div className="item-info">
        <Field
          component={mapField}
          name="position"
        />
      </div>
    );
  }

  getTransactionCreditATM = () => {
    const qs = {};

    qs.type = HANDSHAKE_ID.EXCHANGE;

    this.props.getTransactionCashStore({ PATH_URL: API_URL.ME.BASE, qs });
  }

  render() {
    const { messages } = this.props.intl;
    const {
      modalContent, cashTab,
    } = this.state;

    const { atmType, cashStore, startTime } = this.props;

    return (
      <div className="create-store-atm-container">
        <div className="atm-tab-container">
          <FormFilterFeeds>
            <div>
              <div>
                <Field
                  name="cash-show-type"
                  component={fieldRadioButton}
                  type="tab-6"
                  list={[
                    { value: CASH_ATM_TAB.INFO, text: messages.create.atm.tab.storeInfo, icon: null },
                    { value: CASH_ATM_TAB.TRANSACTION, text: messages.create.atm.tab.transaction, icon: null },
                  ]}
                  onChange={this.onCashTabChange}
                />
              </div>
            </div>
          </FormFilterFeeds>
        </div>

        {
          cashTab === CASH_ATM_TAB.INFO ? (
            <FormExchangeCreate onSubmit={this.onSubmit}>
              <div className="create-store-atm">
                <div className="item-info">
                  <label className="form-control-title">{messages.create.atm.text.nameTitle.toUpperCase()}</label>
                  <div >
                    <Field
                      name="username"
                      type="text"
                      className="form-control form-control-input"
                      placeholder={messages.create.atm.text.nameHint}
                      component={fieldInput}
                      validate={[required]}
                    />
                  </div>
                </div>
                <div className="input-group item-info">
                  <Field
                    component={fieldTypeAtm}
                    texts={messages.create.atm.text}
                    name="atmType"
                    atmType={ATM_TYPE}
                  />
                </div>
                {
                  atmType === ATM_TYPE.PERSONAL ? (
                    <div className="item-info">
                      <Field
                        component={fieldAtmStatus}
                        texts={messages.create.atm.text}
                        atmStatus={ATM_STATUS}
                        name="atmStatus"
                      />
                    </div>
                  ) : (
                    <div className="input-group item-info">
                      <div className="w-100 atm-time">
                        <div className="atm-time-item">
                          <div className="from-time">{messages.create.atm.text.open}</div>
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            defaultTime={moment('05:00 AM', TIME_FORMAT)}
                            name="startTime"
                          />
                        </div>
                        <div className="atm-time-item">
                          <div className="to-time">{messages.create.atm.text.closed}</div>
                          <Field
                            component={fieldTimePicker}
                            texts={messages.create.atm.text}
                            defaultTime={moment('08:00 PM', TIME_FORMAT)}
                            minHour={moment(startTime).format('HH')}
                            name="endTime"
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
                <div className="phone-field item-info">
                  <label className="form-control-title">{messages.create.atm.text.phone.toUpperCase()}</label>
                  <Field
                    name="phone"
                    className="form-control-custom"
                    component={fieldPhoneInput}
                    color={textColor}
                    type="tel"
                    placeholder="4995926433"
                    validate={[requiredPhone]}
                    showFlag
                  />
                </div>

                <div className="item-info">
                  <label className="form-control-title">{messages.create.atm.text.addressTitle.toUpperCase()}</label>
                  <div>
                    <div className="address-container">
                      <Field
                        name="address"
                        type="text"
                        className="form-control form-control-input"
                        placeholder={messages.create.atm.text.addressHint}
                        component={fieldInput}
                        validate={[required, addressValidation]}
                      />
                      <div className={`address-update-btn ${this.state.showMap && 'close-map'}`} onClick={this.toggleGoogleMap}>
                        <span>{ this.state.showMap ? 'Close Maps' : 'Open Maps' }</span>
                      </div>
                    </div>
                    {this.renderMap()}
                  </div>
                </div>
                <Button block type="submit" className="mt-3 open-button item-info"> {
                  cashStore ? messages.create.atm.button.update : messages.create.atm.button.create
                }
                </Button>
              </div>
            </FormExchangeCreate>
          ) : (
            <Transaction />
          )
        }
        <ModalDialog onRef={modal => { this.modalRef = modal; }} >
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const atmType = selectorFormExchangeCreate(state, 'atmType');
  const position = selectorFormExchangeCreate(state, 'position');
  const startTime = selectorFormExchangeCreate(state, 'startTime');
  return {
    position,
    atmType,
    startTime,
    ipInfo: state.app.ipInfo,
    cashStore: state.exchange.cashStore,
  };
};

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  rfReset: bindActionCreators(reset, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),

  createStoreATM: bindActionCreators(createStoreATM, dispatch),
  getStoreATM: bindActionCreators(getStoreATM, dispatch),
  updateStoreATM: bindActionCreators(updateStoreATM, dispatch),
  showPopupGetGPSPermission: bindActionCreators(showPopupGetGPSPermission, dispatch),
  getTransactionCashStore: bindActionCreators(getTransactionCashStore, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Component));
