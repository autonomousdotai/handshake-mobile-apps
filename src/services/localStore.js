const local = {
  save: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  },
  get: (key) => {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return false;
  },
  remove: (key) => {
    localStorage.removeItem(key);
    return true;
  },
};

export default local;
