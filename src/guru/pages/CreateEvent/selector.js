export const reportSelector = state => {
  return (state.guru.reports || []).map(r => {
    return Object.assign({}, r, {
      value: r.id.toString(),
      label: r.url
    });
  });
};
