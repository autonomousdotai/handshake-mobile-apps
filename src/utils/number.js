export const formatAmount = (amount, ROUND = 10000) => {
  return Math.floor(amount * ROUND) / ROUND;
};

export const getOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

