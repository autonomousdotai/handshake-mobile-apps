import CoinOffer from './CoinOffer';

class OfferShop {
  static offerShop(data) {
    return {
      id: data.id || '',
      hid: data.hid || '',
      itemFlags: data.item_flags || {},
      status: data.status || '',
      username: data.username || '',
      email: data.email || '',
      language: data.language || '',
      contactPhone: data.contact_phone || '',
      contactInfo: data.contact_info || '',
      longitude: data.longitude || '',
      latitude: data.latitude || '',
      fiatCurrency: data.fiat_currency || '',
      transactionCount: data.transaction_count || {},
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',
      items: data.items ? {
        BTC: data.items.BTC && CoinOffer.coinOffer(data.items.BTC) || {},
        ETH: data.items.ETH && CoinOffer.coinOffer(data.items.ETH) || {},
      } : {},
      chatUsername: data.chat_username || '',
      toChatUsername: data.to_chat_username || '',
    };
  }
}

export default OfferShop;
