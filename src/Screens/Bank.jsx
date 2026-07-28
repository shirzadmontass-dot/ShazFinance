import { useEffect, useState } from "react"
import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import { supabase } from "../supabase.js"

export default function Bank({ store, add, remove }) {
  const [aspsps, setAspsps] = useState([])
  const [selectedAspsp, setSelectedAspsp] = useState("")
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState("")

  useEffect(() => {
    // TEMPORARY: Sandbox only has a limited set of test banks, mostly
    // European (not UK). Using FI here just to prove the connection
    // works end-to-end — switch back to GB once on Production access.
    fetch("/api/bank/aspsps?country=FI")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.aspsps)) {
          setAspsps(data.aspsps)
        }
      })
      .catch(() => {
        // Silently ignore — the manual entry form below still works
      })
  }, [])

  async function handleConnect() {
    if (!selectedAspsp) return
    setConnecting(true)
    setConnectError("")

    try {
      const chosen = aspsps.find(
        (a) => `${a.name}|${a.country}` === selectedAspsp
      )
      if (!chosen) throw new Error("Pick a bank first")

      const res = await fetch("/api/bank/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aspspName: chosen.name,
          aspspCountry: chosen.country,
          redirectUrl: `${window.location.origin}/bank-callback`
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to connect")

      window.location.href = data.url
    } catch (err) {
      setConnectError(err.message)
      setConnecting(false)
    }
  }

  if (!store) return null

  const manualAccounts = store.bank || []
  const linkedAccounts = store.bankAccounts || []
  const bankTransactions = store.bankTransactions || []

  const manualTotal = manualAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )
  const linkedTotal = linkedAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )
  const total = manualTotal + linkedTotal

  return (
    <Page title="Bank Accounts">
      <Card title="Total Balance" icon="🏦">
        <div style={{ fontSize: "26px", fontWeight: "700" }}>
          £{total.toLocaleString()}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Combined balance across all accounts
        </div>
      </Card>

      {/* Real bank connection */}
      <Card title="Connect your bank" icon="🔗">
        {linkedAccounts.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            {store.bankLastSynced && (
              <div style={{ color: "var(--subtext)", fontSize: 13 }}>
                Last synced:{" "}
                {new Date(store.bankLastSynced).toLocaleString()}
              </div>
            )}

            {linkedAccounts.map((acc) => (
              <div
                key={acc.id}
                style={{
                  padding: "var(--space-2)",
                  background: "var(--bg)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div style={{ fontWeight: 600 }}>{acc.name}</div>
                <div style={{ color: "var(--accent)", fontWeight: 700 }}>
                  £{Number(acc.balance).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            <div style={{ color: "var(--subtext)" }}>
              Link a real bank account to automatically pull in your
              balances and transactions.
            </div>

            <select
              value={selectedAspsp}
              onChange={(e) => setSelectedAspsp(e.target.value)}
              style={{
                padding: "var(--space-2)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)"
              }}
            >
              <option value="">Select your bank…</option>
              {aspsps.map((a) => (
                <option
                  key={`${a.name}|${a.country}`}
                  value={`${a.name}|${a.country}`}
                >
                  {a.name}
                </option>
              ))}
            </select>

            {connectError && (
              <div style={{ color: "var(--danger)", fontSize: 13 }}>
                {connectError}
              </div>
            )}

            <button
              onClick={handleConnect}
              disabled={!selectedAspsp || connecting}
              style={{
                background: "var(--accent)",
                border: "none",
                padding: "10px",
                borderRadius: "var(--radius)",
                color: "white",
                fontWeight: "700",
                cursor:
                  !selectedAspsp || connecting ? "default" : "pointer",
                opacity: !selectedAspsp || connecting ? 0.6 : 1
              }}
            >
              {connecting ? "Connecting…" : "Connect bank"}
            </button>
          </div>
        )}
      </Card>

      {bankTransactions.length > 0 && (
        <Card title="Recent bank transactions" icon="📄">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            {bankTransactions.slice(0, 15).map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: "var(--subtext)" }}>
                    {t.date}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: t.amount < 0 ? "#EF4444" : "#22C55E"
                  }}
                >
                  {t.amount < 0 ? "-" : "+"}£
                  {Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Manual entry — still available as a fallback */}
      <Card title="Manually added accounts" icon="💳">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          {manualAccounts.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No manually added accounts.
            </div>
          )}

          {manualAccounts.map((acc, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                  {acc.name}
                </div>
                <div style={{ color: "var(--subtext)" }}>
                  £{acc.balance}
                </div>
              </div>

              <button
                onClick={() => remove("bank", index)}
                style={{
                  background: "var(--accent)",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "var(--radius)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Add account manually" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const name = e.target.name.value
            const balance = Number(e.target.balance.value)
            if (!name || isNaN(balance)) return
            add("bank", { name, balance })
            e.target.reset()
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <input
            name="name"
            placeholder="Account name"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="balance"
            type="number"
            placeholder="Balance"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <button
            type="submit"
            style={{
              background: "var(--border)",
              border: "none",
              padding: "10px",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Add Account
          </button>
        </form>
      </Card>
    </Page>
  )
}
