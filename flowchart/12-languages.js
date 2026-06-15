
/************************ LANGUAGES ************************/

function setLanguage(lang) {
  if (! ['en', 'es'].includes(lang)) {
    lang = 'en';
  }
  globalLang = lang;
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const translation = translations[lang][key];
    if (translation) {
      el.textContent = translation;
    }
  });
}

function enLang() {
  globalLang = 'en';
  setLanguage('en');
}

function esLang() {
  globalLang = 'es';
  setLanguage('es');
}

function navigatorLang() {
  const lang = (navigator.language || navigator.userLanguage).substring(0, 2);
  setLanguage(lang)
}
