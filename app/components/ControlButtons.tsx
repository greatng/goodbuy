import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import type { Item } from './ItemList';
export default function ControlButtons({ addItem, resetItems }: { addItem: () => void; resetItems: () => void; items: Item[] }) {
    const { t } = useTranslation();
    return <Flex gap="3" wrap="wrap" className="controls-group">
        <Button size="3" onClick={addItem}>+ {t('Add Item')}</Button>
        <AlertDialog.Root><AlertDialog.Trigger><Button size="3" color="gray" variant="soft">{t('Reset')}</Button></AlertDialog.Trigger><AlertDialog.Content maxWidth="420px"><AlertDialog.Title>{t('Clear all products?')}</AlertDialog.Title><AlertDialog.Description>{t('This will remove your saved comparison.')}</AlertDialog.Description><Flex justify="end" gap="3" mt="4"><AlertDialog.Cancel><Button variant="soft" color="gray">{t('Cancel')}</Button></AlertDialog.Cancel><AlertDialog.Action><Button color="red" onClick={resetItems}>{t('Clear all')}</Button></AlertDialog.Action></Flex></AlertDialog.Content></AlertDialog.Root>
    </Flex>;
}
