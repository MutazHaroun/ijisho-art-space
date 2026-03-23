export const formatCurrency = (amount) => {
  return `RWF ${Number(amount || 0).toLocaleString()}`;
};