class OfferPrice {
  static offerPrice (data) {
    return {
      type: data.Type || '',
      amount: data.Amount || '',
      currency: data.Currency || '',
      fiatCurrency: data.FiatCurrency || '',
      fiatAmount: data.FiatAmount || '',
      price: data.Price || '',
    };
  }
}

export default OfferPrice;
