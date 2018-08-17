import React from 'react'
import { bindActionCreators } from 'redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { change, Field, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import Feed from '@/components/core/presentation/Feed'
import Button from '@/components/core/controls/Button'
import createForm from '@/components/core/form/createForm'
import { ExchangeHandshake } from '@/services/neuron'
import {
  formatAmountCurrency,
  formatMoney,
  getOfferPrice
} from '@/services/offer-util'
import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField'
import {
  maxValue,
  minValue,
  required
} from '@/components/core/form/validation'
import { minValueBTC, minValueETH } from './validation'
import ImageUploader from '../components/ImageUploader'
// import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_DEFAULT,
  CRYPTO_CURRENCY_NAME,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_DEFAULT,
  EXCHANGE_ACTION_LIST,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY_SYMBOL,
  MIN_AMOUNT,
  NB_BLOCKS,
  SELL_PRICE_TYPE_DEFAULT,
  URL
} from '@/constants'
import '../styles.scss'
import ModalDialog from '@/components/core/controls/ModalDialog/ModalDialog'
import { hideLoading, showAlert, showLoading } from '@/reducers/app/action'
import { MasterWallet } from '@/services/Wallets/MasterWallet'
import COUNTRIES from '@/data/country-dial-codes.js'
import { feedBackgroundColors } from '@/components/handshakes/exchange/config'
import {
  addOfferItem,
  createOffer,
  createOfferStores,
  getOfferStores
} from '@/reducers/exchange/action'

import { BigNumber } from 'bignumber.js/bignumber'
import { authUpdate } from '@/reducers/auth/action'
import axios from 'axios/index'
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import iconBitcoin from '@/assets/images/icon/coin/icon-btc.svg'
import iconEthereum from '@/assets/images/icon/coin/icon-eth.svg'

import './styles.scss'

const nameFormExchangeCreateLocal = 'exchangeCreateLocal'
const FormExchangeCreateLocal = createForm({
  propsReduxForm: {
    form: nameFormExchangeCreateLocal,
    initialValues: {
      type: EXCHANGE_ACTION_DEFAULT,
      currency: CRYPTO_CURRENCY_DEFAULT
    }
  }
})
const selectorFormExchangeCreateLocal = formValueSelector(
  nameFormExchangeCreateLocal
)

const textColor = '#000000'

class Component extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      modalContent: '',
      currency: CRYPTO_CURRENCY_DEFAULT,
      lat: 0,
      lng: 0,
      CRYPTO_CURRENCY_LIST: [
        {
          value: CRYPTO_CURRENCY.ETH,
          text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH],
          icon: <img src={iconEthereum} width={22} />,
          hide: false
        },
        {
          value: CRYPTO_CURRENCY.BTC,
          text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC],
          icon: <img src={iconBitcoin} width={22} />,
          hide: false
        }
      ]
    }
    this.mainColor = '#1F2B34'
  }

  componentDidMount() {
    const { ipInfo, rfChange, authProfile } = this.props;
    this.setAddressFromLatLng(ipInfo?.latitude, ipInfo?.longitude);

    // auto fill phone number from user profile
    let detectedCountryCode = ''
    const foundCountryPhone = COUNTRIES.find(
      i => i.code.toUpperCase() === ipInfo?.country?.toUpperCase()
    )
    if (foundCountryPhone) {
      detectedCountryCode = foundCountryPhone.dialCode
    }
    rfChange(
      nameFormExchangeCreateLocal,
      'phone',
      authProfile.phone || `${detectedCountryCode}-`
    )
    rfChange(nameFormExchangeCreateLocal, 'address', authProfile.address || '')
  }

  setAddressFromLatLng = (lat, lng) => {
    this.setState({ lat, lng })
    const { rfChange } = this.props
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true`
      )
      .then(response => {
        const address =
          response.data.results[0] &&
          response.data.results[0].formatted_address
        rfChange(nameFormExchangeCreateLocal, 'address', address)
      })
  };
  checkMainNetDefaultWallet = wallet => {
    let result = true

    if (process.env.isLive) {
      if (
        wallet.network ===
        MasterWallet.ListCoin[wallet.className].Network.Mainnet
      ) {
        result = true
      } else {
        const message = <FormattedMessage id='requireDefaultWalletOnMainNet' />
        this.showAlert(message)
        result = false
      }
    }
    return result
  };
  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance)
    const bnAmount = new BigNumber(amount)
    const bnFee = new BigNumber(fee)
    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee))
    if (condition) {
      this.props.showAlert({
        message: (
          <div className='text-center'>
            <FormattedMessage
              id='notEnoughCoinInWallet'
              values={{
                amount: formatAmountCurrency(balance),
                fee: formatAmountCurrency(fee),
                currency
              }}
            />
          </div>
        ),
        timeOut: 3000,
        type: 'danger',
        callBack: () => {}
      })
    }

    return condition
  };
  showLoading = () => {
    this.props.showLoading({ message: '' })
  };
  hideLoading = () => {
    this.props.hideLoading()
  };
  showAlert = message => {
    this.props.showAlert({
      message: <div className='text-center'>{message}</div>,
      timeOut: 5000,
      type: 'danger',
      callBack: () => {}
    })
  };
  handleSubmit = async values => {
    const {
      ipInfo: { currency: fiat_currency },
      authProfile
    } = this.props
    const { amount, currency, type, phone, physical_item, address } = values

    const wallet = MasterWallet.getWalletDefault(values.currency)

    if (!this.checkMainNetDefaultWallet(wallet)) {
      return
    }

    const balance = await wallet.getBalance()
    const fee = await wallet.getFee(NB_BLOCKS, true)
    let checkAmount = amount

    const shopType =
      type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY

    if (currency === CRYPTO_CURRENCY.ETH && shopType === EXCHANGE_ACTION.BUY) {
      checkAmount = 0
    }

    if (
      (currency === CRYPTO_CURRENCY.ETH ||
        (shopType === EXCHANGE_ACTION.SELL &&
          currency === CRYPTO_CURRENCY.BTC)) &&
      this.showNotEnoughCoinAlert(balance, checkAmount, fee, values.currency)
    ) {
      return
    }

    const phones = phone.trim().split('-')

    let newPhone = ''
    if (phones.length > 1) {
      newPhone = phones[1].length > 0 ? phone : ''
    }

    const offer = {
      amount,
      price: '0',
      physical_item,
      currency,
      type: shopType,
      contact_info: address,
      contact_phone: newPhone,
      fiat_currency,
      latitude: this.state.lat,
      longitude: this.state.lng,
      email: authProfile?.email || '',
      username: authProfile?.name || '',
      chat_username: authProfile?.username || ''
    }

    if (shopType === EXCHANGE_ACTION.BUY) {
      offer.user_address = wallet.address
    } else {
      offer.refund_address = wallet.address
    }

    console.log('handleSubmit', offer)
    const message = (
      <FormattedMessage
        id='createOfferConfirm'
        values={{
          type: EXCHANGE_ACTION_NAME[type],
          something: physical_item,
          amount,
          currency
        }}
      />
    )

    this.setState(
      {
        modalContent: (
          <div className='py-2'>
            <Feed className='feed p-2' background='#259B24'>
              <div
                className='text-white d-flex align-items-center'
                style={{ minHeight: '50px' }}
              >
                <div>{message}</div>
              </div>
            </Feed>
            <Button
              className='mt-2'
              block
              onClick={() => this.createOffer(offer)}
            >
              <FormattedMessage id='ex.btn.confirm' />
            </Button>
            <Button
              block
              className='btn btn-secondary'
              onClick={this.cancelCreateOffer}
            >
              <FormattedMessage id='ex.btn.notNow' />
            </Button>
          </div>
        )
      },
      () => {
        this.modalRef.open()
      }
    )
  };
  createOffer = offer => {
    this.modalRef.close()
    console.log('createOffer', offer)

    this.showLoading()
    this.props.createOffer({
      PATH_URL: API_URL.EXCHANGE.OFFERS,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleCreateOfferSuccess,
      errorFn: this.handleCreateOfferFailed
    })
  };
  cancelCreateOffer = () => {
    this.modalRef.close()
  };
  handleCreateOfferSuccess = async res => {
    const { data } = res
    const { currency, type, system_address, total_amount, id } = data

    console.log('handleCreateOfferSuccess', data)

    if (type === EXCHANGE_ACTION.SELL) {
      const wallet = MasterWallet.getWalletDefault(currency)
      console.log('wallet', wallet)

      if (currency === CRYPTO_CURRENCY.BTC) {
        wallet
          .transfer(system_address, total_amount, NB_BLOCKS)
          .then(success => {
            console.log('transfer', success)
          })
      } else if (currency === CRYPTO_CURRENCY.ETH) {
        const exchangeHandshake = new ExchangeHandshake(wallet.chainId)

        const result = await exchangeHandshake.initByCoinOwner(
          total_amount,
          id
        )
        console.log('handleCreateOfferSuccess', result)
      }
    }

    this.hideLoading()
    this.props.showAlert({
      message: (
        <div className='text-center'>
          <FormattedMessage id='createOfferSuccessMessage' />
        </div>
      ),
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        this.props.history.push(URL.HANDSHAKE_ME)
      }
    })
  };
  handleCreateOfferFailed = e => {
    this.hideLoading()
    this.props.showAlert({
      message: <div className='text-center'>{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger'
    })
  };

  render () {
    const {
      currency,
      intl
    } = this.props
    const modalContent = this.state.modalContent

    const { CRYPTO_CURRENCY_LIST } = this.state

    return (
      <div className='create-exchange-local'>
        <FormExchangeCreateLocal onSubmit={this.handleSubmit}>
          <div className='d-flex mb-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.iWantTo' />
              </span>
            </label>
            <div className='input-group'>
              <Field
                name='type'
                // containerClass="radio-container-old"
                component={fieldRadioButton}
                type='tab'
                list={EXCHANGE_ACTION_LIST}
                // color={textColor}
                validate={[required]}
                onChange={this.onCurrencyChange}
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex mb-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.something' />
              </span>
            </label>
            <div className='input-group'>
              <Field
                name='physical_item'
                className='form-control-custom form-control-custom-ex w-100 input-no-border'
                component={fieldInput}
                placeholder={intl.formatMessage({
                  id: 'ex.createLocal.placeholder.anyItem'
                })}
                // onChange={this.onAmountChange}
                validate={[required]}
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex mb-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.coin' />
              </span>
            </label>
            <div className='input-group'>
              <Field
                name='currency'
                // containerClass="radio-container-old"
                component={fieldRadioButton}
                type='tab-4'
                list={CRYPTO_CURRENCY_LIST}
                // color={textColor}
                validate={[required]}
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.amount' />
              </span>
            </label>
            <div className='input-group'>
              <Field
                name='amount'
                className='form-control-custom form-control-custom-ex w-100 input-no-border'
                component={fieldInput}
                placeholder={MIN_AMOUNT[currency]}
                // onChange={this.onAmountChange}
                validate={[
                  required,
                  currency === CRYPTO_CURRENCY.BTC ? minValueBTC : minValueETH
                ]}
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex mt-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.phone' />
              </span>
            </label>
            <div className='input-group w-100'>
              <Field
                name='phone'
                className='form-control-custom form-control-custom-ex w-100 input-no-border'
                component={fieldPhoneInput}
                color={textColor}
                type='tel'
                placeholder='4995926433'
                // validate={[required, currency === 'BTC' ? minValue001 : minValue01]}
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex mt-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.address' />
              </span>
            </label>
            <div className='w-100'>
              <Field
                name='address'
                className='form-control-custom form-control-custom-ex w-100 input-no-border'
                component={fieldInput}
                validate={[required]}
                placeholder='81 E. Augusta Ave. Salinas'
              />
            </div>
          </div>

          <hr className='hrLine' />

          <div className='d-flex mb-2'>
            <label className='col-form-label mr-auto label-create'>
              <span className='align-middle'>
                <FormattedMessage id='ex.createLocal.label.uploadImage' />
              </span>
            </label>
            <div className='w-100'>
              <ImageUploader
                onSuccess={res => console.log('abcdde', res)}
                imgSample={null}
                multiple={false}
              />
            </div>
          </div>
          <Button block type='submit' className='mt-3'>
            <FormattedMessage id='btn.initiate' />
          </Button>
        </FormExchangeCreateLocal>
        <ModalDialog onRef={modal => (this.modalRef = modal)}>
          {modalContent}
        </ModalDialog>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const type = selectorFormExchangeCreateLocal(state, 'type');
  const currency = selectorFormExchangeCreateLocal(state, 'currency');

  const amount = selectorFormExchangeCreateLocal(state, 'amount');
  const phone = selectorFormExchangeCreateLocal(state, 'phone');
  const address = selectorFormExchangeCreateLocal(state, 'address');

  return {
    type,
    currency,
    amount,
    phone,
    address,
    ipInfo: state.app.ipInfo,
    authProfile: state.auth.profile
  }
}

const mapDispatchToProps = dispatch => ({
  showAlert: bindActionCreators(showAlert, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  authUpdate: bindActionCreators(authUpdate, dispatch),

  createOffer: bindActionCreators(createOffer, dispatch)
})
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(Component)
)
