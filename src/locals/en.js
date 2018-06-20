export default {
  HELLO: 'hello {name}',
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
  createOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  handshakeOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
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
  offerStoreHandShakeContent: '{offerTypeBuy} {amountBuy} {currency} at {fiatAmountBuy} {fiatAmountCurrency}. {offerTypeSell} {amountSell} {currency} at {fiatAmountSell} {fiatAmountCurrency}',
  requireDefaultWalletOnMainNet: 'You must set your wallet on Mainnet',
  movingCoinToEscrow: 'Moving your coin to escrow. This may take a few minutes.',
  movingCoinFromEscrow: 'Moving your coin from escrow. This may take a few minutes.',
  'ex.create.label.amountBuy': 'I want to buy',
  'ex.create.label.amountSell': 'I want to sell',
  'ex.create.label.marketPrice': 'Current market price',
  'ex.create.label.premiumBuy': 'Your buying price',
  'ex.create.label.premiumSell': 'Your selling price',
  'ex.create.label.premiumSellExplanation': '= Market price ± percentage',
  'ex.create.label.nameStation': 'Station name',
  'ex.create.label.phone': 'Phone',
  'ex.create.label.address': 'Meet-up place',
  'ex.create.label.beASeller': 'Be a seller',
  'ex.create.label.beABuyer': 'You can also be a buyer',
  'ex.create.label.stationInfo': 'Station information',

  'ex.createLocal.label.iWantTo': 'I want to',
  'ex.createLocal.placeholder.anyItem': 'any item or service',
  'ex.createLocal.label.coin': 'Coin',
  'ex.createLocal.label.amount': 'Amount',
  'ex.createLocal.label.phone': 'Phone',
  'ex.createLocal.label.address': 'Meet-up place',

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

  'ex.exchange.status.created': 'created',
  'ex.exchange.status.active': 'active',
  'ex.exchange.status.closing': 'closing',
  'ex.exchange.status.closed': 'closed',
  'ex.exchange.status.shaking': 'shaking',
  'ex.exchange.status.shake': 'shake',
  'ex.exchange.status.completing': 'completing',
  'ex.exchange.status.completed': 'completed',
  'ex.exchange.status.withdrawing': 'withdrawing',
  'ex.exchange.status.withdraw': 'withdraw',
  'ex.exchange.status.rejecting': 'rejecting',
  'ex.exchange.status.rejected': 'rejected',

  'ex.cc.status.processing': 'Processing',
  'ex.cc.status.success': 'Done',
  'ex.cc.status.cancelled': 'Failed',

  'ex.shop.status.created': 'Verifying...',
  'ex.shop.status.active': 'Active',
  'ex.shop.status.closing': 'Pending...',
  'ex.shop.status.closed': 'Closed',

  'ex.shop.shake.status.pre_shaking': 'Shake pending',
  'ex.shop.shake.status.pre_shake': 'Shook',
  'ex.shop.shake.status.shaking': 'Shake pending...',
  'ex.shop.shake.status.shake': 'Shook',
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
};
