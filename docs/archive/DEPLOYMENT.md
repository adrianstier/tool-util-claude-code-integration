# Deployment Guide - Claude Code Learning Hub

This guide walks you through deploying the Claude Code Learning Hub to Render.com.

## Prerequisites

- GitHub account
- Render.com account (free tier available)
- Git repository pushed to GitHub

## Deployment Steps

### 1. Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
# Check git status
git status

# Add any uncommitted changes
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended for easy repo connection)

### 3. Create New Web Service

1. From Render Dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click "Connect account" if not already connected
   - Find and select your `claude-code-integration` repository
   - Click "Connect"

### 4. Configure Web Service

Fill in the following settings:

**Basic Settings:**
- **Name:** `claude-code-learning-hub` (or your preferred name)
- **Region:** Choose closest to your users (e.g., Oregon USA)
- **Branch:** `main`
- **Root Directory:** Leave blank (uses repository root)
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Plan:**
- Select **"Free"** (perfect for this project)

**Environment Variables:**
Click "Add Environment Variable" and add:
- **Key:** `NODE_ENV` → **Value:** `production`
- **Key:** `NODE_VERSION` → **Value:** `18.17.0`

### 5. Deploy

1. Click **"Create Web Service"** button at the bottom
2. Render will:
   - Clone your repository
   - Install dependencies with `npm install`
   - Build your Next.js app with `npm run build`
   - Start the server with `npm start`

3. Watch the deploy logs in real-time
4. First deploy takes 3-5 minutes

### 6. Verify Deployment

Once deployed, you'll see:
- **Status:** "Live" with green indicator
- **URL:** `https://claude-code-learning-hub.onrender.com` (or your custom name)

Click the URL to view your live site!

### 7. Test Your Live Site

Verify these pages work:
- ✅ Home page: `/`
- ✅ Start Here: `/start-here`
- ✅ Data Analysis: `/data-analysis`
- ✅ App Builder: `/app-builder`
- ✅ Individual guides: `/start-here/mac-setup`, `/data-analysis/python-intro`, etc.

## Automatic Deployments

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update content"
git push origin main

# Render detects the push and automatically redeploys
```

## Custom Domain (Optional)

To use your own domain:

1. In Render Dashboard, go to your web service
2. Click **"Settings"** tab
3. Scroll to **"Custom Domain"** section
4. Click **"Add Custom Domain"**
5. Enter your domain (e.g., `learn.yoursite.com`)
6. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Render Dashboard
2. Click on your web service
3. View "Logs" tab
4. Look for error messages

**Common issues:**
- Missing dependencies: Run `npm install` locally first
- Build errors: Test with `npm run build` locally
- Node version: Ensure `NODE_VERSION` env var is set

### Site Not Loading

**Check:**
1. Service status shows "Live" (not "Deploy failed")
2. Logs show "Server running" message
3. No errors in "Events" tab

**Fix:**
- Trigger manual redeploy: Click "Manual Deploy" → "Deploy latest commit"

### 404 Errors on Pages

**Likely causes:**
- Missing MDX files
- Incorrect file paths
- Build didn't include all routes

**Fix:**
1. Verify all content files exist locally
2. Test production build locally: `npm run build && npm start`
3. Redeploy if files were missing

### Performance Issues (Free Tier)

Render's free tier spins down after 15 minutes of inactivity:
- First visit after inactivity takes ~30 seconds to wake up
- Subsequent visits are instant
- This is normal for free tier

**Solutions:**
- Upgrade to paid plan ($7/month) for always-on service
- Use uptime monitoring service to ping site every 14 minutes

## Monitoring

### View Logs

Real-time logs in Render Dashboard:
1. Go to your web service
2. Click **"Logs"** tab
3. See all server output and errors

### Metrics

Render provides basic metrics:
- CPU usage
- Memory usage
- Request count
- Response times

Access from **"Metrics"** tab in your service.

## Updating Your Site

### Content Changes

1. Edit MDX files in `content/` directory
2. Commit and push:
   ```bash
   git add content/
   git commit -m "Update tutorial content"
   git push origin main
   ```
3. Render auto-deploys (2-3 minutes)

### Code Changes

1. Modify components or styles
2. Test locally:
   ```bash
   npm run dev
   ```
3. Build locally to verify:
   ```bash
   npm run build
   ```
4. Push to GitHub:
   ```bash
   git add .
   git commit -m "Improve UI components"
   git push origin main
   ```

## Manual Deploy

To manually trigger deployment without code changes:

1. Go to Render Dashboard
2. Open your web service
3. Click **"Manual Deploy"** button
4. Select "Deploy latest commit" or "Clear build cache & deploy"

## Environment Variables

Current environment variables:
- `NODE_ENV=production` - Enables production optimizations
- `NODE_VERSION=18.17.0` - Specifies Node.js version

To add more variables:
1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"**
3. Enter key and value
4. Service automatically redeploys

## Next Steps

- Set up custom domain
- Add analytics (Google Analytics, Plausible)
- Monitor uptime (UptimeRobot)
- Set up status page
- Enable HTTPS (automatic with Render)

## Support

- **Render Docs:** [render.com/docs](https://render.com/docs)
- **Render Status:** [status.render.com](https://status.render.com)
- **Support:** [community.render.com](https://community.render.com)

## Cost

**Free Tier Includes:**
- 750 hours/month compute time
- Automatic HTTPS
- Global CDN
- Automatic deploys from GitHub
- Custom domains

**Perfect for:**
- Learning projects
- Documentation sites
- Low-traffic applications

---

**Your Claude Code Learning Hub is now live!** 🎉

Share the URL with others to help them learn Claude Code, Git, Python, R, and more.
