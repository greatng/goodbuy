'use client';

import { Button, DropdownMenu } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function LangDropdown() {
    const { t, i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const handleChangeLanguage = (lang: 'th-TH' | 'en-US') => {
        setCurrentLanguage(lang);
    };

    useEffect(() => {
        i18n.changeLanguage(currentLanguage);
    }, [currentLanguage]);

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="soft">
                    {t('Language')}: {currentLanguage}
                    <DropdownMenu.TriggerIcon />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item
                    onClick={() => handleChangeLanguage('th-TH')}
                >
                    ไทย
                </DropdownMenu.Item>
                <DropdownMenu.Item
                    onClick={() => handleChangeLanguage('en-US')}
                >
                    English
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

export default LangDropdown;

