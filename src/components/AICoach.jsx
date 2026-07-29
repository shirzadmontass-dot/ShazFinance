import { useState } from "react"
import { supabase } from "../supabase"

// Renders just the panel content (insights button / chat) — the
// header decides when it's shown and where it's positioned.
export default function AICoach({ summary, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function callCoach(newMessages) {
    setLoading(true)
    setError(null)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error("Not logged in")

      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ summary, messages: newMessages })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to get advice")

      setMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch (err) {
      console.error("AI coach error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function getInsights() {
    callCoach([])
  }

  function sendMessage() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: "user", content: input.trim() }]
    setMessages(newMessages)
    setInput("")
    callCoach(newMessages)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            fontWeight: 700
          }}
        >
          🤖 AI Savings Coach
        </div>
        {onClose && (
          <span
            onClick={onClose}
            style={{
              cursor: "pointer",
              color: "var(--subtext)",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            Close ✕
          </span>
        )}
      </div>

      {messages.length === 0 && !loading && (
        <>
          <div style={{ color: "var(--subtext)", fontSize: 13 }}>
            Get a quick read on your spending, or ask a specific question.
          </div>
          <button
            onClick={getInsights}
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "9px 14px",
              borderRadius: 10,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              alignSelf: "flex-start"
            }}
          >
            Get insights on my spending
          </button>
        </>
      )}

      {messages.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 320,
            overflowY: "auto"
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "88%",
                padding: "8px 12px",
                borderRadius: 12,
                background: m.role === "user" ? "var(--accent)" : "#0f172a",
                color: m.role === "user" ? "white" : "var(--text)",
                whiteSpace: "pre-wrap",
                fontSize: 13,
                lineHeight: 1.4
              }}
            >
              {m.content}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--subtext)", fontSize: 12 }}>Thinking…</div>
      )}

      {error && (
        <div style={{ color: "#EF4444", fontSize: 12 }}>{error}</div>
      )}

      {messages.length > 0 && (
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a follow-up…"
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)",
              fontSize: 13,
              minWidth: 0
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "8px 14px",
              borderRadius: 10,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}
