/**
 * Google Analytics Helper
 */

const TAG = 'GOOGLE_ANALYTIC';

let instance = null;
const EVENT_CATEGORY = {
  PREDICTION: 'Prediction',
  ORDER_BOOK: 'OrderBook',
  ME: 'Me/Prediction',
  FREEBET: 'Freebet',
  CREATE_OWN_MARKET: 'CreateOwnMarket',
};
const EVENT_ACTION = {
  //PREDICTION
  CLICK_CHOOSE_OUTCOME: 'Click choose an outcome',
  CLICK_BANNER: 'Click banner',
  CLICK_COMMENT: 'Click comments',
  CLICK_CREATE_OWN_EVENT: 'Click create a bet',
  CLICK_INSTRUCTION_START_GUIDE: 'Click instruction quick start guide',
  CLICK_INSTRUCTION_GOT_IT: 'Click instruction play now button',
  CLICK_INSTRUCTION_CLOSE: 'Click instruction close button',
  CLICK_TOP_UP_WALLET: 'Click top up wallet',
  CLICK_CLOSE_TOPUP_WALLET: 'Click close top up wallet ',
  DID_FILL_UP_WALLET: 'Did fill up wallet',
  //ORDER BOOK
  CLICK_SUPPORT: 'Click support',
  CLICK_OPPOSE: 'Click oppose',
  CLICK_SIMPLE: 'Click simple',
  CLICK_ADVANCE: 'Click advance',
  CLICK_SIMPLE_PLACE_SUPPORT_ORDER: 'Click simple place support order',
  CLICK_SIMPLE_PLACE_OPPOSE_ORDER: 'Click simple place oppose order',
  CLICK_ADVANCE_PLACE_SUPPORT_ORDER: 'Click advance place support order',
  CLICK_ADVANCE_PLACE_OPPOSE_ORDER: 'Click advance place oppose order',
  CLICK_FREE_PLACE_SUPPORT_ORDER: 'Click free place support order',
  CLICK_FREE_PLACE_OPPOSE_ORDER: 'Click free place oppose order',
  CLICK_FREE_BET: 'Click free bet',
  CLICK_PAID_BET: 'Click paid bet',
  CLICK_CLOSE: 'Click close',

  //ME PREDICTION
  CLICK_ME_CANCEL_BUTTON: 'Click me cancel button',
  CLICK_ME_WITHDRAW_BUTTON: 'Click me withdraw button',
  CLICK_ME_REFUND_BUTTON: 'Click me refund button',
  CLICK_ME_DISPUTE_BUTTON: 'Click me dispute button',
  CLICK_FREE_CANCEL_BUTTON: 'Click free cancel button',
  CLICK_FREE_WITHDRAW_BUTTON: 'Click free withdraw button',
  CLICK_FREE_REFUND_BUTTON: 'Click free refund button',
  CLICK_ME_CANCEL_API_SUCCESS: 'Click me cancel API successful',
  CLICK_ME_CANCEL_API_FAILED: 'Click me cancel API failed',
  CLICK_ME_WITHDRAW_API_SUCCESS: 'Click me withdraw API successful',
  CLICK_ME_WITHDRAW_API_FAILED: 'Click me withdraw API failed',
  CLICK_ME_REFUND_API_SUCCESS: 'Click me refund API successful',
  CLICK_ME_REFUND_API_FAILED: 'Click me refund API failed',
  CLICK_ME_DISPUTE_API_SUCCESS: 'Click me dispute API successful',
  CLICK_ME_DISPUTE_API_FAILED: 'Click me dispute API failed',

  //FREEBET
  CLICK_GOT_IT_WINNER: 'Click Got it on winner popup',
  CLICK_GOT_IT_LOSER: 'Click Got it on loser popup',
  CLICK_NOTIFY_ME: 'Click notify me',

  //Create Own Market
  CLICK_CREATE_NEW_EVENT: 'Click create a new event',
  CLICK_CREATE_NEW_OUTCOME: 'Click create a new outcome',

  CLICK_GO_BUTTON: 'Click go button',
  CLICK_COMMENTS_BOX: 'Click comments box',
  CLICK_SHARE_BUTTON: 'Click share button',
  CREATE_BET_SUCCESSFUL: 'Create API bet successful',
  CREATE_BET_FAILED: 'Create API bet failed',
  CANT_CREATE_BET: `Can't create bet`,
  CREATE_SHARE_BUTTON: 'Create share button',
  CREATE_BET_NOT_MATCH_FAIL: 'Create bet not match - fail',
  CREATE_BET_NOT_MATCH_SUCCESS: 'Create bet not match - success',
  CREATE_BET_MATCHED_FAIL: 'Create bet matched - fail',
  CREATE_BET_MATCHED_SUCCESS: 'Create bet matched - success',
};

const BETTING_SIDE_NAME = {
  1: 'Support',
  2: 'Oppose',
};

class GoogleAnalyticsService {
  /**
   * Creates an instance of GoogleAnalyticsService.
   * @memberof GoogleAnalyticsService
   */
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  get eventCategory() {
    try {
      const pathName = window.location.pathname;
      const categoryByPathName = {
        '/prediction': EVENT_CATEGORY.PREDICTION,
        '/orderbook': EVENT_CATEGORY.ORDER_BOOK,
        '/me/prediction': EVENT_CATEGORY.ME,
      };
      return categoryByPathName[pathName];
    } catch (err) {
      return '';
    }
  }

  /**
   *
   * @param category
   * @param action
   * @param label
   * @param value
   * @param options
   */
  sendGAEvent({
    category, action, label, value = 0, options = {},
  }) {
    try {
      ga('send', 'event', category, action, label, value, options);
    } catch (err) {
    }
  }

  //PREDICTION
  /**
   *
   * @param outcomeName
   */

  clickChooseAnOutcome(eventName, outcomeName) {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_CHOOSE_OUTCOME,
      label: `${eventName}-${outcomeName}`,
    };

    console.log(TAG, 'clickChooseAnOutcome', params);
    this.sendGAEvent(params);
  }

  /**
   *
   *
   */
  clickBannerWin() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_BANNER,
    };
    console.log(TAG, 'clickBannerWin', params);

    this.sendGAEvent(params);
  }

  /**
   *
   *
   */
  clickComment(eventName) {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_COMMENT,
      label: `${eventName}`,
    };
    console.log(TAG, 'clickComment', params);

    this.sendGAEvent(params);
  }

  clickCreateOwnEvent() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_CREATE_OWN_EVENT,
    };
    console.log(TAG, 'clickCreateOwnEvent', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }

  clickInstructionStartGuide() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_INSTRUCTION_START_GUIDE,
    };
    console.log(TAG, 'clickInstructionStartGuide', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }

  clickInstructionGotIt() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_INSTRUCTION_GOT_IT,
    };
    console.log(TAG, 'clickInstructionGotIt', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }


  clickInstructionClose() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_INSTRUCTION_CLOSE,
    };
    console.log(TAG, 'clickInstructionClose', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }

  clickTopupWallet(result) {
    const { balance = 0, total = 0 } = result;
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_TOP_UP_WALLET,
      label: `Balance ${balance} - Need Amount ${total}`,
    };
    console.log(TAG, 'clickTopupWallet', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }

  clickCloseTopupWallet() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_CLOSE_TOPUP_WALLET,

    };
    console.log(TAG, 'clickCloseTopupWallet', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }
  didFillUpMoney() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.DID_FILL_UP_WALLET,

    };
    console.log(TAG, 'didFillUpMoney', params);
    try {
      this.sendGAEvent(params);
    } catch (error) {
      console.log(error);
    }
  }


  //ORDER BOOK
  /**
   *
   */
  clickSupport(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SUPPORT,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSupport', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickOppose(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_OPPOSE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickOppose', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickSimple(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SIMPLE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSimple', params);

    this.sendGAEvent(params);
  }
  /**
   *
   */
  clickAdvance(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_ADVANCE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickAdvance', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickSimplePlaceSupportOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SIMPLE_PLACE_SUPPORT_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSimplePlaceSupportOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickSimplePlaceOpposeOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SIMPLE_PLACE_OPPOSE_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSimplePlaceOpposeOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickAdvancePlaceSupportOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_ADVANCE_PLACE_SUPPORT_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickAdvancePlaceSupportOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickAdvancePlaceOpposeOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_ADVANCE_PLACE_OPPOSE_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickAdvancePlaceOpposeOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickFreePlaceSupportOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_FREE_PLACE_SUPPORT_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickFreePlaceSupportOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickFreePlaceOpposeOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_FREE_PLACE_OPPOSE_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickFreePlaceOpposeOrder', params);

    this.sendGAEvent(params);
  }


  /**
   *
   */
  clickFree(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_FREE_BET,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickFree', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickPaid(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_PAID_BET,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickPaid', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickClose(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_CLOSE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickClose', params);

    this.sendGAEvent(params);
  }


  /**
   *
   * @param matchName
   * @param matchOutCome
   * @param sideName
   */
  createBetSuccess(matchName, matchOutCome, sideName) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_SUCCESSFUL,
      label: `${sideName === 1 ? 'Support' : 'Oppose'}: ${matchName} - ${matchOutCome}`,
    };
    console.log(TAG, 'createBetSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  /**
   *
   * @param matchName
   * @param matchOutCome
   * @param sideName
   */
  createBetFailed(message) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_FAILED,
      label: message,
    };
    console.log(TAG, 'createBetSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  /**
   *
   */
  createBetNotSuccess(errMessage) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CANT_CREATE_BET,
      label: errMessage,
    };
    console.log(TAG, 'createBetNotSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }


  /** z
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetNotMatchSuccess({ side, odds, amount, txHash }) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_NOT_MATCH_SUCCESS,
      label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}-${txHash}`,
    };
    console.log(TAG, 'createBetNotMatchSuccess', params);

    try {
      const category = this.eventCategory;
      if (category) {
        this.sendGAEvent(params);
      }
    } catch (err) {}
  }


  /**
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetMatchedSuccess({ side, odds, amount, hash }) {
    console.log('Hash:', hash);

    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_MATCHED_SUCCESS,
      label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}-${hash}`,
    };
    console.log(TAG, 'createBetMatchedSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(TAG, err);
    }
  }

  /**
   *
   * @param event
   * @param outcome
   */
  createClickCancel(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_CANCEL_BUTTON,
      label: `${outcome}-${txHash}`,
    };
    console.log(TAG, 'createClickCancel', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createClickWithdraw(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_WITHDRAW_BUTTON,
      label: `${outcome}-${txHash}`,
    };
    console.log(TAG, 'createClickWithdraw', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createClickRefund(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_REFUND_BUTTON,
      label: `${outcome}-${txHash}`,
    };
    console.log(TAG, 'createClickRefund', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  /**
   * @param event
   * @param outcome
   */
  createClickDispute(outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_DISPUTE_BUTTON,
      label: `${outcome}-${txHash}`,
    };
    console.log(TAG, 'createClickDispute', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  /**
   *
   * @param event
   * @param outcome
   */
  createFreeClickCancel(outcome) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_FREE_CANCEL_BUTTON,
      label: `${outcome}`,
    };
    console.log(TAG, 'createFreeClickCancel', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createFreeClickWithdraw(outcome) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_FREE_WITHDRAW_BUTTON,
      label: `${outcome}`,
    };
    console.log(TAG, 'createFreeClickWithdraw', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createFreeClickRefund(outcome) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_FREE_REFUND_BUTTON,
      label: `${outcome}`,
    };
    console.log(TAG, 'createFreeClickRefund', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  clickCancelAPISuccess(offchain) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_CANCEL_API_SUCCESS,
      label: `${offchain}`,
    };
    console.log(TAG, 'clickCancelAPISuccess', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  clickCancelAPIFailed(offchain, err) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_CANCEL_API_FAILED,
      label: `${offchain}-${err}`,
    };
    console.log(TAG, 'clickCancelAPIFailed', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  clickWithdrawAPISuccess(offchain) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_WITHDRAW_API_SUCCESS,
      label: `${offchain}`,
    };
    console.log(TAG, 'clickWithdrawAPISuccess', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  clickWithdrawAPIFailed(offchain, err) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_WITHDRAW_API_FAILED,
      label: `${offchain}-${err}`,
    };
    console.log(TAG, 'clickWithdrawAPIFailed', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  clickRefundAPISuccess(offchain) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_REFUND_API_SUCCESS,
      label: `${offchain}`,
    };
    console.log(TAG, 'clickRefundAPISuccess', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  clickRefundAPIFailed(offchain, err) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_REFUND_API_FAILED,
      label: `${offchain}-${err}`,
    };
    console.log(TAG, 'clickRefundAPIFailed', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  clickDisputeAPISuccess(offchain) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_DISPUTE_API_SUCCESS,
      label: `${offchain}`,
    };
    console.log(TAG, 'clickDisputeAPISuccess', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  clickDisputeAPIFailed(offchain, err) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_DISPUTE_API_FAILED,
      label: `${offchain}-${err}`,
    };
    console.log(TAG, 'clickDisputeAPIFailed', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  //FREEBET
  clickGotItWinner() {
    const params = {
      category: EVENT_CATEGORY.FREEBET,
      action: EVENT_ACTION.CLICK_GOT_IT_WINNER,
    };
    console.log(TAG, 'clickGotItWinner', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(err);
    }
  }

  clickGotItLoser() {
    const params = {
      category: EVENT_CATEGORY.FREEBET,
      action: EVENT_ACTION.CLICK_GOT_IT_LOSER,
    };
    console.log(TAG, 'clickGotItLoser', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(err);
    }
  }

  clickNotifyMe(email) {
    const params = {
      category: EVENT_CATEGORY.FREEBET,
      action: EVENT_ACTION.CLICK_NOTIFY_ME,
      label: `${email}`,
    };
    console.log(TAG, 'clickNotifyMe', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(err);
    }
  }

  //Create your own market

  clickCreateNewEvent(eventName, email = '', marketFee, uid='') {
    const params = {
      category: EVENT_CATEGORY.CREATE_OWN_MARKET,
      action: EVENT_ACTION.CLICK_CREATE_NEW_EVENT,
      label: `${eventName}-${email}-${marketFee}-${uid}`,
    };
    console.log(TAG, 'clickCreateNewEvent', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(err);
    }
  }
  clickCreateNewOutcome(email = '', marketFee, uid='') {
    const params = {
      category: EVENT_CATEGORY.CREATE_OWN_MARKET,
      action: EVENT_ACTION.CLICK_CREATE_NEW_OUTCOME,
      label: `${email}-${marketFee}-${uid}`,
    };
    console.log(TAG, 'clickCreateNewOutcome', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(err);
    }
  }


}

export default new GoogleAnalyticsService();
