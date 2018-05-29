class CryptoPrice {
  static cryptoPrice(data) {
    return {
      id: data.id || '',
      uid: data.uid || '',
      amount: data.amount || '',
      currency: data.currency || '',
      fiatAmount: data.fiat_amount || '',
      fiatCurrency: data.fiat_currency || '',
      price: data.price || '',
      status: data.status || '',
      type: data.type || '',
      paymentMethodData: data.payment_method_data || '',
      address: data.address || '',
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',
    };
  }
}

export default CryptoPrice;
