# Portfolio Website — Firdavs Samadov

Professional portfolio website for a DevOps & Cloud Engineer, hosted on GitHub Pages.

**Live:** https://fedia-2211.github.io (or your custom domain)

## Features

- Dark/Light theme toggle with saved preference
- Terminal typing animation in hero section
- Smooth scroll animations (AOS library)
- Responsive design (mobile-first)
- GitHub contribution stats
- Contact form (Formspree integration)
- Fast loading, semantic HTML, accessible

## Deployment to GitHub Pages

### Step 1 — Create Repository

1. Go to https://github.com/new
2. Repository name: `fedia-2211.github.io` (must match your username)
3. Set to Public
4. Click "Create repository"

### Step 2 — Push Code

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio website"
git branch -M main
git remote add origin https://github.com/Fedia-2211/fedia-2211.github.io.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to repository → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `/ (root)`
4. Click Save
5. Wait 2-3 minutes
6. Your site is live at: `https://fedia-2211.github.io`

### Step 4 — Custom Domain (Optional)

1. In repo Settings → Pages → Custom domain: enter `samadov.xyz`
2. Create a CNAME file in your repo with content: `samadov.xyz`
3. In your DNS (Route 53), add:
   - A record → 185.199.108.153
   - A record → 185.199.109.153
   - A record → 185.199.110.153
   - A record → 185.199.111.153
4. Check "Enforce HTTPS"

## Customization

### Replace Photo
Put your photo at `assets/images/profile.jpg` (recommended: 520x620px)

### Update Contact Form
1. Go to https://formspree.io and create a free account
2. Create a new form
3. Replace `YOUR_FORM_ID` in index.html with your form ID

### Add Project Screenshots
Place screenshots in `assets/images/`:
- `project-commerce.png` — Cloud-Native Commerce Platform
- `project-gitops.png` — GitOps Kubernetes Platform
- `project-enterprise.png` — Enterprise Application Platform

### Change Colors
Edit CSS variables in `style.css` under `:root` (dark) and `[data-theme="light"]`

## File Structure

```
portfolio/
├── index.html          # Main page
├── style.css           # All styles
├── script.js           # Animations & interactivity
├── assets/
│   ├── images/
│   │   ├── profile.jpg          # Your photo
│   │   ├── project-commerce.png
│   │   ├── project-gitops.png
│   │   └── project-enterprise.png
│   └── resume.pdf               # Your CV
└── README.md
```

## License

MIT
