import { BET_BLOCKCHAIN_STATUS, ROLE, SIDE, BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import { isExpiredDate } from '@/components/handshakes/betting/validation';
import { BETTING_STATUS_LABEL } from '@/components/handshakes/betting/message';
import { PERCENT_DISPUTE } from '@/components/handshakes/betting/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { leftTime} from '@/components/handshakes/betting/utils';
const TAG = 'STATUS_ACTION';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();

export const getStatusLabel = (item) => {

  let {id, result, role, side, matched, reportTime, disputeTime, totalAmount, totalDisputeAmount} = item;
  let {status} = item;

  let label = null;
  let strStatus = null;
  let isAction = false;

  const itemLoading = keepCurrentLoading(item);
  status = itemLoading && itemLoading.status || status;

  console.log(TAG,'getStatusLabel', ' id:', id,
                  ' blockchainStatus:', status,
                  ' resultStatus:', result,
                  ' role:', role,
                  ' side:', side,
                  ' isMatch:', matched,
                  ' reportTime:', reportTime,
                  ' disputeTime:', disputeTime);

  // totalAmount = 100;
  // totalDisputeAmount = 5;
  // status = BET_BLOCKCHAIN_STATUS.STATUS_DISPUTED;

  // reportTime = 1532502000; //2h
  // disputeTime = 1532512800; //5h

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTED) {
    return resolvingAction(status);
  }

  if(status === BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_SHAKE_FAILED){
      //FAILED ACTION
      return failedAction(status);

  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING
    || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING
    || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING
    || (status === BET_BLOCKCHAIN_STATUS.STATUS_USER_DISPUTED && !isExpiredDate(disputeTime))
    || status === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_PENDING) {
      //PENDING ACTION
      return pendingAction(status);

  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED
    || (!matched && role === ROLE.INITER && status >= BET_BLOCKCHAIN_STATUS.STATUS_INITED)
    || (!matched && status === BET_BLOCKCHAIN_STATUS.DISPUTED && isExpiredDate(disputeTime))) {
      //CANCEL ACTION
      return cancelAction(status, disputeTime);
  }

  if ((matched && result === BETTING_RESULT.DRAW && (isExpiredDate(disputeTime) || status === BET_BLOCKCHAIN_STATUS.STATUS_RESOLVED)) //Draw and over dispute time
    //  || (matched && result === BETTING_RESULT.DRAW && status === BET_BLOCKCHAIN_STATUS.STATUS_RESOLVED) //Resolve dispute, result DRAW
      || (matched && result === BETTING_RESULT.INITED && isExpiredDate(reportTime)) // Over report time but there is no result
      || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUNDED) {
        //REFUND ACTION
      return refundAction(status, reportTime);
  }

  if (matched
    && (result > BETTING_RESULT.INITED || result < BETTING_RESULT.DISPUTED)
    && status !== BET_BLOCKCHAIN_STATUS.STATUS_RESOLVED
    && !isExpiredDate(disputeTime)) {
    return disputeAction(result, side, disputeTime);
  }

  if (result === BETTING_RESULT.INITED && // hasn't has result
      ((matched && status === BET_BLOCKCHAIN_STATUS.STATUS_INITED) //marker
     || (status === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED))) { //shaker

      //MATCHED WAITING RESULT
      return matchAction();
  }

  if (matched
    && result > BETTING_RESULT.INITED && result < BETTING_RESULT.DRAW
    && status !== BET_BLOCKCHAIN_STATUS.STATUS_DONE
    && ((status === BET_BLOCKCHAIN_STATUS.STATUS_RESOLVED && !isExpiredDate(disputeTime))
        || isExpiredDate(disputeTime))) { //Has result and matched
      return winOrLose(result, side, disputeTime);
  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_DONE) {
      return doneAction(result, side);
  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_INIT_ROLLBACK
    || status === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_ROLLBACK) {
      return rollbackAction();
    }

  return { title: label, isAction, status: strStatus };
}

const keepCurrentLoading = (item) => {
  const { id, status } = item;
  const isLoadingObj = betHandshakeHandler?.getLoadingOnChain(item.id);
  if (isLoadingObj) {

    if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
        || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
        || status === BET_BLOCKCHAIN_STATUS.STATUS_DONE || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUNDED) {
      betHandshakeHandler.setItemOnChain(id, null);
      return null;
    }

    const { itemOnChain } = isLoadingObj;
    return itemOnChain;
  }
  return null;
}

const failedAction = (blockchainStatus) => {
  console.log(TAG, 'failedAction');
  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED:
      strStatus = BETTING_STATUS_LABEL.INIT_FAILED;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED:
      strStatus = BETTING_STATUS_LABEL.COLLECT_FAILED;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED:
      strStatus = BETTING_STATUS_LABEL.DISPUTE_FAILED;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_SHAKE_FAILED:
      strStatus = BETTING_STATUS_LABEL.SHAKE_FAILED;
    default:
      strStatus = BETTING_STATUS_LABEL.ACTION_FAILED;
      break;
  }
  return { title: label, isAction, status: strStatus };
};

const pendingAction = (blockchainStatus) => {
  console.log(TAG, 'pendingAction');

  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING:
      strStatus = BETTING_STATUS_LABEL.INITING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING:
      strStatus = BETTING_STATUS_LABEL.CANCEL_PROGRESSING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_REFUND_PENDING:
      strStatus = BETTING_STATUS_LABEL.REFUND_PENDING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING:
      strStatus = BETTING_STATUS_LABEL.COLLECT_PENDING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_USER_DISPUTED:
      strStatus = BETTING_STATUS_LABEL.DISPUTE_WAIT;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_PENDING:
      strStatus = BETTING_STATUS_LABEL.DISPUTE_PENDING;
      break;
    default:
      break;
  }

  return { title: label, isAction, status: strStatus };
};

const cancelAction = (blockchainStatus, disputeTime) => {
  console.log(TAG, 'cancelAction');

  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT:
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.SHOULD_CANCEL;
      isAction = true;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED:
      strStatus = BETTING_STATUS_LABEL.CANCELLED;
      break;
    default: // !isMatch && role === ROLE.INITER && blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INITED)
      if (isExpiredDate(disputeTime)) {
        strStatus = BETTING_STATUS_LABEL.BET_CANCEL_OVER;
      } else {
        strStatus = BETTING_STATUS_LABEL.BET_WAIT_MATCHING;
      }
      label = BETTING_STATUS_LABEL.CANCEL;
      isAction = true;


      break;
  }
  return { title: label, isAction, status: strStatus };
};

const refundAction = (blockchainStatus, reportTime) => {
  console.log(TAG, 'refundAction');

  let label = null;
  let strStatus = null;
  let isAction = false;


  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_REFUNDED:
      strStatus = BETTING_STATUS_LABEL.REFUNDED;
      break;
    default:
      if (!isExpiredDate(reportTime)) {
        strStatus = BETTING_STATUS_LABEL.REFUNDING + BETTING_STATUS_LABEL.REFUND_WAIT;
      } else {
        label = BETTING_STATUS_LABEL.REFUND;
        strStatus = BETTING_STATUS_LABEL.REFUNDING;
        isAction = true;
      }

      break;
  }

  return { title: label, isAction, status: strStatus };
};


const matchAction = () => {
  console.log(TAG, 'matchAction');


  const strStatus = BETTING_STATUS_LABEL.BET_MACHED_WAIT_RESULT;
  const isAction = false;

  return { title: null, isAction, status: strStatus };
};

const winOrLose = (resultStatus, side = SIDE.SUPPORT, disputeTime) => {
  console.log(TAG, 'winOrLose');

  let label = null;
  let strStatus = null;
  let isAction = false;
  // Win
  if (resultStatus === side) {
    if (isExpiredDate(disputeTime)) { // Over dispute time, user can withdraw
      label = BETTING_STATUS_LABEL.WITHDRAW;
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = true;
    } else {
      const time = leftTime(disputeTime);
      strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.WIN_WAIT.replace('{{value}}', time);
      isAction = false;
    }
  } else { // LOSE
    strStatus = BETTING_STATUS_LABEL.LOSE;
  }

  return { title: label, isAction, status: strStatus };
};

const doneAction = (resultStatus, side) => {
  let strStatus = null;
  let isAction = false;
  if (resultStatus === side) {
    strStatus = BETTING_STATUS_LABEL.COLLECT_DONE; //Win and withdraw
  } else {
    strStatus = BETTING_STATUS_LABEL.LOSE;

  }

  return { title: null, isAction, status: strStatus };
}

const rollbackAction = () => {
  console.log(TAG, 'rollbackAction');

  const strStatus = BETTING_STATUS_LABEL.ROLLBACK;
  const isAction = false;
  return { title: null, isAction, status: strStatus };
};

const disputeAction = (result, side, disputeTime) => {
  console.log(TAG, 'disputeAction');
  let strStatus = null;
  let isAction = true;
  let label = BETTING_STATUS_LABEL.DISPUTE;

  switch (result) {
    case BETTING_RESULT.DRAW:
      strStatus = BETTING_STATUS_LABEL.REFUNDING + BETTING_STATUS_LABEL.DISPUTE_CLICK;
      break;
    default:
      if (result === side) {
        const time = leftTime(disputeTime);
        console.log(TAG, 'TIME:', time);
        strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.WIN_WAIT.replace('{{value}}', time);
        isAction = false;
        label = null;
      } else {
        strStatus = BETTING_STATUS_LABEL.LOSE + BETTING_STATUS_LABEL.DISPUTE_CLICK;
      }
      break;
  }

  return { title: label, isAction, status: strStatus };

};
const resolvingAction = () => {
  console.log(TAG, 'resolvingAction');

  const isAction = false;
  const strStatus = BETTING_STATUS_LABEL.DISPUTE_RESOVING;

  return { title: null, isAction, status: strStatus };

};
