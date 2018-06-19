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
  offerDistanceContent: '{distance} away',
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
  FAQ_TITLE: 'FAQ',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: 'Décentralisé de prédiction change ',
  FAQ_DATA: [
    {
      question: 'quel est le Ninja PEX ?',
      answer: 'Ninja est un échange anonyme-to-peer décentralisé prédiction en cours d’exécution sur le dessus de l’Ethereum blockchain.',
    },
    {
      question: 'ce qui est spécial au sujet de PEX ? Pourquoi devrais je parie sur un ?',
      answer: 'Il permet aux parties de parier directement contre l’autre sans passer par une autorité centrale ou le bookmaker. Cela rend 100 % anonyme, pas de signes place aucun téléchargement requis. La gestion de Paris et au règlement des gains sont effectués collectivement par le réseau blockchain, protection des utilisateurs contre n’importe quel point de défaillance unique. Vous pouvez également créer vos propres marchés de prédiction.',
    },
    {
      question: 'ai-je besoin d’éther ? Supporte-t-il les autres cryptocurrencies ?',
      answer: 'Oui. Ninja accepte uniquement les ETH pour l’instant, mais le support sera ajouté pour les autres monnaies très bientôt.',
    },
    {
      question: ' Comment puis-je commencer avec Ninja ?',
      isList: true,
      answer: [
        {
          title: 'Obtenez l’éther :',
          content: 'Vous pouvez soit acheter ETH directement en PEX avec vos cartes de crédit ou d’échanges de pièces populaires tels que Coinbase ou Binance.',
        },
        {
          title: 'Recharger votre porte-monnaie PEX :',
          content: 'Transférer l’ETH dans le portefeuille PEX. Portefeuille de PEX est complètement décentralisé, la clé privée est tenue sur votre téléphone, que vous pouvez transférer et recevoir ETH.',
        },
        {
          title: 'Placer un pari :',
          content: 'Choix du marché vous voulez parier (p. ex. Brésil - Espagne), les résultats (c.-à-d. les victoires Brésil) et le site (c\'est-à-dire le support ou le pari contre l’issue)\n' +
          'Entrer dans le jeu vous voulez à pari (c.-à-d. 1 ETH) et les cotes (c.-à-d. 1 / 2,25)\n' +
          'Le moteur de Matching BEX trouverez alors une autre ordonnance qui parie contre vents et marées que vous définir.',
        },
        {
          title: 'Attendre le rapport :',
          content: 'Si vous gagnez, vos gains seront automatiquement transférées du contrat escrow intelligente à votre compte.',
        },
      ],
    },
    {
      question: 'puis-je créer mes propres cotes de préférés ? Comment ?',
      answer: 'Oui ! Lorsque vous créez votre propre pari, vous allez entrer dans l’événement qui que vous intéresse et le résultat que vous souhaitez parier sur. Ensuite, il suffit d’entrer votre mise et la cote souhaitée. Puis le moteur PEX ',
    },
    {
      question: 'Comment vous la police Paris douteux ou illégaux ?',
      answer: 'Nous construisons actuellement un système de freins et contrepoids à signaler les comportements inappropriés dans le dojo.',
    },
    {
      question: 'Comment est le système sait le résultat de Paris entre les gens ? Qui agit en tant qu’arbitre et vérifie un résultat par rapport à un autre à la conclusion du contrat ?',
      answer: 'Ninja aura bientôt une solution complètement décentralisée pour vérifier le résultat et motivant la vérité en disant (un DAO de reporters !). En attendant, que nous allons lancer juste à temps pour la Coupe du monde, notre équipe utilise ',
    },
    {
      question: 'où se déroule la pièce ?',
      answer: 'Personne ne détient les fonds. Tous les fonds sont conservés sécuritaire en dépôt jusqu\'à ce qu’une résolution soit atteinte.',
    },
    {
      question: 'Pourquoi devrais je parie sur blockchain au lieu d’utiliser les méthodes traditionnelles ?',
      answer: 'Un échange décentralisé de prédiction fournira vous la liberté de créer vos propres cotes et parier directement avec n’importe qui, vous offrons anonymat 100 % ninja et garantie des paiements.',
    },
    {
      question: 'qu’en est-il de la vie privée et anonymat ?',
      answer: 'Ninja nécessite aucun téléchargement et aucun signe d’ups. Cela veut dire aucun mot de passe, aucun numéro de téléphone et pas de courriels. anonymat 100 %.',
    },
    {
      question: ' dois-je payer tous les frais ?',
      answer: 'Il existe deux principaux types de frais : frais de créateur (pour le ninja qui crée le PARI) et les frais de réseau (un pourcentage de la taxe de créateur, qui se dirige vers le maintien de la plate-forme).',
    },
    {
      question: 'que dois-je faire quand le résultat est finalisé ?',
      answer: 'Rien. Si vous gagnez, vos gains seront automatiquement transférés sur votre compte. Si vous perdez, ce sera quelqu\'un d’autre compte.',
    },
    {
      question: 'où puis-je trouver une correspondance pour parier sur ?',
      answer: 'Sur la page d’accueil, vous serez en mesure de parcourir les marchés et les Paris en cours. Si vous ne trouvez pas que vous aimez, créez vos propres !',
    },
    {
      question: 'autres que sportives, je peux parier sur autre chose ? Comment ça marche ?',
      answer: 'Très bientôt, Ninja s’appliqueront à tout sous le soleil. La seule limite sera votre créativité. Vous pouvez facilement créer n’importe quel marché à n’importe quel événement futur, qu’elle soit sportive, politique, science, marchés, climat... vous l’appelez. ',
    },
    {
      question: 'ce qui va se passer à l’application mobile de la poignée de main ?',
      answer: 'Nous intégrerons Handshake (et vos fonctions préférées comme promesses, reconnaissances de dette, upload de contrat, etc.) dans le site Web mobile de Ninja. ',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: 'L’échange anonyme de quoi que ce soit',
  MOT_CONTENT_0: 'Le réseau de Ninja n’est accessible que via mobile',
  MOT_CONTENT_1: 'Ouvrez',
  MOT_CONTENT_2: 'dans votre navigateur mobile pour gagner l’entrée anonyme.',
  MOT_CONTENT_3: 'Aucun téléchargement nécessaire. Aucuns inscription ne nécessaire.',
  MOT_LIST_CONTENT: [
    {
      mainContent: 'Lisez le',
      placeHolderLink: 'livre blanc',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
    },
    {
      mainContent: 'Nous répondons à votre',
      placeHolderLink: 'FAQ',
      link: '/faq',
    },
    {
      mainContent: 'Rejoindre le dojo sur le',
      placeHolderLink: 'télégramme',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],
};
