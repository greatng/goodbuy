import { Button, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

function ControlButtons({
    addItem,
    resetItems,
}: {
    addItem: (e: any) => void;
    resetItems: (e: any) => void;
}) {
    const { t } = useTranslation();

    return (
        <Flex direction="row" gap="2" justify={'center'}>
            <Button onClick={(e) => addItem(e)}>{t('Add Item')}</Button>
            <Button onClick={(e) => resetItems(e)} variant="soft">
                {t('Reset')}
            </Button>
        </Flex>
    );
}

export default ControlButtons;

