import en from './en';
import fr from './fr';
import zh from './zh';
import de from './de';
import ja from './ja';
import ko from './ko';
import ru from './ru';
import es from './es';

const languages = {
  en: { ...en },
  fr: { ...en, ...fr },
  zh: { ...en, ...zh },
  de: { ...en, ...de },
  ja: { ...en, ...ja },
  ko: { ...en, ...ko },
  ru: { ...en, ...ru },
  es: { ...en, ...es },
};

export default languages;
