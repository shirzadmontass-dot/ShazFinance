import { useState } from "react"
import Card from "./Card.jsx"
import { supabase } from "../supabase"

export default function AICoach({ summary }) {
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
    <Card title="AI Savings Coach" icon="🤖">
      {messages.length === 0 && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: "var(--subtext)", fontSize: 13 }}>
            Get a quick read on your spending, or ask a specific question
            about your finances.
          </div>
          <button
            onClick={getInsights}
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "10px 16px",
              borderRadius: "var(--radius)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
              alignSelf: "flex-start"
            }}
          >
            Get insights on my spending
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 12
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: 14,
                background: m.role === "user" ? "var(--accent)" : "#162032",
                color: m.role === "user" ? "white" : "var(--text)",
                whiteSpace: "pre-wrap",
                fontSize: 14,
                lineHeight: 1.4
              }}
            >
              {m.content}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--subtext)", fontSize: 13, marginBottom: 8 }}>
          Thinking…
        </div>
      )}

      {error && (
        <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 8 }}>
          {error}
        </div>
      )}

      {messages.length > 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a follow-up question…"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "10px 16px",
              borderRadius: "var(--radius)",
              color: "white",
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1
            }}
          >
            Send
          </button>
        </div>
      )}
    </Card>
  )
}
