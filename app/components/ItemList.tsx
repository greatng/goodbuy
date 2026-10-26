import { usePersistentState } from "../hooks/usePersistentState";
import { useTranslation } from "react-i18next";
import ItemCard, { ItemInfo } from "./ItemCard";
import ControlButtons from "./ControlButtons";
import {
  CURRENCIES,
  comparison,
  unitPrice,
  validCurrency,
  type Currency,
} from "../utils/comparison";
export { unitPrice } from "../utils/comparison";

export type Item = {
  name?: string;
  volume?: number;
  price?: number;
  qty?: number;
  per_unit?: number;
  unit?: string;
  shipping?: number;
  isCheapest?: boolean;
};
export const ITEM_PROPERTIES = [
  ItemInfo.Name,
  ItemInfo.Price,
  ItemInfo.Volume,
  ItemInfo.Qty,
  ItemInfo.Shipping,
];
const defaults = (): Item[] => [
  { qty: 1, volume: 1, unit: "item" },
  { qty: 1, volume: 1, unit: "item" },
];

const validItems = (value: unknown): boolean =>
  Array.isArray(value) &&
  value.length >= 2 &&
  value.every(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      (item.unit === undefined || typeof item.unit === "string") &&
      (item.name === undefined || typeof item.name === "string") &&
      ["price", "volume", "qty", "shipping"].every(
        (key) =>
          item[key] === undefined ||
          typeof item[key] === "number" ||
          typeof item[key] === "string"
      )
  );

export default function ItemList() {
  const { t } = useTranslation();
  const [items, setItems] = usePersistentState<Item[]>(
    "item-lists",
    defaults,
    validItems
  );
  const [currency, setCurrency] = usePersistentState<Currency>(
    "comparison-currency",
    "THB",
    validCurrency
  );
  const calculated = items.map((item) => ({
    ...item,
    per_unit: unitPrice(item),
  }));
  const { count, incompatible, cheapest } = comparison(items);
  const setItemInfo = (idx: number, key: ItemInfo, value: string | number) =>
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item))
    );
  return (
    <section aria-label={t("Find the best value")}>
      <div className="comparison-note">
        {t(
          "Choose a unit for each product. Grams and kilograms (or ml and litres) are converted automatically."
        )}
      </div>
      <div className="comparison-settings">
        <label className="field-label">
          {t("Currency")}
          <select
            className="unit-select"
            aria-label={t("Currency")}
            value={currency}
            onChange={(event) => setCurrency(event.target.value as Currency)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <p>
          {t(
            "Currency applies to all prices. Changing it does not convert amounts."
          )}
        </p>
      </div>
      <p className="comparison-status" role="status">
        {t(
          incompatible
            ? "Choose matching units: compare weights, volumes, or item counts."
            : count < 2
            ? "Add at least two prices to compare."
            : "Results update as you type."
        )}
      </p>
      <div className="item-list-wrapper">
        {calculated.map((item, idx) => (
          <ItemCard
            key={idx}
            item={item}
            idx={idx}
            currency={currency}
            cheapestUnitPrice={cheapest}
            setItemInfo={setItemInfo}
            setItems={setItems}
          />
        ))}
      </div>
      <ControlButtons
        items={calculated}
        addItem={() =>
          setItems((prev) => [
            ...prev,
            { qty: 1, volume: 1, unit: prev[0]?.unit || "item" },
          ])
        }
        resetItems={() => setItems(defaults())}
      />
    </section>
  );
}
