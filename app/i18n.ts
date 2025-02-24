import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import th from './locales/th.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    'en-US': {
        translation: en,
    },
    'th-TH': {
        translation: th,
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection: { lookupLocalStorage: 'goodbuy-lang' },
        fallbackLng: 'th-TH',
        resources,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        keySeparator: '.',
    });

export default i18n;

