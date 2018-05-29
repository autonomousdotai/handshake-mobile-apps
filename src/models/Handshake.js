class Handshake {
  static handshake(data) {
    return {
      id: data.id,
      hid: data.hid,
      type: data.type,
      state: data.state,
      status: data.status,
      initUserId: data.init_user_id,
      shakedUserIds: data.shaked_user_ids,
      textSearch: data.text_search,
      shakeCount: data.shake_count,
      viewCount: data.view_count,
      commentCount: data.comment_count,
      initAt: data.init_at,
      lastUpdateAt: data.last_update_at,
      extraData: data.extra_data,
    };
  }
}

export default Handshake;
