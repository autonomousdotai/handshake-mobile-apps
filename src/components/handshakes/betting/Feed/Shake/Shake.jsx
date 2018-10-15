import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant
import { shakeItem, initHandshake } from '@/reducers/handshake/action';
import { HANDSHAKE_ID, API_URL } from '@/constants';
import GA from '@/services/googleAnalytics';
import { SIDE } from '@/components/handshakes/betting/constants.js';
import { getGasPrice } from '@/utils/gasPrice';
import { VALIDATE_CODE } from '@/components/handshakes/betting/constants.js';

// components
import { showAlert } from '@/reducers/app/action';
import {
  getMessageWithCode, getChainIdDefaultWallet,
  getEstimateGas, getAddress, isExistMatchBet, parseBigNumber, formatAmount
} from '@/components/handshakes/betting/utils.js';
import { validateBet } from '@/components/handshakes/betting/validation.js';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { calculateBetDefault, calculateWinValues } from '@/components/handshakes/betting/calculation';
import { updateTotalBets } from '@/pages/Prediction/action';


import './Shake.scss';


const betHandshakeHandler = BetHandshakeHandler.getShareManager();

const TAG = 'BETTING_SHAKE';
class BetingShake extends React.Component {
  static propTypes = {
    side: PropTypes.number.isRequired,
    outcomeId: PropTypes.number.isRequired,
    outcomeHid: PropTypes.number.isRequired,
    matchName: PropTypes.string.isRequired,
    matchOutcome: PropTypes.string.isRequired,
    marketSupportOdds: PropTypes.number.isRequired,
    marketAgainstOdds: PropTypes.number.isRequired,
    amountSupport: PropTypes.number.isRequired,
    amountAgainst: PropTypes.number.isRequired,
    closingDate: PropTypes.any.isRequired,
    reportTime: PropTypes.any.isRequired,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSubmitClick: undefined,
    onCancelClick: undefined,
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowOdds: true,
      extraData: {},
      isChangeOdds: false,
      marketOdds: 0,
      oddValue: 0,
      amountValue: 0,
      winValue: 0,
      balance: 0,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentWillMount() {

  }
  componentDidMount() {
    this.props.onClickSubmit(this.onSubmit);
    this.updateDefautValues(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDefautValues(nextProps);
  }

  onSubmit = async (e) => {
    console.log("Submit");

    const { oddValue, amountValue } = this.state;

    const { matchName, matchOutcome, side, closingDate, onSubmitClick,onCancelClick, handleBetFail} = this.props;

    const amount = parseBigNumber(amountValue);
    const odds = parseBigNumber(oddValue);

    console.log(TAG, "Amount, Side, Odds", amount ?.toNumber(), side, odds ?.toNumber());


    // send event tracking
    // try {
    //   GA.clickGoButton(matchName, matchOutcome, side);
    // } catch (err) { }

    await getGasPrice();


    if (side === SIDE.SUPPORT) {
      GA.clickAdvancePlaceSupportOrder(matchOutcome);
    } else {
      GA.clickAdvancePlaceOpposeOrder(matchOutcome);
    }

    const validate = await validateBet(amount, odds, closingDate, matchName, matchOutcome);
    const { status, message, code, value, balance } = validate;
    this.setState({
      balance,
    });

    if (status) {
      this.initHandshake(amount, odds);
      onSubmitClick();

    } else {
      if (message) {
        GA.createBetNotSuccess(message);
        if (code === VALIDATE_CODE.NOT_ENOUGH_BALANCE) {
          onCancelClick();
          handleBetFail(value);

        }else {
          this.props.showAlert({
            message: <div className="text-center">{message}</div>,
            timeOut: 3000,
            type: 'danger',
            callBack: () => {
            }
          });

        }


      }
    }

  }


  updateTotal = () => {
    const { oddValue, amountValue } = this.state;
    const total = calculateWinValues(amountValue, oddValue);
    this.setState({
      winValue: formatAmount(total),
    });
  }

  updateDefautValues = (props) => {
    const { side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst } = props;
    const defaultValue = calculateBetDefault(side, marketSupportOdds, marketAgainstOdds, amountSupport, amountAgainst);

    this.setState({
      oddValue: defaultValue.marketOdds,
      amountValue: defaultValue.marketAmount,
      winValue: defaultValue.winValue,
    });
  }

  initHandshake = (amount, odds) => {
    const { outcomeId, matchName, matchOutcome, side } = this.props;
    const { extraData } = this.state;
    const fromAddress = getAddress();
    extraData.event_name = matchName;
    extraData.event_predict = matchOutcome;
    const params = {
      type: HANDSHAKE_ID.BETTING,
      outcome_id: outcomeId,
      odds: `${odds}`,
      amount: `${amount}`,
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
      errorFn: this.initHandshakeFailed,
    });
  }

  initHandshakeSuccess = async (successData) => {
    console.log(TAG, 'initHandshakeSuccess', successData);
    const { status, data } = successData;
    const { balance } = this.state;

    const { handshakes, total_bets: totalBets } = data;

    if (status && data) {
      this.props.dispatch(updateTotalBets(totalBets));
      betHandshakeHandler.controlShake(handshakes, balance);
      const isExist = isExistMatchBet(handshakes);
      let message = MESSAGE.CREATE_BET_NOT_MATCH;
      if (isExist) {
        message = MESSAGE.CREATE_BET_MATCHED;
      }
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
      // send ga event
      try {
        const { matchName, matchOutcome, side } = this.props;
        GA.createBetSuccess(matchName, matchOutcome, side);
      } catch (err) { }
    }
  }

  initHandshakeFailed = (error) => {
    console.log(TAG, 'initHandshakeFailed', error);

    const { status, code } = error;
    if (status === 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
      GA.createBetFailed(message);
    }
    this.props.onSubmitClick();
  }

  renderForm = () => {
    const { isShowOdds, marketOdds, isChangeOdds, disable, estimateGas } = this.state;
    //console.log('Sa Test disable', disable);

    const amountField = {
      id: 'amount',
      name: 'amount',
      label: 'Amount',
      className: 'amount',
      placeholder: '0.00',
      type: 'text',
    };
    const oddsField = {
      id: 'odds',
      name: 'odds',
      label: 'Odds',
      className: `odds${isChangeOdds ? ' yourOdds' : ''}`,
      placeholder: '2.0',
      value: 3.0,
      defaultValue: marketOdds,
      infoText: isChangeOdds ? 'Your Odds' : 'Market Odds',
      isShowInfoText: true,
      type: 'text',
    };

    return (
      <form className="wrapperBetting">
        {this.renderInputField(amountField)}
        {isShowOdds && this.renderInputField(oddsField)}
        <div className="rowWrapper">
          <div>Possible winnings</div>
          <div className="possibleWinningsValue">{this.state.winValue}</div>
        </div>
      </form>
    );
  }

  renderInputField = (props) => {
    const {
      label,
      className,
      id,
      infoText = 'ETH',
      isShowInfoText = true,
      type = 'text',
      value,
      defaultValue,
      isInput = true,
      ...newProps
    } = props;
    const { oddValue, amountValue } = this.state;
    return (
      <div className="rowWrapper">
        <label className="label" htmlFor={id}>{label}</label>
        {
          isInput ? (
            <input
              ref={id}
              className={cn('form-control-custom input value', className || '')}
              id={id}
              type={type}
              value={id === "odds" ? oddValue : amountValue}
              autoComplete="off"
              {...newProps}
              onChange={(evt) => {
                if (id === 'odds') {
                  console.log('Change Odds');
                  this.setState({
                    oddValue: evt.target.value,
                    isChangeOdds: true,
                  }, () => this.updateTotal());
                } else {
                  this.setState({
                    amountValue: evt.target.value,
                  }, () => this.updateTotal());
                }
              }}
              onClick={(event) => { event.target.setSelectionRange(0, event.target.value.length); }}
            />
          ) : (<div className={cn('value', className)}>{value}</div>)
        }
        {
          isShowInfoText && <div className="cryptoCurrency">{infoText}</div>
        }
      </div>
    );
  }

  render() {
    return this.renderForm();
  }
}
const mapState = state => ({
});
const mapDispatch = ({
  initHandshake,
  shakeItem,
  showAlert,
});
export default connect(mapState, mapDispatch)(BetingShake);
