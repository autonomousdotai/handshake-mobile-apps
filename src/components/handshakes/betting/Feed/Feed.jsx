import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ProgressBar } from 'react-bootstrap';

// services, constants
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { BET_BLOCKCHAIN_STATUS, ROLE } from '@/components/handshakes/betting/constants.js';
import GA from '@/services/googleAnalytics';

import { API_URL } from '@/constants';
import { uninitItem, collect, collectFree, uninitItemFree, refundFree, refund, dispute } from '@/reducers/handshake/action';
import { loadMyHandshakeList, updateBettingChange } from '@/reducers/me/action';
import { MESSAGE, BETTING_STATUS_LABEL } from '@/components/handshakes/betting/message.js';
import { getStatusLabel } from '@/components/handshakes/betting/StatusAction.js';
import {
  getMessageWithCode, getId,
  getBalance, getEstimateGas, foundShakeList, parseBigNumber,
  formatAmount, findUserBet, parseJsonString
} from '@/components/handshakes/betting/utils.js';

// components
import Button from '@/components/core/controls/Button';
import Feed from '@/components/core/presentation/Feed';
import { showAlert } from '@/reducers/app/action';


import { isSameAddress, isRightNetwork } from '@/components/handshakes/betting/validation.js';

// css, icons
import './Feed.scss';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();

const TAG = "FEED_BETTING";

class FeedBetting extends React.Component {

  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
    super(props);

    this.state = {
      actionTitle: null,
      statusTitle: null,
      isLoading: false,
      isAction: false,
      itemInfo: props,
      shakedItemList: [],
      matchDone: false,
      estimatedGas: 0,
      eventName:'',
      predictName:'',
    };
  }


  async componentDidMount() {
    const estimatedGas = await getEstimateGas();
    this.setState({
      estimatedGas,
    });
    this.handleStatus(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.handleStatus(nextProps);
    }
  }

  getButtonClassName(actionTitle) {
    let buttonClassName = 'cancel';
    switch (actionTitle) {
      case BETTING_STATUS_LABEL.CANCEL:
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        buttonClassName = 'withdraw';

        break;
      case BETTING_STATUS_LABEL.REFUND:
        buttonClassName = 'refund';
        break;

      case BETTING_STATUS_LABEL.DISPUTE:
        buttonClassName = 'dispute';
        break;

      default:
        break;
    }
    return buttonClassName;
  }

  formatEventName(eventName) {
    let name = eventName || '';
    if (eventName.indexOf('Event') === -1) {
      name = `Event: ${name}`;
    }
    return name;
  }

  formatPredictName(eventPredict) {
    let predictName = eventPredict || '';
    if (predictName.indexOf('Outcome') !== -1) {
      predictName = eventPredict.slice(8);
    }
    return predictName;
  }


  handleStatus(props) {

    const itemInfo = findUserBet(props);
    const { status } = itemInfo;

    const statusResult = getStatusLabel(itemInfo);
    const { title, isAction } = statusResult;
    const matchDone = status === BET_BLOCKCHAIN_STATUS.STATUS_DONE;

    const {extraData} = props;
    const { event_name, event_predict } = parseJsonString(extraData);
    const eventName = event_name && this.formatEventName(event_name);
    const predictName = event_predict && this.formatPredictName(event_predict);

    this.setState({
      actionTitle: title,
      statusTitle: statusResult.status,
      isAction,
      itemInfo,
      shakedItemList: foundShakeList(props),
      matchDone,
      eventName,
      predictName
    });
  }

  async clickActionButton(title) {
    this.setState({
      isLoading: true,
    });
    const balance = await getBalance();

    let message = null;
    const {
      hid,
    } = this.props; // new state

    const { itemInfo, estimatedGas } = this.state;
    const { id, freeBet, fromAddress } = itemInfo;

    console.log(TAG, 'clickActionButton',
      ' idCryptosign:', id,
      ' isFreeBet:', freeBet,
      ' fromAddress: ', fromAddress,
    );

    if (!isRightNetwork()) {
      message = MESSAGE.RIGHT_NETWORK;
    } else if (!isSameAddress(fromAddress)) {
      message = MESSAGE.DIFFERENCE_ADDRESS;
    } else if (freeBet && title !== BETTING_STATUS_LABEL.DISPUTE) {
      this.handleActionFree(title, id, hid);
    } else if (estimatedGas > balance) {
      message = MESSAGE.NOT_ENOUGH_GAS;
    } else {
      this.handleActionReal(title, id, hid);
    }
    if (message) {
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }

  handleActionFree(title, offchain, hid) {
    const realId = getId(offchain);
    switch (title) {
      case BETTING_STATUS_LABEL.CANCEL:
        this.uninitItemFree(realId);
        break;
      case BETTING_STATUS_LABEL.WITHDRAW:
        this.collectFree(offchain);
        break;
      case BETTING_STATUS_LABEL.REFUND:
        this.refundFree(offchain);
        break;
      case BETTING_STATUS_LABEL.DISPUTE:
        this.disputeOnChain(offchain, hid);
        break;
      default:
        break;
    }
  }
  async handleActionReal(title, offchain, hid) {

    switch (title) {
      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        this.cancelOnChain(offchain, hid);

        break;

      case BETTING_STATUS_LABEL.WITHDRAW:

        this.withdrawOnChain(offchain, hid);
        break;
      case BETTING_STATUS_LABEL.REFUND:
        this.refundOnChain(offchain, hid);
        break;
      case BETTING_STATUS_LABEL.DISPUTE:
        this.disputeOnChain(offchain, hid);
        break;
      default:
        break;
    }
  }


  async cancelOnChain(offchain, hid) {
    const { itemInfo, eventName, predictName } = this.state;
    const { side, amount, odds } = itemInfo;
    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
    betHandshakeHandler.setItemOnChain(offchain, updateInfo);
    this.props.updateBettingChange(updateInfo);

    betHandshakeHandler.cancelBet(hid, side, amount, odds, offchain, eventName, predictName);
    this.uninitItemReal(offchain);
  }
  async withdrawOnChain(offchain, hid) {
    const { itemInfo, eventName, predictName } = this.state;
    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
    betHandshakeHandler.setItemOnChain(offchain, updateInfo);
    this.props.updateBettingChange(updateInfo);

    betHandshakeHandler.withdraw(hid, offchain, eventName, predictName);
    this.collectReal(offchain);
  }
  async refundOnChain(offchain, hid) {
    const { itemInfo, eventName, predictName } = this.state;
    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING;
    betHandshakeHandler.setItemOnChain(offchain, updateInfo);
    this.props.updateBettingChange(updateInfo);

    betHandshakeHandler.refund(hid, offchain, eventName, predictName);
    this.refundReal(offchain);

    /*
    const { hash } = result;
    if (hash) {
      this.refundReal(offchain);
    } else {
      this.props.updateBettingChange(oldInfo);
    }
    */
  }
  async disputeOnChain(offchain, hid) {
    const { itemInfo } = this.state;
    const oldInfo = Object.assign({}, itemInfo);
    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_PENDING;
    betHandshakeHandler.setItemOnChain(offchain, updateInfo);
    this.props.updateBettingChange(updateInfo);

    const result = await betHandshakeHandler.dispute(hid, offchain);
    const { hash } = result;
    if (hash) {
      this.disputeReal(offchain);
    } else {
      this.props.updateBettingChange(oldInfo);
    }
  }

  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  /*** API FREE BET ***/
  async uninitItemFree(id) {
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE_FREE.concat(`/${id}`);
    const { itemInfo, predictName } = this.state;

    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
    betHandshakeHandler.setItemOnChain(id, updateInfo);
    this.props.updateBettingChange(updateInfo);

    this.props.uninitItemFree({
      PATH_URL: url,
      METHOD: 'POST',
      successFn: this.uninitHandshakeFreeSuccess,
      errorFn: this.uninitHandshakeFreeFailed,
    });
    GA.createFreeClickCancel(predictName);
  }
  uninitHandshakeFreeSuccess= async (successData) => {
    console.log(TAG, 'uninitHandshakeFreeSuccess', successData);
  }
  uninitHandshakeFreeFailed = (error) => {
    console.log(TAG, 'uninitHandshakeFreeFailed', error);
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
    }
  }
  collectFree(id) {
    const params = {
      offchain: id,
    };

    const { itemInfo, predictName } = this.state;

    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
    betHandshakeHandler.setItemOnChain(id, updateInfo);
    this.props.updateBettingChange(updateInfo);

    this.props.collectFree({
      PATH_URL: API_URL.CRYPTOSIGN.COLLECT_FREE,
      METHOD: 'POST',
      data: params,
      successFn: this.collectFreeSuccess,
      errorFn: this.collectFreeFailed,
    });
    GA.createFreeClickWithdraw(predictName);
  }

  collectFreeSuccess = async (successData) => {
    console.log(TAG, 'collectFreeSuccess', successData);
    const { status } = successData;
    if (status) {
      this.props.showAlert({
        message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
    }
  }
  collectFreeFailed = (error) => {
    console.log(TAG, 'collectFreeFailed', error);
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
    }
  }

  refundFree(id) {
    const params = {
      offchain: id,
    };

    const { itemInfo, predictName } = this.state;
    const updateInfo = Object.assign({}, itemInfo);
    updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING;
    betHandshakeHandler.setItemOnChain(id, updateInfo);
    this.props.updateBettingChange(updateInfo);

    this.props.refundFree({
      PATH_URL: API_URL.CRYPTOSIGN.REFUND_FREE,
      METHOD: 'POST',
      data: params,
      successFn: this.refundFreeSuccess,
      errorFn: this.refundFreeFailed,
    });
    GA.createFreeClickRefund(predictName);
  }

  refundFreeSuccess = async (successData) => {
    console.log(TAG, 'refundFreeSuccess');
    const { status } = successData;
  }

  refundFreeFailed = (error) => {
    console.log(TAG, 'refundFreeFailed', error);
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
    }
  }
  /*** API REAL BET */
  uninitItemReal(id) {
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE;
    const params = {
      offchain: id,
    };
    this.props.uninitItem({
      PATH_URL: url,
      METHOD: 'POST',
      data: params,
    });
  }

  collectReal(id) {
    const params = {
      offchain: id,
    };
    this.props.collect({
      PATH_URL: API_URL.CRYPTOSIGN.COLLECT,
      METHOD: 'POST',
      data: params,
    });
  }

  refundReal(id) {
    const params = {
      offchain: id,
    };
    this.props.refund({
      PATH_URL: API_URL.CRYPTOSIGN.REFUND,
      METHOD: 'POST',
      data: params,
    });
  }
  disputeReal(id) {
    const params = {
      offchain: id,
    };
    this.props.dispute({
      PATH_URL: API_URL.CRYPTOSIGN.DISPUTE,
      METHOD: 'POST',
      data: params,
    });
  }

  renderStatus = () => {
    const { statusTitle } = this.state;
    return <div className="statusBetting" dangerouslySetInnerHTML={{ __html: statusTitle }} />;
  }


  renderItem(matchedAmount, amount, winMatch, winValue) {
    return (
      <div className="bettingInfoValues">
        <div>
          {<div className="value">{matchedAmount}/{amount} ETH</div>}
        </div>
        <div>
          <div className="value">{winMatch}/{winValue} ETH</div>
        </div>
      </div>
    );
  }
  renderItemShake(shakerList) {
    let displayWinMatch = 0;
    let displayAmount = 0;
    let displayMatchedAmount = 0;
    let displayWinValue = 0;
    if (shakerList) {
      shakerList.forEach((item) => {
        const {
          amount = 0, odds = 0, status
        } = item;
        const oddsBN = parseBigNumber(odds);
        const amountBN = parseBigNumber(amount);
        let amountMatchBN = amountBN;

        const winValue = amountBN.times(oddsBN).toNumber() || 0;
        let winMatch = winValue;

        if (status === BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING) {
          amountMatchBN = parseBigNumber(0);
          winMatch = 0;
        }
        displayWinMatch += winMatch;
        displayAmount += amountBN.toNumber();
        displayMatchedAmount += amountMatchBN.toNumber();
        displayWinValue += winValue;
      });

      displayMatchedAmount = formatAmount(displayMatchedAmount);
      displayWinMatch = formatAmount(displayWinMatch);
      displayAmount = formatAmount(displayAmount);
      displayWinValue = formatAmount(displayWinValue);

      // console.log(TAG, ' renderShaker',
      //                   ' displayMatchedAmount:', displayMatchedAmount,
      //                   ' displayWinMatch:', displayWinMatch,
      //                   ' displayAmount:', displayAmount,
      //                   ' displayWinValue:', displayWinValue,
      //                 );

      return (this.renderItem(displayMatchedAmount, displayAmount, displayWinMatch, displayWinValue));
    }
    return null;
  }

  renderShaker() {

    const { shakedItemList } = this.state;

    return (
      <div>
        {this.renderItemShake(shakedItemList)}
      </div>
    );
  }

  renderMaker() {
    const { itemInfo } = this.state;
    const {
      amount, odds, remainingAmount, matched,
    } = itemInfo;
    const amountBN = parseBigNumber(amount);
    const zeroBN = parseBigNumber(0);
    const remainingAmountBN = parseBigNumber(remainingAmount) || zeroBN;
    const oddsBN = parseBigNumber(odds);

    const amountMatchBN = matched ? amountBN.minus(remainingAmountBN) : zeroBN;
    const winMatchBN = matched ? amountMatchBN.times(oddsBN) : zeroBN;

    const amountMatch = amountMatchBN.toNumber() || 0;
    const winMatch = winMatchBN.toNumber() || 0;

    // console.log(TAG, ' renderMaker', ' Matched:', matched,
    //                     ' Amount:', amountBN.toNumber(),
    //                     ' Remaining Amount:', remainingAmount,
    //                     ' Remaining:', remainingAmountBN.toNumber(),
    //                     ' AmountMatch:', amountMatchBN.toNumber(),
    //                     ' WinMatch:', winMatchBN.toNumber());
    const winValue = amountBN.times(oddsBN).toNumber() || 0;
    const displayAmount = formatAmount(amount);

    const displayMatchedAmount = formatAmount(amountMatch);
    const displayWinMatch = formatAmount(winMatch);
    const displayWinValue = formatAmount(winValue);

    return (
      this.renderItem(displayMatchedAmount, displayAmount, displayWinMatch, displayWinValue)
    );
  }
  renderButton(buttonClassName) {
    const {
      actionTitle, isLoading,
    } = this.state;
    const title = isLoading ? 'Loading...' : actionTitle;
    return (
      <div>
        {actionTitle && <Button disabled={isLoading} block className={buttonClassName} onClick={() => { this.clickActionButton(actionTitle); }}>{title}</Button>}
      </div>

    );
  }
  renderProgressBar(itemInfo) {
    const { totalAmount, totalDisputeAmount } = itemInfo;
    //totalDisputeAmount = 50;
    //totalAmount = 100;

    const progress = totalDisputeAmount / totalAmount * 100;
    const pgText = `${formatAmount(totalDisputeAmount)} ETH of ${formatAmount(totalAmount)} ETH outcome pool`;
    console.log(TAG, 'renderProgressBar', 'totalAmount:', totalAmount,'totalDisputeAmount:', totalDisputeAmount);
    console.log(TAG, 'renderProgressBar', 'totalAmount:', formatAmount(totalAmount),'totalDisputeAmount:', formatAmount(totalDisputeAmount));

    return (
      <div>
        <ProgressBar className="progressBar" striped bsStyle="info" now={progress} />
        <div className="progressText">{pgText}</div>
      </div>
    );
  }
  renderBottom(itemInfo) {
    const { status } = itemInfo;
    const { actionTitle } = this.state;
    const buttonClassName = this.getButtonClassName(actionTitle);

    return (
      <div className="bottomDiv">
        {status === BET_BLOCKCHAIN_STATUS.STATUS_USER_DISPUTED && this.renderProgressBar(itemInfo)}
        <div className="bottomStatus">
          {this.renderStatus()}
          {this.renderButton(buttonClassName)}
        </div>
      </div>

    );
  }

  render() {
    const {
      actionTitle, isAction, itemInfo, isLoading, eventName, predictName
    } = this.state;

    //const {extraData} = this.props;

    const { side, odds, role } = itemInfo;
    //const { event_name, event_predict } = parseJsonString(extraData);

    const colorBySide = side === 1 ? `support` : 'oppose';

    //const eventName = event_name && this.formatEventName(event_name);
    //const predictName = event_predict && this.formatPredictName(event_predict);

    console.log(TAG, 'render', isLoading);
    return (
      <div>
        {/* Feed */}
        <Feed
          className="wrapperBettingFeedMe"
          handshakeId={this.props.id}
          onClick={this.props.onFeedClick}
          background="white"
        >
          <div className={`eventTitle event-done-${this.state.matchDone}`}>
            {eventName}
          </div>

          <div className="predictRow">
            <div className="predictTitle">
              <div className={`sideLabel ${colorBySide}`}>{side === 1 ? `Support` : 'Oppose'}</div>
              <div className="predictName">{predictName}</div>
            </div>
            <div className="oddName"><span className="odds-text-feed">Odds</span> <span className={`odds-value-feed-${colorBySide}`}>{odds}</span></div>
          </div>
          <div className="clearfix">
            <div className="bettingInfo">
              <div className="description">Matched</div>
              <div className="description">You could win</div>
            </div>
            {role === ROLE.INITER ? this.renderMaker() : this.renderShaker()}
          </div>
          {this.renderBottom(itemInfo)}
        </Feed>
      </div>
    );
  }
}

const mapState = state => ({
  // firebaseUser: state.firebase.data,
});
const mapDispatch = ({
  loadMyHandshakeList,
  updateBettingChange,
  uninitItem,
  collect,
  collectFree,
  showAlert,
  uninitItemFree,
  refund,
  refundFree,
  dispute,
});
export default connect(mapState, mapDispatch)(FeedBetting);
