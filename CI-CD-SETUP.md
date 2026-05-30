# CI/CD Quick Setup Checklist

Follow these steps to enable automated testing and deployment:

## Step 1️⃣: Push Code to GitHub

```powershell
git add .
git commit -m "Add GitHub Actions CI/CD workflows"
git push origin main
```

## Step 2️⃣: Get Render Credentials

1. Go to https://dashboard.render.com
2. **Account** → **API Keys** → Create new key
   - Copy to GitHub secret: `RENDER_API_KEY`
3. Go to your backend service
   - **Settings** → Find `Service ID`
   - Copy to GitHub secret: `RENDER_BACKEND_SERVICE_ID`

## Step 3️⃣: Get Vercel Credentials

1. Go to https://vercel.com/account/tokens
   - Create new token
   - Copy to GitHub secret: `VERCEL_TOKEN`
2. Go to your frontend project
   - **Settings** → **General**
   - Copy `ORG ID` to GitHub secret: `VERCEL_ORG_ID`
   - Copy `PROJECT ID` to GitHub secret: `VERCEL_PROJECT_ID`

## Step 4️⃣: Add Secrets to GitHub

In your GitHub repo:
1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these 5 secrets:
   - `RENDER_API_KEY` = your render API key
   - `RENDER_BACKEND_SERVICE_ID` = your render service ID
   - `VERCEL_TOKEN` = your vercel token
   - `VERCEL_ORG_ID` = your vercel org ID
   - `VERCEL_PROJECT_ID` = your vercel project ID

## Step 5️⃣: Configure Deployment Environment Variables

### On Render Dashboard (for backend):
1. Go to your backend service → **Environment**
2. Add:
   - `GROQ_API_KEY` = your Groq API key
   - `CORS_ORIGINS` = your Vercel URL (e.g., `https://yourapp.vercel.app`)

### On Vercel Dashboard (for frontend):
1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - `REACT_APP_SUPABASE_URL` = your Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` = your Supabase anon key

## Step 6️⃣: Test the Workflow

1. Make a small change and push to `main`:
   ```powershell
   git commit --allow-empty -m "Test CI/CD workflow"
   git push origin main
   ```
2. Go to your GitHub repo → **Actions** tab
3. You should see the CI workflow running
4. After CI passes, deployment workflows will trigger

## 📊 You're Done!

Now every time you push to `main`:
- ✅ CI tests run automatically
- ✅ If tests pass, backend auto-deploys to Render
- ✅ Frontend auto-deploys to Vercel

For detailed info, see `.github/CI-CD-SETUP.md`
