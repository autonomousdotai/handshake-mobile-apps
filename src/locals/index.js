import i18n from 'handshake-i18n';
import { merge } from 'lodash';
import en from './en';

const languages = {
  en: { ...en },
  fr: merge({}, en, i18n.fr),
  zh: merge({}, en, i18n.zh),
  de: merge({}, en, i18n.de),
  ja: merge({}, en, i18n.ja),
  ko: merge({}, en, i18n.ko),
  ru: merge({}, en, i18n.ru),
  es: merge({}, en, i18n.es),
};

export default languages;
