# Deployment Instructions - Render.com

## Prerequisites
- ✅ Code committed to git (DONE)
- ⏳ GitHub repository created
- ⏳ Code pushed to GitHub

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `claude-code-learning-hub`
3. Description: `Comprehensive learning platform for Claude Code with best practices from Anthropic`
4. Choose **Public** or **Private**
5. **Do NOT** check "Initialize with README" (we already have one)
6. Click **"Create repository"**

## Step 2: Push Code to GitHub

After creating the repository, run these commands (replace YOUR_USERNAME):

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/claude-code-learning-hub.git

# Push code
git branch -M main
git push -u origin main
```

**Your repository URL will be:** `https://github.com/YOUR_USERNAME/claude-code-learning-hub`

## Step 3: Deploy to Render

### Option A: Web Dashboard (Recommended)

1. **Go to Render:** https://render.com
2. **Sign Up/Login:** Use GitHub account (easiest)
3. **Create New Web Service:**
   - Click **"New +"** button
   - Select **"Web Service"**
4. **Connect Repository:**
   - Grant Render access to your GitHub account
   - Find and select `claude-code-learning-hub` repository
   - Click **"Connect"**
5. **Configure Service** (auto-filled from render.yaml):
   - **Name:** `claude-code-learning-hub`
   - **Region:** Oregon (USA) or closest to you
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. **Environment Variables** (auto-configured):
   - `NODE_ENV` = `production`
   - `NODE_VERSION` = `18.17.0`
7. **Deploy:**
   - Click **"Create Web Service"**
   - Watch build logs (takes 3-5 minutes)
   - Site will be live at: `https://claude-code-learning-hub.onrender.com`

### Option B: Using Git + Web Dashboard

If you can't install Render CLI, you can still automate deployment:

1. Push code to GitHub (as above)
2. Render auto-detects `render.yaml` configuration
3. Every push to `main` branch triggers automatic deployment

## Step 4: Verify Deployment

Once deployed, test these URLs:

- **Home:** https://YOUR-APP.onrender.com/
- **Best Practices:** https://YOUR-APP.onrender.com/advanced-topics/best-practices
- **Start Here:** https://YOUR-APP.onrender.com/start-here
- **Data Analysis:** https://YOUR-APP.onrender.com/data-analysis

## Automatic Deployments

After initial deployment, any push to GitHub `main` branch will auto-deploy:

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Render automatically deploys in ~3 minutes
```

## Custom Domain (Optional)

To use your own domain:

1. In Render Dashboard, go to your web service
2. **Settings** → **Custom Domain**
3. Add your domain: `learn.yoursite.com`
4. Update DNS records as instructed by Render
5. SSL certificate is automatically provisioned

## Troubleshooting

### Build Fails

Check build logs in Render dashboard:
- Look for npm errors
- Verify all dependencies are in `package.json`
- Test locally: `npm run build`

### Site Shows 404

- Verify `startCommand` is `npm start`
- Check environment variables are set
- Review deployment logs

### Slow First Load

Render's free tier spins down after 15 minutes of inactivity:
- First visit after idle takes ~30 seconds
- Subsequent visits are instant
- Upgrade to paid tier ($7/month) for always-on

## Production Optimizations

Your site is already optimized:
- ✅ Next.js static generation
- ✅ Production build mode
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables configured

## Monitoring

View metrics in Render dashboard:
- **Logs:** Real-time server logs
- **Metrics:** CPU, memory, request count
- **Events:** Deployment history

---

## Current Status

- ✅ Code ready and committed
- ✅ `render.yaml` configured
- ✅ Production build tested locally
- ⏳ GitHub repository (you need to create)
- ⏳ Push to GitHub
- ⏳ Deploy to Render

**Next:** Create GitHub repository and push code (see Step 1 above)

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Support:** https://community.render.com

**Questions?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.
