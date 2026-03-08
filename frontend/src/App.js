import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";
import { API_BASE_URL, DEFAULT_CHARACTER, ACCENT_COLORS, SCENARIO_EXAMPLES } from "./config";
import "./App.css";

function BottomNav({ page, setPage }) {
  const items = [
    { id:"chat", label:"Chats", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:20,height:20}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    { id:"discover", label:"Discover", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:20,height:20}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> },
    { id:"create", label:"Create", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:20,height:20}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
    { id:"profile", label:"Profile", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:20,height:20}}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];
  return (
    <nav className="bottom-nav" style={{justifyContent:"space-around"}}>
      {items.map(n=>(
        <button key={n.id} onClick={()=>setPage(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"6px 0",background:"transparent",border:"none",color:page===n.id?"#8B6FBF":"#3A3A42",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:500,transition:"color 0.15s"}}>
          {n.icon}{n.label}
        </button>
      ))}
    </nav>
  );
}

function SidebarContent({ onClose, onNav, onSelectCharacter, activeCharacterId }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setCharacters(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"24px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,fontSize:20,color:"#E8E4DC"}}>
          nian<span style={{color:"#E07A2F"}}>.</span><span style={{fontSize:14,fontWeight:400,color:"#4A4A52",marginLeft:2}}>chat</span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{background:"#1E1E22",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6B6670"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>
      <div style={{padding:"0 12px 16px"}}>
        <button onClick={()=>onNav?.("create")} style={{width:"100%",padding:"10px",background:"#161618",border:"1px solid #252528",borderRadius:10,color:"#8B8890",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"'DM Sans',sans-serif"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#3A3A40";e.currentTarget.style.color="#E8E4DC"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#252528";e.currentTarget.style.color="#8B8890"}}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Chat
        </button>
      </div>
      <div style={{padding:"0 12px",flex:1,overflowY:"auto"}}>
        <div style={{fontSize:10,fontWeight:600,color:"#3A3A42",letterSpacing:"1.2px",marginBottom:8,padding:"0 4px"}}>MY CHARACTERS</div>
        {loading && (
          <div style={{padding:"12px 4px",fontSize:12,color:"#3A3A42"}}>Loading...</div>
        )}
        {!loading && characters.length === 0 && (
          <div style={{padding:"12px 4px",fontSize:12,color:"#3A3A42",lineHeight:1.6}}>No characters yet. Hit Create to make your first one 🖤</div>
        )}
        {characters.map(c => (
          <div key={c.id} className={`sidebar-item ${activeCharacterId===c.id?"active":""}`}
            onClick={()=>{ onSelectCharacter?.(c); onClose?.(); }}>
            <div style={{width:34,height:34,borderRadius:"50%",background:(c.color||"#8B6FBF")+"22",border:`1px solid ${c.color||"#8B6FBF"}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:c.color||"#8B6FBF",flexShrink:0}}>
              {c.name[0].toUpperCase()}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:activeCharacterId===c.id?"#E8E4DC":"#8B8890"}}>{c.name}</div>
              <div style={{fontSize:11,color:"#3A3A42",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.tagline||c.scenario?.slice(0,40)||"No description"}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px",borderTop:"1px solid #1A1A1E"}}>
        {[
          {id:"discover",label:"Discover",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>},
          {id:"create",label:"Create",icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:16,height:16}}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>},
        ].map(n=>(
          <button key={n.id} onClick={()=>{onNav?.(n.id);onClose?.();}}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"transparent",border:"none",borderRadius:8,color:"#4A4A52",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.color="#8B8890";e.currentTarget.style.background="#161618"}}
            onMouseLeave={e=>{e.currentTarget.style.color="#4A4A52";e.currentTarget.style.background="transparent"}}
          >{n.icon}{n.label}</button>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginTop:4}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#2A1F3D,#4A3A6A)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#8B6FBF"}}>N</div>
          <div style={{fontSize:13,color:"#6B6670"}}>Ninian</div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ page, setPage, setShowSidebar, character }) {
  const char = character || DEFAULT_CHARACTER;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const conversationId = char.id || "default";
  const bottomRef = useRef(null);

  // Load conversation history from Supabase when character changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!character?.id) {
        const greeting = `Hey... I'm ${DEFAULT_CHARACTER.name}.`;
        const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setMessages([{ id: 1, role: "ai", text: greeting, time: now }]);
        return;
      }
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("character_id", character.id)
        .order("created_at", { ascending: true });
      if (!data || data.length === 0) {
        const greeting = character.greeting || `Hey... I'm ${character.name}.`;
        const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setMessages([{ id: Date.now(), role: "ai", text: greeting, time: now }]);
      } else {
        setMessages(data.map(m => ({
          id: m.id,
          role: m.role,
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
        })));
      }
    };
    loadMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character?.id]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,typing]);

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    const historySnapshot = messages
      .filter(m => m.role === "user" || m.role === "ai")
      .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }));

    setMessages(prev=>[...prev,{id:Date.now(),role:"user",text:userMessage,time:now}]);
    setInput("");
    setTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: userMessage,
          reset: false,
          temperature: 0.75,
          max_tokens: 2500,
          top_p: 0.6,
          character_name: char.name,
          character_description: char.personality || char.scenario || "",
          user_name: "You",
          user_description: "A user chatting with the AI character.",
          history: historySnapshot,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const aiText = data.message || "...";
      const aiTime = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
      setTyping(false);
      setMessages(prev=>[...prev,{id:Date.now()+1,role:"ai",text:aiText,time:aiTime}]);

      if (character?.id) {
        await supabase.from("messages").insert([
          { character_id: character.id, role: "user", content: userMessage },
          { character_id: character.id, role: "ai",   content: aiText },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setTyping(false);
      setMessages(prev=>[...prev,{
        id:Date.now()+1,
        role:"ai",
        text:"Sorry, I'm having trouble connecting right now. Please check if the API server is running.",
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
      }]);
    }
  };

  const handleReset = async () => {
    if (character?.id) {
      await supabase.from("messages").delete().eq("character_id", character.id);
    }
    try {
      await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId, message: "", reset: true }),
      });
    } catch (_) {}
    const greeting = character?.greeting || `Hey... I'm ${character?.name || DEFAULT_CHARACTER.name}.`;
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setMessages([{ id: Date.now(), role: "ai", text: greeting, time: now }]);
  };

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>
      {/* Header */}
      <div style={{padding:"12px 16px",borderBottom:"1px solid #1A1A1E",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0D0D0F",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button className="mobile-menu-btn" onClick={()=>setShowSidebar(true)} style={{width:34,height:34,borderRadius:9,background:"transparent",border:"none",color:"#4A4A52",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div style={{position:"relative"}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:char.color+"22",border:`1.5px solid ${char.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:char.color}}>{char.name[0]}</div>
            <div className="online-dot" style={{position:"absolute",bottom:1,right:1,border:"2px solid #0D0D0F"}}/>
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:"#E8E4DC"}}>{char.name}</div>
            <div style={{fontSize:11,color:"#4A4A52",marginTop:1}}>{char.tagline}</div>
          </div>
        </div>
        <button onClick={()=>setShowInfo(!showInfo)} style={{width:34,height:34,borderRadius:9,background:showInfo?"#1E1E22":"transparent",border:`1px solid ${showInfo?"#2E2E34":"transparent"}`,color:"#4A4A52",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:15,height:15}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"20px 16px",display:"flex",flexDirection:"column",gap:20,background:"radial-gradient(ellipse at 50% 0%,#14101C 0%,#0D0D0F 60%)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,height:1,background:"#1A1A1E"}}/><span style={{fontSize:11,color:"#3A3A42",fontWeight:500}}>Today</span><div style={{flex:1,height:1,background:"#1A1A1E"}}/>
        </div>
        {messages.map(m=>(
          <div key={m.id} className="msg-in" style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",gap:4}}>
            {m.role==="ai" && (
              <div style={{display:"flex",alignItems:"flex-end",gap:10}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:char.color+"22",border:`1px solid ${char.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:char.color,flexShrink:0}}>{char.name[0]}</div>
                <div className="msg-ai">{m.text}</div>
              </div>
            )}
            {m.role==="user" && <div className="msg-user">{m.text}</div>}
            <div style={{fontSize:10,color:"#2E2E36",paddingLeft:m.role==="ai"?38:0}}>{m.time}</div>
          </div>
        ))}
        {typing && (
          <div className="msg-in" style={{display:"flex",alignItems:"flex-end",gap:10}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:char.color+"22",border:`1px solid ${char.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:char.color,flexShrink:0}}>{char.name[0]}</div>
            <div className="msg-ai" style={{padding:"14px 18px"}}><div style={{display:"flex",gap:4}}><span className="dot"/><span className="dot"/><span className="dot"/></div></div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{padding:"12px 16px 14px",borderTop:"1px solid #1A1A1E",background:"#0D0D0F",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,background:"#111113",border:"1px solid #222226",borderRadius:16,padding:"10px 14px"}}>
          <textarea className="chat-input" placeholder={`Message ${char.name}...`} value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
            rows={1} style={{height:"auto"}}
            onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
          />
          <button className="send-btn" onClick={sendMessage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{width:16,height:16}}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div style={{fontSize:11,color:"#2A2A32",textAlign:"center",marginTop:6}}>nian<span style={{color:"#E07A2F"}}>.</span>chat · AI characters may say unexpected things</div>
      </div>

      <BottomNav page={page} setPage={setPage}/>

      {/* Info panel */}
      <div className={`info-panel ${showInfo?"open":""}`}>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
          <button onClick={()=>setShowInfo(false)} style={{background:"#1E1E22",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#6B6670"}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{width:13,height:13}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,paddingBottom:24,borderBottom:"1px solid #1E1E22",marginBottom:20}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:char.color+"22",border:`2px solid ${char.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:char.color}}>{char.name[0]}</div>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:"#E8E4DC"}}>{char.name}</div>
            <div style={{fontSize:12,color:"#4A4A52",marginTop:4}}>{char.tagline}</div>
          </div>
          <div style={{background:char.color+"15",border:`1px solid ${char.color}30`,borderRadius:8,padding:"6px 14px",fontSize:11,color:char.color}}>{char.messages?.toLocaleString?.() ?? "New"} chats</div>
        </div>
        <div style={{fontSize:11,fontWeight:600,color:"#3A3A42",letterSpacing:"1px",marginBottom:10}}>PERSONALITY</div>
        <p style={{fontSize:13,color:"#6B6670",lineHeight:1.7}}>{char.personality}</p>
        {char.scenario && <>
          <div style={{fontSize:11,fontWeight:600,color:"#3A3A42",letterSpacing:"1px",marginBottom:10,marginTop:20}}>SCENARIO</div>
          <p style={{fontSize:13,color:"#6B6670",lineHeight:1.7}}>{char.scenario}</p>
        </>}
        {char.traits?.length > 0 && (
          <div style={{marginTop:16,display:"flex",flexWrap:"wrap",gap:6}}>
            {char.traits.map(t=>(
              <span key={t} style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:char.color+"15",border:`1px solid ${char.color}25`,color:char.color}}>{t}</span>
            ))}
          </div>
        )}
        <button onClick={handleReset} style={{width:"100%",marginTop:24,padding:"10px",background:"#E05A5A15",border:"1px solid #E05A5A30",borderRadius:10,color:"#E05A5A",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear conversation</button>
      </div>
    </div>
  );
}

function CreatePage({ page, setPage, setActiveCharacter }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", tagline: "", color: ACCENT_COLORS[0],
    personality: "", traits: [],
    scenario: "", scenarioDetail: "", greeting: "",
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const toggleTrait = (t) => set("traits", form.traits.includes(t) ? form.traits.filter(x=>x!==t) : [...form.traits, t]);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const handleCreate = async () => {
    if (!form.scenarioDetail.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const { data, error } = await supabase.from("characters").insert({
        name: form.name,
        tagline: form.tagline || null,
        color: form.color,
        traits: form.traits,
        personality: form.personality,
        scenario: form.scenarioDetail,
        greeting: form.greeting || null,
      }).select().single();
      if (error) throw error;
      setDone(true);
      setTimeout(() => {
        setDone(false); setSaving(false);
        setStep(1);
        setForm({ name:"", tagline:"", color:ACCENT_COLORS[0], personality:"", traits:[], scenario:"", scenarioDetail:"", greeting:"" });
        setActiveCharacter(data);
        setPage("chat");
      }, 2000);
    } catch (err) {
      setSaveError(err.message || "Something went wrong. Try again.");
      setSaving(false);
    }
  };

  const inp = {width:"100%",background:"#111113",border:"1px solid #222226",borderRadius:12,padding:"12px 14px",color:"#E8E4DC",fontSize:14,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color 0.2s"};
  const focus = e => e.target.style.borderColor="#3D2E5A";
  const blur  = e => e.target.style.borderColor="#222226";

  const steps = ["Identity","Personality","Scenario"];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#0D0D0F"}}>

      {/* Header */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid #1A1A1E",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <button onClick={()=>step>1?setStep(step-1):setPage("chat")} style={{width:34,height:34,borderRadius:9,background:"#161618",border:"1px solid #252528",color:"#8B8890",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:15,height:15}}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:"#E8E4DC"}}>New Character</div>
          <div style={{fontSize:11,color:"#4A4A52",marginTop:1}}>{steps[step-1]}</div>
        </div>
        {/* Step pills */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {steps.map((s,i)=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{
                width: i+1===step?28:22, height:22, borderRadius:20,
                background: i+1===step?"#8B6FBF": i+1<step?"#2A1F3D":"#111113",
                border: i+1<step?"1px solid #4A3A6A":"1px solid transparent",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:700,
                color: i+1===step?"#fff": i+1<step?"#8B6FBF":"#3A3A42",
                transition:"all 0.3s",
              }}>
                {i+1<step ? "✓" : i+1}
              </div>
              {i<2 && <div style={{width:16,height:1,background:"#1E1E22"}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflowY:"auto",padding:"28px 20px"}}>
        <div style={{maxWidth:500,margin:"0 auto",display:"flex",flexDirection:"column",gap:24}}>

          {/* ── STEP 1: Identity ── */}
          {step===1 && <>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#E8E4DC",marginBottom:6}}>Who are they?</div>
              <div style={{fontSize:13,color:"#4A4A52",lineHeight:1.6}}>Give them a name, a look, a presence.</div>
            </div>

            {/* Avatar + color */}
            <div style={{display:"flex",gap:16,alignItems:"center",background:"#111113",border:"1px solid #1E1E22",borderRadius:14,padding:"16px"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:form.color+"22",border:`2px solid ${form.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,color:form.color,flexShrink:0,transition:"all 0.2s"}}>
                {form.name?form.name[0].toUpperCase():"?"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px",marginBottom:10}}>PICK A COLOR</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {ACCENT_COLORS.map(c=>(
                    <button key={c} onClick={()=>set("color",c)} style={{width:24,height:24,borderRadius:"50%",background:c,border:form.color===c?"2.5px solid #E8E4DC":"2.5px solid transparent",cursor:"pointer",transition:"all 0.15s"}}/>
                  ))}
                </div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>NAME <span style={{color:"#E05A5A"}}>*</span></label>
              <input style={inp} placeholder="e.g. Aria, Marcus, Elara..." value={form.name} maxLength={32}
                onChange={e=>set("name",e.target.value)} onFocus={focus} onBlur={blur}/>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>SHORT DESCRIPTION <span style={{color:"#3A3A42",fontWeight:400}}>optional</span></label>
              <input style={inp} placeholder="e.g. A childhood friend I lost touch with" value={form.tagline} maxLength={80}
                onChange={e=>set("tagline",e.target.value)} onFocus={focus} onBlur={blur}/>
              <div style={{fontSize:11,color:"#2A2A32",textAlign:"right"}}>{(form.tagline||"").length}/80</div>
            </div>

            <button onClick={()=>setStep(2)} disabled={!form.name.trim()}
              style={{padding:"13px",background:form.name.trim()?"#8B6FBF":"#1E1E22",border:"none",borderRadius:12,color:form.name.trim()?"#fff":"#3A3A42",fontSize:14,fontWeight:600,cursor:form.name.trim()?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",marginTop:4}}>
              Continue →
            </button>
          </>}

          {/* ── STEP 2: Personality ── */}
          {step===2 && <>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#E8E4DC",marginBottom:6}}>How do they carry themselves?</div>
              <div style={{fontSize:13,color:"#4A4A52",lineHeight:1.6}}>Define {form.name}'s personality — how they speak, think, and feel.</div>
            </div>

            {/* Trait tags */}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>PERSONALITY TRAITS <span style={{color:"#3A3A42",fontWeight:400}}>pick any</span></label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["Warm","Cold","Sarcastic","Gentle","Intense","Playful","Mysterious","Blunt","Poetic","Anxious","Confident","Broken"].map(t=>{
                  const on = form.traits.includes(t);
                  return (
                    <button key={t} onClick={()=>toggleTrait(t)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${on?"#5A3F8A":"#252528"}`,background:on?"#2A1F3D":"transparent",color:on?"#B09AD4":"#4A4A52",fontSize:12,fontWeight:500,cursor:"pointer",transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif"}}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free-form personality */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>DESCRIBE THEM IN YOUR OWN WORDS <span style={{color:"#E05A5A"}}>*</span></label>
              <textarea style={{...inp,resize:"none",lineHeight:1.7}} rows={4}
                placeholder={`Who is ${form.name||"this person"} really? How do they talk? What do they care about? What are they hiding?`}
                value={form.personality} onChange={e=>set("personality",e.target.value)}
                onFocus={focus} onBlur={blur}
              />
              <div style={{fontSize:11,color:"#2A2A32",textAlign:"right"}}>{form.personality.length} chars</div>
            </div>

            <button onClick={()=>setStep(3)} disabled={!form.personality.trim()}
              style={{padding:"13px",background:form.personality.trim()?"#8B6FBF":"#1E1E22",border:"none",borderRadius:12,color:form.personality.trim()?"#fff":"#3A3A42",fontSize:14,fontWeight:600,cursor:form.personality.trim()?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
              Continue →
            </button>
          </>}

          {/* ── STEP 3: Scenario ── */}
          {step===3 && <>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#E8E4DC",marginBottom:6}}>What's the story?</div>
              <div style={{fontSize:13,color:"#4A4A52",lineHeight:1.6}}>Set the scene. What's your history with {form.name}? What brings you together right now?</div>
            </div>

            {/* Scenario presets */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>QUICK SCENARIOS</label>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {SCENARIO_EXAMPLES.map(s=>{
                  const on = form.scenario===s.label;
                  return (
                    <button key={s.label} onClick={()=>{ set("scenario",s.label); if(s.label!=="Custom") set("scenarioDetail",s.detail); }}
                      style={{padding:"12px 14px",background:on?"#16111F":"#0A0A0C",border:`1px solid ${on?"#3D2E5A":"#1A1A1E"}`,borderRadius:10,cursor:"pointer",textAlign:"left",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:on?"#C4A8F0":"#6B6670"}}>{s.label}</div>
                        <div style={{fontSize:12,color:on?"#6B5A8A":"#2E2E36",marginTop:2,lineHeight:1.5}}>{s.detail}</div>
                      </div>
                      <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${on?"#8B6FBF":"#252528"}`,background:on?"#8B6FBF":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:12}}>
                        {on && <div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scenario detail */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>SCENARIO DETAILS <span style={{color:"#E05A5A"}}>*</span></label>
              <textarea style={{...inp,resize:"none",lineHeight:1.7}} rows={4}
                placeholder={`Describe the situation. Where are you? What just happened? What does ${form.name||"this person"} know about you?`}
                value={form.scenarioDetail} onChange={e=>set("scenarioDetail",e.target.value)}
                onFocus={focus} onBlur={blur}
              />
            </div>

            {/* Opening line */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <label style={{fontSize:11,color:"#4A4A52",fontWeight:600,letterSpacing:"0.8px"}}>OPENING LINE <span style={{color:"#3A3A42",fontWeight:400}}>optional</span></label>
              <textarea style={{...inp,resize:"none",lineHeight:1.7}} rows={2}
                placeholder={`The first thing ${form.name||"they"} says when you open the chat...`}
                value={form.greeting} onChange={e=>set("greeting",e.target.value)}
                onFocus={focus} onBlur={blur}
              />
            </div>

            {/* Preview card */}
            {form.scenarioDetail.trim() && (
              <div style={{background:"#0A0A0C",border:"1px solid #1E1E22",borderRadius:14,padding:"18px",display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:form.color+"22",border:`1.5px solid ${form.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:form.color,flexShrink:0}}>
                  {form.name[0]?.toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"#E8E4DC"}}>{form.name}</div>
                  {form.tagline && <div style={{fontSize:12,color:"#3A3A42",marginTop:2}}>{form.tagline}</div>}
                  <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:6}}>
                    {form.traits.map(t=>(
                      <span key={t} style={{fontSize:11,padding:"2px 10px",borderRadius:20,background:form.color+"15",border:`1px solid ${form.color}25`,color:form.color}}>{t}</span>
                    ))}
                  </div>
                  {form.greeting && (
                    <div style={{marginTop:12,background:"#161618",border:"1px solid #252528",borderRadius:"2px 12px 12px 12px",padding:"10px 12px",fontSize:13,color:"#D4D0C8",lineHeight:1.6,fontStyle:"italic"}}>
                      "{form.greeting}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {saveError && (
              <div style={{background:"#2A1010",border:"1px solid #5A2020",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#E07A7A"}}>
                {saveError}
              </div>
            )}

            <button onClick={handleCreate} disabled={!form.scenarioDetail.trim() || saving}
              style={{padding:"14px",background:done?"#2E4A2E":form.scenarioDetail.trim()?"linear-gradient(135deg,#6A4F9E,#8B6FBF)":"#1E1E22",border:done?"1px solid #4A7A4A":"none",borderRadius:12,color:done?"#6FCF6F":form.scenarioDetail.trim()?"#fff":"#3A3A42",fontSize:14,fontWeight:600,cursor:form.scenarioDetail.trim()&&!saving?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s",marginTop:4,opacity:saving?0.7:1}}>
              {done ? "✓ Character saved!" : saving ? "Saving..." : `Start chatting with ${form.name}`}
            </button>
          </>}

        </div>
      </div>

      <BottomNav page={page} setPage={setPage}/>
    </div>
  );
}

function DiscoverPage({ page, setPage, onSelectCharacter }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("characters").select("*").order("created_at", { ascending: false });
      setCharacters(data || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#0D0D0F"}}>
      <div style={{padding:"14px 20px",borderBottom:"1px solid #1A1A1E",flexShrink:0}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:"#E8E4DC"}}>Discover</div>
        <div style={{fontSize:12,color:"#4A4A52",marginTop:2}}>All your characters</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px"}}>
        {loading && <div style={{color:"#4A4A52",fontSize:13}}>Loading...</div>}
        {!loading && characters.length === 0 && (
          <div style={{color:"#4A4A52",fontSize:13,textAlign:"center",marginTop:40}}>
            No characters yet.{" "}
            <button onClick={()=>setPage("create")} style={{background:"none",border:"none",color:"#8B6FBF",cursor:"pointer",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>Create one →</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          {characters.map(c=>(
            <div key={c.id} onClick={()=>onSelectCharacter(c)}
              style={{background:"#111113",border:"1px solid #1E1E22",borderRadius:14,padding:"16px",cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="#3D2E5A";e.currentTarget.style.background="#161618";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#1E1E22";e.currentTarget.style.background="#111113";}}
            >
              <div style={{width:48,height:48,borderRadius:"50%",background:(c.color||"#8B6FBF")+"22",border:`1.5px solid ${c.color||"#8B6FBF"}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:c.color||"#8B6FBF",marginBottom:12}}>
                {c.name[0].toUpperCase()}
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"#E8E4DC",marginBottom:4}}>{c.name}</div>
              {c.tagline && <div style={{fontSize:11,color:"#4A4A52",lineHeight:1.5,marginBottom:6}}>{c.tagline}</div>}
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
                {(c.traits||[]).slice(0,3).map(t=>(
                  <span key={t} style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:(c.color||"#8B6FBF")+"15",color:c.color||"#8B6FBF"}}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav page={page} setPage={setPage}/>
    </div>
  );
}

export default function NianChat() {
  const [page, setPage] = useState("chat");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:"#0D0D0F",height:"100vh",color:"#E8E4DC",display:"flex",overflow:"hidden"}}>
      <div className={`drawer-overlay ${showSidebar?"open":""}`} onClick={()=>setShowSidebar(false)}/>
      <div className={`mobile-drawer ${showSidebar?"open":""}`}>
        <SidebarContent
          onClose={()=>setShowSidebar(false)}
          onNav={(p)=>{setPage(p);setShowSidebar(false);}}
          onSelectCharacter={(c)=>{setActiveCharacter(c);setPage("chat");}}
          activeCharacterId={activeCharacter?.id}
        />
      </div>

      <aside className="desktop-sidebar">
        <SidebarContent
          onNav={setPage}
          onSelectCharacter={(c)=>{setActiveCharacter(c);setPage("chat");}}
          activeCharacterId={activeCharacter?.id}
        />
      </aside>

      {page==="create"
        ? <CreatePage page={page} setPage={setPage} setActiveCharacter={setActiveCharacter}/>
        : page==="discover"
        ? <DiscoverPage page={page} setPage={setPage} onSelectCharacter={(c)=>{setActiveCharacter(c);setPage("chat");}}/>
        : <ChatPage page={page} setPage={setPage} setShowSidebar={setShowSidebar} character={activeCharacter}/>
      }
    </div>
  );
}
