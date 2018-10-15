const taggingConfig = {
  common: {
    category: 'Common',
    action: {
      chooseCategory: 'choose_category',
    },
  },
  cash: {
    category: 'Cash',
    action: {
      clickFeed: 'click_feed',
      clickBuySell: 'click_buy_sell',
      clickCoin: 'click_coin',
      clickSubmit: 'click_submit',
    },
  },
  creditCard: {
    category: 'Credit Card',
    action: {
      clickBuy: 'click_buy',
      showPopupWallet: 'show_popup_wallet',
      showPopupPrediction: 'show_popup_prediction',
      showPopupCreate: 'show_popup_create',
      showPopupDashboard: 'show_popup_dashboard',
      showPopupMeNotEnoughCoin: 'show_popup_me_not_enough_coin',
      showPopupCreateNotEnoughCoin: 'show_popup_create_not_enough_coin',
      buySuccess: 'buy_success',
      showPopupReceiveCoin: 'show_popup_receive_coin',
    },
  },
  depositATM: {
    category: 'Deposit ATM',
    action: {
      depositSuccess: 'deposit_success',
    },
  },
  depositCashATM: {
    category: 'Deposit Cash ATM',
    action: {
      depositSuccess: 'deposit_success',
    },
  },
};

export default taggingConfig;
