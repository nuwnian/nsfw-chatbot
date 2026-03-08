import re
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from typing import List

# Conversation memory: key = conversation_id, value = list of {role, content} message dicts
conversation_context = {}

# Groq configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
MAX_CONTEXT_TURNS = int(os.getenv("MAX_CONTEXT_TURNS", "10"))

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set. Add it to backend/.env")

client = Groq(api_key=GROQ_API_KEY)
print(f"Groq client ready. Model: {GROQ_MODEL}")
print("Model loaded successfully!")

app = FastAPI(
    title="Nian Chat API",
    description="AI Character Chat Backend powered by Groq",
    version="2.0.0"
)

# CORS Configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request data model
class ChatRequest(BaseModel):
    conversation_id: str = "default"  # conversation id; defaults to "default"
    message: str                       # the user's message this turn
    reset: bool = False                # if True, clears the conversation context
    temperature: float = 0.75
    max_tokens: int = 2500
    top_p: float = 0.6
    repeat_penalty: float = 1.3
    character_name: str = "Aria"
    character_description: str = """A thoughtful, calm, and deeply empathetic person.
    She listens without judgment and chooses her words carefully.
    She is warm but carries a quiet mystery about her past."""
    user_name: str = "You"
    user_description: str = """A user chatting with the AI character."""
    

def remove_tags(text: str) -> str:
    return re.sub(r'<.*?>', '', text)

def build_system_prompt(character_name: str, character_description: str, user_name: str, user_description: str) -> str:
    return f"""Reply exclusively in English. Keep responses under ~200 words.
    Stay in character at all times. Be emotionally expressive and descriptive. Never repeat previous dialogue.
    You are {character_name}. Here is your character information:
    {character_description}

    The person you are talking to is {user_name}. Here is their information:
    {user_description}"""

@app.post("/chat")
async def chat(request: ChatRequest):
    conv_id = request.conversation_id

    if request.reset:
        conversation_context[conv_id] = []
        return {"message": "Conversation has been reset."}

    system_prompt = build_system_prompt(
        request.character_name,
        request.character_description,
        request.user_name,
        request.user_description,
    )

    history: List[dict] = conversation_context.get(conv_id, [])
    if len(history) > MAX_CONTEXT_TURNS * 2:
        history = history[-(MAX_CONTEXT_TURNS * 2):]

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": request.message})

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            top_p=request.top_p,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")

    answer = response.choices[0].message.content or ""

    if "</think>" in answer:
        answer = answer.split("</think>")[-1].strip()
    answer = remove_tags(answer)
    if not answer:
        answer = "..."

    conversation_context.setdefault(conv_id, []).extend([
        {"role": "user", "content": request.message},
        {"role": "assistant", "content": answer},
    ])

    return {"message": answer}

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Nian Chat API",
        "version": "2.0.0",
        "model": GROQ_MODEL
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model": GROQ_MODEL,
        "active_conversations": len(conversation_context)
    }

if __name__ == "__main__":
    import uvicorn
    HOST = os.getenv("API_HOST", "0.0.0.0")
    PORT = int(os.getenv("API_PORT", "8063"))
    print(f"\n🚀 Starting Nian Chat API on {HOST}:{PORT}")
    print(f"📝 API docs available at http://localhost:{PORT}/docs")
    uvicorn.run(app, host=HOST, port=PORT)