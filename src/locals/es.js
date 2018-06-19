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
  FAQ_TITLE: 'Preguntas más frecuentes',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: ' Descentralizada de intercambio de predicción',
  FAQ_DATA: [
    {
      question: '¿Qué es Ninja PEX?',
      answer: 'Ninja es un intercambio anónimo peer-to-peer descentralizada predicción corriendo encima de la blockchain de Etereum.',
    },
    {
      question: '¿Qué es especial acerca de PEX? ¿Por qué debo apostar por uno?',
      answer: 'Permite partes apuesta directamente contra otros sin pasar por una autoridad central o la casa de apuestas. Esto es 100% anónimo, sin señales para arriba sin descargas necesarias. La gestión de las apuestas y la liquidación de las ganancias se llevan a cabo conjuntamente por la red de blockchain, protegiendo a los usuarios de cualquier punto único de falla. También puede crear sus propios mercados de predicción. ',
    },
    {
      question: '¿necesito éter? ¿Soporta otros cryptocurrencies?',
      answer: 'Sí. Ninja sólo acepta ETH por ahora, pero se añadió soporte para otras monedas muy pronto.',
    },
    {
      question: '¿Cómo empiezo con Ninja?',
      isList: true,
      answer: [
        {
          title: 'Obtener éter:',
          content: 'Cualquiera puede comprar ETH directamente en PEX con tus tarjetas de crédito o de intercambios de monedas populares como Coinbase o Binance.',
        },
        {
          title: 'Recargar su billetera PEX:',
          content: 'Transferencia del ETH en la cartera PEX. Cartera de PEX es totalmente descentralizada, la clave privada se lleva a cabo en el teléfono, sólo puede transferir y recibir ETH.',
        },
        {
          title: 'Hacer una apuesta:',
          content: 'Escoger el mercado que quiere apostar (es decir, Brasil - España), los resultados (es decir victorias de Brasil) y el sitio (es decir, apoyo o apuesta contra el resultado)\n' +
          'Entrar en el juego que desee apuesta (es decir, 1 ETH) y las probabilidades (es decir 1 / 2.25)\n' +
          'El motor de Matching de BEX encontrará otra orden que apuesta contra viento y marea que se establece.',
        },
        {
          title: 'Espere el informe:',
          content: 'Si usted gana, sus ganancias serán transferidas automáticamente el contrato de fideicomiso inteligente a su cuenta.',
        },
      ],
    },
    {
      question: '¿puedo configurar mis propias probabilidades de recomendado:? ¿?',
      answer: '¡Sí! Al crear su propia apuesta, entrará el evento que te interesa y el resultado que desea apostar. Luego, simplemente introduzca su juego y las probabilidades que usted quiere. Entonces el motor PEX automáticamente encontrará y emparejarle con alguien que tiene un interés en el mismo evento, y que acepta sus probabilidades.',
    },
    {
      question: '¿Cómo usted policía indeseables o ilegales apuestas?',
      answer: 'Actualmente estamos construyendo un sistema de controles y equilibrios para airear inadecuado comportamiento en el dojo.',
    },
    {
      question: '¿Cómo sabe el sistema el resultado de apuestas entre las personas? Que actúa como árbitro y verifica el uno resultado contra otro en la conclusión del contrato?',
      answer: 'Ninja pronto tendrá una solución totalmente descentralizada para comprobar el resultado e incentivar la verdad diciendo (un DAO de reporteros!). Mientras tanto, como se lanzará justo a tiempo para la Copa Mundial, nuestro equipo utiliza una fuente pública (livescore.com) y actúan como el reportero.',
    }, {
      question: '¿Dónde se lleva a cabo la moneda?',
      answer: 'Nadie tiene los fondos. Todos los fondos se mantienen en fideicomiso hasta que se alcance una resolución.',
    }, {
      question: '¿por qué debo apostar en blockchain en lugar de utilizar los métodos tradicionales?',
      answer: 'Un intercambio descentralizado predicción proporcionará usted la libertad de crear su propio pronóstico y apuesta directamente con cualquier persona, le anonimato ninja 100% y garantizado los pagos. ',
    }, {
      question: '¿Qué privacidad y anonimato?',
      answer: 'Ninja requiere sin descargas y sin inscripciones. Eso significa que no hay contraseñas, no hay números de teléfono y ningún email. 100% anonimato.',
    }, {
      question: '¿necesito pagar algo?',
      answer: 'Hay dos tipos de tarifas: tarifas de creador (para el ninja que crea la apuesta) y la cuota de la red (un porcentaje de la cuota del creador, que va hacia el mantenimiento de la plataforma).',
    }, {
      question: '¿Qué tengo que hacer cuando el resultado esté finalizado?',
      answer: 'Nada. Si usted gana, sus ganancias se transferirán automáticamente a su cuenta. Si pierde, será cuenta de otra persona.',
    }, {
      question: '¿Dónde puedo encontrar un partido para apostar?',
      answer: 'En la Página principal, podrás ver los mercados y las apuestas actuales. Si no encuentras alguna que te gusta, crear su propio!',
    }, {
      question: 'que deportes, puedo apostar en otra cosa? ¿Cómo funciona?',
      answer: 'Muy pronto, el Ninja se aplicará a todo bajo el sol. La única limitación será tu creatividad. Fácilmente puede crear cualquier mercado en cualquier evento futuro, ya sea deportes, política, ciencia, mercados, clima... lo que sea. ',
    }, {
      question: '¿Qué va a pasar a la aplicación móvil de apretón de manos?',
      answer: 'Se ser integrar apretón de manos (y tus rasgos favoritos como promesas, pagarés, subida de contrato, etc.) en la página web móvil de Ninja.',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: 'El intercambio anónimo de nada',
  MOT_CONTENT_0: 'El red Ninja sólo es accesible a través del móvil',
  MOT_CONTENT_1: 'Abra',
  MOT_CONTENT_2: 'en el navegador del móvil para tener acceso anónimo.',
  MOT_CONTENT_3: 'No es necesitada para descargar. Ningún registro necesario.',
  MOT_LIST_CONTENT: [
    {
      mainContent: 'Lea el',
      placeHolderLink: 'white paper',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      isBlankTarget: true,
    },
    {
      mainContent: 'Respondemos tu',
      placeHolderLink: 'FAQ',
      link: '/faq',
    },
    {
      mainContent: 'Únete al dojo en',
      placeHolderLink: 'telegrama',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],
};
