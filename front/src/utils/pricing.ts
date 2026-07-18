export function calculateDiscountedPrice(
  rentalPrice: number | string,
  discountPercentage?: number | null
) {
  const price = Number(rentalPrice);
  const discount = Math.min(100, Math.max(0, discountPercentage ?? 0));

  return Math.round((price - price * (discount / 100)) * 100) / 100;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}
