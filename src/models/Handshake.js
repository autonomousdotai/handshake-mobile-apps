const handleListPayload = payload => payload.map(handshake => Handshake.handshake(handshake));

class Handshake {
  static handshake(data) {
    return {
      id: data.id,
      hid: data.hid,
      type: data.type,
      state: data.state,
      status: data.status,
      initUserId: data.init_user_id,
      shakeUserIds: data.shake_user_ids,
      textSearch: data.text_search,
      shakeCount: data.shake_count,
      viewCount: data.view_count,
      commentCount: data.comment_count,
      initAt: data.init_at,
      lastUpdateAt: data.last_update_at,
      extraData: data.extra_data,
      hid: data.hid || '',
      fromAddress: data.from_address || '',
      odds: data.odds || '',
      outComeId: data.outcome_id || '',
      side: data.side || '',
      remainingAmount: data.remaining_amount || '',
      location: data.location,
      result: data.result || '',
      shakers: data.shakers,
      amount: data.amount || '',
      winValue: data.win_value || '',
      offerFeedType: data.offer_feed_type || '',
      offerType: data.offer_type || '',
      bkStatus: data.bk_status || '',
      reviewCount: data.review_count || 0,
      review: data.review || 0,
      freeBet: data.free_bet || 0,
    };
  }
}

export default Handshake;
