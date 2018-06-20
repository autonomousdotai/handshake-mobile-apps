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
  FAQ_TITLE: 'Вопросы и ответы',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: 'Децентрализованные предсказание обмен',
  FAQ_DATA: [
    {
      question: 'что такое PEX ниндзя?',
      answer: 'Ниндзя представляет собой обмен анонимный peer-to-peer децентрализованных предсказание, запущенное поверх Эфириума blockchain.',
    },
    {
      question: 'что особенного PEX? Почему следует поставить на один?',
      answer: 'Она позволяет сторонам ставить непосредственно против друг друга без прохождения через Центральный орган или букмекер. Это делает его 100% анонимный, никаких признаков вверх загружаемые файлы не требуется. Управление ставок и урегулирования выигрыши осуществляется коллективно blockchain сети, защищая пользователей от любой единой точки отказа. Можно также создать свои собственные рынки предсказаний. ',
    },
    {
      question: 'нужна ли мне эфира? Он поддерживает другие cryptocurrencies?',
      answer: 'Да. Ниндзя принимает только ETH для теперь, но очень скоро для других валют будет добавлена поддержка.',
    },
    {
      question: 'как начать с ниндзя?',
      isList: true,
      answer: [
        {
          title: 'Получите эфира:',
          content: 'Вы можете либо купить ETH непосредственно в PEX с вашей кредитной карты или из популярных монет обменов как Coinbase или Binance.',
        },
        {
          title: 'Пополните кошелек PEX:',
          content: 'Перенесите ETH в бумажник PEX. PEX кошелек полностью децентрализованной, закрытый ключ проводится на вашем телефоне, только вы можете передавать и получать ETH.',
        },
        {
          title: 'Сделайте ставку:',
          content: 'Выбор рынка, вы хотите ставку (т.е. Бразилия - Испания), результаты (т.е. победы Бразилии) и сайта (т.е. поддержки или ставку против результатов)\n' +
          'Введите ставку, вы хотите ставку (т.е. 1 ETH) и шансы (т.е. 1 / 2.25)\n' +
          'BEX соответствия будут затем найти другой порядок, что ставки против коэффициенты, заданные.',
        },
        {
          title: 'Ждать для отчета:',
          content: 'Если вы выиграете, ваши выигрыши будут автоматически переведены из смарт-контракт сделки на ваш счет.',
        },
      ],
    },
    {
      question: 'можно ли установить мой собственный предпочтительным шансы? Как?',
      answer: 'Да! При создании собственных ставку, вы войдете, событие, которое вы заинтересованы в и результаты, которые вы хотите сделать ставку на. Просто введите вашу ставку и шансы, что вы хотите. Затем обработчик PEX автоматически найдет и матч вы с кем-либо, имеет интерес в то же событие, и кто принимает ваши шансы.',
    },
    {
      question: 'как вы полиции непривлекательный/незаконный ставки?',
      answer: 'В настоящее время мы строим систему сдержек и противовесов для флага за неподобающее поведение в додзё.',
    },
    {
      question: 'как система знать результат ставки между людьми? ВОЗ выступает в качестве арбитра и проверяет один результат против другой на заключение контракта?',
      answer: 'Ниндзя скоро будет полностью децентрализованное решение для проверки результатов и стимулированием правду говорю (DAO Репортеры!). В то же время как мы будем запускать как раз вовремя для чемпионата мира по футболу, наша команда будет использовать общественный источник (livescore.com) и действовать в качестве репортера.',
    },
    {
      question: 'где проходит монеты?',
      answer: 'Никто держит средства. Все средства хранятся безопасной в эскроу, пока не будет достигнуто решение.',
    }, {
      question: 'Почему следует поставить на blockchain вместо использования традиционных методов?',
      answer: 'Децентрализованные предсказание обмен обеспечит вам свободу создавать собственные шансы и ставки непосредственно с кем-либо, предлагаем вам ниндзя 100% анонимность и гарантированные выплаты. ',
    }, {
      question: 'как насчет конфиденциальности и анонимности?',
      answer: 'Ниндзя требует никаких Скачиваний и не подписать взлеты. Это означает, что никакие пароли, без номера телефонов и без писем. 100% анонимность.',
    }, {
      question: 'нужно ли мне платить?',
      answer: 'Существует два основных типа сборов: создатель сборы (для ниндзя, который создает ставку) и сетевой платы (в процентах от создателя плату, которая идет на поддержание платформы).',
    }, {
      question: 'что нужно делать, когда завершается результат?',
      answer: 'Ничего. Если вы выиграете, ваши выигрыши будут автоматически переведены на ваш счет. Если вы потеряете, он будет кто-то чужой учетной записью.',
    }, {
      question: 'где можно найти ставки на матч?',
      answer: 'На домашней странице вы сможете просматривать текущие ставки и рынки. Если вы не можете найти любой понравившийся вам, создайте свой собственный!',
    }, {
      question: 'Помимо спорта можно ставить на что-нибудь еще? Как это работает?',
      answer: 'Очень скоро ниндзя будет применяться ко всем под солнцем. Единственное ограничение будет ваше творчество. Вы можете легко создать любой рынок на любых будущих событий, будь то спорт, политика, Наука, рынки, климат... вы назовите его',
    }, {
      question: 'то, что должно произойти для подтверждения мобильного приложения?',
      answer: 'Мы будет интеграция рукопожатие (и ваши любимые функции, такие как обещания, долговые расписки, загрузить контракт и т.д.) в ниндзя мобильный веб-сайт.',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: 'Анонимный обмен ничего',
  MOT_CONTENT_0: 'Ниндзя сеть доступна только через мобильный',
  MOT_CONTENT_1: 'Откройте',
  MOT_CONTENT_2: 'в вашем мобильном браузере, чтобы получить анонимный вход.',
  MOT_CONTENT_3: 'Не нужно загружать. Не Зарегистрируйся требуется.',
  MOT_LIST_CONTENT: [
    {
      mainContent: 'Читать',
      placeHolderLink: 'документ',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
    },
    {
      mainContent: 'Мы ответим на ваши',
      placeHolderLink: 'вопросы и ответы',
      link: '/faq',
    },
    {
      mainContent: 'Присоединяйтесь к dojo на',
      placeHolderLink: 'Телеграмма',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],

  // landing page --> /coin-exchange
  COIN_EXCHANGE_LP_FAQ_TITLE: 'Есть вопросы?',
  COIN_EXCHANGE_LP_FAQ: [
    {
      question: 'Какая идентификация нужна для продавцов или покупателей?',
      answer: 'Нам не нужна проверка идентификации. Если вы подтвердите свой номер телефона, у вас будет шанс получить 1 бесплатный ETH, чтобы совершить транзакцию на Shake Ninja.',
    },
    {
      question: 'Принимаются ли кредитные карты?',
      answer: 'Да. Мы принимаем Visa, Mastercard, Amex и Discover.',
    },
    {
      question: 'Какие валюты принимаются для обмена?',
      answer: 'Мы принимаем все валюты.',
    },
    {
      question: 'Есть ли система отслеживания истории торговли?',
      answer: 'Да. Мы прослеживаем успешные и неудачные транзакции с четким отчетом для каждого продавца и покупателя.',
    },
    {
      question: 'Имеет ли какая либо страна ограничения по использованию платформы?',
      answer: 'Мы доступны для всех стран.',
    },
    {
      question: 'Есть ли децентрализованный обмен?',
      answer: 'Да, поэтому транзакция на 100% безопасна и надежна.',
    },
    {
      question: 'Могу ли я использовать Paypal?',
      answer: 'Мы не доступны в Paypal на данный момент.',
    },
    {
      question: 'Будут ли средства храниться в Эскроу?',
      answer: 'Да, либо на Эскроу или на смарт-контракте Эфириум Блокче́йн.',
    },
    {
      question: 'Как будет выполняться Смарт-договор, когда задействованы физические деньги и вероятны ли запоздания во время транзакций?',
      answer: 'Получив физическую наличность, продавец нажимает кнопку «принять», монета будет автоматически переведена покупателю. Процесс занимает от 10 до 20 минут.',
    },
  ],
  COIN_EXCHANGE_LP_TRADE_EASY_TRADE_SAFE: {
    title: 'Легкая и безопасная торговля',
    info: [
      {
        title: '1. Разместите вашу сделку',
        description: 'Выберите криптовалюту, которую вы хотите купить / продать по желаемой цене',
      },
      {
        title: '2. Выберите магазин',
        description: 'Найдите и выберите наиболее подходящий магазин в вашем регионе',
      },
      {
        title: '3. Выполните обмен',
        description: 'Отправьтесь в магазин и обменяйте наличные деньги на криптовалюту или криптовалюту на наличные деньги',
      },
      {
        title: '4. Подтвердите платеж',
        description: 'Процесс обезопасен на 100% за счет смарт-контракта',
      },
    ],
  },
  COIN_EXCHANGE_LP_START_TRADING_NOW: 'Начать торговать прямо сейчас',
  COIN_EXCHANGE_LP_PLACEHOLDER_INPUT: 'Ваша электронная почта',
  COIN_EXCHANGE_LP_TITLE_SUBMIT_BT: 'Присоединиться к списку рассылки',
  COIN_EXCHANGE_LP_SECOND_BOX_TITLE: 'Мы первые, кто предложил полностью децентрализованную платформу для покупки и продажи Bitcoin и Ethereum.',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_1: 'Несколько способов оплаты: кредитная карта и наличные деньги',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_2: 'Обеспеченная сделка по blockchain технологии',
  COIN_EXCHANGE_LP_SECOND_BOX_DESCRIPTION_3: '-Быстрое и удобное использование.',
  COIN_EXCHANGE_LP_THIRD_BOX_1: {
    title: 'Несколько способов оплаты',
    description: 'Мы обеспечиваем торговлю наличных денег на криптовалюту и кредитной карты на криптовалюту. Найдите своих ближайших трейдеров, не оставляя истории транзакций для каких-либо действий на нашей платформе.',
  },
  COIN_EXCHANGE_LP_THIRD_BOX_2: {
    title: 'Быстро и на ходу',
    description: 'Благодаря торговле на основе местоположения, мы позволяем вам совершать платежи за несколько минут с повышенным удобством.',
  },
  COIN_EXCHANGE_LP_THIRD_BOX_3: {
    title: '100% безопасно и надежно для обеих сторон',
    description: 'В отличие от любой другой платформы, мы не владеем ключами пользователей и предоставляем полный контроль ключами покупателям и продавцам.',
  },
};
