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
  FAQ_TITLE: 'FAQ',
  FAQ_HEADER_YELLOW: '',
  FAQ_HEADER: '予測 Exchange を分散',
  FAQ_DATA: [
    {
      question: '忍者 PEX ってなに?',
      answer: '忍者は、Ethereum blockchain 上で実行される匿名のピア ツー ピア分散予測交換です。',
    },
    {
      question: 'PEX について特別なは?なぜ私は 1 つに賭ける必要があります?',
      answer: '中央官庁やブック メーカーを経由せず直接賭ける互いに当事者をことができます。これは 100% 匿名、兆候ダウンロードが必要になりません。賭け金の管理や賞金の決済によって実行されますまとめて blockchain のネットワークは、すべての単一点障害からユーザーを保護します。独自の予測市場を作成することも。',
    },
    {
      question: 'エーテルは必要ですか。それが他の cryptocurrencies を支えるか。',
      answer: 'うん。忍者はのみ今のところ、ETH を受け付けますが、他の通貨のサポートが非常にすぐに追加されます。',
    },
    {
      question: '忍者の始まる.',
      isList: true,
      answer: [
        {
          title: 'エーテルを得る。',
          content: 'あなたのクレジット カードまたは Coinbase または Binance のような人気のあるコインの交換から直接 PEX の ETH を購入できますか。',
        },
        {
          title: 'PEX 財布をトップします。',
          content: 'PEX 財布に ETH を転送します。PEX の財布は完全に分散、あなたの携帯電話に秘密キーを保管、あなただけ転送、ETH を送受信することができます。',
        },
        {
          title: 'ベットを配置します。',
          content: 'ピックするベット (すなわちブラジル - スペイン)、結果 (すなわちブラジル wins) とサイト (サポートまたは結果に対して賭け) 市場\n' +
          'ベット (すなわち 1 ETH) とオッズの場合出資を入力 (つまり 1/2.25\n' +
          'BEX マッチング エンジンは、ベットを設定する予想に反して別の順序を見つけます。',
        },
        {
          title: 'レポートを待つ:',
          content: 'あなたのアカウントに、エスクロー スマート契約からはあなたの賞金自動的に転送されますあなたが勝った場合。',
        },
      ],
    },
    {
      question: '私は自分の最寄りののオッズを設定できますか。どのようにですか?',
      answer: 'うん！自分の賭けを作成するには、興味を持っているイベントとの賭けを結果を入力します。その後、単にあなたの株式と場合のオッズを入力します。[PEX エンジン自動的に検索し、誰もが同じイベントに興味を持っている、あなたの勝算を受け入れる人を一致させます。',
    },
    {
      question: 'どのように不快な/違法賭けを警察か。',
      answer: '我々 は現在と道場で不適切な行動をフラグする均衡のシステムを構築しています。',
    },
    {
      question: 'システムは、どのように人々 の間の賭の結果を知っていますか人は仲裁人として機能し、別契約の締結での対 1 つの結果を確認しますか。',
      answer: '忍者はすぐ結果を確認して病名告知 (記者の DAO!) の報奨のため完全に分散型ソリューションがあります。一方で、FIFA ワールド カップのための時間だけで、起動すると、我々 のチームがパブリック ソース (livescore.com) を使用、記者を務めます。',
    },
    {
      question: 'コインははどこで開催されますか。',
      answer: '誰が資金を保持しています。すべての資金は、解像度に達するまで条件付け捺印証書安全な保存されます。',
    },
    {
      question: '従来の方法を使用する代わりに blockchain に賭けるなぜとする必要がありますか。',
      answer: '分散予測交換は誰とでも直接、独自のオッズと賭けを作成するための自由は 100% 忍者の匿名性を提供し、支払いを保証を提供します。',
    },
    {
      question: '方法についてプライバシーと匿名性ですか。',
      answer: '忍者には、ダウンロード不要とないサインアップが必要です。つまり、パスワード、電話番号がなく、メールを送信しません。100% 年の匿名。',
    },
    {
      question: '料金を支払う必要がありますか。',
      answer: '手数料の 2 つの主なタイプがある: (ベットを作成する忍者) の作成者料とネットワーク料 (プラットフォームを維持することの方に行くされる創作者手数料の割合)。',
    },
    {
      question: 'どのような結果を確定するしたいですか。',
      answer: '何もない。あなたが勝った場合、あなたの賞金はあなたのアカウントに自動的に転送されます。紛失した場合、それは誰か他の人のアカウントになります。',
    },
    {
      question: 'どこに賭ける一致を検索できますか。',
      answer: 'ホームページにおいて、継続的なベットと市場を参照することができます。あなたのように見つけることができない場合は、あなた自身を作成!',
    },
    {
      question: '他のスポーツよりも、私は他の何かに賭けることができるか。どのように動作するのか。',
      answer: '非常に早く、忍者は、太陽の下ですべてに適用されます。唯一の制限はあなたの創造性になります。簡単に任意の将来のイベントを任意の市場を作成できます、スポーツのこと、政治、科学、市場、気候. ',
    },
    {
      question: 'はハンドシェイクのモバイル アプリに起こるつもりですか。',
      answer: '我々 は忍者携帯サイトにハンドシェイク (と約束、IOUs、契約アップロード等のようなあなたのお気に入りの機能) を統合するでしょう。',
    },
  ],

  // MobileOrTablet components
  MOT_TITLE: '何か匿名の交流',
  MOT_CONTENT_0: '忍者ネットワークのみアクセス可能です携帯電話を介して',
  MOT_CONTENT_1: '匿名エントリを得るためにあなたの携帯電話のブラウザーで',
  MOT_CONTENT_2: 'を開きます。',
  MOT_CONTENT_3: 'ダウンロードは必要ありません。サインアップは必要ありません。',
  MOT_LIST_CONTENT: [
    {
      mainContent: '',
      placeHolderLink: 'ホワイト ペーパー',
      link: 'https://medium.com/@ninjadotorg/shakeninja-bex-1c938f18b3e8',
      mainContent1: 'を読む',
      isBlankTarget: true,
    },
    {
      mainContent: 'あなたの',
      placeHolderLink: '質問',
      mainContent1: 'にお答え',
      link: '/faq',
    },
    {
      mainContent: '',
      placeHolderLink: '電報',
      mainContent1: 'の道場に参加します。',
      link: 'https://t.me/ninja_org',
      isBlankTarget: true,
    },
  ],
};
