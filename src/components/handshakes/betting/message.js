export const MESSAGE_SERVER = {
  /* ERROR */
  1000: 'Please double check your input data.',
  1001: 'No equivalent bets found. Please create a new bet.',
  1002: 'Please provide valid wallet address!',
  1003: 'Missing offchain data!',
  1004: 'Odds should be large than 1',
  1005: 'The maximum free bet is 100!',
  1006: 'You cannot withdraw this handshake!',
  1007: 'Cannot rollback this handshake!',

  /* OUTCOME */
  1008: 'Please check your outcome id',
  1009: 'Please check your outcome result',
  1010: 'This outcome has had result already!',

  /* MATCH */
  1011: 'Match not found. Please try again.',
  1012: 'Match result invalid. Please try again.',
  1013: 'Match result is empty. Please try again.',
  1043: 'The report time is exceed!',

  /* USER */
  1014: 'Please enter a valid email address.',
  1015: 'Sorry, we were unable to register you. Please contact human@autonomous.ai for support.',
  1016: 'Invalid user',
  1017: 'Please purchase to sign more.',
  1018: 'Invalid user',
  1019: 'Please login with google+ or facebook account.',
  1020: 'You have received free bet already!',

  /* HANSHAKE */
  1021: 'You\'re out of gas! Please wait while we add ETH to your account.',
  1022: 'This Handshake seems to be empty.',
  1023: 'You are not authorized to make this Handshake.',
  1024: 'Contract file not found!',
  1025: 'Handshake not found. Please try again.',
  1026: 'Please enter a payment amount.',
  1027: 'Amount should be larger > 0.',
  1028: 'Amount key is invalid.',
  1029: 'Public key is invalid.',
  1030: 'Please enter a valid wallet address which exists in our system.',
  1031: 'You\'re out of gas! Please wait while we add ETH to your account.',
  1032: 'Your note is too long. It should be less than 1000 characters.',
  1033: 'Please choose type of handshake.',
  1034: 'This is not betting template.',
  1035: 'There is an error happens or you are calling cancel too fast. Need wait for 5 minutes!',
  1036: 'Your result does not match with outcome!',
  1037: 'Withdraw only works after dispute time.',
  1044: 'Cannot refund this handshake!',
  /* SHAKER */
  1038: 'Shaker not found. Please try again.',
  1039: 'You have rollbacked already!',


  /* WALLET */
  1040: 'Busy day for Handshakes - we\'re out of freebies! Please try again tomorrow.',
  1041: 'You can only request free Handshakes once.',
  1042: 'Your account can\'t get free ETH.',
};

export const MESSAGE = {
  BET_PROGRESSING: 'Your bet is creating. Please wait',
  CREATE_BET_NOT_MATCH: 'Finding a ninja to bet against you.',
  CREATE_BET_MATCHED: 'Bet matched! Waiting for outcome.',
  NOT_ENOUGH_BALANCE: 'Too rich for your blood. Please top up your wallet.',
  NOT_ENOUGH_GAS: `Not enough gas. Your balance should larger than {{value}}. Please top up your wallet.`,
  CHOOSE_MATCH: 'Please choose event and outcome',
  ODD_LARGE_THAN: 'Please enter odds greater than 1 and smaller 11.5',
  AMOUNT_VALID: 'Please place a bet larger than 0.',
  MATCH_OVER: 'Time travel is hard. Please bet on a future or ongoing match.',
  RIGHT_NETWORK: 'You must set your wallet on Mainnet',
  ROLLBACK: `Something did not go according to plan. Please try again.`,
  WITHDRAW_SUCCESS: 'Success! Your winnings have been withdrawn to your wallet.',
  DIFFERENCE_ADDRESS: `Current address isn't same as which you used to create bet`,
};

export const BETTING_STATUS_LABEL =
    {
      //LABEL
      INITING: 'Placing a bet..',
      ROLLBACK: 'There is something wrong with blockchain. The bet is cancelled',
      COLLECT_FAILED: 'There is something wrong with withdraw. Please cancel to get back money',
      SHOULD_CANCEL: 'There is no bet matched. Please cancel to get back money',
      MATCH_POSTPONSE: 'Event is postponsed',
      ACTION_FAILED: `There is something wrong with blockchain. Your action is cancelled`,
      INIT_FAILED: `There is something wrong with blockchain. Your bet is cancelled`,
      DISPUTE_FAILED: `There is something wrong with blockchain. You can't dispute this bet`,
      SHAKE_FAILED: `There is something wrong with blockchain. You can't shake this bet`,

      SOLVE: 'Please retry to solve problem',
      LOSE: 'Better luck next time.',
      WIN: `You're a winner!`,
      WIN_WAIT: `<br/> Wait {{value}} to withdraw.`,
      DISPUTE_CLICK: `<br/>Don't agree with the result?`,
      DISPUTE_WAIT: `<br/> You've disputed the result. Please wait while we resolve it.`,
      DISPUTE_RESOVING: `Other players have also disputed this result. Please wait while we resolve it.`,
      DONE: ` The bet is done.`,
      CANCELLING: 'Your bet is being cancelled.',
      CANCEL_PROGRESSING: 'The blockchain is processing your cancelling. Please wait.',
      BET_WAIT_MATCHING: 'Bet placed. Matching..',
      BET_MACHED_WAIT_RESULT: 'Bet matched. Waiting for result..',
      CANCELLED: 'Your bet was cancelled.',
      REFUNDING: 'Your coin is being refunded to you.',
      REFUND_WAIT: `<br/> It's not time to refund. Please wait..`,
      REFUNDED: 'Your coin has been refunded.',
      COLLECT_PENDING: 'The blockchain is processing your withdrawal. Please wait.',
      COLLECT_DONE: 'Your winnings have been withdrawn to your wallet!',
      REFUND_PENDING: 'The blockchain is processing your refund. Please wait.',
      DISPUTE_PENDING: 'The blockchain is processing your dispute. Please wait.',
      //BUTTON
      REFUND: 'Refund your bet',
      WITHDRAW: 'Withdraw winnings',
      CANCEL: 'Cancel this bet',
      RETRY: 'Retry',
      DISPUTE: 'Dispute it',
    };

