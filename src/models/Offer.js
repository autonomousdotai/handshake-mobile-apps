class Offer {
  static offer(data) {
    return {
      id: data.id || '',
      amount: data.amount || '',
      totalAmount: data.total_amount || '',
      currency: data.currency || '',
      price: data.price || '',
      fiatAmount: data.fiat_amount || '',
      fiatCurrency: data.fiat_currency || '',
      type: data.type || '',
      status: data.status || '',
      uid: data.uid || '',
      username: data.username || '',
      toUid: data.to_uid || '',
      toUsername: data.to_username || '',
      contactInfo: data.contact_info || '',
      systemAddress: data.system_address || '',
      userAddress: data.user_address || '',
      provider: data.provider || '',
      providerData: data.provider_data || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
    };
  }
}

export default Offer;
