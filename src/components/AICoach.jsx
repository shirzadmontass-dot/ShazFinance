import { useState } from "react"
import { supabase } from "../supabase"

export default function AICoach({ summary, wide = true }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

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
    setOpen(true)
    callCoach([])
  }

  function sendMessage() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: "user", content: input.trim() }]
    setMessages(newMessages)
    setInput("")
    callCoach(newMessages)
  }

  // Collapsed state: a slim bar, not a full card — reads more like a
  // toolbar prompt than a big empty box.
  if (!open) {
    return (
      <div
        onClick={getInsights}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: wide ? "12px 16px" : "10px 12px",
          borderRadius: 14,
          background:
            "linear-gradient(135deg, rgba(255,138,0,0.12), rgba(255,61,127,0.08))",
          border: "1px solid rgba(255,138,0,0.3)",
          cursor: "pointer",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0
          }}
        >
          <span style={{ fontSize: wide ? 20 : 18 }}>🤖</span>
          <span
            style={{
              fontSize: wide ? 14 : 13,
              fontWeight: 600,
              color: "var(--text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            Ask your AI savings coach
          </span>
        </div>
        <span
          style={{
            fontSize: wide ? 13 : 12,
            fontWeight: 700,
            color: "var(--accent)",
            whiteSpace: "nowrap"
          }}
        >
          {loading ? "Thinking…" : "Get insights →"}
        </span>
      </div>
    )
  }

  return (
    <div
      style={{
        borderRadius: 14,
        background: "#131A2B",
        border: "1px solid var(--border)",
        padding: wide ? 16 : 12
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: wide ? 14 : 13,
            fontWeight: 700
          }}
        >
          🤖 AI Savings Coach
        </div>
        <span
          onClick={() => setOpen(false)}
          style={{
            cursor: "pointer",
            color: "var(--subtext)",
            fontSize: 12,
            fontWeight: 600
          }}
        >
          Close ✕
        </span>
      </div>

      {messages.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 10,
            maxHeight: wide ? 360 : 280,
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
                fontSize: wide ? 13 : 12.5,
                lineHeight: 1.4
              }}
            >
              {m.content}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--subtext)", fontSize: 12, marginBottom: 8 }}>
          Thinking…
        </div>
      )}

      {error && (
        <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 8 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a follow-up question…"
          style={{
            flex: "1 1 160px",
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
    </div>
  )
}
