import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { connect } from 'react-redux';

// service, constant

import { shakeItem, initFreeHandshake } from '@/reducers/handshake/action';
import { HANDSHAKE_ID, API_URL, APP } from '@/constants';
import { getGasPrice } from '@/utils/gasPrice';

// components
import Button from '@/components/core/controls/Button';
import EstimateGas from '@/modules/EstimateGas';

import { showAlert } from '@/reducers/app/action';
import {
  getMessageWithCode, getChainIdDefaultWallet,
  getEstimateGas, getAddress, parseBigNumber,
  formatOdds, formatAmount,
} from '@/components/handshakes/betting/utils';
import { validateBet } from '@/components/handshakes/betting/validation.js';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { calculateBetDefault, calculateWinValues } from '@/components/handshakes/betting/calculation';
import { getKeyByValue } from '@/utils/object';

import { SIDE } from '@/components/handshakes/betting/constants.js';
import GA from '@/services/googleAnalytics';
import { updateSide } from './../OrderPlace/action';

import './ShakeFree.scss';
import Toggle from './../Toggle';

const TAG = 'SHAKE_FREE';
class BetingShakeFree extends React.Component {
  static propTypes = {
    outcomeId: PropTypes.number,
    outcomeHid: PropTypes.number,
    matchName: PropTypes.string,
    matchOutcome: PropTypes.string,
    marketSupportOdds: PropTypes.number,
    marketAgainstOdds: PropTypes.number,
    amount: PropTypes.number,
    closingDate: PropTypes.any,
    reportTime: PropTypes.any,
    onSubmitClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSubmitClick: undefined,
    onCancelClick: undefined,
  };


  constructor(props) {
    super(props);

    this.state = {
      buttonClass: 'btnOK btnBlue',
      isShowOdds: true,
      extraData: {},
      isChangeOdds: false,
      marketOdds: 0,
      oddValue: 0,
      amountValue: 0,
      winValue: 0,
      disable: false,
      side: SIDE.SUPPORT,
    };


    this.onSubmit = ::this.onSubmit;
    this.renderInputField = ::this.renderInputField;
    this.renderForm = ::this.renderForm;
    this.onToggleChange = ::this.onToggleChange;
  }
  componentDidMount() {
    this.updateDefautValues();
  }
  async componentWillReceiveProps(nextProps) {

    this.updateDefautValues();

    const estimateGas = await getEstimateGas();
    this.setState({
      estimateGas,
    });
  }

  async onSubmit(e) {
    e.preventDefault();

    const { oddValue, amountValue } = this.state;

    const { matchName, matchOutcome, closingDate, onSubmitClick } = this.props;

    this.setState({
      disable: true,
    });

    const amountBN = parseBigNumber(amountValue);
    const odds = parseBigNumber(oddValue);
    // send event tracking
    const side = this.toggleRef.value;
    // try {
    //   GA.clickGoButton(matchName, matchOutcome, side);
    // } catch (err) { }
    await getGasPrice();

    if (side === SIDE.SUPPORT) {
      GA.clickFreePlaceSupportOrder(matchOutcome);
    } else {
      GA.clickFreePlaceOpposeOrder(matchOutcome);
    }

    const validate = await validateBet(amountBN, odds, closingDate, matchName, matchOutcome, true);
    const { status, message } = validate;
    if (status) {
      this.initHandshake(amountBN, odds);
      onSubmitClick();
    } else if (message) {
      GA.createBetNotSuccess(message);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
      this.setState({
        disable: false,
      });
    }
  }

  onToggleChange(id) {
    const { marketAgainstOdds, marketSupportOdds, matchOutcome } = this.props;
    const side = this.toggleRef.value;
    const marketOdds = side === SIDE.SUPPORT ? marketSupportOdds : marketAgainstOdds;
    const tabSide = getKeyByValue(SIDE, side);

    this.props.dispatch(updateSide(tabSide.toLowerCase()));

    this.setState({
      oddValue: formatOdds(marketOdds),
      side: id,
      buttonClass: `btnOK ${id === 1 ? 'btnBlue' : 'btnRed'}`,
    }, () => this.updateTotal());

    // Event tracking
    //GA.clickChooseASide(id);
    if (side === SIDE.SUPPORT) {
      GA.clickSupport(matchOutcome);
    } else {
      GA.clickOppose(matchOutcome);
    }

  }

  updateDefautValues() {
    const { marketSupportOdds, marketAgainstOdds, amount } = this.props;
    console.log(TAG, 'updateDefautValues', 'Props:', this.props);
    const side = this.toggleRef.value;
    const defaultValue = calculateBetDefault(side, marketSupportOdds, marketAgainstOdds, amount, amount);
    console.log(TAG, 'updateDefautValues','defaultValue:', defaultValue);
    this.setState({
      oddValue: defaultValue.marketOdds,
      amountValue: amount,
      winValue: defaultValue.winValue,
    });
  }

  updateTotal() {
    const { oddValue, amountValue } = this.state;
    const total = calculateWinValues(amountValue, oddValue);
    this.setState({
      winValue: formatAmount(total),
    });
  }

  initHandshake(amount, odds) {
    const { outcomeId, matchName, matchOutcome } = this.props;
    const { extraData } = this.state;
    const side = this.toggleRef.value;
    const fromAddress = getAddress();
    extraData.event_name = matchName;
    extraData.event_predict = matchOutcome;
    extraData.event_odds = odds;
    extraData.event_bet = amount;
    const params = {

      type: HANDSHAKE_ID.BETTING,

      outcome_id: outcomeId,
      odds: `${odds}`,
      extra_data: JSON.stringify(extraData),
      currency: 'ETH',
      side,
      from_address: fromAddress,
      chain_id: getChainIdDefaultWallet(),
    };
    console.log('Params:', params);


    this.props.initFreeHandshake({
      PATH_URL: API_URL.CRYPTOSIGN.INIT_HANDSHAKE_FREE,
      METHOD: 'POST',
      data: params,
      successFn: this.initHandshakeSuccess,
      errorFn: this.initHandshakeFailed,
    });
  }

  initHandshakeSuccess = async (successData) => {
    console.log('initHandshakeSuccess', successData);
    const { status, data } = successData;

    if (status && data) {
      const { outcomeHid } = this.props;
      const { match } = data;
      const isExist = match;
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
      //this.props.onCreateBetSuccess();
      // send ga event
      try {
        const { matchName, matchOutcome } = this.props;
        const side = this.toggleRef.value;
        GA.createBetSuccess(matchName, matchOutcome, side);
      } catch (err) { }
    }
  }

  initHandshakeFailed = (errorData) => {
    console.log('initHandshakeFailed', errorData);
    const { status, code } = errorData;
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
  }

  renderInputField(props) {
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
    //console.log('Label Default Value:', label, defaultValue);
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
              value={id === 'odds' ? oddValue : amountValue}
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

  renderForm() {
    const {
      total, isShowOdds, marketOdds, isChangeOdds, buttonClass, disable, estimateGas,
    } = this.state;
    const { amount } = this.props;
    const { winValue } = this.state;
    console.log('Win Value:', winValue);

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

    // const sideText = getKeyByValue(SIDE, this.state.side);
    // const buttonText = disable ? 'Loading...' : `Place ${sideText} order`;
    const buttonText = disable ? 'Loading...' : `Bet now`;

    return (
      <form className="wrapperBettingShakeFree" onSubmit={this.onSubmit}>
        {/* <p className="titleForm text-center">BET FREE ON THE OUTCOME</p> */}
        {<Toggle ref={(component) => { this.toggleRef = component; }} onChange={this.onToggleChange} />}
        {/* this.renderInputField(amountField) */}
        <div className="freeAmount">You have {amount} ETH FREE to bet!</div>
        {isShowOdds && this.renderInputField(oddsField)}
        <div className="rowWrapper">
          <div>Possible winnings</div>
          <div className="possibleWinningsValue">{winValue}</div>
        </div>
        {/*<div className="rowWrapper">
          <div className="possibleWinningsValue">{estimateGas}</div>
    </div>*/}
        <Button type="submit" isLoading={disable} disabled={disable} block className={buttonClass}>
          {buttonText}
        </Button>
        <EstimateGas />
      </form>
    );
  }


  render() {
    return this.renderForm();
  }
}

const mapDispatch = ({
  initFreeHandshake,
  shakeItem,
  showAlert,
});

export default connect(null, mapDispatch)(BetingShakeFree);

