import { Switch } from '@radix-ui/themes';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import LangDropdown from './LangDropdown';
export default function GuideCard({ isDarkMode, setIsDarkMode }: { isDarkMode: boolean; setIsDarkMode: Dispatch<SetStateAction<boolean>> }) {
    const { t } = useTranslation();
    return <header className="page-header"><div className="toolbar"><span className="brand">Goodbuy<span aria-hidden="true">.</span></span><div className="preferences"><label><Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} /> {t('Dark mode')}</label><LangDropdown /></div></div><h1>{t('Find the best value')}</h1><p>{t('Enter the price and size of each product. The lowest unit price wins.')}</p></header>;
}
