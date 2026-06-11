'use client';

import {
    Card,
    Flex,
    Separator,
    TextField,
    Text,
    IconButton,
    Grid,
} from '@radix-ui/themes';
import {
    type ChangeEvent,
    type Dispatch,
    type SetStateAction,
    useEffect,
} from 'react';
import { type Item, ITEM_PROPERTIES } from './ItemList';
import { useTranslation } from 'react-i18next';
import { Cross1Icon } from '@radix-ui/react-icons';

export enum ItemInfo {
    Name = 'name',
    Volume = 'volume',
    Price = 'price',
    Qty = 'qty',
    Unit = 'unit',
    PerUnit = 'per_unit',
    Shipping = 'shipping',
}

type ItemConfig = {
    name: string;
    type?: 'text' | 'number';
};

const ITEM_PROP_CONFIG: Record<ItemInfo, ItemConfig> = {
    [ItemInfo.Name]: { name: 'Item Name', type: 'text' },
    [ItemInfo.Volume]: { name: 'Volume', type: 'number' },
    [ItemInfo.Price]: { name: 'Price', type: 'number' },
    [ItemInfo.Qty]: { name: 'Quantity', type: 'number' },
    [ItemInfo.Unit]: { name: 'Unit', type: 'text' },
    [ItemInfo.PerUnit]: { name: 'Price per unit', type: 'number' },
    [ItemInfo.Shipping]: { name: 'Shipping Cost', type: 'number' },
};

type ItemCardProps = {
    item: Item;
    idx: number;
    cheapestUnitPrice?: number;
    setItemInfo: (idx: number, key: ItemInfo, value: string | number) => void;
    setItems: Dispatch<SetStateAction<Item[]>>;
};

type InputItemProps = {
    itemKey: ItemInfo;
    value: string | number;
    cb: (key: ItemInfo, value: string | number, e: ChangeEvent) => void;
};

function InputItem({ itemKey, value, cb }: InputItemProps) {
    const { t } = useTranslation();

    return (
        <Flex direction="column">
            <Text as="label" size="2">
                {t(ITEM_PROP_CONFIG[itemKey].name)}
                {' :'}
                <TextField.Root
                    type={ITEM_PROP_CONFIG[itemKey].type}
                    mt="2"
                    value={value}
                    placeholder={t(ITEM_PROP_CONFIG[itemKey].name)}
                    aria-label={t(ITEM_PROP_CONFIG[itemKey].name)}
                    onChange={(e) => cb(itemKey, e.target.value, e)}
                ></TextField.Root>
            </Text>
        </Flex>
    );
}

function ItemCard({
    item,
    idx,
    cheapestUnitPrice,
    setItemInfo,
    setItems,
}: ItemCardProps) {
    const { t } = useTranslation();
    const buildText = (key: ItemInfo) =>
        `${t(ITEM_PROP_CONFIG[key].name)} ${
            item[key] || (key === ItemInfo.Qty ? 1 : 0)
        }`;
    const handleChange = (
        key: ItemInfo,
        value: string | number,
        e: ChangeEvent,
    ) => {
        e.preventDefault();

        setItemInfo(idx, key, value);
    };

    const handleRemove = () => {
        setItems((prev: Item[]) => {
            const newItems = [...prev];
            newItems.splice(idx, 1);
            return newItems;
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!item[ItemInfo.Price] || !item[ItemInfo.Volume]) return;

            const calculatedPrice =
                (Number(item[ItemInfo.Price]) +
                    Number(item[ItemInfo.Shipping] ?? 0)) /
                (Number(item[ItemInfo.Volume]) *
                    Number(item[ItemInfo.Qty] ?? 1));

            if (isNaN(calculatedPrice)) return;

            setItemInfo(idx, ItemInfo.PerUnit, calculatedPrice);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        item[ItemInfo.Price],
        item[ItemInfo.Volume],
        item[ItemInfo.Qty],
        item[ItemInfo.Shipping],
    ]);

    const topRank = (item as any).topRank as number | undefined;
    const perUnitValue = Number(item[ItemInfo.PerUnit]);
    const itemUnit = String(item[ItemInfo.Unit] ?? 'pcs');
    const hasValidPerUnit = isFinite(perUnitValue) && perUnitValue > 0;
    const hasCheapestValue = Number.isFinite(cheapestUnitPrice ?? NaN);
    const savingsPercent =
        hasValidPerUnit && hasCheapestValue
            ? ((perUnitValue - Number(cheapestUnitPrice)) /
                  Number(cheapestUnitPrice)) *
              100
            : undefined;

    return (
        <Card
            className={`item-card
                ${topRank === 1 ? ' item-card-top1' : ''}
                ${topRank === 2 ? ' item-card-top2' : ''}
                ${topRank === 3 ? ' item-card-top3' : ''}
            `}
        >
            <Flex direction="column" gap="2">
                <Flex
                    className="item-card-header"
                    justify="between"
                    align="center"
                >
                    <div style={{ flex: 1 }}>
                        <TextField.Root
                            type="text"
                            value={item[ItemInfo.Name] ?? ''}
                            onChange={(e) =>
                                handleChange(ItemInfo.Name, e.target.value, e)
                            }
                            aria-label="Item name"
                            placeholder={t(
                                ITEM_PROP_CONFIG[ItemInfo.Name].name,
                            )}
                            className="item-name-input"
                        />
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                        }}
                    >
                        {topRank && (
                            <div
                                className={`rank-badge rank-${topRank}`}
                                title={`Rank #${topRank}`}
                            >
                                {topRank}
                            </div>
                        )}
                        {topRank === 1 && (
                            <div className="best-value-pill">Best value</div>
                        )}

                        <div className="per-unit-badge" title="Price per unit">
                            <div className="per-unit-label">
                                {t(ITEM_PROP_CONFIG[ItemInfo.PerUnit].name)}{' '}
                                {itemUnit ? ` / ${itemUnit}` : ''}
                            </div>
                            <div className="per-unit-value">
                                {item[ItemInfo.PerUnit]?.toPrecision(4) ?? '-'}
                                {itemUnit ? ` / ${itemUnit}` : ''}
                            </div>
                        </div>

                        {idx > 1 && (
                            <IconButton
                                onClick={() => handleRemove()}
                                aria-label="Remove item"
                            >
                                <Cross1Icon width="18" height="18" />
                            </IconButton>
                        )}
                    </div>
                </Flex>
                <Grid gap="2" columns="1fr 1fr" className="item-input-grid">
                    {ITEM_PROPERTIES.filter((k) => k !== ItemInfo.Name).map(
                        (itemKey) => (
                            <InputItem
                                key={itemKey}
                                itemKey={itemKey}
                                value={item[itemKey] ?? ''}
                                cb={handleChange}
                            />
                        ),
                    )}
                </Grid>
                <Separator my="1" size="4" />
                <Text size="2">
                    {`(${buildText(ItemInfo.Price)} + ${buildText(
                        ItemInfo.Shipping,
                    )}
                    ) / (${buildText(ItemInfo.Volume)} * ${buildText(
                        ItemInfo.Qty,
                    )}
                    )`}
                </Text>
                {hasValidPerUnit && hasCheapestValue && (
                    <Text size="2" className="item-card-savings">
                        {topRank === 1
                            ? 'Lowest unit price in your list'
                            : `Pay ${savingsPercent?.toFixed(
                                  1,
                              )}% more than the cheapest`}
                    </Text>
                )}
                <Text as="label" size="2">
                    {t(ITEM_PROP_CONFIG[ItemInfo.PerUnit].name)}
                    {' : '}
                    <TextField.Root
                        mt={'2'}
                        value={item[ItemInfo.PerUnit]?.toPrecision(4) ?? ''}
                        disabled={true}
                    ></TextField.Root>
                </Text>
            </Flex>
        </Card>
    );
}

export default ItemCard;

