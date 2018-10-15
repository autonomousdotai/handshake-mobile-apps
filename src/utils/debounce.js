export default function debounce(func, wait) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  const waitTime = Number.parseInt(wait, 10) || 0;
  let timeout;
  return () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(func, waitTime);
  };
}
