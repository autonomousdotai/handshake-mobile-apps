export default {
  buy: 'Buy',
  sell: 'Sell',
  amount: 'amount',
  askUsingCreditCard: 'for {total} {fiatCurrency} using card?',
  change: 'Change',
  ccNumber: 'Number',
  ccExpire: 'Expiry',
  ccCVC: 'CVC',
  overCCLimit: 'You have reached your credit card limit! You have already used {currency}{amount} in the dojo today. ',

  required: 'Required',
  ccExpireTemplate: 'MM/YY',
  securityCode: '325',
  shakeNow: 'Shake',
  offerHandShakeContent: '{offerType} {amount} {currency} for {total} {currency_symbol} in {payment_method}?',
  offerHandShakeContentMe: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMe: '{offerType} {something} for {amount} {currency}',
  offerHandShakeContentMeDone: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMeDone: '{offerType} {something} for {amount} {currency}',
  instantOfferHandShakeContent: 'You{just}{offerType} {amount} {currency} for {total} {currency_symbol} on your card - fee {fee}%',
  offerDistanceContent: '{distance} away',
  transactonOfferInfo: 'Successful ({success}) / Failed ({failed})',
  createOfferConfirm: 'You are about to {type} {something} by {amount} {currency}',
  handshakeOfferConfirm: 'You are about to {type} {something} for {amount} {currency}',
  rejectOfferConfirm: 'Do you want to Reject this handshake? You will not be able to make transactions for 4 hours.',
  completeOfferConfirm: 'Finish shaking?',
  withdrawOfferConfirm: 'Are you sure you want to withdraw?',
  cancelOfferConfirm: 'Cancel this order?',
  closeOfferConfirm: 'Finish your order?',
  acceptOfferConfirm: 'Accept the order?',
  createOfferSuccessMessage: 'Success! You have created an offer on Ninja.',
  shakeOfferSuccessMessage: 'Success! A ninja has shaked on your order.',
  closeOfferSuccessMessage: 'Success! Your order is now closed.',
  completeShakedfferSuccessMessage: 'You have successfully shaked on Ninja',
  cancelShakedfferSuccessMessage: 'You have cancelled your order ',
  withdrawShakedfferSuccessMessage: 'Your offer has been withdrawn.',
  buyUsingCreditCardSuccessMessge: 'Your order using your credit card has gone through.',
  notEnoughCoinInWallet: 'You don\'t have enough coin right now. Please top up your wallet.',

  createOfferStoreConfirm: 'Do you want to set up an offer to {intentMsg}?',
  notEnoughCoinInWalletStores: 'You don\'t have enough coin right now. Please top up your wallet.',
  addOfferItemSuccessMassage: 'Success! Your order is now listed on Ninja',
  deleteOfferItemSuccessMassage: 'You have successfully deleted your order.',
  shakeOfferItemSuccessMassage: 'You have successfully shaked on Ninja',
  acceptOfferItemSuccessMassage: 'Good news! Your order has been accepted.',
  cancelOfferItemSuccessMassage: 'Your order has been cancelled!',
  rejectOfferItemSuccessMassage: 'You rejected a fellow ninja\'s order.',
  completeOfferItemSuccessMassage: 'Good news! Your order has been completed.',
  offerStoresAlreadyCreated: 'Oops! You already created an order on Ninja.',
  offerStoreHandShakeContentBuy: '{offerTypeBuy} {amountBuy} {currency} at {fiatAmountBuy} {fiatAmountCurrency}. ',
  offerStoreHandShakeContentSell: '{offerTypeSell} {amountSell} {currency} at {fiatAmountSell} {fiatAmountCurrency}.',
  requireDefaultWalletOnMainNet: 'You must set your wallet on Mainnet',
  movingCoinToEscrow: 'Moving your coin to escrow. This may take a few minutes.',
  movingCoinFromEscrow: 'Moving your coin from escrow. This may take a few minutes.',
  'ex.create.label.amountBuy': 'I want to buy',
  'ex.create.label.amountSell': 'I want to sell',
  'ex.create.label.marketPrice': 'Current market price',
  'ex.create.label.premiumBuy': 'My price',
  'ex.create.label.premiumSell': 'My price',
  'ex.create.label.premiumSellExplanation': 'Market price ± percentage',
  'ex.create.label.nameStation': 'Station name',
  'ex.create.label.phone': 'Phone',
  'ex.create.label.address': 'Meet-up place',
  'ex.create.label.beASeller': 'Be a seller',
  'ex.create.label.beABuyer': 'You can also be a buyer',
  'ex.create.label.stationInfo': 'Station information',

  'ex.createLocal.label.iWantTo': 'I want to',
  'ex.createLocal.label.something': 'What is it called?',
  'ex.createLocal.placeholder.anyItem': 'any item or service',
  'ex.createLocal.label.coin': 'Coin',
  'ex.createLocal.label.amount': 'Amount',
  'ex.createLocal.label.phone': 'Phone',
  'ex.createLocal.label.address': 'Meet-up place',
  'ex.createLocal.label.uploadImage': 'Upload an image of your product',

  'ex.discover.label.priceBuy': 'BUY',
  'ex.discover.label.priceSell': 'SELL',
  'ex.discover.label.reviews': '({reviewCount})',
  'ex.discover.banner.text': 'Got coins? Turn them into a money-making machine.',
  'ex.discover.banner.btnText': 'BECOME A LOCAL EXCHANGE',
  'ex.discover.shakeDetail.label.amount': 'Amount',
  'ex.discover.shakeDetail.label.total': 'Total',
  'ex.discover.shakeDetail.label.maximum': 'Maximum:',
  'ex.me.label.with': 'With',
  'ex.me.label.from': 'From',
  'ex.me.label.about': 'About',
  'ex.btn.confirm': 'Confirm',
  'ex.btn.OK': 'OK',
  'ex.btn.notNow': 'Not now',

  'ex.label.buy': 'Buy',
  'ex.label.sell': 'Sell',
  'ex.label.bought': 'Bought',
  'ex.label.sold': 'Sold',
  'ex.label.buying': 'Buying',
  'ex.label.selling': 'Selling',
  'ex.label.buyer': 'buyer',
  'ex.label.seller': 'seller',

  'ex.exchange.status.created': 'Verifying...',
  'ex.exchange.status.active': 'Active',
  'ex.exchange.status.closing': 'Pending...',
  'ex.exchange.status.closed': 'Closed',
  'ex.exchange.status.shaking': 'Shake pending...',
  'ex.exchange.status.shake': 'Shook',
  'ex.exchange.status.completing': 'Completing...',
  'ex.exchange.status.completed': 'Done',
  'ex.exchange.status.pre_shaking': 'Shake pending',
  'ex.exchange.status.pre_shake': 'Shook',
  'ex.exchange.status.rejecting': 'Rejecting',
  'ex.exchange.status.rejected': 'Rejected',
  'ex.exchange.status.cancelling': 'Cancelling',
  'ex.exchange.status.cancelled': 'Cancelled',

  'ex.cc.status.processing': 'Processing',
  'ex.cc.status.success': 'Done',
  'ex.cc.status.cancelled': 'Failed',

  'ex.shop.status.created': 'Verifying...',
  'ex.shop.status.active': 'Active',
  'ex.shop.status.closing': 'Pending...',
  'ex.shop.status.closed': 'Closed',

  'ex.shop.shake.status.pre_shaking': 'Requesting',
  'ex.shop.shake.status.pre_shake': 'Requested',
  'ex.shop.shake.status.shaking': 'Requesting',
  'ex.shop.shake.status.shake': 'Requested',
  'ex.shop.shake.status.rejecting': 'Rejecting',
  'ex.shop.shake.status.rejected': 'Rejected',
  'ex.shop.shake.status.completing': 'Completing...',
  'ex.shop.shake.status.completed': 'Done',
  'ex.shop.shake.status.cancelling': 'Cancelling',
  'ex.shop.shake.status.cancelled': 'Cancelled',

  'ex.error.systemError': 'Sorry Ninja. Something went wrong. Come back soon.',
  'ex.error.312': 'Oh no! You cancelled your offer. You will not be able to make orders for 4 hours. Sorry',
  'ex.error.313': 'You already have a listing! To change your rates, please cancel your current listing.',
  'ex.error.314': 'Looks like that listing has been deleted.',
  'ex.error.315': 'Sorry ninja, someone else got there first.',
  'ex.error.1': 'Oops! Something went wrong. Come back soon.',
  'ex.error.3': 'It looks like that token is invalid.',
  'ex.error.301': 'You are already a ninja.',
  'ex.error.302': 'Sorry, that ninja does not exist.',
  'ex.error.303': 'It looks like you have reached your credit card limit.',
  'ex.error.309': 'You already have a listing! To change your rates, please cancel your current listing.',
  'ex.error.default': 'Oops! Something went wrong.',

  'error.required': 'Required',
  'error.requiredOne': 'You need to fill in one of these!',
  'error.greaterThan': 'Must be greater than {min}',
  'error.lessThan': 'Must be less than {max}',

  'btn.initiate': 'Initiate',
  'btn.shake': 'Shake',
  'btn.reject': 'Reject',
  'btn.complete': 'Complete',
  'btn.withdraw': 'Withdraw',
  'btn.cancel': 'Cancel',
  'btn.close': 'Close',
  'btn.accept': 'Accept',

  // FAQ
  FAQ_TITLE: 'FAQ',
  FAQ_HEADER_YELLOW: 'Decentralized',
  FAQ_HEADER: 'Prediction Exchange',
  FAQ_DATA: [
    {
      question: 'What is Ninja PEX?',
      answer: 'Ninja is an anonymous peer-to-peer decentralized prediction exchange running on top of the Ethereum blockchain.',
    },
    {
      question: 'What’s special about PEX? Why should i bet on one?',
      answer: 'It allows parties to directly bet against each other without going through a central authority or bookmaker. This makes it 100% anonymous, no signs up no downloads required. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. You can also create your own prediction markets.',
    },
    {
      question: 'Do I need Ether? Does it support other cryptocurrencies?',
      answer: 'It allows parties to directly bet against each other without going through a central authority or bookmaker. This makes it 100% anonymous, no signs up no downloads required. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. You can also create your own prediction markets.',
    },
    {
      question: 'How do I start with Ninja?',
      isList: true,
      answer: [
        {
          title: 'Get Ether:',
          content: ' You can either buy ETH directly in PEX with your credit cards or from popular coin exchanges like Coinbase or Binance.',
        },
        {
          title: 'Top up your PEX Wallet:',
          content: 'You can either buy ETH directly in PEX with your credit cards or from popular coin exchanges like Coinbase or Binance.',
        },
        {
          title: 'Place a bet:',
          content: 'Pick the market you want to bet (i.e. Brazil - Spain), the outcomes (i.e. Brazil wins) and the site (i.e. support or bet against the outcome)\n' +
          'Enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/ 2.25)\n' +
          'The PEX Matching Engine will then find another order that bets against the odds you set.',
        },
        {
          title: 'Wait for the report:',
          content: 'if you win, your winnings will be automatically transferred from the escrow smart contract to your account.',
        },
      ],
    },
    {
      question: 'What’s special about PEX? Why should i bet on one?',
      answer: 'Yes! When creating your own bet, you’ll enter the event you’re interested in and the outcome you want to bet on. Then, simply enter your stake and the odds you want. Then the PEX Engine will automatically find and match you with anyone that has an interest in the same event, and who accepts your odds.',
    },
    {
      question: 'How do you police unsavory/illegal bets?',
      answer: 'We are currently building a system of checks and balances to flag up inappropriate behaviour in the dojo.',
    },
    {
      question: 'How does the system know the result of bets between people? Who acts as arbitrator and verifies one outcome vs. another at conclusion of contract?',
      answer: 'Ninja will soon have a completely decentralized solution for verifying the outcome and incentivizing truth telling (a DAO of reporters!). In the meantime, as we will launch just in time for the FIFA world cup, our team will use a public source (livescore.com) and act as the reporter.',
    },
    {
      question: 'Where is the coin held?',
      answer: 'No one holds the funds. All the funds are kept safe in escrow until a resolution is reached.',
    },
    {
      question: 'Why should I bet on blockchain instead of using traditional methods?',
      answer: 'A decentralized prediction exchange will provide you the freedom to create your own odds and bet directly with anyone, offer you 100% ninja anonymity and guaranteed payouts.',
    },
    {
      question: 'How about privacy and anonymity?',
      answer: 'Ninja requires no downloads, and no sign ups. That means no passwords, no phone numbers and no emails. 100% anonymity.',
    },
    {
      question: 'Do I need to pay any fees?',
      answer: 'There are two main types of fees: creator fees (for the ninja that creates the bet) and the network fee (a percentage of the creator fee, that goes towards maintaining the platform).',
    },
    {
      question: 'What do I need to do when the outcome is finalized?',
      answer: 'Nothing. If you win, your winnings will be automatically transferred to your account. If you lose, it will be someone else’s account.',
    },
    {
      question: 'Where can I find a match to bet on?',
      answer: 'On the homepage, you’ll be able to browse ongoing bets and markets. If you can’t find any you like, create your own!',
    },
    {
      question: 'Other than sports, can I bet on anything else? How does it work?',
      answer: 'Very soon, Ninja will apply to everything under the sun. The only limitation will be your creativity. You can easily create any market on any future event, be it sports, politics, science, markets, climate… you name it.',
    },
    {
      question: 'What’s gonna happen to the Handshake mobile app?',
      answer: 'We will be integrating Handshake (and your favourite features like promises, IOUs, contract upload, etc.) into the Ninja mobile website.',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: 'The anonymous exchange of anything',
  MOT_CONTENT_0: 'The Ninja network is only accessible via mobile.',
  MOT_CONTENT_1: 'Open',
  MOT_CONTENT_2: 'on your mobile browser to gain anonymous entry.',
  MOT_CONTENT_3: 'No download needed. No sign up required.',
  MOT_LIST_CONTENT: [
    {
      mainContent: 'Read the',
      placeHolderLink: 'whitepaper',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
    },
    {
      mainContent: 'We answered your',
      placeHolderLink: 'FAQ',
      link: '/faq',
    },
    {
      mainContent: 'Join the dojo on',
      placeHolderLink: 'Telegram',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],

  // landing page --> /coin-exchange
  COIN_EXCHANGE_LP_FAQ_TITLE: 'Have any questions?',
  COIN_EXCHANGE_LP_FAQ: [
    {
      question: 'What ID do I need as a seller or a buyer?',
      answer: 'We do not need ID verification. If you verify your phone number, you will have the chance to get 1 free ETH to make transactions on Shake Ninja',
    },
    {
      question: 'Are credit cards accepted?',
      answer: 'Yes. We accept Visa, Mastercard, Amex and Discover',
    },
    {
      question: 'What currencies can people exchange?',
      answer: 'We accept all types of currencies',
    },
    {
      question: 'Is there a system to track the trading history?',
      answer: 'Yes. We count the successful and failed transactions with clear report for each seller and buyer',
    },
    {
      question: 'Is there any country restricted for this platform?',
      answer: 'We are available for all countries',
    },
    {
      question: 'Is there decentralized exchange?',
      answer: 'Yes. Therefore the transaction is 100% safe and secured',
    },
    {
      question: 'Can I use paypal?',
      answer: 'We are not available on Paypal at the moment',
    },
    {
      question: 'Will the funds be held in Escrow?',
      answer: 'Yes, in either Escrow on smart contract or ethereum blockchain',
    },
    {
      question: 'How will the Smart Contract execute when physical cash is involved and there is a lag in transaction time?',
      answer: 'After receiving the physical cash, the seller will click on the accept button, the coin will be automatically transferred to the buyer. The process takes about 10 minutes to 20 minutes',
    },
  ],
  COIN_EXCHANGE_LP_TRADE_EASY_TRADE_SAFE: {
    title: 'Trade Easy. Stay Safe',
    info: [
      {
        title: '1. Post your trade',
        description: 'Select the coin you want to buy/sell along with your desired price',
      },
      {
        title: '2. Choose your shop',
        description: 'Search and choose the most suitable shop in your location',
      },
      {
        title: '3. Fulfill your exchange',
        description: 'Meet up at the shop and exchange cash to coin or coin to cash',
      },
      {
        title: '4. Secure your payment',
        description: 'Process has been secured 100% by smart contract',
      },
    ],
  },
  COIN_EXCHANGE_LP_START_TRADING_NOW: 'Start Trading Now',
  COIN_EXCHANGE_LP_PLACEHOLDER_INPUT: 'Enter your email',
  COIN_EXCHANGE_LP_TITLE_SUBMIT_BT: 'Join mailing list',
  COIN_EXCHANGE_LP_SECOND_BOX_TITLE: 'We are the first to offer a completely decentralized platform to buy and sell Bitcoin and Ethereum.',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_1: 'Multiple payment method: credit card and cash',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_2: 'Secured transaction by blockchain technology',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_3: 'Fast and convenient usage.',
  COIN_EXCHANGE_LP_THIRD_BOX_1: {
    title: 'Multiple Payment Method',
    description: 'We are available for cash - coin trading and credit card - coin trading. Find your nearest traders and leave no transaction history for any activity on our platform.',
  },
  COIN_EXCHANGE_LP_THIRD_BOX_2: {
    title: 'Fast and On the go',
    description: 'With location based trading, we allow you to make payment in few minutes with utmost convenience.',
  },
  COIN_EXCHANGE_LP_THIRD_BOX_3: {
    title: '100% safe and secured for both sides',
    description: 'Unlike any other platform, we do not hold users\' keys and grant full key controls to buyers and sellers.',
  },

  // me page
  me: {
    profile: {
      username: {
        exist: 'Alias has existed!',
        success: 'Your alias is recorded',
        required: 'Alias has required!',
      },
      verify: {
        alert: {
          send: {
            phone: 'We sent the secret code to your phone.',
            email: 'We sent a verification code to your email.',
          },
          notValid: {
            server: {
              phone: 'That’s not a real number. Try harder.',
              email: 'That’s not a real email. Try harder.',
            },
            client: {
              phone: 'A valid phone number would work better.',
              email: 'A valid email would work better.',
            },
          },
          require: {
            phone: 'Please enter your verify code.',
            email: 'Please enter your verify code.',
          },
          success: {
            phone: 'Phone number securely saved.',
            email: 'Your email has been verified.',
          },
          cannot: {
            phone: 'Can\'t verify your phone, please check your code',
            email: 'Can\'t verify your email, please check your code.',
          },
        },
      },
      text: {
        verified: 'Verified',
        username: {
          label: 'Alias',
          desc1: 'What do they call you?',
          button: {
            submit: 'Save',
          },
        },
        phone: {
          label: 'Phone Number',
          desc1: 'To send you free ETH sometimes, we’ll need your phone number to verify that you are not a robot. This is optional.',
          desc2: 'We only send humans rewards.',
          desc3: 'Please verify your phone number.',
          desc4: 'Enter the secret code sent to your phone.',
          button: {
            send: 'Send',
            submit: 'Verify your number',
          },
        },
        email: {
          label: 'Email Verification',
          desc1: 'You may prefer to receive updates and notifications via email. This is also optional.',
          desc2: 'Prefer to receive notifications and updates via email?',
          desc3: 'Enter your email',
          desc4: 'Enter the secret code sent to your email.',
          button: {
            send: 'Send',
            submit: 'Verify your email',
          },
        },
      },
    },
  },

  wallet: {
    top_banner: {
      message: "Shuriken Airdrop (limited)",
      button: "Click here"
    },
    refers_dashboard: {
      header: "3 Shuriken Airdrop hoops",

    },
    refers: {
      header: "3 Shuriken Airdrop hoops",
      error: {
        submit_telegram: "Couldn't find you on Telegram. Please exit the group and try again.",
        submit_twitter: "You haven't followed us yet. Please try again.",
        verify_code: "Verification code is wrong. Please try again!"
      },
      success: {
        submit_telegram: "You joined our community telegram!",
        submit_twitter: "You followed our Twitter!",
        verify_code: "Your email has been verified."
      }
    },
    action: {
      remove: {
        header: "Are you sure?",
        message: "This will permanently delete your wallet.",
        button_yes: "Yes, remove",
        button_cancel: "Cancel"
      },
      transfer: {
        header: "Transfer coins",
        to_address: {
          placeholder: "Specify receiving..."
        }
      }
    }
  },
  /*
  *
  * White Paper
  *
  * ******************************************************************************************* */
  WHITE_PAPER_H1: 'Anonymous Peer-to-Peer Prediction Exchange on Ethereum',
  WHITE_PAPER_SUBTITLE_1: 'Hello! We are Roc, Bakunawa, Hakawai and Grootslang from the Ninja team. We are building an electronic prediction exchange on the blockchain. Here’s why we did it, and how it works!',
  WHITE_PAPER_SUBTITLE_2: 'Join the conversation at',
  WHITE_PAPER_INTRO: 'Introduction',
  WHITE_PAPER_INTRO_1: 'Online betting is run almost exclusively by bookmakers that serve as trusted third parties. As is typically the case, the users suffer from this “centralized trusted thirty party problem”:',
  WHITE_PAPER_INTRO_2: [
    'Bookmakers set the odds that always favor them (they always win)',
    'Bookmakers enjoy a hefty 5% — 30% margin on every bet',
    'Bets are reversible, and winnings are uncertain',
    'Completely anonymity is not possible',
    'Fraud is unavoidable, and accepted for being so',
    'Single point of failure — what if the bookmaker disappears?',
    'Betting is considered gambling — disproportionately risky, largely due to the centralized party’s lack of transparency',
  ],
  WHITE_PAPER_INTRO_3: 'These problems multiply by 10 when it comes to betting offline, so it is little wonder that users are increasingly taking the lesser of two evils.',
  WHITE_PAPER_INTRO_4_HIGH_LIGHT: 'The solution: an electronic prediction system that replaces reluctant trust with cryptographic proof, allowing any two anonymous parties from anywhere in the world to bet directly against each other without the need for a trusted third party.',
  WHITE_PAPER_INTRO_5: 'The Anonymous Peer-to-Peer Electronic Prediction Exchange (PEX) allows parties to directly bet against each other without going through a central authority or bookmaker. The management of bets and the settlement of winnings are carried out collectively by the blockchain network, protecting users from any single point of failure. PEX has unique properties that allow exciting use cases, previously impossible under any traditional betting mechanism.',
  WHITE_PAPER_INTRO_6: 'It is our hope that PEX will change today’s perception of betting — often needlessly portrayed as a shady gambling game, due mostly to reliance on centralized parties looking for unethical, cutthroat ways of making a profit.',
  WHITE_PAPER_INTRO_7_HIGH_LIGHT: 'PEX directly challenges the shadowy gambling industry with an open, transparent prediction market exchange.',
  WHITE_PAPER_INTRO_8: 'This exchange will be where people get together and predict like they have always done, on future events in sports, politics, science, markets, climate, and everything under the sun — as individuals who are invested in the world we are building naturally do.',
  WHITE_PAPER_PEX: 'What is PEX?',
  WHITE_PAPER_PEX_1: 'Running on top of the Ethereum blockchain, PEX is an anonymous peer-to-peer decentralized prediction exchange that provides a simple way for anyone to:',
  WHITE_PAPER_PEX_2: [
    'Place a Support Order (Ask) or an Against Order (Bid) on an outcome',
    'Be a Market Maker (Lay the odds) or a Market Taker (Back the odds)',
    'Be a Creator of their own Prediction Market',
    'Collect winnings instantly (guaranteed under a Smart Contract)',
  ],
  WHITE_PAPER_PEX_3: 'Place a bet.',
  WHITE_PAPER_OUTCOME: 'Outcomes as tradable assets. Odds as prices.',
  WHITE_PAPER_OUTCOME_1: 'In a stock exchange, the tradeable asset is share, and traders bet on share unit prices (e.g. sell 100 shares of Apple at $200 each).',
  WHITE_PAPER_OUTCOME_2: 'In a coin exchange, the tradeable asset is coin, and traders bet on coin unit prices (e.g. buy 2 Bitcoin at $7000 each).',
  WHITE_PAPER_OUTCOME_3: 'Similarly, in a decentralized prediction exchange like PEX, the tradeable asset is outcome of an event, and traders bet on the odds of that outcome. They can bet for the outcome (support it), or bet against it. For example: an outcome of the match Brazil vs. Spain could be that “Brazil wins”. John can bet on that outcome with odds of 2.0. Mary can bet on that outcome with odds of 2.25. Peter can bet against that outcome (“Brazil loses” or “Brazil draws”) with odds of 1.9.',
  WHITE_PAPER_OUTCOME_4: 'A different type of exchange.',
  WHITE_PAPER_COMPARE: 'PEX vs. Traditional betting',
  WHITE_PAPER_COMPARE_1: 'Importantly, PEX does not accept bets and hold stakes, but instead matches the users who support the outcome with the users who are against the outcome. The stakes are held in an Escrow smart contract.',
  WHITE_PAPER_COMPARE_2: 'The Escrow smart contract is unstoppable. It runs exactly as programmed — to forward its escrow balance to the winner at the end — without any possibility of downtime, fraud or third-party interference. Once both parties commit to a bet, it is irreversible. Payment is guaranteed and instant.',
  WHITE_PAPER_COMPARE_3: 'The entire process happens without any party revealing their identities. It’s 100% anonymous.',
  WHITE_PAPER_COMPARE_4: 'All this happens without a central authority or bookmaker. It’s carried out collectively by all the nodes of the blockchain.',
  WHITE_PAPER_COMPARE_5: 'This is why you should bet on the blockchain.',
  WHITE_PAPER_PEX_WORK: 'How does PEX work?',
  WHITE_PAPER_PEX_WORK_SUB_TITLE: 'PEX is different from what you know. It also provides more autonomy than what you know. Just as importantly, it is designed to be easy to create bet markets and place bet orders.',
  WHITE_PAPER_STEP_1: 'Step 1: Get Ether',
  WHITE_PAPER_STEP_1_1: 'If you don’t have ETH yet, you have a choice of buying ETH directly in PEX with your credit card. You can also buy ETH from popular coin exchanges like Coinbase or Binance.',
  WHITE_PAPER_STEP_1_2: 'PEX will support other cryptocurrencies soon.',
  WHITE_PAPER_STEP_1_3: 'Easily buy ETH in-app.',
  WHITE_PAPER_STEP_2: 'Step 2: Top up your PEX Wallet',
  WHITE_PAPER_STEP_2_1: 'Transfer the ETH you just bought into the PEX Wallet, so that you can start placing bets with your ETH. The PEX Wallet is completely decentralized. The private key is held on your phone and only you can access it. Only you can transfer and receive ETH.',
  WHITE_PAPER_STEP_2_2: 'The neatly organized PEX wallet.',
  WHITE_PAPER_STEP_3: 'Step 3: Place a bet',
  WHITE_PAPER_STEP_3_1: 'First, pick a prediction market that interests you (i.e. Brazil — Spain), the outcome (i.e. “Brazil wins”) and the side (i.e. support or bet against the outcome).',
  WHITE_PAPER_STEP_3_2: 'Then enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/2.25). The stake will be put into an escrow smart contract. The PEX Matching Engine will then find another order that bets against the odds you set.',
  WHITE_PAPER_STEP_3_3: 'That’s it.',
  WHITE_PAPER_STEP_3_4: 'Our ETH is on Argentina for this one.',
  WHITE_PAPER_STEP_4: 'Step 4: Wait for the report',
  WHITE_PAPER_STEP_4_1: 'Once the event ends, the reporter of the market will report the result within the reporting window (set by the market creator). Generally, you should expect to have the report within minutes. If you win, your winnings will be automatically transferred from the escrow smart contract to your account.',
  WHITE_PAPER_STEP_4_2: 'May the odds be ever in your favour.',
  WHITE_PAPER_CREATE: 'Create your own prediction markets',
  WHITE_PAPER_CREATE_1: 'While most users will place orders in existing markets, PEX allows anyone to create a prediction market about any future event — be it in sports, politics, science, or literally any other aspect of modern life. You, as the market creator, can set the market fee, the market closing time, the reporter of the outcome, and the reporting deadline.',
  WHITE_PAPER_ARCHITECTURE: 'PEX Architecture',
  WHITE_PAPER_ARCHITECTURE_1: 'The core components of the PEX architecture are:',
  WHITE_PAPER_ARCHITECTURE_2_HL: 'Prediction Market',
  WHITE_PAPER_ARCHITECTURE_2: 'PEX allows anyone to create a prediction market about any future event. This can be in any field — sports, politics, science, lifestyle, even weather and so on. The only limit here is your creativity. Each market is part of an on-chain smart contract. It has its own order book, makers and takers.',
  WHITE_PAPER_ARCHITECTURE_3_HL: 'Order Book',
  WHITE_PAPER_ARCHITECTURE_3: 'Each Prediction Market has its own order book. PEX Order Book manages all Support Outcome Orders (ask) and all Against Outcome Order (bid). It aggregates all orders with the same price (odds) into an entry on the order book.',
  WHITE_PAPER_ARCHITECTURE_3_1: 'The order book.',
  WHITE_PAPER_ARCHITECTURE_4_HL: 'Matching Engine',
  WHITE_PAPER_ARCHITECTURE_4_1: 'PEX uses a first-in, first-out (FIFO) order book. Orders are executed in price-time priority. This means that it will match by price first, and if there are two orders with the same price, then it will match by time.',
  WHITE_PAPER_ARCHITECTURE_4_2: 'In some cases, the amount placed on either side is uneven, and the order will be partially filled. The remaining order will be matched with the next best price-then-time in the order book until the order is completely filled.',
  WHITE_PAPER_ARCHITECTURE_4_3: 'Your perfect match.',
  WHITE_PAPER_ARCHITECTURE_4_4: [
    'A user places a Support Outcome Order into the Open Order Book',
    'Another user place an Against Outcome Order into the Open Order Book',
    'Matching Engine finds a match and moves both Orders from the Open Order Book to Matched Order Book',
  ],
  WHITE_PAPER_ARCHITECTURE_5_HL: 'REST API',
  WHITE_PAPER_ARCHITECTURE_5: 'PEX REST API has endpoints for order management, account management, and public market data.',
  WHITE_PAPER_ARCHITECTURE_6_HL: 'Web Socket',
  WHITE_PAPER_ARCHITECTURE_6: 'PEX Web Socket feed provides real-time market data updates for orders and trades.',
  WHITE_PAPER_PRIVACY: 'Privacy & Anonymity',
  WHITE_PAPER_PRIVACY_SUB: 'The privacy afforded to the user is a deliberate design.',
  WHITE_PAPER_PRIVACY_1_HL: 'No downloads',
  WHITE_PAPER_PRIVACY_1: 'PEX is not a mobile app. It’s freely accessible on the mobile web. While native mobile apps sometimes have better UI/UX, they must be hosted by centralized app stores like Android Play Store or Apple App store. In our view, a more attractive UI is not an acceptable tradeoff for compromised privacy.',
  WHITE_PAPER_PRIVACY_2_HL: 'No sign ups',
  WHITE_PAPER_PRIVACY_2_1: 'The need for a password, email or phone number is obsolete.',
  WHITE_PAPER_PRIVACY_2_2: 'PEX doesn’t collect your personal information. You can use PEX with complete privacy. When you first open PEX, a public/private keypair will be created silently in the background and stored locally on your phone. The public key acts as your anonymous username, and the private key is your password. PEX doesn’t have access to your private key — only you do.',
  WHITE_PAPER_PRIVACY_2_3: 'Note that in the Profile Settings, we provide an option for the user to enter their email address. The purpose is not to collect your email, but for a better experience, especially in use cases related to payments. It’s completely optional.',
  WHITE_PAPER_PRIVACY_2_4: 'Note also that there is an option to backup your private key in Settings. We highly recommend doing so.',
  WHITE_PAPER_PRIVACY_3_HL: 'Anonymous prediction',
  WHITE_PAPER_PRIVACY_3: 'PEX is built on top of Ethereum, which is a public blockchain, but privacy is maintained by keeping your public key anonymous. While the public can see that someone is predicting on something, it’s almost impossible to find out who that someone is.',
  WHITE_PAPER_PRIVACY_4_HL: 'Anonymous order matching',
  WHITE_PAPER_PRIVACY_4: 'Similar to stock and coin exchanges, the order book, sizes, odds, and time are public, but the order book doesn’t disclose who the order makers and takers are. The order book records the bet anonymous parties place against each other, based on their opposing predictions of an event. Once the event concludes and the report is available, the escrowed funds are transferred automatically to the winner.',
  WHITE_PAPER_FEE: 'Fees',
  WHITE_PAPER_FEE_1: 'There are two main types of fees: winning fee and network fee.',
  WHITE_PAPER_FEE_2: 'The winning fee is set by the market creator, as a percentage of the total winnings of that market. It’s entirely up to the market creator to set their own fees. Since PEX allows anyone to create a prediction market, we expect that the fees will be very competitive among markets. This is the best case scenario for users.',
  WHITE_PAPER_FEE_3: 'The network fee is 20% of the creator’s winning fee. This pays for engineering, infrastructure, and maintenance of the network. At the beginning, this will be undertaken by the Core Ninja Team. But we expect that over time we will decentralize the team and design a mechanism that opens it up to the entire community.',
  WHITE_PAPER_FEE_4: 'Optionally, we are considering a referral fee for the market creator. The referral pool could be 10% — 20% of the winning fee, which will help in adding a lot more users to the market.',
  WHITE_PAPER_SETTLEMENT: 'Settlement',
  WHITE_PAPER_SETTLEMENT_1: 'The deeper we dive into building PEX, the more it seems that we have to initially strike a compromise between speed and decentralization, while always retaining security. In relation to settlement, which requires the report of the outcome to be available immediately after each event (i.e. a sports event), we will opt for speed, for now.',
  WHITE_PAPER_SETTLEMENT_2: 'In the first release, the Core Ninja Team will assume the reporting role and report the outcome of all events. We’re researching and designing a decentralized mechanism that will allow the community to report the outcomes.',
  WHITE_PAPER_SUMMARY: 'Summary',
  WHITE_PAPER_SUMMARY_1: 'PEX is a purely peer-to-peer version of electronic prediction that allows parties to bet directly against each other without going through a central authority or bookmaker',
  WHITE_PAPER_SUMMARY_2: 'PEX is open-source; its design is public, nobody owns or controls PEX and everyone can take part.',
  WHITE_PAPER_SUMMARY_3: 'PEX is open source at',
  WHITE_PAPER_SUMMARY_4: 'Build PEX with us. Join the conversation at',
  WHITE_PAPER_END: 'And it actually works',
  WHITE_PAPER_END_1: 'Hey, thanks for reading. Ninja will go live on the testnet on 5 June! We’re excited to hear your thoughts.',
};
