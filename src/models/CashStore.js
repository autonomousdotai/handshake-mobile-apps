class CashStore {
  static cashStore(data) {
    return {
      uid: data.uid || '',
      name: data.name || '',
      address: data.address || '',
      phone: data.phone || '',
      businessType: data.business_type || '',
      status: data.status || '',
      center: data.center || '',
      information: data.information || {},
      profit: data.profit || '',
      longitude: data.longitude || 0,
      latitude: data.latitude || 0,
      chainId: data.chain_id || '',
      createdAt: data.created_at || '',
    };
  }
}

export default CashStore;
