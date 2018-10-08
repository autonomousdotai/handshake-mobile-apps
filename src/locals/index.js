import i18n from 'handshake-i18n';
import en from './en';

const languages = {
  en: { ...en },
  fr: Object.assign({}, en, i18n.fr),
  zh: Object.assign({}, en, i18n.zh),
  de: Object.assign({}, en, i18n.de),
  ja: Object.assign({}, en, i18n.ja),
  ko: Object.assign({}, en, i18n.ko),
  ru: Object.assign({}, en, i18n.ru),
  es: Object.assign({}, en, i18n.es),
};

export default languages;
