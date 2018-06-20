/**
 * Google Analytics Helper
 */

let instance = null;
const EVENT_CATEGORY = {
  DISCOVER_BETTING: 'DiscoverBetting',
  CREATE: 'Create',
  ME: 'Me',
};
const EVENT_ACTION = {
  CLICK_CHOOSE_EVENT: 'Click choose an event',
  CLICK_CHOOSE_OUTCOME: 'Click choose an outcome',
  CLICK_CHOOSE_SIDE: 'Click choose a side',
  CLICK_GO_BUTTON: 'Click go button',
  CLICK_COMMENTS_BOX: 'Click comments box',
  CLICK_SHARE_BUTTON: 'Click share button',
  CREATE_BET_SUCCESSFUL: 'Create bet successful',
  CREATE_SHARE_BUTTON: 'Create share button',
  CREATE_BET_NOT_MATCH_FAIL: 'Create bet not match - fail',
  CREATE_BET_NOT_MATCH_SUCCESS: 'Create bet not match - fail',
  CREATE_BET_MATCHED_FAIL: 'Create bet matched - success',
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
        '/discover': EVENT_CATEGORY.DISCOVER_BETTING,
        '/create': EVENT_CATEGORY.CREATE,
      };
      return categoryByPathName[pathName];
    } catch (err){
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
  sendGAEvent({category, action, label, value = 0, options = {}}) {
    try {
      ga('send', 'event', category, action, label, value, options);
    } catch (err) {
    }
  }

  /**
   *
   * @param eventName
   */
  clickChooseAnEvent(eventName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_EVENT,
      label: eventName,
    });
  }

  /**
   *
   * @param outcomeName
   */
  clickChooseAnOutcome(outcomeName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_OUTCOME,
      label: outcomeName,
    });
  }

  /**
   *
   * @param sideName
   */
  clickChooseASide(sideName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_SIDE,
      label: sideName,
    });
  }

  /**
   *
   * @param eventName
   */
  clickChooseAnEventCreatePage(eventName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.CREATE,
      action: EVENT_ACTION.CLICK_CHOOSE_EVENT,
      label: eventName,
    });
  }

  /**
   *
   * @param outcomeName
   */
  clickChooseAnOutcomeCreatePage(outcomeName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.CREATE,
      action: EVENT_ACTION.CLICK_CHOOSE_OUTCOME,
      label: outcomeName,
    });
  }

  /**
   *
   * @param sideName
   */
  clickChooseASideCreatePage(sideName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.CREATE,
      action: EVENT_ACTION.CLICK_CHOOSE_SIDE,
      label: sideName,
    });
  }

  /**
   *
   * @param selectedMatch
   * @param selectedOutcome
   * @param sideName
   */
  clickGoButtonCreatePage(selectedMatch, selectedOutcome, sideName) {
    try {
      console.log("sele", selectedMatch, selectedOutcome);
      this.sendGAEvent({
        category: EVENT_CATEGORY.CREATE,
        action: EVENT_ACTION.CLICK_GO_BUTTON,
        label: `${sideName}: ${selectedMatch.value} -  ${selectedOutcome.value}`,
      });
    } catch (err) {}
  }

  /**
   *
   * @param matchName
   * @param matchOutCome
   * @param sideName
   */
  clickGoButton(matchName, matchOutCome, sideName) {
    try {
      console.log("matchName", matchName, matchOutCome, sideName);
      this.sendGAEvent({
        category: EVENT_CATEGORY.DISCOVER_BETTING,
        action: EVENT_ACTION.CLICK_GO_BUTTON,
        label: `${sideName === 1 ? 'Support' : 'Oppose'}: ${matchName} - ${matchOutCome}`,
      });
    } catch (err) {}
  }

  /**
   *
   * @param matchName
   * @param matchOutCome
   * @param sideName
   */
  createBetSuccess(matchName, matchOutCome, sideName) {
    try {
      this.sendGAEvent({
        category: EVENT_CATEGORY.DISCOVER_BETTING,
        action: EVENT_ACTION.CREATE_BET_SUCCESSFUL,
        label: `${sideName === 1 ? 'Support' : 'Oppose'}: ${matchName} - ${matchOutCome}`,
      });
    } catch (err) {}
  }

  /**
   *
   * @param selectedMatch
   * @param selectedOutcome
   * @param sideName
   */
  createBetSuccessCreatePage(selectedMatch, selectedOutcome, sideName) {
    try {
      this.sendGAEvent({
        category: EVENT_CATEGORY.CREATE,
        action: EVENT_ACTION.CREATE_BET_SUCCESSFUL,
        label: `${sideName}: ${selectedMatch.value} -  ${selectedOutcome.value}`,
      });
    } catch (err) {}
  }

  /**
   *
   * @param side
   * @param odds
   * @param amount
   * @param message
   */
  createBetNotMatchFail({side, odds, amount, message}) {
    try {
      const category = this.eventCategory;
      if (!!category) {
        this.sendGAEvent({
          category,
          action: EVENT_CATEGORY.CREATE_BET_NOT_MATCH_FAIL,
          label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount} - Reason: ${message}`,
        });
      }
    } catch (err) {}
  }

   /**z
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetNotMatchSuccess({side, odds, amount}) {
    try {
      const category = this.eventCategory;
      if (!!category) {
        this.sendGAEvent({
          category,
          action: EVENT_CATEGORY.CREATE_BET_NOT_MATCH_SUCCESS,
          label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}`,
        });
      }
    } catch (err) {}
  }

  /**
   *
   * @param side
   * @param odds
   * @param amount
   * @param message
   */
  createBetMatchedFail({side, odds, amount, message}) {
    try {
      const category = this.eventCategory;
      if (!!category) {
        this.sendGAEvent({
          category,
          action: EVENT_CATEGORY.CREATE_BET_MATCHED_FAIL,
          label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount} - Reason: ${message}`,
        });
      }
    } catch (err) {}
  }

  /**
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetMatchedSuccess({side, odds, amount}) {
    try {
      const category = this.eventCategory;
      if (!!category) {
        this.sendGAEvent({
          category,
          action: EVENT_CATEGORY.CREATE_BET_MATCHED_SUCCESS,
          label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}`,
        });
      }
    } catch (err) {}
  }

  /**
   *
   * @param category
   * @param shareType
   * @param title
   * @param shareUrl
   */
  createShareButton({ category = EVENT_CATEGORY.DISCOVER_BETTING, shareType, title, shareUrl }) {
    try {
      this.sendGAEvent({
        category: category || EVENT_CATEGORY.DISCOVER_BETTING,
        action: `${EVENT_ACTION.CLICK_SHARE_BUTTON}: ${shareType}`,
        label: `${title} - (${shareUrl})`,
      })
    } catch (err) {}
  }
}

export default new GoogleAnalyticsService();
