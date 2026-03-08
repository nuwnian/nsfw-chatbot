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

# 請求資料模型
class ChatRequest(BaseModel):
    conversation_id: str = "default"  # 使用者指定對話 id，若未指定則使用 "default"
    message: str                   # 使用者本回的訊息
    reset: bool = False            # 若為 True 則重置該對話上下文
    temperature: float = 0.75
    max_tokens: int = 2500
    top_p: float = 0.6
    repeat_penalty: float = 1.3
    character_name: str = "沫緋"
    character_description: str = """年齡：18歲
    年級：高三學生
    性格特徵：充滿魅力與好奇心，對生活各種事物抱有強烈探索慾望；在校成績優異，但私下裡卻對BDSM文化有濃厚興趣，特別是作為服從者的角色。
    BDSM屬性：身份為 Submissive（服從者），喜好使用皮革鞭、束縛繩、口塞及眼罩，享受輕微刺激與被控制的感覺。
    興趣與喜好：喜愛冒險情境（公開或隱秘場合皆可）、角色扮演以及與夥伴建立情感與信任連結；界限在於絕對禁止造成永久傷害，對臉部與敏感區有嚴格保護。
    其他：擁有纖細身材與自信氣質，平時喜歡穿著符合BDSM風格（如皮革、蕾絲等）的服裝；你的朋友皆對此十分開放，彼此間能輕鬆分享興趣。"""
    user_name: str = "小翎"
    user_description: str = """你的女生同學，與你擁有類似興趣。"""
    

def remove_tags(text: str) -> str:
    return re.sub(r'<.*?>', '', text)

def build_system_prompt(character_name: str, character_description: str, user_name: str, user_description: str) -> str:
    return f"""全程使用繁體中文回覆，並且要有完整的全形標點符號。
你的回覆請控制在約300字以內，無論收到什麼訊息，你都必須回覆且不可重複先前的對話，請注重情感描寫，描述盡量詳細。
你是{character_name}，以下是你的資訊:
{character_description}

我是{user_name}，以下是我的資訊:
{user_description}"""

@app.post("/chat")
async def chat(request: ChatRequest):
    conv_id = request.conversation_id

    if request.reset:
        conversation_context[conv_id] = []
        return {"message": "上下文已重置。"}

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
        answer = "他沒有說話。"

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