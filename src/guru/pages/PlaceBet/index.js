import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import qs from 'querystring';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getAddress, getChainIdDefaultWallet } from '@/utils/helpers';
import { formatAmount } from '@/utils/number';
import { possibleWinning } from '@/utils/calculate';

// TODO: [Begin: Will be moving to another place]
import { HANDSHAKE_ID } from '@/constants';
import { showAlert } from '@/reducers/app/action';
import OuttaMoney from '@/assets/images/modal/outtamoney.png';
import ModalDialog from '@/components/core/controls/ModalDialog';
// TODO: [End: Will be moving to another place]

import { getMatchDetail, getGasPrice, getMatchOdd, initHandShake } from './action';
import { queryStringSelector, matchDetailSelector, gasPriceSelector, matchOddsSelector } from './selector';
import { VALIDATE_CODE } from './constants';
import { validationBet } from './validation';
import View from './View';

import './styles.scss';

class PlaceBet extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    queryStringURL: PropTypes.string,
    matchDetail: PropTypes.object,
    gasPrice: PropTypes.number,
    sideOdds: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    queryStringURL: undefined,
    matchDetail: {},
    gasPrice: 0,
    sideOdds: ['support', 'against']
  };

  state = {
    betAmount: 0
  };

  componentDidMount() {
    const { props, getParams } = this;
    const { dispatch } = props;
    dispatch(getMatchDetail({ eventId: getParams(props).event_id }));
    dispatch(getMatchOdd({ outcomeId: getParams(props).outcome_id }));
    dispatch(getGasPrice());
  }

  getParams = ({ queryStringURL }) => (qs.parse(queryStringURL.slice(1)))

  getSide = (props) => (parseInt(this.getParams(props).side, 10));

  getOdds = () => {
    const { props, getSide } = this;
    const { matchOdds, sideOdds } = props;
    return (matchOdds && matchOdds[sideOdds[`${getSide(props) - 1}`]][0].odds) || 0;
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
      from_address: getAddress(),
      side: getSide({ queryStringURL }),
      chain_id: getChainIdDefaultWallet()
    };
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
    possibleWinning: `${this.calculatePosWinning()}`,
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
          history={props.history}
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
      matchDetail: matchDetailSelector(state),
      queryStringURL: queryStringSelector(state),
      gasPrice: gasPriceSelector(state),
      matchOdds: matchOddsSelector(state)
    };
  }
)(PlaceBet));
