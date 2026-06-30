# Portfolio Website — Firdavs Samadov
## Multilingual DevOps & Cloud Engineer Portfolio

Professional portfolio with full multilingual support (English, Russian, Tajik), hosted on GitHub Pages.

## Features

- **3 languages** — English, Russian, Tajik with instant switching
- **Language remembered** — saved in localStorage, auto-loads on revisit
- **Resume download modal** — choose CV language before downloading
- Dark/Light theme toggle
- Terminal typing animation
- Smooth scroll animations (AOS)
- Responsive mobile-first design
- GitHub contribution stats
- Contact form (Formspree)

## File Structure

```
portfolio/
├── index.html              # Main page (all data-i18n attributes)
├── style.css               # Styles including language switcher & modal
├── script.js               # Animations, theme, terminal
├── i18n.js                 # Translation engine
├── assets/
│   ├── lang/
│   │   ├── en.json         # English translations
│   │   ├── ru.json         # Russian translations
│   │   └── tj.json         # Tajik translations
│   ├── resume/
│   │   ├── CV-English.pdf  # English CV
│   │   ├── CV-Russian.pdf  # Russian CV
│   │   └── CV-Tajik.pdf    # Tajik CV
│   └── images/
│       ├── profile.jpg     # Your photo
│       └── project-*.png   # Project screenshots
└── README.md
```

## How Language Switching Works

1. `i18n.js` loads on page start
2. Checks localStorage for saved language preference
3. Falls back to browser language, then English
4. Fetches the JSON translation file (`assets/lang/xx.json`)
5. Walks the DOM looking for `data-i18n`, `data-i18n-html`, `data-i18n-placeholder` attributes
6. Replaces text content with translated values
7. Language switcher dropdown in the navbar lets users switch instantly

## How to Add a Fourth Language

1. Copy `assets/lang/en.json` → `assets/lang/xx.json`
2. Translate all values in the new JSON file
3. Open `i18n.js` and add to the `LANGUAGES` array:
   ```js
   { code: 'xx', label: 'Language Name', flag: '🏳️' },
   ```
4. Add the CV file: `assets/resume/CV-Newlanguage.pdf`
5. Add download option in the `buildResumeModal()` function in `i18n.js`

## How to Edit Translations

Open `assets/lang/xx.json` in any text editor. The structure is:

```json
{
  "section_name": {
    "key": "Translated text here"
  }
}
```

Keys must match exactly. Only edit the values (right side of `:`)

## How to Replace Resume Files

1. Place your PDF files in `assets/resume/`
2. Name them: `CV-English.pdf`, `CV-Russian.pdf`, `CV-Tajik.pdf`
3. The download modal links to these automatically

## How to Change Default Language

In `i18n.js`, change: `const DEFAULT_LANG = 'en';` to your preferred language code.

## Deployment

```bash
git init
git add .
git commit -m "Portfolio website with multilingual support"
git branch -M main
git remote add origin https://github.com/Fedia-2211/fedia-2211.github.io.git
git push -u origin main
```

Enable GitHub Pages: Settings → Pages → Branch: main → Save

## Custom Domain

Add DNS A records pointing to GitHub Pages IPs, then set custom domain in repo settings.

## License

MIT
