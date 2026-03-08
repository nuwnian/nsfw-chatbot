# Nian.Chat 🌙

A full-stack AI character chat platform powered by Llama models. Create custom AI characters with unique personalities, scenarios, and engage in immersive conversations.

![Nian Chat](https://img.shields.io/badge/AI-Character%20Chat-8B6FBF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)
![Llama](https://img.shields.io/badge/Llama-CPP-00A67E?style=for-the-badge)

## ✨ Features

- 🎭 **Multi-Character System** - Create unlimited AI characters with unique personalities
- 💬 **Real-time Chat** - Seamless conversation with context memory
- 🎨 **Beautiful UI** - Modern, responsive design with dark theme
- 🧠 **Advanced AI** - Powered by Tifa-DeepsexV2-7b-MGRPO model
- 📱 **Mobile Responsive** - Works perfectly on desktop and mobile
- 🔄 **Context Management** - Smart conversation history tracking
- 🎯 **Character Creation Wizard** - Step-by-step character builder
- 🗄️ **Supabase Integration** - Cloud database for character storage
- 🤖 **Discord Bot** (Optional) - Chat with your AI characters in Discord

## 📁 Project Structure

```
nian-chat/
├── frontend/               # React web application
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── config.js      # Configuration
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── .env.example
│
├── backend/               # Python FastAPI server
│   ├── guff_server.py    # Main API server
│   ├── DCbot.py          # Discord bot (optional)
│   ├── think.gbnf        # Grammar file for model
│   ├── requirements.txt   # Python dependencies
│   └── .env.example
│
├── database/              # Database schema
│   ├── schema.sql        # Supabase table definitions
│   └── README.md         # Database setup guide
│
├── docker/               # Docker configuration
│   └── Dockerfile
│
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 16+
- GPU with CUDA support (recommended)
- Supabase account (free tier works)
- Tifa-DeepsexV2-7b-MGRPO model file (GGUF format)

### 1. Download the Model

Download your preferred quantization from [Hugging Face](https://huggingface.co/collections/ValueFX9507/tifa-deepsexv2-mgrpo-67b0f0e99d15e90f2cfed096):

```bash
# Place the .gguf file in the backend/ directory
# Recommended: Q8 or higher for best quality
```

### 2. Set Up Database

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Run the SQL from `database/schema.sql` in the SQL Editor
4. Copy your Project URL and Anon Key

### 3. Configure Backend

```bash
cd backend

# Copy and edit configuration
cp .env.example .env
# Edit .env and set MODEL_PATH to your .gguf file name

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Configure Frontend

```bash
cd frontend

# Install Node dependencies
npm install

# Copy and edit configuration
cp .env.example .env
# Add your Supabase credentials to .env

# Also update src/config.js with your Supabase credentials
```

### 5. Run the Application

**Terminal 1 - Backend API:**
```bash
cd backend
python guff_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎮 Usage

### Creating a Character

1. Click **"Create"** in the sidebar
2. **Step 1 - Identity**: Give your character a name and color
3. **Step 2 - Personality**: Define traits and description
4. **Step 3 - Scenario**: Set the context and opening line
5. Start chatting!

### Chatting

- Select a character from the sidebar
- Type your message and press Enter
- The AI will respond based on the character's personality
- Click the info icon (ⓘ) to see character details
- Use "Clear conversation" to reset the chat history

### API Endpoints

The backend provides these endpoints:

- `GET /` - Health check
- `GET /health` - Detailed health status
- `POST /chat` - Send a message
- `GET /docs` - Interactive API documentation (Swagger UI)

## 🎨 Customization

### Accent Colors

Edit `frontend/src/config.js` to add more color options:

```javascript
export const ACCENT_COLORS = [
  "#8B6FBF", // Purple (default)
  "#6F8BBF", // Blue
  // Add your colors here
];
```

### Personality Presets

Modify `PERSONALITY_PRESETS` in `config.js` to add quick personality templates.

### Model Parameters

Adjust in the chat request or backend `.env`:

- `temperature` - Creativity (0.1-1.0)
- `max_tokens` - Response length
- `top_p` - Diversity
- `repeat_penalty` - Avoid repetition

## 🤖 Discord Bot (Optional)

Run the Discord bot to chat with your characters in Discord:

```bash
cd backend

# Edit DCbot.py and add your:
# - Discord bot token
# - Allowed channel IDs

python DCbot.py
```

## 🐳 Docker Deployment

```bash
cd docker
docker build -t nian-chat .
docker run --gpus all -it -p 8063:8063 -v .:/app nian-chat
```

## 🔧 Troubleshooting

### Backend won't start
- Check if model file path is correct in `.env`
- Verify GPU drivers and CUDA installation
- Try CPU mode: Set `N_GPU_LAYERS=0` in `.env`

### Frontend can't connect to API
- Ensure backend is running on port 8063
- Check CORS settings in `backend/guff_server.py`
- Verify `API_BASE_URL` in `frontend/src/config.js`

### Characters not loading
- Check Supabase credentials in `frontend/src/config.js`
- Verify database schema was created correctly
- Check browser console for errors

### Out of memory errors
- Reduce `N_CTX` in backend `.env`
- Use a smaller model quantization (Q4 instead of Q8)
- Reduce `MAX_CONTEXT_TURNS` to store less history

## 📚 Tech Stack

**Frontend:**
- React 18
- Supabase JS Client
- Google Fonts (DM Sans, Playfair Display)

**Backend:**
- FastAPI
- llama-cpp-python
- OpenCC (Traditional Chinese conversion)
- Pydantic

**Database:**
- Supabase (PostgreSQL)

**Model:**
- Tifa-DeepsexV2-7b-MGRPO (Llama-based)

## 🤝 Contributing

Contributions welcome! Feel free to:

- Add new features
- Improve the UI
- Fix bugs
- Add more character templates
- Improve documentation

## ⚠️ Content Warning

This project was originally designed for NSFW roleplay scenarios. The default example characters and prompts may contain adult themes. You can easily modify the code to create SFW characters by:

1. Changing character descriptions in the database
2. Modifying default examples in `frontend/src/config.js`
3. Adjusting system prompts in `backend/guff_server.py`

## 📝 License

This project is open source. The Tifa-DeepsexV2-7b-MGRPO model has its own license - please check the [model page](https://huggingface.co/ValueFX9507) for details.

## 🙏 Credits

- Original concept and UI design: Ninian
- Base model: [ValueFX9507/Tifa-DeepsexV2-7b-MGRPO](https://huggingface.co/ValueFX9507)
- Built with ❤️ using React, FastAPI, and llama.cpp

## 📞 Support

Having issues? 

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the logs in terminal
3. Open an issue on GitHub
4. Check that all dependencies are installed correctly

---

Made with 🌙 by the Nian Chat team

- 本專案涉及 NSFW 內容，請謹慎使用。
- 若要在公開 Discord 伺服器中運行，請確保符合 Discord 的使用政策。

## 聯絡方式
Email: v99sam@gmail.com
