import React, { useState, useRef, useEffect } from 'react'
import './ui.css'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    // auto-scroll to bottom on new messages
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])

  async function sendMessage(e) {
    e && e.preventDefault()
    if (!input.trim()) return                     

    const userMsg = { role: 'user', text: input }
    const newMessages = [...messages, userMsg]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // System prompt to 'train' the bot for cardiovascular guidance
      const systemPrompt = 'You are a Cardio vascular guidance bot reply everyone with their problems based on the given user input'

      const res = await fetch(
        '/1s22zb2p/v1beta/models/gemini-2.5-flash:generateContent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  systemInstruction: {
    parts: [{ text: systemPrompt }]
  },
  contents: newMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }))
})
        }
      )

      const data = await res.json()

      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response'

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error: ' + err.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrap">
      <div className="app-card">
        <div className="app-header">
          <div>
            <div className="brand">Cardio Doc AI</div>
        
          </div>
        </div>

        <div className="chat-window" ref={chatRef}>
          {messages.length === 0 && (
            <div className="meta">Start the conversation</div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'assistant'}`}>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, textTransform: 'capitalize' }}>{m.role}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="msg assistant">
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>assistant</div>
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
          )}
        </div>

        <form className="composer" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message and press Enter"
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
              <><span className="dots"><span></span><span></span><span></span></span> Thinking</>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
