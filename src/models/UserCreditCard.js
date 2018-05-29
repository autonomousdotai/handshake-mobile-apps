class UserCreditCard {
  static userCreditCard(data) {
    return {
      ccNumber: data.cc_number || '',
      expirationDate: data.expiration_date || '',
      token: data.token || '',
    };
  }
}

export default UserCreditCard;
