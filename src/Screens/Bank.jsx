import { useState, useEffect } from "react"
import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import { supabase } from "../supabase"
import { resolveCategory, normalizeMerchant } from "../utils/categorize.js"

// How stale "last synced" has to be before we auto-refresh on page open.
const AUTO_SYNC_AFTER_MS = 5 * 60 * 1000 // 5 minutes

export default function Bank({ store, add, remove, update }) {
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const [txExpanded, setTxExpanded] = useState(false)

  const linkedAccounts = store?.bankAccounts || []
  const bankTransactions = store?.bankTransactions || []
  const categoryOverrides = store?.categoryOverrides || {}
  const accountRoles = store?.accountRoles || {}

  async function runSync(showSpinner = true) {
    if (showSpinner) setSyncing(true)
    setSyncError(null)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error("Not logged in")

      const res = await fetch("/api/bank/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Sync failed")

      // The sync endpoint writes straight to Supabase; if your store
      // context re-fetches from Supabase on an interval or via realtime,
      // this is enough. If not, call your store-refresh function here.
      if (typeof update === "function") {
        update("bankLastSynced", new Date().toISOString())
      }
    } catch (err) {
      console.error("sync failed:", err)
      setSyncError(err.message || "Sync failed")
    } finally {
      if (showSpinner) setSyncing(false)
    }
  }

  // Auto-sync on page open if data is stale and a bank is already linked.
  useEffect(() => {
    if (linkedAccounts.length === 0) return
    const last = store?.bankLastSynced
      ? new Date(store.bankLastSynced).getTime()
      : 0
    if (Date.now() - last > AUTO_SYNC_AFTER_MS) {
      runSync(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleConnect() {
    setConnecting(true)

    const clientId = import.meta.env.VITE_TRUELAYER_CLIENT_ID
    const redirectUri = `${window.location.origin}/bank-callback`
    const scope = "info accounts balance transactions offline_access"
    const providers = "uk-ob-all uk-oauth-all"

    const authUrl =
      `https://auth.truelayer.com/?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&providers=${encodeURIComponent(providers)}`

    window.location.href = authUrl
  }

  function setTransactionCategory(transaction, category) {
    if (typeof update !== "function") return
    const key = normalizeMerchant(transaction.description)
    update(`categoryOverrides.${key}`, category)
  }

  function setAccountRole(accountId, role) {
    if (typeof update !== "function") return
    // Tap the same role again to clear it back to untagged.
    const current = accountRoles[accountId]
    update(`accountRoles.${accountId}`, current === role ? null : role)
  }

  if (!store) return null

  const manualAccounts = store.bank || []

  const manualTotal = manualAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )
  const linkedTotal = linkedAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )
  const total = manualTotal + linkedTotal

  const groupedAccounts = linkedAccounts.reduce((groups, acc) => {
    const bankName = acc.bankName || "Bank account"
    if (!groups[bankName]) groups[bankName] = []
    groups[bankName].push(acc)
    return groups
  }, {})

  const discretionaryTotal = bankTransactions
    .filter((t) => t.amount < 0)
    .filter(
      (t) => resolveCategory(t, categoryOverrides) === "discretionary"
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Round-up/pot transfers (e.g. Monzo's "Transfer to Pot" round-ups) are
  // real but tiny and numerous — folding them into one summary line keeps
  // the list readable and focused on actual spending.
  const isRoundUpTransfer = (t) =>
    /transfer (to|from) pot|round[\s-]?up/i.test(t.description || "")

  const regularTransactions = bankTransactions.filter(
    (t) => !isRoundUpTransfer(t)
  )
  const roundUpTransactions = bankTransactions.filter(isRoundUpTransfer)
  const roundUpTotal = roundUpTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  )

  const visibleTransactions = txExpanded ? regularTransactions : []

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

      {discretionaryTotal > 0 && (
        <Card title="Wasted on non-essentials" icon="🧾">
          <div
            style={{ fontSize: "26px", fontWeight: "700", color: "#F97316" }}
          >
            £{discretionaryTotal.toLocaleString()}
          </div>
          <div style={{ color: "var(--subtext)" }}>
            From recent transactions like takeaways, subscriptions and
            shopping. Tap a transaction below to recategorise it if it's
            wrong.
          </div>
        </Card>
      )}

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8
              }}
            >
              {store.bankLastSynced && (
                <div style={{ color: "var(--subtext)", fontSize: 13 }}>
                  Last synced:{" "}
                  {new Date(store.bankLastSynced).toLocaleString()}
                </div>
              )}

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => runSync(true)}
                  disabled={syncing}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: "var(--radius)",
                    color: "var(--text)",
                    cursor: syncing ? "default" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    opacity: syncing ? 0.6 : 1
                  }}
                >
                  {syncing ? "Syncing…" : "Sync now"}
                </button>

                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border)",
                    padding: "6px 12px",
                    borderRadius: "var(--radius)",
                    color: "var(--accent)",
                    cursor: connecting ? "default" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    opacity: connecting ? 0.6 : 1
                  }}
                >
                  {connecting ? "Redirecting…" : "+ Connect another bank"}
                </button>
              </div>
            </div>

            {syncError && (
              <div style={{ color: "#EF4444", fontSize: 12 }}>
                {syncError === "No bank connected yet"
                  ? "Sync can't run yet — click \"+ Connect another bank\" above and log into your bank once more to enable it."
                  : syncError}
              </div>
            )}

            {Object.entries(groupedAccounts).map(([bankName, accounts]) => (
              <div
                key={bankName}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.05,
                    color: "var(--subtext)",
                    marginTop: 6
                  }}
                >
                  {bankName}
                </div>

                {accounts.map((acc) => {
                  const role = accountRoles[acc.id]
                  return (
                    <div
                      key={acc.id}
                      style={{
                        padding: "var(--space-2)",
                        background: "var(--bg)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{acc.name}</div>
                        <div
                          style={{
                            marginTop: 4,
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap"
                          }}
                        >
                          {(acc.type === "SAVINGS"
                            ? [
                                ["house", "House Deposit"],
                                ["kids", "Kids"],
                                ["general", "General"]
                              ]
                            : [
                                ["spending", "Spending"],
                                ["bills", "Bills"]
                              ]
                          ).map(([value, label]) => (
                            <button
                              key={value}
                              onClick={() => setAccountRole(acc.id, value)}
                              style={{
                                cursor: "pointer",
                                padding: "2px 10px",
                                borderRadius: 999,
                                fontSize: 11,
                                fontWeight: 600,
                                background:
                                  role === value
                                    ? "rgba(255,138,0,0.15)"
                                    : "transparent",
                                color:
                                  role === value
                                    ? "var(--accent)"
                                    : "var(--subtext)",
                                border:
                                  role === value
                                    ? "1px solid var(--accent)"
                                    : "1px solid var(--border)"
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ color: "var(--accent)", fontWeight: 700 }}>
                        £{Number(acc.balance).toLocaleString()}
                      </div>
                    </div>
                  )
                })}
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
              balances and transactions. You'll be taken to a secure page
              to pick your bank and log in.
            </div>

            <button
              onClick={handleConnect}
              disabled={connecting}
              style={{
                background: "var(--accent)",
                border: "none",
                padding: "12px",
                borderRadius: "var(--radius)",
                color: "white",
                fontWeight: "700",
                cursor: connecting ? "default" : "pointer",
                opacity: connecting ? 0.6 : 1
              }}
            >
              {connecting ? "Redirecting…" : "Connect bank"}
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
            <button
              onClick={() => setTxExpanded((v) => !v)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--accent)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                padding: "8px 12px",
                textAlign: "left"
              }}
            >
              {txExpanded
                ? "Hide transactions ▲"
                : `Show ${bankTransactions.length} transactions ▼`}
            </button>

            {visibleTransactions.map((t) => {
              const category = resolveCategory(t, categoryOverrides)
              return (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border)",
                    gap: 8
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{t.description}</div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--subtext)",
                        display: "flex",
                        gap: 6,
                        alignItems: "center"
                      }}
                    >
                      <span>{t.date}</span>
                      {t.amount < 0 && category !== "uncategorised" && (
                        <span
                          onClick={() =>
                            setTransactionCategory(
                              t,
                              category === "discretionary"
                                ? "essential"
                                : "discretionary"
                            )
                          }
                          title="Tap to change category"
                          style={{
                            cursor: "pointer",
                            padding: "1px 7px",
                            borderRadius: 999,
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: 0.05,
                            background:
                              category === "discretionary"
                                ? "rgba(249,115,22,0.12)"
                                : "rgba(34,197,94,0.12)",
                            color:
                              category === "discretionary"
                                ? "#F97316"
                                : "#4ADE80",
                            border:
                              category === "discretionary"
                                ? "1px solid rgba(249,115,22,0.4)"
                                : "1px solid rgba(34,197,94,0.4)"
                          }}
                        >
                          {category === "discretionary"
                            ? "Non-essential"
                            : "Essential"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      color: t.amount < 0 ? "#EF4444" : "#22C55E"
                    }}
                  >
                    {t.amount < 0 ? "-" : "+"}£
                    {Math.abs(t.amount).toLocaleString()}
                  </div>
                </div>
              )
            })}
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
