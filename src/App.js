import { useState, useRef, useEffect } from "react";

// ─── CHANGE THIS to your Render backend URL after deploying ───────────────────
// Example: const BACKEND_URL = "https://smartassist-backend.onrender.com";
const BACKEND_URL = "https://smartassist-backend.onrender.com"; // replace with yours

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #13131a;
    --surface2: #1c1c27;
    --border: rgba(255,255,255,0.07);
    --accent: #7c6ef7;
    --accent2: #4fc4cf;
    --accent3: #f4845f;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --radius: 16px;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 860px;
    margin: 0 auto;
    padding: 0 16px 40px;
  }

  .header {
    padding: 28px 0 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 28px;
  }

  .logo {
    width: 40px; height: 40px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .header-text h1 {
    font-family: var(--font-head);
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #fff;
  }

  .header-text p { font-size: 13px; color: var(--muted); margin-top: 1px; }

  .badge {
    margin-left: auto;
    background: rgba(124,110,247,0.15);
    color: var(--accent);
    border: 1px solid rgba(124,110,247,0.3);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 500;
    font-family: var(--font-head);
  }

  .tabs {
    display: flex; gap: 6px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 6px;
    margin-bottom: 24px;
  }

  .tab {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 8px;
    border-radius: 10px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-body);
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab:hover { color: var(--text); background: var(--surface2); }
  .tab.active { background: var(--accent); color: #fff; box-shadow: 0 4px 16px rgba(124,110,247,0.35); }
  .tab span { font-size: 16px; }

  .panel { flex: 1; display: flex; flex-direction: column; gap: 16px; }

  .chat-messages {
    flex: 1; min-height: 360px; max-height: 440px;
    overflow-y: auto;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    display: flex; flex-direction: column; gap: 14px;
    scroll-behavior: smooth;
  }

  .msg { display: flex; gap: 10px; animation: fadeUp 0.25s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .msg.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
  }

  .msg.user .msg-avatar { background: var(--accent); }
  .msg.ai .msg-avatar { background: var(--surface2); border: 1px solid var(--border); }

  .msg-bubble {
    max-width: 75%;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px; line-height: 1.6;
    white-space: pre-wrap; word-break: break-word;
  }

  .msg.user .msg-bubble { background: var(--accent); color: #fff; border-bottom-right-radius: 4px; }
  .msg.ai .msg-bubble { background: var(--surface2); color: var(--text); border-bottom-left-radius: 4px; border: 1px solid var(--border); }

  .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 10px; color: var(--muted); }
  .empty-state .big-icon { font-size: 40px; opacity: 0.5; }
  .empty-state p { font-size: 14px; }

  .chat-input-row { display: flex; gap: 10px; }

  .input-field {
    flex: 1;
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 14px 18px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    outline: none; resize: none; transition: border-color 0.2s;
    min-height: 52px; max-height: 120px;
  }
  .input-field:focus { border-color: var(--accent); }
  .input-field::placeholder { color: var(--muted); }

  .btn {
    padding: 14px 22px; border-radius: var(--radius); border: none;
    font-family: var(--font-head); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 7px; white-space: nowrap;
  }

  .btn-primary { background: var(--accent); color: #fff; box-shadow: 0 4px 14px rgba(124,110,247,0.3); }
  .btn-primary:hover:not(:disabled) { background: #6a5ee0; box-shadow: 0 6px 20px rgba(124,110,247,0.45); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-danger { background: rgba(244,132,95,0.15); color: var(--accent3); border: 1px solid rgba(244,132,95,0.3); }
  .btn-danger:hover { background: rgba(244,132,95,0.25); }

  .textarea-large {
    width: 100%; min-height: 180px;
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    outline: none; resize: vertical; transition: border-color 0.2s;
  }
  .textarea-large:focus { border-color: var(--accent); }
  .textarea-large::placeholder { color: var(--muted); }

  .result-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; color: var(--text);
    min-height: 80px; animation: fadeUp 0.3s ease;
  }

  .result-label { font-family: var(--font-head); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent2); margin-bottom: 10px; }

  .row { display: flex; gap: 10px; align-items: flex-start; flex-wrap: wrap; }

  .upload-zone {
    border: 2px dashed var(--border); border-radius: var(--radius);
    padding: 36px 20px; text-align: center; cursor: pointer;
    transition: all 0.2s; background: var(--surface);
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(124,110,247,0.05); }
  .upload-zone .upload-icon { font-size: 36px; margin-bottom: 10px; }
  .upload-zone p { font-size: 14px; color: var(--muted); }
  .upload-zone strong { color: var(--text); }

  .image-preview { width: 100%; max-height: 280px; object-fit: contain; border-radius: 12px; border: 1px solid var(--border); }

  .voice-center { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px 0; }

  .mic-btn {
    width: 90px; height: 90px; border-radius: 50%; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; cursor: pointer; transition: all 0.2s;
  }
  .mic-btn.idle { background: var(--surface2); border: 2px solid var(--border); color: var(--text); }
  .mic-btn.idle:hover { border-color: var(--accent); transform: scale(1.04); }
  .mic-btn.recording { background: var(--accent3); box-shadow: 0 0 0 0 rgba(244,132,95,0.5); animation: pulse 1.2s infinite; color: #fff; }

  @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(244,132,95,0.5)} 70%{box-shadow:0 0 0 18px rgba(244,132,95,0)} 100%{box-shadow:0 0 0 0 rgba(244,132,95,0)} }

  .voice-status { font-family: var(--font-head); font-size: 15px; color: var(--muted); text-align: center; }
  .voice-transcript { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 20px; font-size: 14px; line-height: 1.6; min-height: 60px; color: var(--text); }

  .typing { display: flex; gap: 5px; padding: 4px 0; }
  .typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); animation: bounce 1.2s infinite; }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

  .char-count { font-size: 12px; color: var(--muted); text-align: right; }
  .tag-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
  .tag { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; font-size: 12px; color: var(--muted); cursor: pointer; transition: all 0.15s; }
  .tag:hover { border-color: var(--accent); color: var(--accent); }
`;

const TABS = [
  { id: "chat",    icon: "💬", label: "Chat" },
  { id: "summary", icon: "📝", label: "Summarizer" },
  { id: "image",   icon: "🖼️", label: "Image AI" },
  { id: "voice",   icon: "🎙️", label: "Voice" },
];

// ─── API call goes to YOUR backend, not Anthropic directly ────────────────────
async function callClaude(messages, systemPrompt = "") {
  const body = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt || "You are SmartAssist, a helpful AI assistant. Be clear, concise, and friendly.",
    messages,
  };
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data.content?.[0]?.text || "";
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────
function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const PROMPTS = ["Explain AI in simple terms", "Write a cover letter tip", "What skills should I learn?", "Help me prepare for interviews"];

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: q }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const reply = await callClaude(newMessages);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: `⚠️ Error: ${e.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="big-icon">💬</div>
            <p>Ask me anything to get started</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
            <div className="msg-avatar">{m.role === "user" ? "👤" : "🤖"}</div>
            <div className="msg-bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-avatar">🤖</div>
            <div className="msg-bubble"><div className="typing"><span/><span/><span/></div></div>
          </div>
        )}
        <div ref={endRef}/>
      </div>
      {messages.length === 0 && (
        <div className="tag-row">
          {PROMPTS.map(p => <div key={p} className="tag" onClick={() => send(p)}>{p}</div>)}
        </div>
      )}
      <div className="chat-input-row">
        <textarea
          className="input-field"
          placeholder="Type your message…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
        />
        <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>Send ➤</button>
        {messages.length > 0 && <button className="btn btn-secondary" onClick={() => setMessages([])}>Clear</button>}
      </div>
    </div>
  );
}

// ─── Summarizer Tab ───────────────────────────────────────────────────────────
function SummaryTab() {
  const [text, setText]     = useState("");
  const [mode, setMode]     = useState("bullet");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const MODES = [
    { id: "bullet", label: "Bullet points" },
    { id: "short",  label: "1 paragraph" },
    { id: "eli5",   label: "Explain simply" },
    { id: "tldr",   label: "TL;DR" },
  ];

  const summarize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true); setResult("");
    const prompts = {
      bullet: "Summarize the following text as clear bullet points:",
      short:  "Summarize the following text in one concise paragraph:",
      eli5:   "Explain the following text as if I'm 12 years old, in simple language:",
      tldr:   "Give a 1-2 sentence TL;DR of the following text:",
    };
    try {
      const r = await callClaude([{ role: "user", content: `${prompts[mode]}\n\n${text}` }]);
      setResult(r);
    } catch (e) { setResult(`⚠️ Error: ${e.message}`); }
    setLoading(false);
  };

  return (
    <div className="panel">
      <textarea className="textarea-large" placeholder="Paste any text here — article, essay, notes, documentation…" value={text} onChange={e => setText(e.target.value)}/>
      <div className="char-count">{text.length} characters</div>
      <div className="row">
        {MODES.map(m => <button key={m.id} className={`btn ${mode === m.id ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode(m.id)}>{m.label}</button>)}
      </div>
      <button className="btn btn-primary" onClick={summarize} disabled={loading || !text.trim()} style={{alignSelf:"flex-start"}}>
        {loading ? "Summarizing…" : "Summarize ✨"}
      </button>
      {result && <div className="result-box"><div className="result-label">Result</div>{result}</div>}
    </div>
  );
}

// ─── Image Tab ────────────────────────────────────────────────────────────────
function ImageTab() {
  const [image, setImage]   = useState(null);
  const [prompt, setPrompt] = useState("Describe this image in detail.");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag]     = useState(false);
  const inputRef = useRef();

  const QUESTIONS = ["Describe this image in detail.", "What objects are in this image?", "What text can you read in this image?", "What is the mood or tone of this image?"];

  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      const base64 = e.target.result.split(",")[1];
      setImage({ base64, mediaType: file.type, url: e.target.result });
      setResult("");
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image || loading) return;
    setLoading(true); setResult("");
    try {
      const r = await callClaude([{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.base64 } },
          { type: "text", text: prompt }
        ]
      }]);
      setResult(r);
    } catch (e) { setResult(`⚠️ Error: ${e.message}`); }
    setLoading(false);
  };

  return (
    <div className="panel">
      {!image ? (
        <div className={`upload-zone ${drag ? "drag" : ""}`} onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}>
          <div className="upload-icon">🖼️</div>
          <p><strong>Click to upload</strong> or drag & drop</p>
          <p style={{marginTop:6,fontSize:12}}>PNG, JPG, WEBP, GIF supported</p>
          <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={e => loadFile(e.target.files[0])}/>
        </div>
      ) : (
        <div style={{position:"relative"}}>
          <img src={image.url} className="image-preview" alt="uploaded"/>
          <button className="btn btn-danger" style={{position:"absolute",top:10,right:10,padding:"6px 12px",fontSize:12}} onClick={() => { setImage(null); setResult(""); }}>Remove</button>
        </div>
      )}
      <div className="tag-row">
        {QUESTIONS.map(q => <div key={q} className="tag" style={prompt===q?{borderColor:"var(--accent)",color:"var(--accent)"}:{}} onClick={() => setPrompt(q)}>{q}</div>)}
      </div>
      <div className="chat-input-row">
        <input className="input-field" style={{minHeight:"auto",padding:"12px 16px"}} placeholder="Ask something about the image…" value={prompt} onChange={e => setPrompt(e.target.value)}/>
        <button className="btn btn-primary" onClick={analyze} disabled={loading || !image}>{loading ? "Analyzing…" : "Analyze 🔍"}</button>
      </div>
      {result && <div className="result-box"><div className="result-label">Analysis</div>{result}</div>}
    </div>
  );
}

// ─── Voice Tab ────────────────────────────────────────────────────────────────
function VoiceTab() {
  const [status, setStatus]         = useState("idle");
  const [transcript, setTranscript] = useState("");
  const [result, setResult]         = useState("");
  const [loading, setLoading]       = useState(false);
  const recognitionRef = useRef(null);

  const supported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startRecording = () => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
    rec.onresult = e => setTranscript(Array.from(e.results).map(r => r[0].transcript).join(""));
    rec.onend = () => setStatus("done");
    rec.onerror = () => setStatus("error");
    recognitionRef.current = rec;
    rec.start();
    setStatus("recording"); setTranscript(""); setResult("");
  };

  const stopRecording = () => { recognitionRef.current?.stop(); setStatus("done"); };

  const sendToAI = async () => {
    if (!transcript.trim() || loading) return;
    setLoading(true);
    try {
      const r = await callClaude([{ role: "user", content: transcript }]);
      setResult(r);
      if ("speechSynthesis" in window) {
        const utt = new SpeechSynthesisUtterance(r);
        utt.rate = 0.95; utt.pitch = 1;
        window.speechSynthesis.speak(utt);
      }
    } catch (e) { setResult(`⚠️ Error: ${e.message}`); }
    setLoading(false);
  };

  return (
    <div className="panel">
      <div className="voice-center">
        {!supported && <div className="result-box" style={{width:"100%",textAlign:"center"}}>⚠️ Your browser doesn't support Speech Recognition.<br/>Try Chrome or Edge.</div>}
        <button className={`mic-btn ${status === "recording" ? "recording" : "idle"}`} onClick={status === "recording" ? stopRecording : startRecording} disabled={!supported}>
          {status === "recording" ? "⏹" : "🎙️"}
        </button>
        <div className="voice-status">
          {status === "idle"      && "Tap the mic to start speaking"}
          {status === "recording" && "🔴 Listening… tap to stop"}
          {status === "done"      && "Recording complete"}
          {status === "error"     && "Microphone error — please retry"}
        </div>
        {transcript && (
          <div style={{width:"100%"}}>
            <div className="result-label" style={{marginBottom:8}}>You said</div>
            <div className="voice-transcript">{transcript}</div>
          </div>
        )}
        <div className="row" style={{justifyContent:"center"}}>
          <button className="btn btn-primary" onClick={sendToAI} disabled={!transcript || loading}>{loading ? "Thinking…" : "Send to AI 🤖"}</button>
          {transcript && <button className="btn btn-secondary" onClick={() => { setTranscript(""); setResult(""); setStatus("idle"); }}>Reset</button>}
        </div>
      </div>
      {result && <div className="result-box"><div className="result-label">AI Response (also spoken aloud)</div>{result}</div>}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function SmartAssist() {
  const [activeTab, setActiveTab] = useState("chat");
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="logo">🧠</div>
          <div className="header-text">
            <h1>SmartAssist</h1>
            <p>AI-powered multi-tool · Powered by Claude</p>
          </div>
          <div className="badge">Portfolio Project</div>
        </header>
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        {activeTab === "chat"    && <ChatTab/>}
        {activeTab === "summary" && <SummaryTab/>}
        {activeTab === "image"   && <ImageTab/>}
        {activeTab === "voice"   && <VoiceTab/>}
      </div>
    </>
  );
}
