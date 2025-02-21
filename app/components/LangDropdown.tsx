'use client';

import { Button, DropdownMenu } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { usePersistentState } from '../hooks/usePersistentState';
import '../i18n';

function LangDropdown() {
    const [currentLanguage, setCurrentLanguage] = usePersistentState(
        'current-language',
        'th'
    );
    const { t, i18n } = useTranslation();
    const handleChangeLanguage = (lang: string) => {
        setCurrentLanguage(lang);
        i18n.changeLanguage(lang);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft">
                    {t('Language')}: {currentLanguage}
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => handleChangeLanguage('th')}>
                    ไทย
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleChangeLanguage('en')}>
                    English
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export default LangDropdown;

