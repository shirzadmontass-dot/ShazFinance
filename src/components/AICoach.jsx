import { useState, useRef, useEffect } from "react"
import { supabase } from "../supabase"

// Pulls a trailing "[GOTO:PageName]" tag off an assistant message, if
// present, returning the cleaned text and the target page separately.
function parseGoto(content) {
  const match = content.match(/\n?\[GOTO:([A-Za-z]+)\]\s*$/)
  if (!match) return { text: content, goto: null }
  return {
    text: content.slice(0, match.index).trim(),
    goto: match[1]
  }
}

// Renders just the panel content (insights button / chat) — the
// header decides when it's shown and where it's positioned.
export default function AICoach({ summary, onClose, setScreen }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryIn, setRetryIn] = useState(0)
  const scrollRef = useRef(null)

  // Always scroll to the newest content — otherwise a long reply can sit
  // below the visible area with no obvious sign there's more to read.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  // Countdown display while waiting to auto-retry after a rate limit.
  useEffect(() => {
    if (retryIn <= 0) return
    const t = setTimeout(() => setRetryIn((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [retryIn])

  async function callCoach(newMessages, isRetry = false) {
    setLoading(true)
    if (!isRetry) setError(null)
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

      setError(null)
      setMessages([...newMessages, { role: "assistant", content: data.reply }])
    } catch (err) {
      console.error("AI coach error:", err)
      const isRateLimit = /getting a lot of use/i.test(err.message || "")

      if (isRateLimit && !isRetry) {
        // Auto-retry once after the wait, so this doesn't need a manual click.
        setError("Busy right now — retrying automatically in 15s…")
        setRetryIn(15)
        setTimeout(() => callCoach(newMessages, true), 15000)
        return
      }

      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const [chatStarted, setChatStarted] = useState(false)

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

      {messages.length === 0 && !loading && !chatStarted && (
        <>
          <div style={{ color: "var(--subtext)", fontSize: 13 }}>
            Get a quick read on your spending, or ask a specific question.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                cursor: "pointer"
              }}
            >
              Get insights on my spending
            </button>
            <button
              onClick={() => setChatStarted(true)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "9px 14px",
                borderRadius: 10,
                color: "var(--text)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer"
              }}
            >
              Help with something else
            </button>
          </div>
        </>
      )}

      {messages.length > 0 && (
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 420,
            overflowY: "auto",
            scrollBehavior: "smooth"
          }}
        >
          {messages.map((m, i) => {
            const { text, goto } =
              m.role === "assistant" ? parseGoto(m.content) : { text: m.content, goto: null }

            return (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }}
              >
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 12,
                    background: m.role === "user" ? "var(--accent)" : "#0f172a",
                    color: m.role === "user" ? "white" : "var(--text)",
                    whiteSpace: "pre-wrap",
                    fontSize: 13,
                    lineHeight: 1.4
                  }}
                >
                  {text}
                </div>

                {goto && (
                  <button
                    onClick={() => {
                      if (typeof setScreen === "function") setScreen(goto)
                      if (typeof onClose === "function") onClose()
                    }}
                    style={{
                      alignSelf: "flex-start",
                      background: "var(--accent)",
                      border: "none",
                      padding: "7px 12px",
                      borderRadius: 8,
                      color: "white",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    Take me to {goto} →
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {loading && (
        <div style={{ color: "var(--subtext)", fontSize: 12 }}>Thinking…</div>
      )}

      {error && (
        <div style={{ color: "#EF4444", fontSize: 12 }}>
          {retryIn > 0
            ? `Busy right now — retrying automatically in ${retryIn}s…`
            : error}
        </div>
      )}

      {(messages.length > 0 || chatStarted) && (
        <div style={{ display: "flex", gap: 6 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              messages.length > 0 ? "Ask a follow-up…" : "What's on your mind?"
            }
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
