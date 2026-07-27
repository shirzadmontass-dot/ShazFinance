import { useState } from "react"
import { supabase } from "../supabase"

export default function Login() {
  const [mode, setMode] = useState("login") // "login" | "signup"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email to confirm your account, then log in.")
      }
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "linear-gradient(180deg,#243B55 0%, #1B263B 100%)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 32,
          boxShadow: "var(--shadow)"
        }}
      >
        <div
          style={{
            marginBottom: 4,
            fontSize: 24,
            fontWeight: 800,
            color: "white"
          }}
        >
          {mode === "login" ? "Welcome back" : "Create your account"}
        </div>
        <div
          style={{
            marginBottom: 24,
            fontSize: 14,
            color: "var(--subtext)"
          }}
        >
          {mode === "login"
            ? "Log in to ShazPlan to see your dashboard."
            : "Set up your own ShazPlan dashboard."}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 13,
              color: "var(--subtext)",
              display: "block",
              marginBottom: 6
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              fontSize: 13,
              color: "var(--subtext)",
              display: "block",
              marginBottom: 6
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div
            style={{
              color: "var(--danger)",
              fontSize: 13,
              marginBottom: 14
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              color: "var(--success)",
              fontSize: 13,
              marginBottom: 14
            }}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 14,
            border: "none",
            background:
              "linear-gradient(135deg, var(--accent), var(--accent2))",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>

        <div
          style={{
            marginTop: 18,
            fontSize: 13,
            color: "var(--subtext)",
            textAlign: "center"
          }}
        >
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                style={{
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontWeight: 600
                }}
                onClick={() => {
                  setMode("signup")
                  setError("")
                  setMessage("")
                }}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={{
                  color: "var(--accent)",
                  cursor: "pointer",
                  fontWeight: 600
                }}
                onClick={() => {
                  setMode("login")
                  setError("")
                  setMessage("")
                }}
              >
                Log in
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  )
}