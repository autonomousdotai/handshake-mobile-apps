class Deposit {
  static deposit(data) {
    return {
      hid: data?.hid || 0,
      currency: data?.currency || '',
      status: data?.status || '',
      subStatus: data?.sub_status || '',
      lastActionData: data?.last_action_data || '',
      sold: data?.sold || '0',
      balance: data?.balance || '0',
      revenue: data?.revenue || '0',
      percentage: data?.percentage || '',
      userAddress: data?.user_address || '',
      createdAt: data?.created_at || '',
      updatedAt: data?.updated_at || '',
    };
  }
}

export default Deposit;
