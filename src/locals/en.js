import { URL } from '@/constants';
import React from 'react';
import { Link } from 'react-router-dom'

export default {
  app: {
    name: 'Ninja',
    fullname: 'Ninja: Anonymous Peer-to-Peer Prediction Exchange',
    description: 'Anonymous Peer-to-Peer Prediction Exchange',
    loading: 'Loading...',
    navigation: {
      me: 'Me',
      exchanges: 'Exchanges',

      whisper: 'Whisper',
      wallet: 'Wallet',
      setting: 'Me',
      atm: 'ATM',
      bet: 'Bet',
      credit: 'CC',
      shop: 'Shop',
    },
  },
  buy: 'Buy',
  sell: 'Sell',
  amount: 'amount',
  askUsingCreditCard: 'for {total} {fiatCurrency} using card?',
  change: 'Change',
  ccNumber: 'Number',
  ccExpire: 'Expiry',
  ccCVC: 'CVC',
  overCCLimit: 'You have reached your credit card limit({currency}{limit} per day)! You have already used {currency}{amount} today.',

  required: 'Required',
  ccExpireTemplate: 'MM/YY',
  securityCode: '325',
  shakeNow: 'Shake',
  offerHandShakeContent: '{offerType} {amount} {currency} for {total} {currency_symbol} in {payment_method}?',
  offerHandShakeContentMe: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMe: '{offerType} {something} for {amount} {currency}',
  offerHandShakeContentMeDone: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeExchangeContentMeDone: '{offerType} {something} for {amount} {currency}',
  instantOfferHandShakeContent: 'You{just}{offerType} {amount} {currency} for {total} {currency_symbol} on your card',
  offerDistanceContent: '{distance} away',
  transactonOfferInfo: 'Successful ({success}) / Failed ({failed})',
  createOfferConfirm: 'You are about to {type} {something} by {amount} {currency}',
  handshakeOfferConfirm: 'You are about to {type} {something} for {amount} {currency}',
  rejectOfferConfirm: 'Do you want to Reject this order? You will not be able to make transactions for 4 hours.',
  rejectOfferConfirmForShop: 'Do you want to Reject this order?',
  completeOfferConfirm: 'Complete the transaction? Your buyer will receive coin in a few minutes.',
  withdrawOfferConfirm: 'Are you sure you want to withdraw?',
  cancelOfferConfirm: 'Cancel this order?',
  closeOfferConfirm: 'Do you want to delete your offer?',
  acceptOfferConfirm: 'Accept to continue transaction?',
  createOfferSuccessMessage: 'Success! You have created an offer on Ninja.',
  updateOfferSuccessMessage: 'Success! You have updated the offer on Ninja.',
  shakeOfferSuccessMessage: 'Success! A ninja has shaked on your order.',
  closeOfferSuccessMessage: 'Success! Your order is now closed.',
  completeShakedfferSuccessMessage: 'You have successfully shaked on Ninja',
  cancelShakedfferSuccessMessage: 'You have cancelled your order ',
  withdrawShakedfferSuccessMessage: 'Your offer has been withdrawn.',
  buyUsingCreditCardSuccessMessge: 'Your order using your credit card has gone through.',
  notEnoughCoinInWallet: 'You don\'t have enough coin right now. Please top up your wallet.',
  threeDSecureNotSupported: 'Not supported this card',

  createOfferStoreConfirm: 'Do you want to set up an offer to {intentMsg}?',
  updateOfferStoreConfirm: 'Update your ATM?',
  notEnoughCoinInWalletStores: 'You don\'t have enough coin right now. Do you want to top up your wallet?',
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
  'ex.create.label.amountBuy.update': 'New limit per purchase',
  'ex.create.label.amountSell': 'I want to sell',
  'ex.create.label.amountSell.update': 'New limit per sale',
  'ex.create.label.currentBalance': 'Current limit',
  'ex.create.label.marketPrice': 'Current market price',
  'ex.create.label.premiumBuy': 'My price',
  'ex.create.label.premiumSell': 'My price',
  'ex.create.label.premiumSellExplanation': 'Market price ± percentage',
  'ex.create.label.nameStation': 'ATM name',
  'ex.create.label.stationCurrency': 'ATM currency',
  'ex.create.placeholder.stationCurrency': 'Select a currency',
  'ex.create.label.phone': 'Phone',
  'ex.create.label.address': 'Meet-up place',
  'ex.create.label.beASeller': 'Be a seller',
  'ex.create.label.beASeller.update': 'Update sale information',
  'ex.create.label.beABuyer': 'You can also be a buyer',
  'ex.create.label.beABuyer.update': 'Update buy request',
  'ex.create.label.stationInfo': 'ATM information',

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
  'ex.credit.banner.text': 'Sell crypto quickly online. 100% secure. Set your own rates',
  'ex.discover.banner.btnText': 'BECOME AN ATM',
  'ex.credit.banner.btnText': 'SELL CRYPTO NOW',
  'ex.discover.shakeDetail.label.amount': 'Amount',
  'ex.discover.shakeDetail.label.total': 'Total',
  'ex.discover.shakeDetail.label.maximum': 'Maximum:',
  'ex.me.label.with': 'With',
  'ex.me.label.from': 'From',
  'ex.me.label.about': 'About',
  'ex.btn.confirm': 'Confirm',
  'ex.btn.OK': 'OK',
  'ex.btn.notNow': 'Not now',
  'ex.btn.topup.now': 'Top up now ',
  'ex.btn.create.atm': 'Create my ATM first ',
  'ex.btn.update.atm': 'Update my ATM first ',
  'ex.label.buy': 'Buy',
  'ex.label.sell': 'Sell',
  'ex.label.bought': 'Bought',
  'ex.label.sold': 'Sold',
  'ex.label.buying': 'Buying',
  'ex.label.selling': 'Selling',
  'ex.label.receiving': 'Receiving',
  'ex.label.buyer': 'Buyer',
  'ex.label.seller': 'Seller',
  'ex.label.sale': 'Sale',
  'ex.label.purchase': 'Purchase',
  'ex.label.cost': 'Cost',

  'ex.exchange.status.created': 'Verifying',
  'ex.exchange.status.active': 'Active',
  'ex.exchange.status.closing': 'Processing',
  'ex.exchange.status.closed': 'Deleted',
  'ex.exchange.status.shaking': 'Processing',
  'ex.exchange.status.shake': 'Processing',
  'ex.exchange.status.completing': 'Processing',
  'ex.exchange.status.completed': 'Success',
  'ex.exchange.status.pre_shaking': 'Processing',
  'ex.exchange.status.pre_shake': 'Processing',
  'ex.exchange.status.rejecting': 'Processing',
  'ex.exchange.status.rejected': 'Rejected',
  'ex.exchange.status.cancelling': 'Processing',
  'ex.exchange.status.cancelled': 'Cancelled',

  'ex.shop.explanation.created': 'This may take a few minutes. Good things come to those who wait.',
  'ex.shop.explanation.active': 'You can now discover your ATM in Cash.',
  'ex.shop.explanation.closing': 'Please wait a few minutes.',
  'ex.shop.explanation.closed': '',
  'ex.shop.explanation.shaking': 'Accepting the other party\'s offer...',
  'ex.shop.explanation.shake': 'Accepted. You will receive coin in a few minutes.',
  'ex.shop.explanation.completing': 'Accepted. You will receive coin in a few minutes.',
  'ex.shop.explanation.completed': '',
  'ex.shop.explanation.pre_shaking': 'Be patient - it can take a couple of minutes for your coin to be sent to escrow.',
  'ex.shop.explanation.pre_shake': 'Waiting for the ATM to accept your offer.',
  'ex.shop.explanation.rejecting': 'Rejecting the offer. Please wait a few minutes.',
  'ex.shop.explanation.rejected': '',
  'ex.shop.explanation.cancelling': 'Cancelling your offer. Please wait a few minutes.',
  'ex.shop.explanation.cancelled': '',

  'ex.cc.status.processing': 'Processing',
  'ex.cc.status.success': 'Done',
  'ex.cc.status.cancelled': 'Failed',

  'ex.shop.status.created': 'Setting up your ATM',
  'ex.shop.status.active': 'ATM listed',
  'ex.shop.status.closing': 'Deleting your ATM',
  'ex.shop.status.closed': 'Deleted',

  'ex.shop.shake.status.pre_shaking': 'Processing',
  'ex.shop.shake.status.pre_shake': 'Processing',
  'ex.shop.shake.status.shaking': 'Processing',
  'ex.shop.shake.status.shake': 'Processing',
  'ex.shop.shake.status.rejecting': 'Processing',
  'ex.shop.shake.status.rejected': 'Rejected',
  'ex.shop.shake.status.completing': 'Processing',
  'ex.shop.shake.status.completed': 'Success',
  'ex.shop.shake.status.cancelling': 'Processing',
  'ex.shop.shake.status.cancelled': 'Cancelled',

  'ex.shop.shake.buyer.seller': '{buyerSeller} order',
  'ex.shop.shake.label.information': 'Information',
  'ex.shop.shake.label.phone': 'Phone',
  'ex.shop.shake.label.reviews': 'Reviews',
  'ex.shop.shake.label.reviews.count': '({reviewCount} reviews)',
  'ex.shop.shake.label.cash.inventory': 'Cash',
  'ex.shop.shake.label.coin.inventory': 'Coin',
  'ex.shop.shake.label.days': 'days',

  'ex.shop.dashboard.label.transaction.successfull.failed': 'Transactions successful/failed',
  'ex.shop.dashboard.label.transaction.pending': 'Transactions pending',
  'ex.shop.dashboard.label.revenue': 'Bought/sold revenue',
  'ex.shop.dashboard.label.transaction.total': 'Total bought/sold',

  'ex.shop.dashboard.button.updateInventory': 'Update your ATM',
  'ex.shop.dashboard.label.trial': 'Trial',

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
  'ex.error.304': 'Credit card is invalid',
  'ex.error.309': 'You already have a listing! To change your rates, please cancel your current listing.',
  'ex.error.319': 'Please type 0.5 ETH only.',
  'ex.error.320': 'The early bird program has ended, please cash in to trade with us.',
  'ex.error.322': 'Your information is incorrect. Please input again',
  'ex.error.323': 'Exceeding global credit limit. Please try again tomorrow.',
  'ex.error.324': 'Credit exists',
  'ex.error.325': 'Credit price changed',
  'ex.error.326': 'Busy day for our CC - we don’t have enough coin for your request! Please try with smaller amount.',
  'ex.error.327': 'Credit item status is invalid',
  'ex.error.default': 'Oops! Something went wrong.',

  'ex.earlyBird.label.1': 'WELCOME TO OUR <br/> EARLY BIRD PROGRAM!',
  'ex.earlyBird.label.2': 'Create your ATM with <br /><span class="intro-amount">{freeETH} ETH</span> free now!',
  'ex.earlyBird.btn': 'Open ATM',

  // 'ex.seo.title': 'Ninja: the anonymous exchange of anything.',
  // 'ex.seo.meta.description': 'Swap coin for cash in your local neighborhood. Trade predictions on anything, anywhere, with anyone. No downloads, no sign ups. 100% anonymous.',

  'error.required': 'Required',
  'error.requiredOne': 'You need to fill in one of these!',
  'error.greaterThan': 'Must be greater than {min}',
  'error.lessThan': 'Must be less than {max}',
  'error.greaterThan.equal': 'Must be equal or greater than {min}',
  'error.lessThan.equal': 'Must be less than or equal {max}',
  'error.mustBeANumber': 'Must be a number',
  'error.mustBeAPositiveInteger': 'Must be a integer number greater or equal 0',

  'btn.initiate': 'Initiate',
  'btn.shake': 'Shake',
  'btn.reject': 'Reject',
  'btn.complete': 'Complete',
  'btn.withdraw': 'Withdraw',
  'btn.cancel': 'Cancel',
  'btn.close': 'Close',
  'btn.accept': 'Accept',
  'btn.delete': 'Delete',
  'btn.update': 'Update',

  'ex.landing.menu.about': 'ABOUT',
  'ex.landing.menu.blog': 'BLOG',
  'ex.landing.menu.faq': 'FAQ',
  'ex.landing.menu.contact': 'CONTACT',

  'ex.landing.intro.label.1': 'We are available on mobile only',
  'ex.landing.intro.label.2': 'Switch to your phone now to start making money with us!',

  'ex.landing.description.label.1': 'Set up an ATM <br/>& make some money',
  'ex.landing.description.label.2': `Ninja Cash is a decentralized peer to peer (P2P) cryptocurrency exchange that allows users to trade ETH and BTC for cash. You can join us anonymously: no signup, no ID verification, no fraud<br/><a href="${URL.ABOUT_NINJA_CASH}" class="btn-read-more">Read more</a> about us here`,

  'ex.landing.features.label.1': 'Your market. Your rates',
  'ex.landing.features.label.2': 'Secured with blockchain technology',
  'ex.landing.features.label.3': 'No KYC information',
  'ex.landing.features.label.4': 'Trade with other Ninjas in your area',

  'ex.landing.tryTelegram.label': 'Try out the platform for FREE by joining the conversation on Telegram',
  'ex.landing.tryTelegram.btn': 'Join Telegram',

  'ex.about.label.about': 'About',
  'ex.about.description': 'Ninja Cash is a peer to peer decentralized cryptocurrency exchange - where you remain anonymous. We got rid of extensive KYC practices, and then we put it on the blockchain. We welcome into our dojo anyone interested in disruption, games of stealth, and decentralized tech.<br/><br/>Ninjas create blockchain powered solutions that are both practical and playful, and apply them to industries plagued by rampant fraud, greedy middlemen and pointless bureaucracy.<br/><br/>Our team of ninjas is based in California, United States.',
  'ex.about.label.connectWith': 'Connect with the team',
  'ex.about.label.website': 'Website',
  'ex.about.label.telegram': 'Telegram',
  'ex.about.label.medium': 'Medium',
  'ex.about.label.github': 'Github',
  'ex.about.label.twitter': 'Twitter',
  'ex.discover.label.sortby': 'Sort by:',
  'ex.sort.distance': 'Distance',
  'ex.sort.price': 'Best Price',
  'ex.sort.rating': 'Rating',
  'ex.sort.price.buy.btc': 'Buy BTC',
  'ex.sort.price.sell.btc': 'Sell BTC',
  'ex.sort.price.buy.eth': 'Buy ETH',
  'ex.sort.price.sell.eth': 'Sell ETH',
  'ex.discover.label.open.atm': 'Open ATM',
  'ex.discover.label.manage.atm': 'Manage ATM',
  'ex.discover.label.dashboard': 'Dashboard',
  product_info: 'Ninja is open-source, decentralized software that never holds your funds. By freely choosing to use Ninja, the user accepts sole responsibility for their behavior and agrees to abide by the legalities of their governing jurisdiction. Ninja cannot be liable for legal, monetary or psychological damages should you do something stupid. Never invest more than you are willing to lose. Play safe!',

  'cc.label.1': 'Buy crypto with credit card',
  'cc.label.2': 'Ninja has some of the best prices around',
  'cc.label.3': 'Common packages:',
  'cc.btn.buyNow': 'Select',
  'cc.btn.payNow': 'Pay now',
  'cc.label.basic': 'Basic',
  'cc.label.pro': 'Pro',
  'cc.label.plus': 'Plus',
  'cc.label.cardNo': 'Card number',
  'cc.label.cvv': 'CVV',
  'cc.label.expiration': 'Expiration date',
  'cc.label.saveCard': 'Save my card for future top-up',
  'cc.label.saving': 'You save {percentage}%',
  'cc.label.email': 'Email',
  'cc.label.email.hint': 'Just for receiving receipt',

  'escrow.label.depositCoin': 'Sell crypto online',
  'escrow.label.iWantTo': 'Deposit any amount of crypto into escrow and enter your percentage',
  'escrow.label.price': 'Price',
  'escrow.label.percentage': 'Percentage',
  'escrow.label.howToCalculatePrice': 'How do I calculate my percentage?',
  'escrow.label.yourSellingPrice': 'Your selling price',
  'escrow.label.sellingPriceCaption': '= Market price + your percentage',
  'escrow.btn.depositNow': 'Deposit now',
  'escrow.btn.depositSuccessMessage': 'Deposit success',
  'escrow.label.wallet.setDefaultWallet': 'You must set default wallet {currency}',

  'dashboard.heading': 'Dashboard',
  'dashboard.label.overview': 'Overview',
  'dashboard.label.transaction': 'Transaction',
  'dashboard.label.manageAssets': 'Manage assets',
  'dashboard.btn.deactivate': 'Pause',
  'dashboard.btn.reactivate': 'Activate',
  'dashboard.btn.depositing': 'Depositing...',
  'dashboard.btn.topUpByCC': 'Top up ATM with credit card',
  'dashboard.btn.scanQRCode': 'Scan QR code',
  'dashboard.btn.depositEscrow': 'Deposit to Escrow',
  'dashboard.btn.withdrawEscrow': 'Withdraw',
  'dashboard.label.amountSold': 'Crypto sold',
  'dashboard.label.amountLeft': 'Crypto remaining',
  'dashboard.label.currentPrice': 'Your price ({currency}/{fiatCurrency})',
  'dashboard.label.revenue': 'Revenue (USD)',
  'dashboard.label.yourBalance': 'Your balance (USD)',
  'dashboard.label.or': 'or',
  'dashboard.label.deposit.description1': 'Need even more security? Use Escrow. ',
  'dashboard.label.deposit.description2': 'Fraud-proof. 100% secured. Safety guaranteed.',

  'askLocationPermission.label.1': 'We would like to access your location to find nearest ATMs around you!',
  'askLocationPermission.label.2': `<span>Please click <strong>"Allow"</strong> to start trading now!</span>`,
  'askLocationPermission.btn.dontAllow': `Don't Allow`,
  'askLocationPermission.btn.allow': 'Allow',

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
      answer: 'Yes. Ninja only accepts ETH for now, but support will be added for other currencies very soon.',
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

  // Landing Page
  'landing_page.btn.joinOurTeam': 'Join our team',
  'landing_page.btn.goToLandingPage': 'Go to landing page',

  'landing_page.header.product': 'PRODUCT',
  'landing_page.subHeader.product': 'Ninja builds applications and protocols for the new decentralized Internet.',
  'landing_page.detail.thanksForSubscribing': 'Thank you for subscribing!',
  'landing_page.detail.email_placeholder': 'Enter your email address',
  'landing_page.recruiting.intro.label': `<h1 class="mt-2"><strong>Hey Ninja</strong></h1><div class="intro-text-2">Come join the dojo.</div><span class="intro-text-3">We build decentralized apps, protocols and moonshot ideas for the new wild west world web.  Reinvent the Internet with us.</span>`,
  'landing_page.recruiting.intro.btn': 'Become a Ninja',
  'landing_page.recruiting.label.noJobs': 'No jobs available',
  'landing_page.recruiting.label.getTheWordOut': 'Get the word out. Earn ETH.',
  'landing_page.recruiting.label.backToListing': 'Back to listing',
  'landing_page.recruiting.button.applyNow': 'Apply now',
  'landing_page.recruiting.button.referFriend': 'Refer a friend',
  'landing_page.recruiting.applyNow.title': 'Import your profile',
  'landing_page.recruiting.applyNow.label.uploadDocs': 'Upload document',
  'landing_page.recruiting.applyNow.label.weAccept': 'We accept .doc, .pdf and .png files, up to 2 MB.',
  'landing_page.recruiting.applyNow.label.or': 'Or',
  'landing_page.recruiting.applyNow.label.submit': 'Submit',
  'landing_page.recruiting.applyNow.label.connectToLinkedIn': 'Connect with Ninja LinkedIn',
  'landing_page.recruiting.applyNow.label.thankYou': 'Thank you for your application!',
  'landing_page.recruiting.applyNow.label.weReview': 'We\'ll review your application and contact you for an interview within 3 days if your skills are qualified.',
  'landing_page.recruiting.referFriend.title': 'Refer a friend',
  'landing_page.recruiting.referFriend.label.yourPhone': 'Your phone',
  'landing_page.recruiting.referFriend.label.yourEmail': 'Your email',
  'landing_page.recruiting.referFriend.label.jobPosition': 'Choose applied job',
  'landing_page.recruiting.referFriend.placeholder.phone': 'Enter your phone',
  'landing_page.recruiting.referFriend.placeholder.email': 'Enter your email',
  'landing_page.recruiting.referFriend.placeholder.saySomething': 'Say something about your friend (optional)...',
  'landing_page.recruiting.referFriend.label.uploadCV': 'Upload your friend\'s CV',
  'landing_page.recruiting.referFriend.label.thankYou': 'Thank you for referral!',
  'landing_page.recruiting.referFriend.label.weReview': 'We\'ll review your friend\'s CV and contact him/her for an interview within 3 days if your skills are qualified.',


  'landing_page.products.cash.title': 'Cash',
  'landing_page.products.cash.subTitle': 'Buy crypto with cash. Secure, anonymous, easy.',
  'landing_page.products.prediction.title': 'Prediction',
  'landing_page.products.prediction.subTitle': 'Bet on anything against anyone, anywhere. Guaranteed payout. Your odds. 100% anonymous.',
  'landing_page.products.wallet.title': 'Wallet',
  'landing_page.products.wallet.subTitle': 'A decentralized cryptocurrency wallet. No downloads. No sign ups.',
  'landing_page.products.hivepay-offline.title': 'Pay for stores',
  'landing_page.products.hivepay-offline.subTitle': 'Seamlessly integrate cryptocurrency payments into your offline business.',
  'landing_page.products.hivepay-online.title': 'Pay for devs',
  'landing_page.products.hivepay-online.subTitle': 'Connect your e-commerce business with a truly borderless payment network.',
  'landing_page.products.dad.title': 'Decentralized Autonomous Dataset',
  'landing_page.products.dad.subTitle': 'Building decentralized datasets to advance AI.',
  'landing_page.products.whisper.title': 'Whisper',
  'landing_page.products.whisper.subTitle': 'The new mailbox for the new internet.',
  'landing_page.products.fund.title': 'Ninja fund',
  'landing_page.products.fund.subTitle': 'Ninja Fund is a smart-contract secured investment platform. Connecting skilled traders and savvy investors to intelligently grow cryptocurrencies.',

  'landing_page.header.research': 'RESEARCH',
  'landing_page.subHeader.research': 'Ninja conducts fundamental research toward the creation of the new internet.',

  'landing_page.researches.uncommons.title': 'Uncommons',
  'landing_page.researches.uncommons.subTitle': 'The people\'s blockchain.',

  'landing_page.researches.internetCash.title': 'Internet Cash',
  'landing_page.researches.internetCash.subTitle': 'The Internet deserves to have its own native currency.',

  'landing_page.label.footer': `Building blockchain powered apps, tools and solutions for the new wild west world web.<br />Join the dojo: <a href="https://t.me/ninja_org" class="landing-link">t.me/ninja_org</a><br />Contact us: <a href="mailto:support@ninja.org" class="landing-link" target="_top">support@ninja.org</a>`,
  'landing_page.label.joinTelegram': `Join the dojo on <a href="https://t.me/ninja_org" class="landing-link">Telegram</a>`,
  // 'landing_page.label.airdrop': `Jump in for <a href="#" class="landing-link">Airdrop</a>`,
  'landing_page.label.whitepaper': `Jump in for <a href="https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8" class="landing-link">Whitepaper</a>`,
  'landing_page.label.btnSubmitEmail': 'Go',
  // 'landing_page.label.faq': `We answered your <a href="#" class="landing-link">FAQ</a>`,

  // 'landing_page.breadcrumb.home': 'Home',

  'landing_page.cash.breadcrumb': 'Cash',
  'landing_page.cash.heading': 'Buy crypto with cash. Secure, anonymous, easy.',
  'landing_page.cash.subHeading': 'Ninja Cash is a decentralized peer to peer (P2P) cryptocurrency exchange that allows users to trade ETH and BTC for cash. Anonymous and immediate: no signup, no ID verification. Blockchain secured and fraud proof.',
  'landing_page.cash.textEmail': `To start trading, please open <a href="https://ninja.org/cash">ninja.org/cash</a> on your mobile browser.`,
  'landing_page.cash.label.sendLinkToEmail': `Send link to your email:`,
  'landing_page.cash.btnSubmitEmail': 'Go',
  'landing_page.cash.joinTelegram': `Join the dojo on <a href="https://t.me/ninjacash" class="landing-link">Telegram</a>`,
  'landing_page.cash.whitepaper': `Read more about <a href="https://medium.com/@ninja_org/introducing-ninja-cash-b0d51a9f4e1b" class="landing-link">Cash</a>`,
  'landing_page.cash.youtubeVideoId': '9L1IltkvU9g',

  'landing_page.cash-for-business.breadcrumb': 'CRYPTO ATM',
  'landing_page.cash-for-business.heading': 'A user friendly ATM for Bitcoin, Ethereum, and Litecoin',
  'landing_page.cash-for-business.subHeading':
    `<ul>
      <li>Flexible investment: no fixed term contracts</li>
      <li>Beat the banks: super low transaction fees</li>
      <li>Take charge: You set your profit margins</li>
    </ul>`,
  'landing_page.cash-for-business.textEmail': `To start trading, please open <a href="https://ninja.org/cash">ninja.org/cash</a> on your mobile browser.`,
  'landing_page.cash-for-business.label.sendLinkToEmail': `Send link to your email:`,
  'landing_page.cash-for-business.btnSubmitEmail': 'Go',
  // 'landing_page.cash-for-business.cta1': 'GET STARTED for FREE',
  // 'landing_page.cash-for-business.cta1_url': 'https://ninja.org/cash',
  // 'landing_page.cash.cta2': 'Get free gifts',
  // 'landing_page.cash.cta2_url': 'https://t.me/ninjacash',
  'landing_page.cash-for-business.joinTelegram': `Join the dojo on <a href="https://t.me/ninjacash" class="landing-link">Telegram</a>`,
  'landing_page.cash-for-business.whitepaper': `Read more about <a href="https://medium.com/@ninja_org/introducing-ninja-cash-b0d51a9f4e1b" class="landing-link">Cash</a>`,
  'landing_page.cash-for-business.youtubeVideoId': '9L1IltkvU9g',

  'landing_page.prediction.breadcrumb': 'Prediction',
  'landing_page.prediction.heading': 'Bet on anything against anyone, anywhere. Guaranteed payout. Your odds. 100% anonymous.',
  'landing_page.prediction.subHeading': 'You create the bets, set the odds, and play directly with other parties. Bet with blockchain technology to bypass the bookies and the books - take down the house and make your own luck.',
  'landing_page.prediction.textEmail': `To play, please open <a href="https://ninja.org/prediction">ninja.org/prediction</a> on your mobile browser.`,
  'landing_page.prediction.label.sendLinkToEmail': `For updates, direct from the dojo:`,
  'landing_page.prediction.btnSubmitEmail': 'Go',
  'landing_page.prediction.joinTelegram': `Join the dojo on <a href="https://t.me/ninja_org" class="landing-link">Telegram</a>`,
  'landing_page.prediction.whitepaper': `Read our <a href="https://medium.com/@ninja_org/shakeninja-bex-1c938f18b3e8" class="landing-link">whitepaper</a> | Find us on <a href="https://github.com/ninjadotorg" class="landing-link">Github</a>`,
  'landing_page.prediction.youtubeVideoId': '-YYp9yW4RDQ',

  'landing_page.wallet.breadcrumb': 'Wallet',
  'landing_page.wallet.heading': 'A decentralized cryptocurrency wallet. No downloads. No sign ups.',
  'landing_page.wallet.subHeading': 'A decentralized cryptocurrency wallet and payment gateway that will allow both businesses and users to easily store and use multiple cryptocurrencies for payments.',
  'landing_page.wallet.textEmail': `To create your wallet, please open <a href="https://ninja.org/wallet">ninja.org/wallet</a> on your mobile browser.`,
  'landing_page.wallet.label.sendLinkToEmail': `Send link to your email:`,
  'landing_page.wallet.btnSubmitEmail': 'Go',
  'landing_page.wallet.youtubeVideoId': '',

  'landing_page.pay-for-stores.breadcrumb': 'Pay For Stores',
  'landing_page.pay-for-stores.heading': 'Seamlessly integrate cryptocurrency payments into your offline business.',
  'landing_page.pay-for-stores.subHeading': 'Allow your offline customers to pay for goods and services in cryptocurrency, just by scanning a QR code. Give the millions of people who own crypto somewhere to spend it.',
  'landing_page.pay-for-stores.textEmail': 'Be the first to hear when we launch',

  'landing_page.pay-for-devs.breadcrumb': 'Pay For Devs',
  'landing_page.pay-for-devs.heading': 'Connect your e-commerce business with a truly borderless payment network.',
  'landing_page.pay-for-devs.subHeading': 'Millions of people are looking to spend their cryptocurrency in a secure, convenient way. Bring the currency of the future into your online store today and stop relying on the sluggish banking industry. No wait times, no bank charges, no card fees.',
  'landing_page.pay-for-devs.textEmail': 'Be the first to hear when we launch',

  'landing_page.internet-cash.breadcrumb': 'Internet Cash',
  'landing_page.internet-cash.heading': 'The Internet deserves to have its own native currency.',
  'landing_page.internet-cash.subHeading': 'While Bitcoin emerges as a powerful currency, it fails to be the everyday currency.  Bitcoin will never be the currency that you can use to pay for coffee or buy a t-shirt.  This project aims to build a new kind of cryptocurrency that behaves like cash in everyday life.',
  'landing_page.internet-cash.textEmail': 'Be the first to know when we launch',

  'landing_page.dad.breadcrumb': 'Decentralized Autonomous Dataset',
  'landing_page.dad.heading': 'Building decentralized datasets to advance AI.',
  'landing_page.dad.subHeading': 'Today, data is controlled by a handful of corporations. The people who need data to develop AI can\'t access it. The people who created the data see no rewards. DAD will solve both problems.',
  'landing_page.dad.textEmail': 'Be the first to hear when we launch',

  'landing_page.uncommons.breadcrumb': 'Uncommons',
  'landing_page.uncommons.heading': 'The people\'s blockchain.',
  'landing_page.uncommons.subHeading': 'No token tricks, no gas fees and no exclusive parties. Help build a blockchain where anyone can develop, use and explore for free. The new internet should belong to you.',
  'landing_page.uncommons.textEmail': 'Be an uncommoner.',
  'landing_page.uncommons.btnSubmitEmail': 'Show me how',

  'landing_page.whisper.breadcrumb': 'Whisper',
  'landing_page.whisper.heading': 'The new mailbox for the new internet.',
  'landing_page.whisper.subHeading': 'An alternative messaging system in this era of surveillance. End-to-end encrypted, anonymous conversations between you and your world. No downloads, sign ups, or subscriptions. Now you can control who\'s listening.',
  'landing_page.whisper.textEmail': `To start chatting, please open <a href="https://ninja.org/whisper">ninja.org/whisper</a> on your mobile browser.`,
  'landing_page.whisper.label.sendLinkToEmail': `Send link to your email:`,
  'landing_page.whisper.btnSubmitEmail': 'Go',

  // MobileOrTablet components
  MOT_TITLE: 'The anonymous exchange of anything',
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
  COIN_EXCHANGE_LP_FAQ_TITLE: 'Frequently asked questions',
  'landing_page.cash.faq': [
    {
      question: 'What is Ninja Cash?',
      answer: 'Ninja Cash is a peer-to-peer decentralized exchange where people can easily exchange cryptocurrency for cash. We want to make sure that traders are able to set up their own ATMs and set their own prices - not have to rely on market prices to buy and sell cryptocurrency.',
    },
    {
      question: 'Is it easy to set up an ATM?',
      answer: <span>It is really simple to set up a ATM on Ninja Cash. We have written some step by step instructions for you <a target="__blank" href="https://medium.com/@ninja_org/a-step-by-step-guide-on-how-to-sell-btc-eth-for-cash-on-ninja-5b30a87e42c2">here</a>.</span>,
    },
    {
      question: 'Where is Ninja Cash available?',
      answer: 'Ninjas are constantly joining us from all over the world. Anyone anywhere can set up an ATM. Just check out ninja.org and see if there is an ATM near you.',
    },
    {
      question: 'What documents do I need to provide to make an account on Ninja Cash?',
      answer: 'Nothing. We don’t need any of your personal information. An account is automatically created on your phone the first time you visit ninja.org.',
    },
    {
      question: 'Will I be truly anonymous on Ninja Cash?',
      answer: 'Yes. We don\'t ask for your real name, the only way people will know it\'s you is if you tell them!',
    },
    {
      question: 'Is Ninja Cash secure?',
      answer: 'Yes, keeping your money safe and your identity private is our top priority. All of the transactions conducted on Ninja Cash are secured through the use of smart contracts written on the Ethereum blockchain.',
    },
    {
      question: 'How do I buy cryptocurrency from Ninja Cash?',
      answer: 'Ninja Cash will connect you to other users in your area who are selling cryptocurrency. All you need to do is find someone who is selling for a price you like and you can then arrange the trade.',
    },
    {
      question: 'What currencies can I use on Ninja Cash?',
      answer: 'Ninja Cash is global, so it depends on where your ATM is set up. Usually, your trade will be made in the local currency.',
    },
    {
      question: 'How do I keep my wallet safe?',
      answer: <span>Secure your wallet with the provided series of words. No one can withdraw your coins without these words in the right order. We suggest that you don’t keep this password in your phone, but that you make a hard copy of it and keep it in a safe place.<br /><a target="__blank" href="https://medium.com/@ninja_org/how-to-back-up-your-ninja-wallet-its-really-quite-easy-d98a5ec1a671">Make sure you backup your wallet.</a></span>,
    },
    {
      question: 'How do I pay for coins?',
      answer: 'After you have connected with a fellow ninja, you will arrange a place to make the trade. Once you hand over your cash, the seller will confirm the deal on NinjaCash. At that moment, your newly-purchased cryptocurrency will be automatically transferred to your wallet out of escrow.',
    },
    {
      question: 'Are there any fees?',
      answer: 'ATM owners pay a 1% transaction fee.',
    },
    {
      question: 'How long does it take to complete a transaction?',
      answer: 'It really depends on what is happening on the Ethereum blockchain at that moment. We expect that transactions will take roughly 10-20 mins to go through. It may be longer if the blockchain is experiencing unusually high traffic - most likely due to the latest dApp sensation.',
    },
    {
      question: 'What happens if the transaction fails?',
      answer: 'You can always track your transaction history and if something goes wrong, don’t hesitate to contact us. We will figure out the problem as soon as we can and get back to you.',
    },
    {
      question: 'Can I buy coins on Ninja Cash using a credit card?',
      answer: 'Unfortunately, we don’t accept any credit card payments. We are looking to introduce that feature in the future.',
    },
    {
      question: 'Where is the coin held?',
      answer: 'The coin is kept in the Ninja wallet which is completely under your control.',
    },
    {
      question: 'How can I make sure my coin is transferred to me after I give the other ninja cash?',
      answer: 'As a buyer, you’ll be able to observe the seller approving the transaction. Once that happens, the cryptocurrency will be released from escrow and into your wallet.',
    }
  ],
  'landing_page.prediction.faq': [
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
      answer: 'Yes. Ninja only accepts ETH for now, but support will be added for other currencies very soon.',
    },
    {
      question: 'How do I start with Ninja?',
      answer: (
        <div>
          <div>– Get Ether:</div>
          <div>You can either buy ETH directly in PEX with your credit cards or from popular coin exchanges like Coinbase or Binance.</div>
          <br />
          <div>– Top up your PEX Wallet: </div>
          <div>Transfer the ETH into the PEX Wallet. PEX Wallet is completely decentralized, the private key is held on your phone, only you can transfer and receive ETH.</div>
          <br />
          <div>– Place a bet: </div>
          <div>Pick the market you want to bet (i.e. Brazil - Spain), the outcomes (i.e. Brazil wins) and the site (i.e. support or bet against the outcome)</div>
          <div>Enter the stake you want to bet (i.e. 1 ETH) and the odds (i.e. 1/ 2.25)</div>
          <div>The BEX Matching Engine will then find another order that bets against the odds you set.</div>
          <br />
          <div>– Wait for the report: if you win, your winnings will be automatically transferred from the escrow smart contract to your account.</div>
        </div>
      ),
    },
    {
      question: 'Can I set my own preferred odds? How?',
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
    {
      question: 'How do I start earning ETH/Bitcoin?/How do I put cryptocurrency in my wallet?',
      answer: <span>For instructions on how to play: <Link to={URL.PEX_INSTRUCTION_URL}>http://ninja.org/pex/prediction</Link></span>,
    }
  ],
  'landing_page.wallet.faq': [
    {
      question: 'What is Ninja Wallet?',
      answer: 'Ninja Wallet is a decentralized cryptocurrency wallet, that allows you to hold multiple cryptocurrencies. There are no downloads,  no sign ups and no fees.',
    },
    {
      question: 'How many cryptocurrencies can I use with Ninja Wallet?',
      answer: 'You can use BTC, BCH, ETH, ZEC, LTC, XRP, ERC20 Tokens and ERC721 Collectables.',
    },
    {
      question: 'How much does it cost to use?',
      answer: 'Ninja Wallet is open source and free for all users.',
    },
    {
      question: 'How do I create an account?',
      answer: <span>You simply go to our website <a href="https://ninja.org/wallet">www.ninja.org/wallet</a>. It will auto creates your wallet BTC, ETH etc on your device. Or you can import/restore you have.</span>,
    },
    {
      question: 'What countries can I use Ninja Wallet in?',
      answer: 'Ninja Wallet is available globally - all you need is access to a mobile device and the internet.',
    },
    {
      question: 'What happens if I swap/lose my phone? Will I lose my wallet?',
      answer: <span>We recommend all users backup their wallets as soon as they start using Ninja. We have explained how to backup your Ninja Wallet <a target="__blank" href="https://medium.com/@ninja_org/how-to-back-up-your-ninja-wallet-its-really-quite-easy-d98a5ec1a671">here</a>.</span>,
    }
  ],
  'landing_page.dad.faq': [
    {
      question: 'What is the DAD?',
      answer: 'The DAD or the Decentralized Autonomous Dataset is a crowdsourcing initiative, with the aim to collect data and reward users through blockchain incentives. We believe that this will be a positive step towards advancing AI, breaking barriers when it comes to Big Data.',
    },
    {
      question: 'How does it work?',
      answer: <span>Anyone can contribute their images to the DAD. <br/>All you need to do is join the platform, upload your photos, and any tags that will help to identify what they are, location etc.<br /><br />If you see a photo and you know where it was taken, or can add more information then just tag the image.</span>,
    },
    {
      question: 'Can anyone buy datasets from DAD?',
      answer: 'Yes, our datasets are available to everyone.',
    },
    {
      question: 'How are the profits distributed to the people who contribute?',
      answer: '10% of all profits will be kept for further development of the DAD platform. The remaining 90% of the profits will be evenly distributed to all the users that contributed to the dataset.',
    },
    {
      question: 'Can I track who has purchased my data?',
      answer: 'The DAD is built on top of Ethereum’s blockchain, this means that all transactions are public. You will be able to track your own data, and see who has purchased the datasets.',
    },
    {
      question: 'How can I contribute data to the DAD?',
      answer: 'All you need to do is go to our app and start contributing which every data you like, the more information (location, colour, etc) the better. We want to create decentralized datasets that are constantly growing and evolving.',
    },
    {
      question: 'How will the DAD benefit AI technology?',
      answer: 'AI needs data. Currently, there are only a few corporations that have access to the kind of big data that is needed for AI technology to learn and grow. We aim to solve this global issue by creating decentralized autonomous datasets that anyone will have access too.',
    },
    {
      question: 'How do I receive my payout from contributing data?',
      answer: 'You will automatically receive payout via your ETH address.',
    },
    {
      question: 'You don’t have the dataset I need, can you create one?',
      answer: 'Yes, all you need to do is put in a request for a specific dataset and we will begin to curate that dataset.',
    },
    {
      question: 'Once you have my data, do you have it forever?',
      answer: 'Yes all of the data that you contribute will be stored on the blockchain, this means it cannot be deleted. It also means that you will continue to receive payouts on DAD as long as your data is being sold.',
    }
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
        exist: 'Name already exists',
        success: 'Your alias has been recorded',
        required: 'Name required',
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
          label: 'Name',
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
    feed: {
      profileTitle: 'The face behind the mask',
      profileDescription: 'You, glorious you',
      shopTitle: 'Your ATM',
      shopDescription: 'Open for business',
      shopNoDataDescription: 'None yet. Set one up?',
      noDataMessage: 'Start a mission.',
      filterBy: 'Filter by:',
      cash: {
        predition: 'Prediction',
        cash: 'Cash',
        stationExplain: 'An ATM is where you can buy or sell cryptocurrency.',
        stationCreateSuggest: 'Got crypto? Create ATM to turn it into money making machine NOW!',
        restoreStation: 'Restore ATM',
        backupStation: 'Backup ATM',
        transactions: 'Transactions',
        dashboard: 'Dashboard',
        buyMoreCoin: 'Buy more coins now',
      }
    },
    credit: {
      overview: {
        askToDeactive: 'Pause your coin selling?',
        messageDeactiveSuccess: 'Pause successfully',
      },
      transaction: {
        amount: 'Amount',
        processing: 'Processing...',
        deposit: {
          title: 'DEPOSIT',
          percentage: 'Percentage',
        },
        withdraw: {
          title: 'WITHDRAW',
          toAccount: 'To Account',
        },
        transaction: {
          title: 'SELLING ORDER',
          selling: 'Selling',
          receiving: 'Receiving',
          fee: 'Fee',
        },
        instant: {
          title: 'PURCHASE ORDER',
          buying: 'Buying',
          cost: 'Cost',
        },
      },
      withdraw: {
        title: 'Withdraw money',
        yourBalance: 'Your balance (USD)',
        yourPapalName: 'Your Paypal email',
        amount: 'Amount (USD)',
        buttonTitle: 'Withdraw to your PayPal',
        description: <span>It will take within a day for us <br /> to transfer money into your account.</span>,
        askToWithdraw: 'Do you want to withdraw?',
        validate: {
          amountMustLargerThan0: 'Amount must larger than 0',
          amountMustLessThanBalance: 'Amount must not larger than your balance',
        }
      },
      withdrawSuccess: {
        description: 'Withdraw successfully!',
        descriptionTransfer: 'We will make the transfer very shortly within 24 hours',
        buttonTitle: 'Back to your dashboard',
      },
    },
  },

  discover: {
    noDataMessageCash: 'No ATMs near you yet. Be the first.',
    noDataMessageSwap: 'No vendors near you yet. Be the first',
    feed: {
      cash: {
        menu: {
          actionDescription: 'I WANT TO',
        },
        marker: {
          label: {
            price: 'Price',
            maxVolume: 'Max volume',
            tradeNow: 'Now',
          },
        },

      },
    },
  },
  create: {
    cash: {
      credit: {
        title: 'Buy coins',
      },
    },
  },

  wallet: {
    top_banner: {
      message: 'Shuriken Airdrop (limited)',
      button: 'Click here',
    },
    refers: {
      header: 'Shuriken Airdrop Mission',
      error: {
        submit_telegram: 'Couldn\'t find you on Telegram. Please exit the group and try again.',
        submit_twitter: 'You haven\'t followed us yet. Please try again.',
        confirm_code: 'Verification code is wrong. Please try again!',
        verify_code: 'Can\'t send verify email',
        get_token: 'Referral incomplete. Please try again.',
      },
      success: {
        submit_telegram: 'Welcome to our telegram group!',
        submit_twitter: 'Thanks for following us on Twitter.',
        confirm_code: 'Your email has been verified.',
        verify_code: 'Verification code has been sent to your email.',
        get_token: 'Success! 60 shurikens have been added to your wallet.',
        copy_link: 'Referral link copied to clipboard.',
      },
      button: {
        verified: 'Verified',
        verify: 'Verify',
        confirm: 'Confirm',
        reset_email: 'Reset email',
        get_token: 'Just give me tokens',
      },
      text: {
        title: '60 shiny Shurikens (SHURI).',
        telegram: 'Say hello on telegram.',
        telegram2: 'Leave your best joke for a chance to win more Shuri.',
        twitter: 'Twitter',
        twitter2: 'Our social media guy says we need followers on ',
        ninja_name: 'Receive your randomly generated ninja name.',
        referral_link: 'This is your super sexy referral link. You get 20 shurikens for every new ninja.',
        menu_amount: 'Shurikens straight into your pocket, when new ninjas bet through your referral link.',
        menu_total: 'ninja{0} you\'ve brought in.',
        profile_link: 'Share to get 20 free tokens.',
      },
      placeholder: {
        telegram_username: 'Your telegram alias',
        twitter_username: 'Your twitter username',
        email: 'Verification code',
        email2: 'Your favourite fake email',
      },
      label: {
        menu: 'Your clan',
        menu_description: 'Track your referrals and rewards here.',
      },
      table: {
        header: {
          user: 'User',
          date: 'Date',
          referalValue: 'Referal Value',
        },
      },
    },
    refers_dashboard: {
      header: 'Shuriken Airdrop Mission',
      title: 'This is your super sexy referral link. You get 20 shurikens for every new ninja.',
      text: {
        copy_link: 'Referral link copied to clipboard.',
        note: 'Do not change your alias or this link will be unvalid',
        number_ninjas: 'You brought {0} ninjas to the dojo.',
        number_total: 'Total reward: {0} SHURI',
      },
    },
    action: {
      payment: {
        button: {
          checkout: 'Checkout'
        },
        label: {
          from_wallet: 'From wallet',
          to_address: 'To address',
          wallet_balance: 'Wallet balance',
        },
        placeholder: {
          to_address: 'Wallet address...',
          select_wallet: 'Select a wallet',
        },
        error: {
          insufficient: 'You have insufficient coin to make the transfer.'
        },
        menu: {
          developer_docs: "Developer Docs",
          payment_buttons: "Payment Buttons",
          help: "Help & Support"
        }
      },
      preferecens:{
        list_item: {
          wallet_name: "Wallet Name",
          hide_balance: "Hide Balance",
          backup_wallet: "Backup Wallet",
          delete_wallet: "Delete Wallet",
        },
        update_name:{
          title: "Wallet name",
          label: "What do you call this wallet?",
          button: {
            save: "Save",
          }
        }
      },
      remove: {
        title: 'Remove',
        header: 'Are you sure?',
        message: 'This will permanently delete your wallet.',
        button_yes: 'Yes, remove',
        button_cancel: 'Cancel',
      },
      transfer: {
        title: 'Transfer coins',
        header: 'Transfer coins',
        to_address: {
          placeholder: 'Specify receiving...',
        },
        label: {
          from_wallet: 'From wallet',
          to_address: 'To wallet address',
          amount: 'Amount',
          usd: 'USD',
          wallet_balance: 'Wallet balance',
          scan_qrcode: 'Scan QR code',
        },
        placeholder: {
          to_address: 'Wallet address...',
          select_wallet: 'Select a wallet',
        },
        text: {
          confirm_transfer: 'Are you sure you want to transfer out ',
        },
        error: 'You don\'t have enough coin right now.',
        button: {
          transfer: 'Transfer',
          confirm: 'Confirm',
        },
      },
      copy: {
        title: 'Copy address to clipboard',
        message: 'Copy address to clipboard',
        success: 'Copied to clipboard',
      },
      default: {
        title: 'Set as default {0} wallet ',
      },
      cancel: {
        title: 'Cancel',
      },
      restore: {
        title: 'Restore wallets',
        error: 'Invalid wallets',
        header: 'Restore wallets',
        success: {
          restore: 'Your Wallet restore success',
        },
        button: {
          restore: 'Restore now',
        },
        description: 'Please enter your top secret recovery data to restore your wallet.',
      },
      setting: {
        title: 'Settings',
        error: 'Invalid wallets',
        header: 'Setting wallets',
        success: {
          restore: 'Your Wallet restore success',
          save_alternative_currency: 'Save alternative currency selected!',
          save_crypto_address: 'Save format crypto address seleted!'
        },
        label: {
          alternative_currency: 'Alternative currency',
          select_alternative_currency: 'Select alternative currency',
          crypto_address: 'Cryptocurrency address',
          select_crypto_address: 'Select cryptocurrency address',
          short_address: 'Show short address',
          shortest_address: 'Show shortest address',
          hide_address: 'Hide address'
        },
        button: {
          restore: 'Restore now',
        },
        description: 'Please enter your top secret recovery data to restore your wallet.',
      },
      import: {
        title: 'Add new / Import coin',
      },
      add_token:{
        title: 'Add custom token',
      },
      add_collectible: {
        title: 'Add collectible',
      },
      backup: {
        title: 'Backup wallets',
        header: 'Backup wallets',
        description: 'This data is the only way to restore your wallets. Keep it secret, keep it safe.',
        success: {
          copied: 'Recovery data copied to clipboard.',
        },
        button: {
          copy: 'Copy it somewhere safe',
        },
      },
      protect: {
        header: 'Secure this wallet',
        title: 'Secure this wallet',
        text: {
          step1_msg1: 'This passphrase will allow you to recover your funds if your phone is ever lost or stolen.',
          step1_msg2: 'Please make sure nobody has access to your passphrase. You can use a password manager or write it down and hide it under your mattress.',
          step1_label: 'I understand that if I lose my passphrase, I lose access to my account.',
          step2_msg1: 'Record these words carefully. Don\'t email it or screenshot it.',
          step3_msg1: 'Tap to put these words in the correct order.',
          need_secure: 'Need secure',
          need_backup: 'Needs Backup'
        },
        button: {
          continue: 'Continue',
          verify: 'Verify your passsphrase',
          copy_clipboard: 'Copy to clipboard',
          ok: 'OK',
        },
        error: {
          confirm: 'These words are in the wrong order. Please try again.',
        },
        success: 'Your wallet has been secured!',
      },
      receive: {
        title: 'Receive coins',
        header: 'Wallet address',
        header2: 'Custom Amount',
        message: 'Share your public wallet address to receive',
        title2: 'MY DESPOSIT ADDRESS',
        label: {
          address: 'Address',
          amount: 'Amount',
          usd: 'USD',
        },
        placeholder: {
          amount: 'Specify amount ...',
          choose_wallet: 'Choose a wallet ...',
        },
        link: {
          copy_address: "Copy address",
          download_qrcode: "Download QR code",
        },
        button: {
          share: 'Copy to share',
          request_amount: 'Request Specific amount ➔',
          done: 'Done',
          text: 'Copy address'
        },
        success: {
          share: 'Wallet address copied to clipboard.',
        },
      },
      create: {
        header: 'Create new wallet',
        label: {
          select_coints: 'Select coins',
          wallet_key: 'Wallet key',
          main_net: 'Mainnet wallets',
          test_net: 'Testnet',
          header_coins: "Cryptocurrencies",
          header_tokens: "ERC20 Tokens",
          header_collectibles: "ERC721 Collectibles",
        },
        text: {
          random: "Random",
          specify_phrase: "Specify recovery Phrase"
        },
        placeholder: {
          wallet_key: 'Wallet key',
          phrase: 'Type your 12 secret recovery words.',
        },
        button: {
          create: 'Create wallet',
          add_new: '+ Add new',
          done: "Done",
          request_free_eth: 'Request free ETH',
        },
        error:{
          recovery_words_invalid: "Cannot create wallet. Recovery words are invalid.",
          random: "Cannot create wallet. Please reload and try again"
        }
      },
      scan_qrcode: {
        header: 'Scan QR code',
      },
      transaction: {
        header: 'Transaction details',
      },
      history: {
        title: 'View transaction history',
        header: 'Transaction history',
        label: {
          balance_hidden: "Balance Hidden",
          failed: 'Failed',
          pending: 'Pending',
          unconfirmed: 'Unconfirmed',
          balance: 'Balance',
          transactions: 'Transactions',
          status: 'Status',
          confirmations: 'confirmations',
          success: 'success',
          error: "Error",
          detail_etherscan: 'View detail on etherscan.io',
          view_all_etherscan: 'Watch etherscan',
          self: "Self",
          sent: "Sent",
          received: "Received",
          create: "Create",
          transfer: "transfer",
          from: "from",
          to: "to",
          internal_transactions: "Internal",
          no_trans: "No transactions yet",
          no_internal_trans: "No internal transactions yet",
          coming_soon: "Coming soon ...",
          send: "Send",
          receive: "Receive",
        },
      },
    },
  },
  bitcoin: {
    error: {
      invalid_address: 'You can only send tokens to Bitcoin address',
      invalid_address2: 'Please enter a valid receiving address.',
      insufficient: 'You have insufficient coin to make the transfer.',
    },
    success: {
      transaction: 'Your transaction will appear on blockchain in about 30 seconds.',
    },
  },
  bitcoin_cash: {
    error: {
      invalid_address: 'You can only send tokens to BitcoinCash address',
      invalid_address2: 'Please enter a valid receiving address.',
      insufficient: 'You have insufficient coin to make the transfer.',
    },
    success: {
      transaction: 'Your transaction will appear on blockchain in about 30 seconds.',
    },
  },
  ethereum: {
    error: {
      invalid_address: 'You can only send tokens to Ethereum address',
      invalid_address2: 'Please enter a valid receiving address.',
      insufficient: 'You have insufficient coin to make the transfer.',
      insufficient_gas: 'You have insufficient coin to make the transfer with gas fee.',
    },
    success: {
      transaction: 'Your transaction will appear on blockchain in about 30 seconds.',
    },
  },
  ripple: {
    error: {
      invalid_address: 'You can only send tokens to Ripple address',
      invalid_address2: 'Please enter a valid receiving address.',
      insufficient: 'You have insufficient coin to make the transfer.',
      insufficient_gas: 'You have insufficient coin to make the transfer with gas fee.',
    },
    success: {
      transaction: 'Your transaction will appear on blockchain in about 30 seconds.',
    },
  },

  chat: {
    emptyMessage: 'Trade secrets here. All communication is encrypted and no one is listening.',
    notFoundUser: 'The Ninja you are looking for is not here. Perhaps you have their name wrong?',
    lastMessageContent: 'You lost the key to this secret message.',
    searchPlaceHolder: 'Enter a ninja’s name or alias.',
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

  // betting

};
