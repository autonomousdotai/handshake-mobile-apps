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
};
