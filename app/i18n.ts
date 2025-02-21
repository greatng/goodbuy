import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import th from './locales/th.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: en,
    },
    th: {
        translation: th,
    },
};

const isLocalStorageAvailable =
    typeof window !== 'undefined' && window.localStorage;

const defaultLanguage = 'th';
const storedLanguage = isLocalStorageAvailable
    ? localStorage.getItem('use-persistent-state-current-language')
    : null;
const lng = storedLanguage ? JSON.parse(storedLanguage) : defaultLanguage;

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        lng,
        resources,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        keySeparator: '.',
    });

export default i18n;

