# Deploy to Render

## Quick Deploy (5 minutes)

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial release"
   git branch -M main
   # Create repo on GitHub, then:
   git remote add origin git@github.com:YOUR_USERNAME/claude-code-onboarding.git
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select `claude-code-onboarding` repository
   - Render auto-detects settings from `render.yaml`
   - Click "Create Web Service"
   - **Done!** You'll get a URL like: `https://claude-code-learning.onrender.com`

### Option 2: Deploy from Git URL

1. **Push to any Git provider** (GitHub, GitLab, Bitbucket)

2. **On Render:**
   - New Web Service
   - "Public Git repository"
   - Paste your repo URL
   - Auto-detect settings
   - Deploy!

---

## Manual Configuration (if auto-detect fails)

If Render doesn't use `render.yaml`:

- **Name**: claude-code-learning
- **Runtime**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

---

## Your Site Will Be Live At:

`https://YOUR-SERVICE-NAME.onrender.com`

---

## After Deployment

1. **Test your site** - visit all pages
2. **Update links** - replace placeholder URLs in content
3. **Add custom domain** (optional) - Render supports custom domains on free tier

---

## Troubleshooting

### Build Fails

Check build logs in Render dashboard. Common issues:
- Missing dependencies: Check `package.json`
- Node version: Specified in `render.yaml`

### Site Not Loading

- Check "Logs" tab in Render
- Ensure start command is `npm start`
- Wait ~2 min for first deploy

### Environment Variables

If needed, add in Render dashboard:
- Settings → Environment
- Add key-value pairs

---

## Free Tier Limits

Render free tier includes:
- ✅ 750 hours/month
- ✅ Auto-deploy from Git
- ✅ Free SSL (HTTPS)
- ✅ Custom domains
- ⏸️ Spins down after 15 min inactivity
- ⏸️ ~30s cold start

**Perfect for this project!**

---

## Next Steps

1. Share your URL!
2. Monitor usage in Render dashboard
3. Upgrade if you need:
   - No cold starts
   - More resources
   - Priority support

---

**Your Claude Code learning platform is now live!**
