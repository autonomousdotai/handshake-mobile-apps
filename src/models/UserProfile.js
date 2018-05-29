import UserCreditCard from "@/models/UserCreditCard";

class UserProfile {
  static userProfile(data) {
    return {
      userId: data.user_id || '',
      creditCardStatus: data.credit_card_status || '',
      creditCard: UserCreditCard.userCreditCard(data.credit_card) || {},
    };
  }
}

export default UserProfile;
