import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { required } from '@/components/core/form/validation';
import { initHandshake } from '@/reducers/handshake/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { SIDE } from '@/components/handshakes/betting/constants.js';
import { validateBet } from '@/components/handshakes/betting/validation.js';
import { VALIDATE_CODE } from '@/components/handshakes/betting/constants.js';

import ModalDialog from '@/components/core/controls/ModalDialog';

import GA from '@/services/googleAnalytics';

// components
import Button from '@/components/core/controls/Button';
import { showAlert } from '@/reducers/app/action';
import {
  getChainIdDefaultWallet,
  isExistMatchBet, getAddress, parseBigNumber,
  formatAmount, getMessageWithCode,
} from '@/components/handshakes/betting/utils.js';
import { calculateBetDefault, calculateWinValues } from '@/components/handshakes/betting/calculation';
import EstimateGas from '@/modules/EstimateGas';
import { getGasPrice } from '@/utils/gasPrice';
import { updateTotalBets } from '@/pages/Prediction/action';


import { getKeyByValue } from '@/utils/object';

// self
import { InputField } from '../form/customField';
import './Create.scss';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();

const regex = /\[.*?\]/g;
const regexReplace = /\[|\]/g;

const TAG = 'BETTING_CREATE';

const item = {
  desc: '[{"key": "event_bet","suffix": "ETH","label": "Amount", "placeholder": "0.00", "type": "number", "className": "amount"}] [{"key": "event_odds", "label": "Odds", "placeholder": "2.0","prefix": "1 -", "className": "atOdds", "type": "number"}]',
};

class BettingCreate extends React.Component {
  static propTypes = {
    bettingShake: PropTypes.object,
    onClickSend: PropTypes.func,
    initHandshake: PropTypes.func.isRequired,
  }

  static defaultProps = {
    bettingShake: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      values: [],
      isChangeOdds: false,
      winValue: 0,
      disable: false,
      balance: 0,
    };
    this.onSubmit = ::this.onSubmit;
    this.renderInput = ::this.renderInput;
    this.renderForm = ::this.renderForm;
    this.renderNumber = ::this.renderNumber;


  }
  componentDidMount() {
    const { bettingShake } = this.props;

    // console.log(TAG, 'componentDidMount', 'bettingShake', bettingShake);
    this.updateDefaultValues(bettingShake);
  }

  componentWillReceiveProps(nextProps) {

    const { bettingShake } = nextProps;
    // console.log(TAG, 'componentWillReceiveProps', 'bettingShake', bettingShake);
    this.updateDefaultValues(bettingShake);
  }

  async onSubmit(e) {
    e.preventDefault();
    const {
      values,
    } = this.state;
    this.setState({
      disable: true,
    });

    const { bettingShake } = this.props;
    const {
      closingDate,
      matchName,
      matchOutcome,
      onCancelClick,
      onSubmitClick,
      handleBetFail,
      side,
    } = bettingShake;

    await getGasPrice();
    if (side === SIDE.SUPPORT) {
      GA.clickSimplePlaceSupportOrder(matchOutcome);
    } else {
      GA.clickSimplePlaceOpposeOrder(matchOutcome);
    }


    const amount = parseBigNumber(values.event_bet);
    const odds = parseBigNumber(values.event_odds);
    const fromAddress = getAddress();


    const validate = await validateBet(amount, odds, closingDate, matchName, matchOutcome);
    const { status, message, code, value, balance } = validate;
    this.setState({
      balance,
    });
    if (status) {
      this.initHandshake(values, fromAddress);
      onSubmitClick();
    } else {
      if (message) {
        GA.createBetNotSuccess(message);
        if (code === VALIDATE_CODE.NOT_ENOUGH_BALANCE) {
          onCancelClick();
          handleBetFail(value);
        } else {
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });
        }
      }
      this.setState({
        disable: false,
      });
    }
  }

  get inputList() {
    const { content } = this;
    return content ? content.match(regex) : [];
  }

  get content() {
    const { desc } = item;
    return desc || '';
  }

  changeText(key, text) {
    const { values } = this.state;
    values[key] = text;
    this.setState({ values });
    if (key === 'event_odds') {
      console.log('Change Odds');
      this.setState({
        isChangeOdds: true,
      });
    }

    const total = calculateWinValues(values.event_bet, values.event_odds);
    this.setState({
      winValue: formatAmount(total),
    });
  }

  updateDefaultValues = (bettingShake) => {
    const { values } = this.state;
    const { side, amountSupport, amountAgainst, marketSupportOdds, marketAgainstOdds, isOpen } = bettingShake;

    const defaultValue = calculateBetDefault(side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst);

    values.event_odds = defaultValue.marketOdds;
    values.event_bet = defaultValue.marketAmount;

    const { winValue } = defaultValue;

    this.setState({
      values,
      winValue,
      disable: !isOpen,
    });
  }


  renderInput(item, index, style = {}) {
    const {
      key, placeholder, type, className,
    } = item;
    const { values } = this.state;
    // const className = 'amount';
    console.log('Item:', item);
    return (
      <input
        ref={key}
        component={InputField}
        type="text"
        placeholder={placeholder}
        className={cn('form-control-custom input', className || '')}
        name={key}
        autoComplete="off"
        value={values[key]}
        validate={[required]}
        onChange={(evt) => {
          this.changeText(key, evt.target.value);
        }}
      />
    );
  }

  renderNumber(item, style = {}) {
    const { key, placeholder } = item;
    const { values } = this.state;
    return (
      <input
        ref={key}
        id={key}
        className="form-control-custom input"
        name={key}
        style={style}
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={values[key] || ''}
        validate={[required]}
        onChange={(evt) => {
          this.changeText(key, evt.target.value);
        }}
        onClick={(event) => { event.target.setSelectionRange(0, event.target.value.length); }}
      />
    );
  }


  renderLabelForItem=(text, { marginLeft, marginRight }) => text && (<label
    className="itemLabel"
    style={{
    display: 'flex', color: 'white', fontSize: 16, marginLeft, marginRight, alignItems: 'center',
    }}>{text}
  </label>)

  renderItem(field, index) {
    const item = JSON.parse(field.replace(regexReplace, ''));
    const {
      key, placeholder, type, label, className, prefix,
    } = item;
    let itemRender = null;// this.renderInput(item, index);
    const { isChangeOdds } = this.state;
    let suffix = item.suffix;
    if (item.key === 'event_odds') {
      suffix = isChangeOdds ? 'Your Odds' : 'Market Odds';
    }

    switch (type) {
      // case 'date':
      //   itemRender = this.renderDate(item, index);
      //   break;
      case 'number':
        itemRender = this.renderNumber(item);
        break;
      default:
        itemRender = this.renderNumber(item, index);
    }
    const classNameSuffix = `cryptoCurrency${item.className} ${(isChangeOdds && item.key === 'event_odds') ? 'cryptoCurrencyYourOdds' : ''}`;
    return (
      <div className="rowWrapper" key={index + 1} >
        <label>{label || placeholder}</label>
        {itemRender}
        {suffix && <div className={classNameSuffix}>{suffix}</div>}
      </div>
    );
  }

  // Service
  initHandshake(fields, fromAddress) {
    const { side, outcomeId, matchName, matchOutcome } = this.props.bettingShake;

    const extraData = {
      event_name: matchName,
      event_predict: matchOutcome,
    };
    const params = {
      type: HANDSHAKE_ID.BETTING,
      outcome_id: outcomeId,
      odds: `${fields.event_odds}`,
      amount: `${fields.event_bet}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side,
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };


    this.props.initHandshake({
      PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE,
      METHOD: 'POST',
      data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
    });


  }
  initHandshakeSuccess = async (successData) => {
    console.log('initHandshakeSuccess', successData);

    const { status, data } = successData;
    const { handshakes, total_bets:totalBets } = data;
    const { bettingShake } = this.props;
    const { matchName, matchOutcome, side } = bettingShake;
    const { balance } = this.state;
    if (status && data) {
      console.log('PROPS', this.props);
      this.props.dispatch(updateTotalBets(totalBets));
      const isExist = isExistMatchBet(handshakes);
      let message = MESSAGE.CREATE_BET_NOT_MATCH;
      if (isExist) {
        message = MESSAGE.CREATE_BET_MATCHED;
      }
      betHandshakeHandler.controlShake(handshakes, balance);

      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
      // send ga event
      GA.createBetSuccess(matchName, matchOutcome, side);

    }
  }
  initHandshakeFailed = (error) => {
    console.log('initHandshakeFailed', error);
    const { status, code } = error;
    if (status === 0) {
      const message = getMessageWithCode(code);

      GA.createBetFailed(message);

    }
  }

  renderForm() {
    const { inputList } = this;
    const { theme } = this.props;
    const { disable } = this.state;
    const { side } = this.props.bettingShake;
    const buttonClass = theme;
    // const sideText = getKeyByValue(SIDE, side);
    // const buttonText = disable ? 'Loading...' : `Place ${sideText} order`;
    const buttonText = disable ? 'Loading...' : `Bet now`;
    return (
      <form className="wrapperBetting" onSubmit={this.onSubmit}>
        <div className="formInput">
          {inputList.map((field, index) => this.renderItem(field, index))}
          <div className="rowWrapper">
            <span className="amountLabel">Amount you could win</span>
            <span className="amountValue">{this.state.winValue}</span>
          </div>
        </div>
        <Button type="submit" isLoading={disable} disabled={disable} block className={buttonClass}>{buttonText}</Button>
        <EstimateGas />
      </form>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }
}
const mapState = state => ({
});
const mapDispatch = ({
  initHandshake,
  showAlert,

});

export default connect(mapState, mapDispatch)(BettingCreate);
