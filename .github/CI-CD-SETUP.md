# CI/CD Setup Guide

This project uses GitHub Actions for automated testing and deployment.

## 📋 Workflows Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **CI** | Push to `main`/`develop` or PR | Test backend & frontend, build check |
| **Deploy Backend** | Push to `main` (backend/ changes) | Auto-deploy to Render |
| **Deploy Frontend** | Push to `main` (frontend/ changes) | Auto-deploy to Vercel |

---

## 🔑 Required GitHub Secrets

Add these secrets in your GitHub repo: **Settings** → **Secrets and variables** → **Actions**

### For Backend Deployment (Render)
- `RENDER_API_KEY` - Your Render API key
- `RENDER_BACKEND_SERVICE_ID` - Your Render backend service ID

### For Frontend Deployment (Vercel)
- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization/team ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

### For Backend Runtime (Render Dashboard)
Set these in **Render Dashboard** (not GitHub):
- `GROQ_API_KEY` - Your Groq API key
- `CORS_ORIGINS` - Your Vercel frontend URL (e.g., `https://yourapp.vercel.app`)

### For Frontend Runtime (Vercel Dashboard)
Set these in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key

---

## 🚀 How to Get These Secrets

### Render API Key
1. Go to https://dashboard.render.com
2. Account → API Keys
3. Create new API key
4. Copy the key to `RENDER_API_KEY`

### Render Service ID
1. Go to your backend service
2. Settings → Copy the Service ID from the URL or info panel
3. Use as `RENDER_BACKEND_SERVICE_ID`

### Vercel Token
1. Go to https://vercel.com/account/tokens
2. Create new token (recommended: full scope, never expire)
3. Copy to `VERCEL_TOKEN`

### Vercel IDs
1. Go to your frontend project
2. Settings → General
3. Copy `ORG ID` to `VERCEL_ORG_ID`
4. Copy `PROJECT ID` to `VERCEL_PROJECT_ID`

---

## 📝 Add Secrets to GitHub

```bash
# Using GitHub CLI
gh secret set RENDER_API_KEY --body "your_render_api_key"
gh secret set RENDER_BACKEND_SERVICE_ID --body "your_service_id"
gh secret set VERCEL_TOKEN --body "your_vercel_token"
gh secret set VERCEL_ORG_ID --body "your_vercel_org_id"
gh secret set VERCEL_PROJECT_ID --body "your_vercel_project_id"
```

Or manually via GitHub web UI:
1. Go to your repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret one by one

---

## ✅ Workflow Status

View your workflow runs:
- Go to your GitHub repo → **Actions** tab
- You'll see all past and current workflow runs
- Click on any run to see detailed logs

---

## 🔄 CI Pipeline Details

### On Every Push to `main`:
1. **Tests Run**
   - Backend: Python linting & pytest
   - Frontend: Build check
2. **Build Check**
   - Frontend builds successfully
   - Backend imports check
3. **Artifacts**
   - Frontend build uploaded (7-day retention)

### On Push to `main` with Backend Changes:
- Backend auto-deploys to Render

### On Push to `main` with Frontend Changes:
- Frontend auto-deploys to Vercel

---

## 🛠️ Customization

### Disable Auto-Deploy
Edit `.github/workflows/deploy-*.yml` and change:
```yaml
on:
  push:
    branches: [main]
```
to:
```yaml
on:
  workflow_dispatch:  # Manual only
```

### Deploy to Different Branches
Change `branches: [main]` to `branches: [main, production, staging]`

### Add Tests
Add to `backend/requirements.txt`:
```
pytest
pytest-cov
```

Then tests will auto-run in CI.

---

## 📊 Monitoring

- **GitHub Actions**: repo → Actions tab
- **Render Logs**: dashboard.render.com → your backend service → Logs
- **Vercel Logs**: vercel.com → your project → Deployments
