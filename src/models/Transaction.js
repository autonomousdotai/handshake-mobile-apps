class Transaction {
  static transaction(data) {
    return {
      id: data.id || '',
      amount: data.amount || '',
      totalAmount: data.total_amount || '',
      currency: data.currency || '',
      price: data.price || '',
      fiatAmount: data.fiat_amount || '',
      totalFiatAmount: data.total_fiat_amount || '',
      fiatCurrency: data.fiat_currency || '',
      type: data.type || '',
      status: data.status || '',
      from: data.from || '',
      fromUsername: data.from_username || '',
      to: data.to || '',
      toUsername: data.to_username || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
    };
  }
}

export default Transaction;
