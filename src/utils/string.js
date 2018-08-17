export function smartTrim(str, maxLength, separator = ' ') {
  if (str.length <= maxLength) return str;
  const pos = str.lastIndexOf(separator, maxLength + 1);
  return [str.substr(0, pos), str.substr(pos + 1)];
}

export function countWords(str) {
  return str.trim().split(/\s+/).length;
}
