# Quick Setup Guide

Welcome to Nian Chat! Follow these steps to get started quickly.

## 🎯 Quick Start (5 minutes)

### Step 1: Download Model
1. Go to [HuggingFace](https://huggingface.co/collections/ValueFX9507/tifa-deepsexv2-mgrpo-67b0f0e99d15e90f2cfed096)
2. Download a `.gguf` file (Q8 recommended)
3. Place it in the `backend/` folder

### Step 2: Setup Supabase
1. Create free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor → paste contents of `database/schema.sql` → Run
4. Go to Project Settings → API → Copy:
   - Project URL
   - Anon public key

### Step 3: Configure Backend
```powershell
cd backend
cp .env.example .env
# Edit .env - set MODEL_PATH to your .gguf filename
pip install -r requirements.txt
```

### Step 4: Configure Frontend
```powershell
cd frontend
npm install
# Edit src/config.js - paste your Supabase URL and key
```

### Step 5: Run!
```powershell
# In project root
.\start.ps1
```

Or manually:
```powershell
# Terminal 1
cd backend
python guff_server.py

# Terminal 2
cd frontend
npm start
```

Open http://localhost:3000 🎉

## 📝 Configuration Files to Edit

1. **backend/.env** - Set your model path
2. **frontend/src/config.js** - Add Supabase credentials (lines 7-8)

## ⚠️ Common Issues

**"Module not found"**
- Run `pip install -r requirements.txt` in backend/
- Run `npm install` in frontend/

**"Model not found"**
- Check the filename in backend/.env matches your .gguf file
- Make sure the model is in the backend/ folder

**"CORS error"**
- Make sure backend is running on port 8063
- Check backend terminal for errors

**"Characters not loading"**
- Verify Supabase credentials in frontend/src/config.js
- Check browser console (F12) for errors
- Make sure you ran the schema.sql in Supabase

## 🆘 Need Help?

1. Check the main [README.md](README.md)
2. Review terminal logs for errors
3. Verify all configuration files are set correctly

## 🎨 Next Steps

- Create your first character in the UI
- Customize colors in `frontend/src/config.js`
- Adjust model parameters in backend/.env
- Set up the Discord bot (optional)

Enjoy chatting! 🌙
