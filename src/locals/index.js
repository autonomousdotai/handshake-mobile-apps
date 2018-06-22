import i18n from 'handshake-i18n';
import en from './en';

const languages = {
  en: { ...en },
  fr: { ...en, ...i18n.fr },
  zh: { ...en, ...i18n.zh },
  de: { ...en, ...i18n.de },
  ja: { ...en, ...i18n.ja },
  ko: { ...en, ...i18n.ko },
  ru: { ...en, ...i18n.ru },
  es: { ...en, ...i18n.es },
};

export default languages;
