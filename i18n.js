/* ═══════════════════════════════════════════════════════════════════════════
   i18n Engine — Multilingual Support
   Loads translation JSON files and dynamically updates all page text.
   
   HOW IT WORKS:
   - HTML elements use data-i18n="key.path" for text content
   - data-i18n-html="key.path" for innerHTML (supports <strong> etc)
   - data-i18n-placeholder="key.path" for input placeholders
   - Language preference saved in localStorage
   
   HOW TO ADD A NEW LANGUAGE:
   1. Create assets/lang/xx.json (copy en.json, translate all values)
   2. Add entry to LANGUAGES array below
   3. Add CV file to assets/resume/CV-Newlang.pdf
   ═══════════════════════════════════════════════════════════════════════════ */

const I18N = (() => {

  // ── Supported languages ────────────────────────────────────────────────
  const LANGUAGES = [
    { code: 'en', label: 'English',  flag: '🇺🇸' },
    { code: 'ru', label: 'Русский',  flag: '🇷🇺' },
    { code: 'tj', label: 'Тоҷикӣ',  flag: '🇹🇯' },
  ];

  const DEFAULT_LANG = 'en';
  let currentLang = DEFAULT_LANG;
  let translations = {};
  let cache = {};

  // ── Get nested value from object by dot path ──────────────────────────
  function getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);
  }

  // ── Load translation file ─────────────────────────────────────────────
  async function loadTranslation(lang) {
    if (cache[lang]) {
      translations = cache[lang];
      return;
    }
    try {
      const response = await fetch(`assets/lang/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
      cache[lang] = await response.json();
      translations = cache[lang];
    } catch (err) {
      console.error(`[i18n] Error loading ${lang}:`, err);
      // Fallback to English
      if (lang !== DEFAULT_LANG) {
        await loadTranslation(DEFAULT_LANG);
      }
    }
  }

  // ── Apply translations to DOM ─────────────────────────────────────────
  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(translations, key);
      if (val) el.textContent = val;
    });

    // HTML content (supports <strong>, <a>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getNestedValue(translations, key);
      if (val) el.innerHTML = val;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedValue(translations, key);
      if (val) el.placeholder = val;
    });

    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = getNestedValue(translations, key);
      if (val) el.setAttribute('aria-label', val);
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;

    // Update language switcher active state
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Update the current language display
    const currentDisplay = document.getElementById('currentLangLabel');
    const langInfo = LANGUAGES.find(l => l.code === currentLang);
    if (currentDisplay && langInfo) {
      currentDisplay.textContent = `${langInfo.flag} ${langInfo.code.toUpperCase()}`;
    }
  }

  // ── Switch language ───────────────────────────────────────────────────
  async function setLanguage(lang) {
    if (!LANGUAGES.find(l => l.code === lang)) {
      console.warn(`[i18n] Language '${lang}' not supported`);
      return;
    }
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);
    await loadTranslation(lang);
    applyTranslations();
  }

  // ── Initialize ────────────────────────────────────────────────────────
  async function init() {
    // Check saved preference, then browser language, then default
    const saved = localStorage.getItem('portfolio-lang');
    const browserLang = navigator.language.split('-')[0];
    const detectedLang = saved || 
      (LANGUAGES.find(l => l.code === browserLang) ? browserLang : DEFAULT_LANG);
    
    await setLanguage(detectedLang);
    buildLanguageSwitcher();
    buildResumeModal();
  }

  // ── Build language switcher dropdown ───────────────────────────────────
  function buildLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const langInfo = LANGUAGES.find(l => l.code === currentLang);

    switcher.innerHTML = `
      <button class="lang-toggle" id="langToggle" aria-label="Change language">
        <span id="currentLangLabel">${langInfo.flag} ${langInfo.code.toUpperCase()}</span>
        <i class="fas fa-chevron-down lang-arrow"></i>
      </button>
      <div class="lang-dropdown" id="langDropdown">
        ${LANGUAGES.map(l => `
          <button class="lang-option ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
            <span class="lang-flag">${l.flag}</span>
            <span class="lang-label">${l.label}</span>
            ${l.code === currentLang ? '<i class="fas fa-check lang-check"></i>' : ''}
          </button>
        `).join('')}
      </div>
    `;

    // Toggle dropdown
    const toggle = document.getElementById('langToggle');
    const dropdown = document.getElementById('langDropdown');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      toggle.classList.toggle('open');
    });

    // Language selection
    dropdown.querySelectorAll('.lang-option').forEach(btn => {
      btn.addEventListener('click', async () => {
        await setLanguage(btn.dataset.lang);
        dropdown.classList.remove('open');
        toggle.classList.remove('open');
        buildLanguageSwitcher(); // Rebuild to update check marks
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
      toggle.classList.remove('open');
    });
  }

  // ── Build resume download modal ───────────────────────────────────────
  function buildResumeModal() {
    // Create modal if it doesn't exist
    if (document.getElementById('resumeModal')) return;

    const modal = document.createElement('div');
    modal.id = 'resumeModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" id="modalClose">&times;</button>
        <h3 data-i18n="resume_modal.title"></h3>
        <div class="modal-options">
          <a href="assets/resume/CV-English.pdf" class="modal-option" download>
            <span class="lang-flag">🇺🇸</span>
            <span data-i18n="resume_modal.download_en">Download English CV</span>
            <i class="fas fa-download"></i>
          </a>
          <a href="assets/resume/CV-Russian.pdf" class="modal-option" download>
            <span class="lang-flag">🇷🇺</span>
            <span data-i18n="resume_modal.download_ru">Download Russian CV</span>
            <i class="fas fa-download"></i>
          </a>
          <a href="assets/resume/CV-Tajik.pdf" class="modal-option" download>
            <span class="lang-flag">🇹🇯</span>
            <span data-i18n="resume_modal.download_tj">Download Tajik CV</span>
            <i class="fas fa-download"></i>
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Apply current translations to modal
    applyTranslations();

    // Close handlers
    document.getElementById('modalClose').addEventListener('click', () => {
      modal.classList.remove('open');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });

    // Open modal on resume button click
    document.querySelectorAll('.resume-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
      });
    });
  }

  // ── Public API ────────────────────────────────────────────────────────
  return {
    init,
    setLanguage,
    getCurrentLang: () => currentLang,
    LANGUAGES,
  };

})();
