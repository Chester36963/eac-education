# EAC Education - GitHub Pages Deployment Guide

**Phase 1g: Complete Deployment Setup**

## Quick Start (5 minutes)

### 1. Create GitHub Repository
```bash
# Go to github.com and create new repository
# Name it: eac-education
# Description: Premium DSE Mathematics Question Bank
# Make it PUBLIC (required for free GitHub Pages)
```

### 2. Clone & Setup Locally
```bash
git clone https://github.com/YOUR-USERNAME/eac-education.git
cd eac-education

# Copy all src/ files to repo root
# The workflow will automatically deploy src/ to gh-pages
```

### 3. Commit & Push
```bash
git add .
git commit -m "Initial Phase 1 release - Full platform"
git push origin main
```

### 4. Enable GitHub Pages
Go to your repo → **Settings → Pages**:
- Source: Deploy from a branch
- Branch: gh-pages
- Folder: / (root)
- Save

### 5. Access Your Site
Website will be live at:
```
https://YOUR-USERNAME.github.io/eac-education/
```

---

## How It Works

### GitHub Actions Workflow
File: `.github/workflows/deploy.yml`

**Triggered on:** Every push to `main` branch

**Steps:**
1. Checkout code
2. Deploy `src/` folder to `gh-pages` branch
3. GitHub Pages serves the files

**Result:** Website updates automatically in ~30 seconds

---

## What Gets Deployed

```
What's in src/
└── Deployed to GitHub Pages as /

src/index.html          →  yoursite.com/index.html
src/css/base.css        →  yoursite.com/css/base.css
src/js/core/auth.js     →  yoursite.com/js/core/auth.js
src/data/questions.json →  yoursite.com/data/questions.json
... etc ...
```

---

## Making Updates

### One-command local workflow

From the project root:

```bash
./scripts/dev.sh
```

Open `http://127.0.0.1:4173/src/` while developing. After checking the page, deploy with:

```bash
./scripts/deploy.sh "Improve Four Centres practice flow"
```

The command validates the JSON data and whitespace, commits the current `src/`, `docs/`, `scripts/` and workflow changes, then pushes `main`. Configure `origin` once for the new repository; every later update uses the same website and repository.

### Add Questions
1. Edit `src/data/questions.json`
2. Save file
3. Commit & push:
   ```bash
   git add src/data/questions.json
   git commit -m "Add 50 new Polynomials questions"
   git push origin main
   ```
4. Site updates in ~30 seconds

### Fix Bugs
1. Edit file (e.g., `src/css/base.css`)
2. Test locally (open in browser)
3. Commit & push
4. Site updates automatically

### Deploy New Pages
1. Create `src/new-page.html`
2. Add links from other pages
3. Commit & push
4. New page live immediately

---

## Verifying Deployment

### Check GitHub Actions Status
1. Go to repo → **Actions** tab
2. See deployment runs
3. Green checkmark = success
4. Red X = error (check logs)

### Test Live Site
1. Open `https://YOUR-USERNAME.github.io/eac-education/`
2. Try all pages (landing, auth, app, dashboard)
3. Create test account
4. Practice questions
5. Check localStorage works

### Check CSS & JS Loaded
1. Open in browser
2. Press F12 (Developer Tools)
3. Check Network tab
4. CSS files should load (green 200)
5. No red 404 errors

---

## Custom Domain (Optional)

### Add Custom Domain
1. Buy domain (GoDaddy, Namecheap, etc.)
2. In repo, edit `.github/workflows/deploy.yml`:
   ```yaml
   cname: yourdomain.com
   ```
3. Update domain DNS:
   - A record → `185.199.108.153`
   - A record → `185.199.109.153`
   - A record → `185.199.110.153`
   - A record → `185.199.111.153`
   - CNAME → `YOUR-USERNAME.github.io`

4. Commit & push
5. Takes 5-15 minutes to propagate

### Verify Custom Domain
- Open `https://yourdomain.com`
- Should see your site
- Browser URL stays at custom domain

---

## Troubleshooting

### Website not updating?
1. Push was successful? Check `git log`
2. GitHub Actions ran? Check repo → Actions tab
3. No errors? Check for 404s (F12 → Network)
4. Try force refresh: Ctrl+Shift+R

### Getting 404 errors?
- Check file paths in HTML are correct
- Verify all files exist in `src/`
- CSS/JS paths should be relative: `css/base.css` (not `/css/base.css`)

### GitHub Pages not enabled?
1. Go to Settings → Pages
2. Set source to `gh-pages` branch
3. Folder `/`
4. Save
5. Wait 2-5 minutes for activation

### Questions not loading?
1. Check `src/data/questions.json` exists
2. Verify JSON syntax (use jsonlint.com)
3. Check browser console (F12)
4. Reload page

### localStorage not working?
1. Try incognito/private mode
2. Check if localStorage is enabled in browser
3. Look for storage permission errors (F12 Console)
4. Some browsers clear storage in private mode

---

## Continuous Workflow

This is your typical workflow:

```
1. Make changes locally
   └─ Edit files in src/

2. Test locally
   └─ Open file directly in browser
   └─ Or use Live Server extension

3. Commit changes
   └─ git add .
   └─ git commit -m "description"

4. Push to GitHub
   └─ git push origin main

5. GitHub Actions auto-deploys
   └─ Takes ~30 seconds

6. Site is live
   └─ https://YOUR-USERNAME.github.io/eac-education/
```

---

## Best Practices

### Do:
- ✅ Push to main regularly (at least weekly)
- ✅ Use descriptive commit messages
- ✅ Test locally before pushing
- ✅ Keep questions.json organized
- ✅ Comment your code changes
- ✅ Monitor GitHub Actions for errors

### Don't:
- ❌ Push broken code to main
- ❌ Commit sensitive data (passwords, API keys)
- ❌ Force push (unless absolutely necessary)
- ❌ Ignore GitHub Actions errors
- ❌ Leave large unused files

---

## Scaling to Many Questions

Current setup:
- `questions.json` can handle ~1000 questions comfortably
- For 10,000+ questions, consider:
  - Split into multiple JSON files
  - Load by topic/category on demand
  - Or migrate to backend database (Phase 2)

Example: `questions-four-centres.json`, `questions-polynomial.json`, etc.

Then in code:
```javascript
// Load questions dynamically
const response = await fetch(`data/questions-${topicId}.json`);
```

---

## Performance Tips

### Optimize Images
- All images should be <100KB
- Use WebP format where possible
- Serve scaled versions (not full resolution)

### Minimize CSS/JS
- Currently ~41KB unminified
- Can minify for production (optional)
- Use gzip compression (GitHub handles this)

### Lazy Load Questions
- Load only when needed
- Don't load all 10,000 at once
- Current app only loads filtered questions

---

## Security Notes

### Passwords are Hashed
- Client-side hashing only (Phase 1)
- Not recommended for production
- Phase 2: Use proper backend authentication

### No Sensitive Data in Code
- Don't commit `.env` files
- Don't commit API keys
- Don't commit credentials

### HTTPS Enabled
- GitHub Pages always uses HTTPS
- Your site is secure by default

---

## Monitoring & Analytics

### Track Deployments
```bash
# See deployment history
git log --oneline -10

# See who changed what
git log --stat

# See specific file changes
git log -p src/data/questions.json
```

### Monitor Live Site
- Set up Google Analytics (Phase 2)
- Monitor GitHub Actions
- Track error logs in browser console

---

## Rollback (If Needed)

### Revert Last Commit
```bash
git revert HEAD

# This creates a NEW commit that undoes the previous one
# Safer than reset for shared repos
```

### Go Back to Earlier Version
```bash
git log --oneline
# Find the commit you want
git revert <commit-hash>

# Or reset (careful - destructive)
git reset --hard <commit-hash>
git push origin main -f  # Force push
```

---

## Accessing Statistics

### Deployment Success Rate
- GitHub Actions tab shows all runs
- Success = green checkmark

### Traffic Stats
- Go to Settings → Pages
- See traffic and popular pages

### Site Performance
- Use PageSpeed Insights
- Check Lighthouse in DevTools (F12)
- Monitor Core Web Vitals

---

## Next Steps After Deployment

1. **Share the Link**
   - Send `https://YOUR-USERNAME.github.io/eac-education/`
   - Start getting student feedback

2. **Monitor Feedback**
   - Track which features students use
   - Which questions cause confusion
   - Where they drop off

3. **Add More Questions**
   - Update `questions.json` regularly
   - Deploy updates automatically

4. **Plan Phase 2**
   - Real backend database
   - Multi-device sync
   - Analytics

---

**Deployment Complete & Ready to Go Live** ✨

Your EAC Education platform is now:
- ✅ Fully functional
- ✅ Deployed to GitHub Pages
- ✅ Auto-updating with every push
- ✅ Accessible worldwide
- ✅ Secure (HTTPS)
- ✅ Always available

**Next:** Share the link and start collecting student feedback!
