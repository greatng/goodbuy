export const UNITS = {
  item: { dimension: "count", factor: 1, label: "per item" },
  g: { dimension: "weight", factor: 1, label: "per 100 g" },
  kg: { dimension: "weight", factor: 1000, label: "per 100 g" },
  ml: { dimension: "volume", factor: 1, label: "per 100 ml" },
  l: { dimension: "volume", factor: 1000, label: "per 100 ml" },
} as const;
export type Unit = keyof typeof UNITS;
export type PriceInput = {
  price?: number | string;
  volume?: number | string;
  qty?: number | string;
  shipping?: number | string;
  unit?: string;
};
export const CURRENCIES = ["THB", "USD", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];
export const validCurrency = (value: unknown): boolean =>
  CURRENCIES.includes(value as Currency);
export function getUnit(unit?: string) {
  return UNITS[unit && Object.hasOwn(UNITS, unit) ? (unit as Unit) : "item"];
}

// Amount per 100 g, per 100 ml, or per item; currency never changes the calculation.
export function unitPrice(item: PriceInput): number | undefined {
  if (item.unit && !Object.hasOwn(UNITS, item.unit)) return undefined;
  const price = Number(item.price);
  const size = Number(item.volume);
  const quantity = Number(item.qty);
  const shipping = Number(item.shipping || 0);
  if (
    ![price, size, quantity, shipping].every(Number.isFinite) ||
    price <= 0 ||
    size <= 0 ||
    quantity <= 0 ||
    shipping < 0
  )
    return undefined;
  const unit = getUnit(item.unit);
  const scale = unit.dimension === "count" ? 1 : 100;
  const result = ((price + shipping) / (size * quantity * unit.factor)) * scale;
  return Number.isFinite(result) && result > 0 ? result : undefined;
}

export function comparison(items: PriceInput[]) {
  const valid = items.flatMap((item) => {
    const price = unitPrice(item);
    return price === undefined
      ? []
      : [{ price, dimension: getUnit(item.unit).dimension }];
  });
  const incompatible = new Set(valid.map((item) => item.dimension)).size > 1;
  return {
    count: valid.length,
    incompatible,
    cheapest:
      valid.length >= 2 && !incompatible
        ? Math.min(...valid.map((item) => item.price))
        : undefined,
  };
}
