import { useEffect, useState } from "react"
import { supabase } from "../supabase.js"

export default function BankCallback() {
  const [status, setStatus] = useState("connecting")
  const [message, setMessage] = useState(
    "Connecting your bank account…"
  )

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      const error = params.get("error")

      if (error) {
        setStatus("error")
        setMessage(`Your bank declined the connection: ${error}`)
        return
      }

      if (!code) {
        setStatus("error")
        setMessage("Missing authorization code from your bank.")
        return
      }

      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (!session) {
        setStatus("error")
        setMessage("You need to be logged in to link a bank account.")
        return
      }

      try {
        const res = await fetch("/api/bank/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            code,
            redirectUri: `${window.location.origin}/bank-callback`
          })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }

        setStatus("success")
        setMessage(
          `Linked ${data.accountsLinked} account${
            data.accountsLinked === 1 ? "" : "s"
          } — importing ${data.transactionsImported} transactions.`
        )

        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } catch (err) {
        setStatus("error")
        setMessage(err.message)
      }
    }

    run()
  }, [])

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        color: "var(--text)",
        padding: 24,
        textAlign: "center"
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>
        {status === "connecting" && "🔗"}
        {status === "success" && "✅"}
        {status === "error" && "⚠️"}
      </div>

      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
        {status === "connecting" && "Connecting your bank…"}
        {status === "success" && "Bank connected!"}
        {status === "error" && "Connection failed"}
      </div>

      <div style={{ color: "var(--subtext)", maxWidth: 360 }}>
        {message}
      </div>

      {status === "error" && (
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Back to ShazPlan
        </button>
      )}
    </div>
  )
}
