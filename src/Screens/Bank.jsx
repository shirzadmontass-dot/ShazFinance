import { useState, useEffect } from "react"
import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import { supabase } from "../supabase"
import { resolveCategory, normalizeMerchant, autoCategorize, isInternalTransfer } from "../utils/categorize.js"
import { isSavingsType, isCreditType, isInvestmentType } from "../utils/accountTypes.js"

// How stale "last synced" has to be before we auto-refresh on page open.
const AUTO_SYNC_AFTER_MS = 5 * 60 * 1000 // 5 minutes

// Statement upload account types — for anything TrueLayer can't reach
// (credit cards, BNPL, PayPal, a LISA, or an investment platform).
const ACCOUNT_TYPE_META = {
  "credit-card": { label: "Credit Card", type: "CREDIT_CARD" },
  klarna: { label: "Klarna", type: "CREDIT_CARD" },
  paypal: { label: "PayPal", type: "TRANSACTION" },
  lisa: { label: "LISA", type: "SAVINGS" },
  investment: { label: "Investment", type: "INVESTMENT" }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(",")[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Bank({ store, add, remove, update }) {
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)

  const incomingFilter = store?.uiState?.bankCategoryFilter
  const [txExpanded, setTxExpanded] = useState(Boolean(incomingFilter))
  const [categoryFilter, setCategoryFilter] = useState(incomingFilter || "all")
  const [searchText, setSearchText] = useState("")

  // Consume the one-off filter preset (set by clicking a Dashboard card)
  // so it doesn't stick around and reapply itself on a later visit.
  useEffect(() => {
    if (incomingFilter && typeof update === "function") {
      update("uiState.bankCategoryFilter", null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [uploadType, setUploadType] = useState("credit-card")
  const [uploadName, setUploadName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const linkedAccounts = store?.bankAccounts || []
  const bankTransactions = store?.bankTransactions || []
  const categoryOverrides = store?.categoryOverrides || {}
  const accountRoles = store?.accountRoles || {}
  const aiCategoryGuesses = store?.aiCategoryGuesses || {}

  // Any merchant the keyword list can't classify (e.g. a pub with a
  // creative name) gets asked to the AI once, then cached forever so it
  // never needs asking again.
  useEffect(() => {
    if (bankTransactions.length === 0) return

    const uncategorisedNames = new Set()
    bankTransactions
      .filter((t) => t.amount < 0)
      .filter((t) => !isInternalTransfer(t.description))
      .forEach((t) => {
        const key = normalizeMerchant(t.description)
        if (categoryOverrides[key]) return
        if (aiCategoryGuesses[key]) return
        if (autoCategorize(t.description) !== "uncategorised") return
        uncategorisedNames.add(t.description)
      })

    if (uncategorisedNames.size === 0) return

    ;(async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession()
        const token = sessionData?.session?.access_token
        if (!token) return

        const res = await fetch("/api/ai/categorize-merchants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ merchants: [...uncategorisedNames] })
        })
        const data = await res.json()
        if (!res.ok) return

        const newGuesses = {}
        Object.entries(data.categories || {}).forEach(([name, cat]) => {
          if (cat === "essential" || cat === "discretionary") {
            newGuesses[normalizeMerchant(name)] = cat
          }
        })

        if (Object.keys(newGuesses).length > 0 && typeof update === "function") {
          update("aiCategoryGuesses", { ...aiCategoryGuesses, ...newGuesses })
        }
      } catch (err) {
        console.error("AI categorization fetch failed:", err)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankTransactions.length])

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
    const current = accountRoles[accountId]
    update(`accountRoles.${accountId}`, current === role ? null : role)
  }

  function moveTransaction(transactionId, newAccountId) {
    if (typeof update !== "function") return
    const updated = bankTransactions.map((t) =>
      t.id === transactionId ? { ...t, accountId: newAccountId } : t
    )
    update("bankTransactions", updated)
  }

  async function handleStatementUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
      const base64 = await fileToBase64(file)
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error("Not logged in")

      const res = await fetch("/api/statements/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileBase64: base64,
          accountType: uploadType,
          accountName: uploadName
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to parse statement")

      const meta = ACCOUNT_TYPE_META[uploadType]
      const newAccountId = `upload-${uploadType}-${Date.now()}`

      const newAccount = {
        id: newAccountId,
        name: uploadName.trim() || data.accountName,
        type: meta.type,
        balance: Number(data.closingBalance || 0),
        currency: "GBP",
        bankName: meta.label,
        source: "upload"
      }

      const newTransactions = (data.transactions || []).map((t, i) => ({
        id: `${newAccountId}-${i}-${t.date}-${t.amount}`,
        date: t.date,
        description: t.description,
        amount: Number(t.amount || 0),
        currency: "GBP",
        accountId: newAccountId
      }))

      if (typeof update === "function") {
        update("bankAccounts", [...linkedAccounts, newAccount])
        update("bankTransactions", [...bankTransactions, ...newTransactions])
      }

      setUploadName("")
    } catch (err) {
      console.error("statement upload error:", err)
      setUploadError(err.message || "Failed to upload statement")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  if (!store) return null

  const manualAccounts = store.bank || []

  const manualTotal = manualAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )

  // Split linked accounts by what they actually represent: real spendable
  // cash, investments (not instantly liquid), and money owed (credit
  // cards / Klarna) — so "Total Balance" isn't misleadingly inflated by
  // debt, and investments aren't confused with cash on hand.
  const cashAccounts = linkedAccounts.filter(
    (a) => !isCreditType(a.type) && !isInvestmentType(a.type)
  )
  const investmentAccounts = linkedAccounts.filter(
    (a) => isInvestmentType(a.type)
  )
  const creditAccounts = linkedAccounts.filter(
    (a) => isCreditType(a.type)
  )

  const cashTotal =
    manualTotal +
    cashAccounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
  const investmentTotal = investmentAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )
  const creditOwedTotal = creditAccounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  )

  const groupedAccounts = linkedAccounts.reduce((groups, acc) => {
    const bankName = acc.bankName || "Bank account"
    if (!groups[bankName]) groups[bankName] = []
    groups[bankName].push(acc)
    return groups
  }, {})

  const discretionaryTotal = bankTransactions
    .filter((t) => t.amount < 0)
    .filter((t) => !isInternalTransfer(t.description))
    .filter(
      (t) => resolveCategory(t, categoryOverrides, aiCategoryGuesses) === "discretionary"
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

  const filteredTransactions = regularTransactions.filter((t) => {
    if (categoryFilter !== "all") {
      const cat = resolveCategory(t, categoryOverrides, aiCategoryGuesses)
      if (categoryFilter === "essential" && cat !== "essential") return false
      if (categoryFilter === "discretionary" && cat !== "discretionary")
        return false
    }
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      if (!t.description.toLowerCase().includes(q)) return false
    }
    return true
  })

  const visibleTransactions = txExpanded ? filteredTransactions : []

  return (
    <Page title="Bank Accounts">
      <Card title="Total Balance" icon="🏦">
        <div style={{ fontSize: "26px", fontWeight: "700" }}>
          £{cashTotal.toLocaleString()}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Cash across your current and savings accounts
        </div>
      </Card>

      {investmentAccounts.length > 0 && (
        <Card title="Investments" icon="📈">
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#38BDF8" }}>
            £{investmentTotal.toLocaleString()}
          </div>
          <div style={{ color: "var(--subtext)" }}>
            Across {investmentAccounts.length} linked investment account
            {investmentAccounts.length > 1 ? "s" : ""} — not counted as
            spendable cash
          </div>
        </Card>
      )}

      {creditAccounts.length > 0 && (
        <Card title="Credit & BNPL owed" icon="💳">
          <div style={{ fontSize: "26px", fontWeight: "700", color: "#EF4444" }}>
            £{creditOwedTotal.toLocaleString()}
          </div>
          <div style={{ color: "var(--subtext)" }}>
            Counted as debt, not as money you have
          </div>
        </Card>
      )}

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
                  const roleOptions =
                    isSavingsType(acc.type)
                      ? [
                          ["house", "House Deposit"],
                          ["kids", "Kids"],
                          ["general", "General"]
                        ]
                      : isInvestmentType(acc.type)
                      ? []
                      : [
                          ["spending", "Spending"],
                          ["bills", "Bills"]
                        ]

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
                        {roleOptions.length > 0 && (
                          <div
                            style={{
                              marginTop: 4,
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap"
                            }}
                          >
                            {roleOptions.map(([value, label]) => (
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
                        )}
                      </div>
                      <div
                        style={{
                          color:
                            isCreditType(acc.type)
                              ? "#EF4444"
                              : "var(--accent)",
                          fontWeight: 700
                        }}
                      >
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

      {/* Statement upload — for anything TrueLayer can't reach */}
      <Card title="Upload a statement" icon="📎">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <div style={{ color: "var(--subtext)", fontSize: 13 }}>
            For credit cards, Klarna, PayPal, a LISA, or investment accounts
            (Trading 212, Monzo Investments, etc.) — upload a PDF statement
            and it'll be read automatically and added alongside your linked
            banks.
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              style={{
                padding: "8px 10px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)"
              }}
            >
              <option value="credit-card">Credit Card</option>
              <option value="klarna">Klarna</option>
              <option value="paypal">PayPal</option>
              <option value="lisa">LISA</option>
              <option value="investment">
                Investment (Trading 212, Monzo Investments, etc.)
              </option>
            </select>

            <input
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="Optional name, e.g. Trading 212"
              style={{
                flex: "1 1 160px",
                padding: "8px 10px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)"
              }}
            />
          </div>

          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: "var(--radius)",
              border: "1px dashed var(--border)",
              color: "var(--accent)",
              fontWeight: 700,
              cursor: uploading ? "default" : "pointer",
              opacity: uploading ? 0.6 : 1
            }}
          >
            {uploading ? "Reading statement…" : "Choose PDF statement"}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleStatementUpload}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>

          {uploadError && (
            <div style={{ color: "#EF4444", fontSize: 12 }}>
              {uploadError}
            </div>
          )}
        </div>
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

            {txExpanded && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center"
                }}
              >
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search transactions…"
                  style={{
                    flex: "1 1 160px",
                    padding: "8px 10px",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    fontSize: 13
                  }}
                />

                {[
                  ["all", "All"],
                  ["essential", "Essential"],
                  ["discretionary", "Non-essential"]
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setCategoryFilter(value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      border:
                        categoryFilter === value
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                      background:
                        categoryFilter === value
                          ? "rgba(255,138,0,0.15)"
                          : "transparent",
                      color:
                        categoryFilter === value
                          ? "var(--accent)"
                          : "var(--subtext)"
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {visibleTransactions.map((t) => {
              const category = resolveCategory(t, categoryOverrides, aiCategoryGuesses)
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
                        marginTop: 3,
                        fontSize: 12,
                        color: "var(--subtext)",
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        flexWrap: "wrap"
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
                      {linkedAccounts.length > 1 && (
                        <select
                          value={t.accountId}
                          onChange={(e) =>
                            moveTransaction(t.id, e.target.value)
                          }
                          title="Move to a different account"
                          style={{
                            fontSize: 10,
                            padding: "1px 4px",
                            borderRadius: 6,
                            border: "1px solid var(--border)",
                            background: "var(--bg)",
                            color: "var(--subtext)"
                          }}
                        >
                          {linkedAccounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name}
                            </option>
                          ))}
                        </select>
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
