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
  overCCLimit: 'Your limit is {currency}{limit}. You have already used {currency}{amount} ',

  required: 'Required',
  ccExpireTemplate: 'MM/YY',
  securityCode: '325',
  shakeNow: 'Shake',
  offerHandShakeContent: '{offerType} {amount} {currency} for {total} {currency_symbol} in {payment_method}?',
  offerHandShakeContentMe: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  offerHandShakeContentMeDone: '{offerType} {amount} {currency} for {total} {currency_symbol} ({payment_method})',
  instantOfferHandShakeContent: 'You{just}{offerType} {amount} {currency} for {total} {currency_symbol} on your card - fee {fee}%',
  offerDistanceContent: '{distanceKm} km ({distanceMiles} miles) away',
  transactonOfferInfo: 'Successful ({success}) / Failed ({failed})',
  createOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  handshakeOfferConfirm: 'You are about to {type} {amount} {currency} for {total} {currency_symbol}',
  rejectOfferConfirm: 'Do you want to Reject this handshake? You will not be able to make transactions for 4 hours.',
  completeOfferConfirm: 'Do you want to Complete this handshake?',
  withdrawOfferConfirm: 'Do you want to Withdraw this handshake?',
  cancelOfferConfirm: 'Do you want to Cancel this handshake?',
  closeOfferConfirm: 'Do you want to Close this handshake?',
  acceptOfferConfirm: 'Do you want to Accept this handshake?',
  createOfferSuccessMessage: 'Create offer success',
  shakeOfferSuccessMessage: 'Shake offer success',
  closeOfferSuccessMessage: 'Close offer success',
  completeShakedfferSuccessMessage: 'Complete shaked offer success',
  cancelShakedfferSuccessMessage: 'Cancel shaked offer success',
  withdrawShakedfferSuccessMessage: 'Withdraw shaked offer success',
  buyUsingCreditCardSuccessMessge: 'Buy using Card success',
  notEnoughCoinInWallet: 'You only have {amount}({currency}) in default wallet {currency}. Fee ~ {fee}({currency}). Please add more',

  createOfferStoreConfirm: 'Do you want to create offer Buy {amountBuy} {currency} - Sell {amountSell} {currency}?',
  notEnoughCoinInWalletStores: 'You only have {amount}({currency}) in default wallet {currency}. Fee ~ {fee}({currency}). Please add more',
  addOfferItemSuccessMassage: 'Add offer item success',
  deleteOfferItemSuccessMassage: 'Delete offer item success',
  shakeOfferItemSuccessMassage: 'Shake offer item success',
  acceptOfferItemSuccessMassage: 'Accept offer item success',
  cancelOfferItemSuccessMassage: 'Cancel offer item success',
  rejectOfferItemSuccessMassage: 'Reject offer item success',
  completeOfferItemSuccessMassage: 'Complete offer item success',
  offerStoresAlreadyCreated: 'You have already create offer',
  offerStoreHandShakeContent: '{offerTypeBuy} {amountBuy} {currency} at {fiatAmountBuy} {fiatAmountCurrency}. {offerTypeSell} {amountSell} {currency} at {fiatAmountSell} {fiatAmountCurrency}',

  // FAQ
  FAQ_TITLE: 'Häufig gestellte Fragen',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: 'Dezentrale Vorhersage Exchange',
  FAQ_DATA: [
    {
      question: 'Was ist Ninja PEX?',
      answer: 'Ninja ist ein anonymen Peer-to-Peer-dezentrale Vorhersage-Austausch auf der Oberseite des Astraleums Blockchain ausgeführt.',
    },
    {
      question: 'Was ist besonders an PEX? Warum sollte ich auf eine Wette?',
      answer: 'Es kann Parteien direkt gegeneinander wetten, ohne den Umweg über eine zentrale Behörde oder Buchmacher. Dies macht es 100 % anonym, keine Anzeichen, keine Downloads erforderlich. Wetten-Management und die Abrechnung ',
    },
    {
      question: 'benötige ich Äther? Unterstützt es andere kryptowährungen?',
      answer: 'Ja. Ninja akzeptiert nur ETH für jetzt, aber Unterstützung wird sehr bald für andere Währungen hinzugefügt werden.',
    },
    {
      question: 'Wie starte ich mit Ninja?',
      isList: true,
      answer: [
        {
          title: 'Äther zu bekommen:',
          content: 'Sie können entweder direkt in PEX ETH mit Ihren Kreditkarten oder von beliebten Münze Börsen wie Coinbase oder Binance kaufen.',
        },
        {
          title: 'Füllen Sie Ihre Brieftasche PEX:',
          content: 'Übertragen Sie die ETH in den PEX-Wallet. PEX Brieftasche ist völlig dezentral, der private Schlüssel wird auf Ihrem Telefon gehalten, nur Sie können übertragen und empfangen ETH.',
        },
        {
          title: 'Platzieren Sie eine Wette:',
          content: 'Wählen Sie den Markt, die Sie möchten Wette (d.h. Brasilien - Spanien), die Ergebnisse (z. B. Brasilien gewinnt) und der Website (d.h. Unterstützung oder Wette gegen das Ergebnis)\n' +
          'Geben Sie den Einsatz Sie wollen Wette (d. h. 1 ETH) und die Quoten (d. h. 1 / 2,25)\n' +
          'Die BEX-Matching-Engine finden dann einen weiteren Auftrag, der gegen die Quoten Wetten, die Sie festlegen.',
        },
        {
          title: 'Warten auf den Bericht:',
          content: 'Wenn Sie gewinnen, Ihre Gewinne werden werden automatisch vom smart Escrow-Vertrag auf Ihr Konto überwiesen.',
        },
      ],
    },
    {
      question: 'einstellen kann ich meine eigenen bevorzugten Chancen? Wie?',
      answer: 'Ja! Wenn Sie Ihren eigenen Einsatz zu erstellen, geben Sie das Ereignis, das, dem Sie interessiert sind, und die Ergebnisse, die, der Sie wetten möchten. Dann geben Sie einfach Ihren Einsatz und die Chancen, die Sie wollen. Dann die PEX-',
    },
    {
      question: 'wie Polizei Sie unangenehme/illegale Wetten?',
      answer: 'Wir bauen derzeit ein System der Checks and Balances, unangemessenes Verhalten im Dojo zu kennzeichnen.',
    },
    {
      question: 'Woher weiß das System das Ergebnis der Wette zwischen den Menschen? Wer als Schiedsrichter und überprüft ein Ergebnis vs. ein weiteres bei Vertragsabschluss?',
      answer: 'Ninja haben bald eine völlig dezentrale Lösung für die Überprüfung der Ergebnisses und Incentivierung Wahrheit erzählen (ein DAO von Reportern!). In der Zwischenzeit als wir just in Time für den FIFA World Cup startet, wird unser Team verwenden Sie eine öffentliche Quelle (livescore.com) und fungieren als der Reporter.',
    },
    {
      question: 'wo findet die Münze?',
      answer: 'Niemand hält die Fonds. Die Mittel werden auf dem Treuhandkonto sicher aufbewahrt, bis eine Lösung gefunden ist.',
    },
    {
      question: 'Warum soll ich auf Blockchain anstelle von traditionellen Methoden Wetten?',
      answer: 'Ein dezentrale Vorhersage Austausch stellen Ihnen die Freiheit, Ihre eigenen Quoten und Wetten direkt mit jedem zu schaffen bieten Ihnen 100 % Ninja Anonymität und garantierte Auszahlungen. ',
    },
    {
      question: 'wie über Privatsphäre und Anonymität?',
      answer: 'Ninja erfordert keine Downloads und keine Anmeldungen. Das heißt, keine Passwörter, keine Telefonnummern und keine e-Mails. 100 % Anonymität.',
    },
    {
      question: 'muss ich Gebühren bezahlen?',
      answer: 'Es gibt zwei Arten von Gebühren: Schöpfer Gebühren (für die Ninja, die die Wette erstellt) und die netzwerkgebühr (ein Prozentsatz der Schöpfer-Gebühr, das geht auf die Erhaltung der Plattform).',
    },
    {
      question: 'Was muss ich tun, wenn das Ergebnis abgeschlossen ist?',
      answer: 'Nichts. Wenn du gewinnst, werden Ihre Gewinne automatisch auf Ihr Konto überwiesen. Wenn Sie verlieren, wird es ein fremdes Konto sein.',
    },
    {
      question: 'wo finde ich ein Match auf Wetten?',
      answer: 'Auf der Homepage werden Sie laufenden Wetten und Märkte durchsuchen. Wenn Sie einen nicht, die Sie mögen finden können, erstellen Sie Ihre eigenen!',
    },
    {
      question: 'als Sport kann ich auf etwas anderes setzen? Wie funktioniert es?',
      answer: 'Sehr bald wird alles unter der Sonne Ninja zuweisen. Die einzige Einschränkung wird Ihre Kreativität sein. Sie können leicht jedem Markt auf jede künftige Veranstaltung zu schaffen, sei es Sport, Politik, Wissenschaft, Märkte, Klima... you',
    },
    {
      question: 'Was soll passieren, an die Handshake-mobile-app?',
      answer: 'Wir werden Handshake (und Ihre Lieblings-Features wie Versprechungen, Schuldscheine, Vertrag Upload, etc.) die Ninja-mobile-Website integriert.',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: 'Der anonyme Austausch von etwas',
  MOT_CONTENT_0: 'Das Ninja-Netz ist nur erreichbar via Handy',
  MOT_CONTENT_1: 'Öffnen Sie',
  MOT_CONTENT_2: 'in Ihren mobilen Browser anonym Zutritt.',
  MOT_CONTENT_3: 'Kein Download erforderlich. Keine Anmeldung erforderlich.',
  MOT_LIST_CONTENT: [
    {
      mainContent: 'Lesen Sie das',
      placeHolderLink: 'Whitepaper',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
    },
    {
      mainContent: 'Wir beantworten Ihre',
      placeHolderLink: 'FAQ',
      link: '/faq',
    },
    {
      mainContent: 'Begleiten Sie das Dojo auf',
      placeHolderLink: 'Telegram',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],

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
