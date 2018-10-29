
class BuyCryptoCoin {
  static parseCoinInfo(data = {}) {
    return {
      fee: Number.parseFloat(data.fee) || 0,
      feeCod: Number.parseFloat(data.fee_cod) || 0,
      feeLocal: Number.parseFloat(data.fee_local) || 0,
      feeLocalCod: Number.parseFloat(data.fee_local_cod) || 0,
      feePercentage: Number.parseFloat(data.fee_percentage) || 0,
      feePercentageCod: Number.parseFloat(data.fee_percentage_cod) || 0,
      fiatAmount: Number.parseFloat(data.fiat_amount) || 0,
      fiatAmountCod: Number.parseFloat(data.fiat_amount_cod) || 0,
      fiatCurrency: data.fiat_currency,
      fiatLocalAmount: Number.parseFloat(data.fiat_local_amount) || 0,
      fiatLocalAmountCod: Number.parseFloat(data.fiat_local_amount_cod) || 0,
      fiatLocalCurrency: data.fiat_local_currency,
      limit: Number.parseFloat(data.limit) || 0,
    };
  }

  static parseOrder(data = {}) {
    return {
      type: data.type,
      userInfo: data.user_info || {},
      amount: Number.parseFloat(data.amount) || 0,
      currency: data.currency,
      fiatCurrency: data.fiat_currency,
      fiatLocalCurrency: data.fiat_local_currency,
      fiatAmount: Number.parseFloat(data.fiat_amount) || 0,
      fiatLocalAmount: Number.parseFloat(data.fiat_local_amount) || 0,
      address: data.address,
      status: data.status,
      refCode: data.ref_code,
      id: data.id,
      createdAt: data.created_at,
    };
  }

  static parseQuoteReverse(data = {}) {
    return {
      type: data.type,
      amount: Number.parseFloat(data.amount) || 0,
      currency: data.currency,
      fiatCurrency: data.fiat_currency,
      fiatLocalCurrency: data.fiat_local_currency,
      fiatAmount: Number.parseFloat(data.fiat_amount) || 0,
      fiatLocalAmount: Number.parseFloat(data.fiat_local_amount) || 0,
      fiatLocalAmountCod: Number.parseFloat(data.fiat_local_amount_cod) || 0,
      limit: Number.parseFloat(data.limit) || 0,
    };
  }
}

export default BuyCryptoCoin;
