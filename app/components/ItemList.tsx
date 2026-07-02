'use client';

import { Box, Button, Flex } from '@radix-ui/themes';
import ItemCard, { ItemInfo } from './ItemCard';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import type { FormEvent } from 'react';
import ControlButtons from './ControlButtons';

export type Item = {
    [ItemInfo.Name]?: string;
    [ItemInfo.Volume]?: number;
    [ItemInfo.Price]?: number;
    [ItemInfo.Qty]?: number;
    [ItemInfo.PerUnit]?: number;
    [ItemInfo.Unit]?: string;
    [ItemInfo.Shipping]?: number;
    isCheapest?: boolean;
};

export const ITEM_PROPERTIES = [
    ItemInfo.Name,
    ItemInfo.Qty,
    ItemInfo.Volume,
    ItemInfo.Price,
    ItemInfo.Shipping,
];

const ITEMS_DEFAULT = [
    { qty: 1, volume: 1 },
    { qty: 1, volume: 1 },
] as Item[];

function ItemList() {
    const { t } = useTranslation();
    const [items, setItems] = usePersistentState('item-lists', ITEMS_DEFAULT);

    const cheapestUnitPrice = useMemo(() => {
        const values = items
            .map((item) => Number(item[ItemInfo.PerUnit]) || Infinity)
            .filter((value) => isFinite(value));
        return values.length > 0 ? Math.min(...values) : undefined;
    }, [items]);

    const setItemInfo = (
        idx: number,
        key: ItemInfo,
        value: string | number,
    ) => {
        setItems((prev) => {
            const newItems = [...prev];
            newItems[idx] = { ...newItems[idx], [key]: value };

            // compute per-unit values and ranks
            const values = newItems.map(
                (item) => Number(item[ItemInfo.PerUnit]) || Infinity,
            );
            const sorted = values
                .map((v, i) => ({ v, i }))
                .sort((a, b) => a.v - b.v);

            const ranks: number[] = new Array(newItems.length).fill(Infinity);
            sorted.forEach((s, order) => (ranks[s.i] = order + 1));

            const modifiedItems = newItems.map((item, i) => {
                const rank = ranks[i];
                (item as any).topRank = isFinite(rank) ? rank : undefined;
                // no longer set `isCheapest` to avoid automatic green background
                return item;
            });

            return modifiedItems;
        });
    };
    const addItem = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setItems((prev) => [...prev, { qty: 1, volume: 1 }] as Item[]);
    };

    const resetItems = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setItems(ITEMS_DEFAULT);
    };

    return (
        <>
            <Flex
                direction="column"
                gap="4"
                mb="40px"
                mt="4"
                className="item-list-wrapper"
            >
                {items?.map((item, idx) => (
                    <ItemCard
                        key={idx}
                        item={item}
                        idx={idx}
                        cheapestUnitPrice={cheapestUnitPrice}
                        setItemInfo={setItemInfo}
                        setItems={setItems}
                    />
                ))}
            </Flex>
            <Box position="fixed" bottom="2" left="0" width="100%">
                <div className="bottom-control-wrap">
                    <ControlButtons
                        addItem={addItem}
                        resetItems={resetItems}
                        items={items}
                    />
                </div>
            </Box>
        </>
    );
}

export default ItemList;

