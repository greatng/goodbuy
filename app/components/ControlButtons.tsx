import { Button, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import type { Item } from './ItemList';
import Top3Dialog from './Top3Dialog';

function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconReset() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M21 12a9 9 0 11-3.22-6.72"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M21 3v6h-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ControlButtons({
    addItem,
    resetItems,
    items,
}: {
    addItem: (e: any) => void;
    resetItems: (e: any) => void;
    items: Item[];
}) {
    const { t } = useTranslation();

    return (
        <Flex
            direction="row"
            gap="2"
            justify={'center'}
            className="controls-group"
        >
            <Top3Dialog items={items} inline />
            <Button
                onClick={(e) => addItem(e)}
                aria-label={t('Add Item') as string}
                title={t('Add Item') as string}
            >
                <IconPlus />
                <span>Add</span>
            </Button>
            <Button
                onClick={(e) => resetItems(e)}
                variant="soft"
                aria-label={t('Reset') as string}
                title={t('Reset') as string}
            >
                <IconReset />
                <span>Clear</span>
            </Button>
        </Flex>
    );
}

export default ControlButtons;

