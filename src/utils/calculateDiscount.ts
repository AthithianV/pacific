export const calculateDiscount = (oldPrice: number, newPrice: number) => {
  if (oldPrice <= 0 || newPrice < 0 || newPrice > oldPrice) {
    return {
      discountAmount: 0,
      discountPercentage: 0,
    };
  }

  const discountAmount = oldPrice - newPrice;
  const discountPercentage = (discountAmount / oldPrice) * 100;

  return {
    discountAmount,
    discountPercentage: parseFloat(discountPercentage.toFixed(2)), // Keep 2 decimal places
  };
};