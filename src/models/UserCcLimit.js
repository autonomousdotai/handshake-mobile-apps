class UserCcLimit {
  static userCcLimit(data) {
    return {
      level: data.level || '',
      limit: data.limit || '',
      amount: data.amount || '',
      endDate: data.end_date || '',
    };
  }
}

export default UserCcLimit;
