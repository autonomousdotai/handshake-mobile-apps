import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import qs from 'querystring';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { isEmpty } from '@/utils/is';
import { formatAmount } from '@/utils/number';
import { possibleWinning } from '@/utils/calculate';
import { getAddress, getChainIdDefaultWallet } from '@/utils/helpers';
import IconCoin from '@/assets/images/icon/icon-coin.svg';

// TODO: [Begin: Will be moving to another place]
import { URL, HANDSHAKE_ID } from '@/constants';
import { showAlert } from '@/reducers/app/action';
import OuttaMoney from '@/assets/images/modal/outtamoney.png';
import ModalDialog from '@/components/core/controls/ModalDialog';
import { MESSAGE } from '@/components/handshakes/betting/message';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
// TODO: [End: Will be moving to another place]

import { getMatchDetail, getGasPrice, getMatchOdd, initHandShake } from './action';
import {
  queryStringSelector,
  matchDetailSelector,
  gasPriceSelector,
  matchOddsSelector,
  handShakesSelector
} from './selector';
import { VALIDATE_CODE } from './constants';
import { validationBet, isExistMatchBet } from './validation';
import View from './View';

import './styles.scss';

class PlaceBet extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    queryStringURL: PropTypes.string,
    eventList: PropTypes.array,
    matchDetail: PropTypes.object,
    sideOdds: PropTypes.arrayOf(PropTypes.string),
    handShakes: PropTypes.object
  };

  static defaultProps = {
    eventList: [],
    queryStringURL: undefined,
    matchDetail: {},
    sideOdds: ['support', 'against'],
    handShakes: undefined
  };

  state = {
    betAmount: 0
  };

  componentWillMount() {
    this.redirectIndex();
  }

  componentDidMount() {
    const { props, getParams } = this;
    const { dispatch } = props;
    dispatch(getMatchDetail({ eventId: getParams(props).event_id }));
    dispatch(getMatchOdd({ outcomeId: getParams(props).outcome_id }));
    dispatch(getGasPrice());
  }

  componentDidUpdate(prevProps) {
    const { handShakes } = this.props;
    if (handShakes && prevProps.handShakes !== handShakes) {
      this.handShakeHandler(handShakes);
    }
  }

  getParams = ({ queryStringURL }) => (qs.parse(queryStringURL.slice(1)))

  getSide = (props) => (parseInt(this.getParams(props).side, 10));

  getOdds = () => {
    const { props, getSide } = this;
    const { matchOdds } = props;
    return (
      matchOdds && matchOdds[this.props.sideOdds[`${getSide(props) - 1}`]][0].odds
    ) || 0;
  }

  redirectIndex = () => {
    const { eventList } = this.props;
    if (isEmpty(eventList)) {
      const redirectURL = `${URL.HANDSHAKE_PREDICTION}`;
      this.props.history.push(redirectURL);
    }
  }

  validate = async ({ amount }) => {
    const validate = await validationBet({ amount });
    return validate;
  }

  alertBox = ({ message, type, timeOut = 3000, callBack = () => {} }) => {
    const { dispatch } = this.props;
    const alertProps = {
      timeOut,
      type,
      callBack,
      message: <div className="text-center">{message}</div>
    };
    dispatch(showAlert(alertProps));
  }

  handShakeData = ({ amount }) => {
    const { getSide } = this;
    const { matchDetail, queryStringURL } = this.props;
    if (!matchDetail) return null;
    return {
      amount,
      currency: 'ETH',
      type: HANDSHAKE_ID.BETTING,
      match_id: matchDetail.id,
      from_address: getAddress(),
      side: getSide({ queryStringURL }),
      chain_id: getChainIdDefaultWallet()
    };
  }

  handShakeSuccess = (data) => {
    const { handshakes } = data;
    if (!handshakes) return null;
    const message = isExistMatchBet(handshakes) ?
      MESSAGE.CREATE_BET_MATCH : MESSAGE.CREATE_BET_NOT_MATCH;
    return this.alertBox({ message, type: 'success' });
  }

  handShakeHandler = (data) => {
    this.handShakeSuccess(data);
    const handler = BetHandshakeHandler.getShareManager();
    const { handshakes } = data;
    handler.controlShake(handshakes);
  }

  handleBet = async ({ values }) => {
    const { validate, alertBox, modalOuttaMoney, handShakeData, props } = this;
    const { status, message, code } = await validate(values);
    if (status) {
      return props.dispatch(initHandShake(handShakeData(values)));
    }
    if (message && code === VALIDATE_CODE.NOT_ENOUGH_BALANCE) {
      return modalOuttaMoney.open();
    }
    return alertBox({ message, type: 'danger' });
  }

  handleChange = (value) => {
    this.setState({ betAmount: value });
  }

  calculatePosWinning = () => {
    const { state, getOdds } = this;
    const { betAmount } = state;
    const betOdds = getOdds();
    return formatAmount(possibleWinning(betAmount, betOdds));
  }

  betFormProps = (props) => {
    const { handleBet, handleChange, getSide } = this;
    return {
      handleBet,
      handleChange,
      amount: '',
      side: getSide(props),
      buttonClasses: classNames('btn btn-block', {
        'btn-primary': getSide(props) === 1,
        'btn-secondary': getSide(props) === 2
      })
    };
  }

  betParamsProps = ({ matchDetail, gasPrice }) => ({
    iconCoin: IconCoin,
    possibleWinning: `${this.calculatePosWinning()} ETH`,
    gasPrice: `${formatAmount(gasPrice)} ETH`,
    marketFee: `${matchDetail.market_fee}%`,
    className: classNames('BetParamsComponent')
    
  });

  renderOuttaMoney = () => {
    return (
      <ModalDialog onRef={(modal) => { this.modalOuttaMoney = modal; }} className="outtaMoneyModal" close>
        <div className="outtaMoneyContainer">
          <img src={OuttaMoney} alt="" />
          <div className="outtaMoneyTitle">{'You\'re outta… money!'}</div>
          <div className="outtaMoneyMsg">
            To keep forecasting, you’ll need to top-up your wallet.
          </div>
        </div>
      </ModalDialog>
    );
  };

  renderComponent = (props) => {
    return (
      <div className="PlaceBetContainer">
        <View
          history={this.props.history}
          betFormProps={this.betFormProps(props)}
          betParamsProps={this.betParamsProps(props)}
        />
        {this.renderOuttaMoney()}
      </div>
    );
  }

  render() {
    return this.renderComponent(this.props);
  }
}

export default injectIntl(connect(
  (state) => {
    return {
      eventList: state.prediction.events,
      matchDetail: matchDetailSelector(state),
      queryStringURL: queryStringSelector(state),
      gasPrice: gasPriceSelector(state),
      matchOdds: matchOddsSelector(state),
      handShakes: handShakesSelector(state)
    };
  }
)(PlaceBet));
