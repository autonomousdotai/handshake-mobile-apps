class CashAtmPrice {
  static cashAtmPrice(data) {
    return {
      fiatLocalCurrency: data.FiatLocalCurrency || '',
      localPrice: data.LocalPrice || '',
      currency: data.Currency || '',
      fiatCurrency: data.FiatCurrency || '',
      price: data.Price || '',
    };
  }
}

export default CashAtmPrice;
