// All Utils related to Objects

export function removeItems(obj, keys) {
  return Object.keys(obj).reduce((result, key) => {
    return keys.includes(key) ? result : {
      ...result,
      [key]: obj[key],
    };
  }, {});
}

/**
 * Get Object key by value
 * @param {Object} obj
 * @param {Object Value} val
 */
export function getKeyByValue(obj, val) {
  return Object.keys(obj)[Object.values(obj).indexOf(val)];
}

/**
 * Detect JSON string
 * @param {*} string
 */
export function isJSON(string) {
  try {
    const json = JSON.parse(string);
    return (typeof json === 'object');
  } catch (e) {
    return false;
  }
}
