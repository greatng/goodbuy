'use client';

import { Button, Flex } from '@radix-ui/themes';
import ItemCard, { ItemInfo } from './ItemCard';
import { useTranslation } from 'react-i18next';
import { usePersistentState } from '../hooks/usePersistentState';
import type { FormEvent } from 'react';

export type Item = {
    [ItemInfo.Name]?: string;
    [ItemInfo.Volume]?: number;
    [ItemInfo.Price]?: number;
    [ItemInfo.Qty]?: number;
    [ItemInfo.PerUnit]?: number;
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

const ITEMS_DEFAULT = [{}, {}] as Item[];

function ItemList() {
    const { t } = useTranslation();
    const [items, setItems] = usePersistentState('item-lists', ITEMS_DEFAULT);
    const setItemInfo = (
        idx: number,
        key: ItemInfo,
        value: string | number
    ) => {
        setItems((prev) => {
            const newItems = [...prev];
            newItems[idx] = { ...newItems[idx], [key]: value };

            const values = newItems.map(
                (item) => item[ItemInfo.PerUnit] ?? Infinity
            );
            const cheapest = Math.min(...values);
            const modifiedItems = newItems.map((item) => {
                item.isCheapest = item[ItemInfo.PerUnit] === cheapest;

                return item;
            });

            return modifiedItems;
        });
    };
    const addItem = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setItems((prev) => [...prev, {}] as Item[]);
    };

    const resetItems = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setItems(ITEMS_DEFAULT);
    };

    return (
        <>
            <Flex direction="column" gap="4" my="4">
                {items?.map((item, idx) => (
                    <ItemCard
                        key={idx}
                        item={item}
                        idx={idx}
                        setItemInfo={setItemInfo}
                        setItems={setItems}
                    />
                ))}
            </Flex>
            <Flex direction="row" gap="2" justify={'center'}>
                <Button onClick={(e) => addItem(e)}>{t('Add Item')}</Button>
                <Button onClick={(e) => resetItems(e)} variant="soft">
                    {t('Reset')}
                </Button>
            </Flex>
        </>
    );
}

export default ItemList;

