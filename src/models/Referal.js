import ReferalItem from './ReferalItem';

class Referal {
  static referal(data) {
    let result = [];

    for (const item of data) {
      const referalItem = ReferalItem.referalItem(item);

      let isExist = false;
      for (let refItem of result) {
        if (refItem.toUid === referalItem.toUid) {
          isExist = true;
          refItem.referalValues.push({ currency: referalItem.currency, reward: referalItem.reward});

          break;
        }
      }

      if (!isExist) {
        result.push({
          toUid: referalItem.toUid,
          toUsername: referalItem.toUsername,
          referralCreatedAt: referalItem.referralCreatedAt,
          referalValues: [{ currency: referalItem.currency, reward: referalItem.reward }],
        });
      }
    }

    return result;
  }
}

export default Referal;
