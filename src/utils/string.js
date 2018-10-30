export function smartTrim(str, maxLength, separator = ' ') {
  if (str.length <= maxLength) return str;
  const pos = str.lastIndexOf(separator, maxLength + 1);
  return [str.substr(0, pos), str.substr(pos + 1)];
}

/**
 * Convert a String into an Interger.
 * @param {string} str
 * @param {radix} base
 */
export function strToInt(str, base) {
  if (typeof str !== 'string') return 0;
  const int = parseInt(str, base || 10);
  return int;
}
export function countWords(str) {
  return str.trim().split(/\s+/).length;
}


export function toCamelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}
