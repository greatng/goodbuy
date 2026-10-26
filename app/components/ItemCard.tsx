import { Card, TextField, Button } from "@radix-ui/themes";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { Item } from "./ItemList";
import { UNITS, getUnit, type Currency } from "../utils/comparison";

export enum ItemInfo {
  Name = "name",
  Volume = "volume",
  Price = "price",
  Qty = "qty",
  Unit = "unit",
  PerUnit = "per_unit",
  Shipping = "shipping",
}
type Props = {
  currency: Currency;
  item: Item;
  idx: number;
  cheapestUnitPrice?: number;
  setItemInfo: (idx: number, key: ItemInfo, value: string | number) => void;
  setItems: Dispatch<SetStateAction<Item[]>>;
};
export default function ItemCard({
  currency,
  item,
  idx,
  cheapestUnitPrice,
  setItemInfo,
  setItems,
}: Props) {
  const { t, i18n } = useTranslation();
  const best =
    item.per_unit !== undefined && item.per_unit === cheapestUnitPrice;
  const format = (n: number) =>
    new Intl.NumberFormat(i18n.language, {
      maximumSignificantDigits: 4,
    }).format(n);
  const formatPrice = (n: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency,
      ...(n < 0.01
        ? { maximumSignificantDigits: 4 }
        : { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    }).format(n);
  const input = (
    key: ItemInfo.Price | ItemInfo.Volume | ItemInfo.Qty | ItemInfo.Shipping,
    label: string
  ) => (
    <label className="field-label">
      {t(label)}
      <TextField.Root
        size="3"
        aria-label={t(label)}
        type="number"
        inputMode="decimal"
        min={key === ItemInfo.Shipping ? 0 : 0.000001}
        step="any"
        value={item[key] ?? ""}
        placeholder={key === ItemInfo.Price ? "0.00" : "0"}
        onChange={(e) => setItemInfo(idx, key, e.target.value)}
      />
    </label>
  );
  return (
    <Card className={`item-card${best ? " item-card-best" : ""}`}>
      <div className="item-card-header">
        <h2>
          {t("Product")} {idx + 1}
        </h2>
        {best && (
          <span className="best-value-pill">✓ {t("Lowest unit price")}</span>
        )}
        {idx > 1 && (
          <Button
            variant="ghost"
            color="gray"
            onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
            aria-label={`${t("Remove product")} ${idx + 1}`}
          >
            ×
          </Button>
        )}
      </div>
      <label className="field-label">
        {t("Item Name")}
        <TextField.Root
          size="3"
          value={item.name ?? ""}
          placeholder={t("Optional name")}
          onChange={(e) => setItemInfo(idx, ItemInfo.Name, e.target.value)}
        />
      </label>
      <div className="item-input-grid">
        {input(ItemInfo.Price, "Price for the whole pack")}
        {input(ItemInfo.Volume, "Size of each item")}
        <label className="field-label">
          {t("Unit")}
          <select
            className="unit-select"
            aria-label={t("Unit")}
            value={item.unit || "item"}
            onChange={(event) =>
              setItemInfo(idx, ItemInfo.Unit, event.target.value)
            }
          >
            {item.unit && !Object.hasOwn(UNITS, item.unit) && (
              <option value={item.unit}>{t("Choose a unit")}</option>
            )}
            {Object.keys(UNITS).map((unit) => (
              <option key={unit} value={unit}>
                {t(unit)}
              </option>
            ))}
          </select>
        </label>
        {input(ItemInfo.Qty, "Items in the pack")}
      </div>
      <details className="more-options">
        <summary>{t("More options")}</summary>
        {input(ItemInfo.Shipping, "Shipping (optional)")}
      </details>
      <div className="unit-result">
        <span>{t("Price per unit")}</span>
        <span>
          {(!item.unit || Object.hasOwn(UNITS, item.unit)) &&
            t(getUnit(item.unit).label)}
        </span>
        <strong>
          {item.per_unit === undefined ? "—" : formatPrice(item.per_unit)}
        </strong>
        <span>
          {item.per_unit === undefined
            ? t(
                item.unit && !Object.hasOwn(UNITS, item.unit)
                  ? "Choose a unit"
                  : item.price
                  ? "Enter positive values for price, size and quantity."
                  : "Enter a price to compare"
              )
            : cheapestUnitPrice !== undefined && !best
            ? `${format((item.per_unit / cheapestUnitPrice - 1) * 100)}% ${t(
                "More than the lowest unit price"
              )}`
            : ""}
        </span>
      </div>
    </Card>
  );
}
