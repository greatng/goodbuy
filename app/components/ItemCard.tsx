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
    [ItemInfo.PerUnit]: { name: 'Price per unit', type: 'number' },
    [ItemInfo.Shipping]: { name: 'Shipping Cost', type: 'number' },
};

type ItemCardProps = {
    item: Item;
    idx: number;
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
                    onChange={(e) => cb(itemKey, e.target.value, e)}
                ></TextField.Root>
            </Text>
        </Flex>
    );
}

function ItemCard({ item, idx, setItemInfo, setItems }: ItemCardProps) {
    const { t } = useTranslation();
    const buildText = (key: ItemInfo) =>
        `${t(ITEM_PROP_CONFIG[key].name)} ${
            item[key] || (key === ItemInfo.Qty ? 1 : 0)
        }`;
    const handleChange = (
        key: ItemInfo,
        value: string | number,
        e: ChangeEvent
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
                (item[ItemInfo.Price] + (item[ItemInfo.Shipping] || 0)) /
                (item[ItemInfo.Volume] * (item[ItemInfo.Qty] || 1));

            if (isNaN(calculatedPrice)) return;

            setItemInfo(idx, ItemInfo.PerUnit, calculatedPrice);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [idx, item, setItemInfo]);

    return (
        <Card className={item.isCheapest ? 'item-card-cheapest' : ''}>
            <Flex direction="column" gap="2">
                <Flex justify="end">
                    {idx > 1 && (
                        <IconButton
                            disabled={idx == 0 || idx == 1}
                            onClick={() => handleRemove()}
                        >
                            <Cross1Icon width="18" height="18" />
                        </IconButton>
                    )}
                </Flex>
                <Grid gap="2" columns="1fr 1fr">
                    {ITEM_PROPERTIES.map((itemKey) => (
                        <InputItem
                            key={itemKey}
                            itemKey={itemKey}
                            value={item[itemKey] ?? ''}
                            cb={handleChange}
                        />
                    ))}
                </Grid>
                <Separator my="1" size="4" />
                <Text size="2">
                    {`(${buildText(ItemInfo.Price)} + ${buildText(
                        ItemInfo.Shipping
                    )}
                    ) / (${buildText(ItemInfo.Volume)} * ${buildText(
                        ItemInfo.Qty
                    )}
                    )`}
                </Text>
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

