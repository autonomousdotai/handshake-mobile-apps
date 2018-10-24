/**
 * @class Auth
 */
class Auth {
  /**
   *
   *
   * @static
   * @param {*} [rawData={}]
   * @memberof Auth
   */
  static profile(rawData = {}) {
    return {
      avatar: rawData.avatar || '',
      cardId: rawData.card_id || -1,
      cardVerified: rawData.card_verified || '',
      dateCreated: rawData.date_created || '',
      dateModified: rawData.date_modified || '',
      email: rawData.email || '',
      fcmToken: rawData.fcm_token || '',
      id: rawData.id || -1,
      name: rawData.name || '',
      phone: rawData.phone || '',
      rewardWalletAddresses: rawData.reward_wallet_addresses || '',
      status: rawData.status || '',
      username: rawData.username || '',
      address: rawData.address || '',
      idVerified: rawData.id_verified || 0,
      idVerificationLevel: rawData.id_verification_level || 0,
      verified: rawData.verified || 0,
    };
  }
}

export default Auth;
