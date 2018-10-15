class CreditTransaction {
  static creditTransaction(data) {
    return {
      id: data.id || '',
      feedType: data.feed_type || '',
      type: data.type || '',
      amount: data.amount || '',
      currency: data.currency || '',
      percentage: data.percentage || '',
      status: data.status || '',
      subStatus: data.sub_status || '',
      revenue: data.revenue || '0',
      information: data.information || {},
      fiatAmount: data.fiat_amount || '0',
      fiatCurrency: data.fiat_currency || '0',
      feePercentage: data.fee_percentage || '0',
      fee: data.fee || '0',
      email: data.email || '',
    };
  }
}

export default CreditTransaction;
