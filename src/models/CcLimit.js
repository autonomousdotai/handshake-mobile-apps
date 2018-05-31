class CcLimit {
  static ccLimit(data) {
    return {
      level: data.level || '',
      limit: data.limit || '',
      duration: data.duration || '',
    };
  }
}

export default CcLimit;
