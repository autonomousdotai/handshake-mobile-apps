class ReferalItem {
  static referalItem(data) {
    return {
      createdAt: data.created_at || '',
      currency: data.currency || '',
      pendingReward: data.pending_reward || 0,
      referralCreatedAt: data.referral_created_at || '',
      reward: data.reward || 0,
      toUid: data.to_uid || '',
      toUsername: data.to_username || '',
      totalReward: data.total_reward || 0,
      uid: data.uid || '',
    };
  }
}

export default ReferalItem;
