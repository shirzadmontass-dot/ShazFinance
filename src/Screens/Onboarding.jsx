import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const GOAL_OPTIONS = [
  { key: "house", label: "House deposit", icon: "🏠" },
  { key: "holiday", label: "Holiday fund", icon: "🌴" },
  { key: "car", label: "Car", icon: "🚗" },
  { key: "wedding", label: "Wedding", icon: "💍" },
  { key: "emergency", label: "Emergency fund", icon: "🛟" },
  { key: "general", label: "General saving", icon: "💰" }
]

const INVESTMENT_PLATFORMS = [
  "Trading 212",
  "Stocks & Shares ISA",
  "Pension",
  "Other"
]

const STATEMENT_TYPE_META = {
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

function ProgressDots({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === step ? 20 : 8,
            height: 8,
            borderRadius: 999,
            background:
              i === step ? "var(--accent)" : "rgba(255,255,255,0.15)",
            transition: "all 0.2s"
          }}
        />
      ))}
    </div>
  )
}

function OptionChip({ selected, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 12,
        border: selected
          ? "1px solid var(--accent)"
          : "1px solid var(--border)",
        background: selected ? "rgba(255,138,0,0.15)" : "var(--bg)",
        color: selected ? "var(--accent)" : "var(--text)",
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
        textAlign: "left"
      }}
    >
      {children}
    </button>
  )
}

function YesNo({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <OptionChip selected={value === true} onClick={() => onChange(true)}>
        Yes
      </OptionChip>
      <OptionChip selected={value === false} onClick={() => onChange(false)}>
        No
      </OptionChip>
    </div>
  )
}

export default function Onboarding({ store, update, finish }) {
  const [step, setStep] = useState(0)
  const [selectedGoals, setSelectedGoals] = useState([])
  const [hasInvestments, setHasInvestments] = useState(null)
  const [investmentPlatforms, setInvestmentPlatforms] = useState([])
  const [hasChildren, setHasChildren] = useState(null)
  const [childCount, setChildCount] = useState(1)
  const [hasDebt, setHasDebt] = useState(null)

  const [freeText, setFreeText] = useState("")
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState(null)
  const [extractedGoals, setExtractedGoals] = useState([])
  const [hasExtracted, setHasExtracted] = useState(false)

  const [connecting, setConnecting] = useState(false)
  const [uploadType, setUploadType] = useState("credit-card")
  const [uploadName, setUploadName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const totalSteps = 7
  const linkedAccounts = store?.bankAccounts || []
  const bankTransactions = store?.bankTransactions || []

  // Mark that onboarding is actively in progress the moment it mounts —
  // this stops the app from treating a bank connected mid-wizard as
  // "already set up" and kicking the user out before they finish.
  useEffect(() => {
    if (typeof update === "function") {
      update("profile.onboardingStarted", true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleGoal(key) {
    setSelectedGoals((prev) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
    )
  }

  function togglePlatform(name) {
    setInvestmentPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    )
  }

  function toggleExtractedGoal(index) {
    setExtractedGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, included: !g.included } : g))
    )
  }

  function handleConnectBank() {
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

      const meta = STATEMENT_TYPE_META[uploadType]
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

  async function runExtraction() {
    if (!freeText.trim()) {
      setHasExtracted(true)
      return
    }
    setExtracting(true)
    setExtractError(null)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error("Not logged in")

      const res = await fetch("/api/ai/extract-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: freeText })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to process that")

      setExtractedGoals(
        (data.goals || []).map((g) => ({ ...g, included: true }))
      )
    } catch (err) {
      console.error("goal extraction failed:", err)
      setExtractError(err.message || "Couldn't process that — no worries")
    } finally {
      setExtracting(false)
      setHasExtracted(true)
    }
  }

  // Kick off extraction the moment we land on the summary step.
  useEffect(() => {
    if (step === totalSteps - 1 && !hasExtracted && !extracting) {
      runExtraction()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  function complete(skipped = false) {
    const presetGoals = selectedGoals.map((key) => {
      const meta = GOAL_OPTIONS.find((g) => g.key === key)
      return {
        id: `goal-${key}-${Date.now()}`,
        name: meta.label,
        icon: meta.icon,
        target: 0,
        current: 0
      }
    })

    const aiGoals = extractedGoals
      .filter((g) => g.included)
      .map((g, i) => ({
        id: `goal-ai-${i}-${Date.now()}`,
        name: g.name,
        icon: g.icon || "🎯",
        target: 0,
        current: 0
      }))

    const allGoals = [...presetGoals, ...aiGoals]

    if (typeof update === "function") {
      update("profile", {
        onboardingComplete: true,
        onboardingStarted: true,
        skipped,
        goalTypes: selectedGoals,
        hasInvestments: hasInvestments === true,
        investmentPlatforms,
        hasChildren: hasChildren === true,
        childCount: hasChildren ? Number(childCount) || 0 : 0,
        hasDebt: hasDebt === true,
        extraNotes: freeText || null
      })

      if (!skipped && allGoals.length > 0) {
        update("goals", allGoals)
      }
    }

    if (typeof finish === "function") finish()
  }

  function next() {
    setStep((s) => Math.min(totalSteps - 1, s + 1))
  }
  function back() {
    setStep((s) => Math.max(0, s - 1))
  }

  const cardStyle = {
    maxWidth: 480,
    width: "100%",
    background: "#131A2B",
    border: "1px solid var(--border)",
    borderRadius: 20,
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18
  }

  const pageStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    color: "var(--text)",
    padding: 20
  }

  const isLastStep = step === totalSteps - 1

  const navRow = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 6
      }}
    >
      <button
        onClick={back}
        disabled={step === 0}
        style={{
          background: "transparent",
          border: "none",
          color: step === 0 ? "transparent" : "var(--subtext)",
          fontWeight: 600,
          cursor: step === 0 ? "default" : "pointer",
          fontSize: 13
        }}
      >
        ← Back
      </button>

      {!isLastStep && (
        <button
          onClick={() => complete(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--subtext)",
            fontSize: 12,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Skip setup
        </button>
      )}

      <button
        onClick={isLastStep ? () => complete(false) : next}
        disabled={isLastStep && extracting}
        style={{
          background: "var(--accent)",
          border: "none",
          padding: "10px 20px",
          borderRadius: 10,
          color: "white",
          fontWeight: 700,
          cursor: isLastStep && extracting ? "default" : "pointer",
          opacity: isLastStep && extracting ? 0.6 : 1,
          fontSize: 14
        }}
      >
        {isLastStep ? "Let's go" : "Next →"}
      </button>
    </div>
  )

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <ProgressDots step={step} total={totalSteps} />

        {step === 0 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                Welcome to Mula 👋
              </h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Let's set this up around what actually matters to you. What
                are you working towards? Pick as many as apply.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10
              }}
            >
              {GOAL_OPTIONS.map((g) => (
                <OptionChip
                  key={g.key}
                  selected={selectedGoals.includes(g.key)}
                  onClick={() => toggleGoal(g.key)}
                >
                  {g.icon} {g.label}
                </OptionChip>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Investments</h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Do you have any investments?
              </p>
            </div>
            <YesNo value={hasInvestments} onChange={setHasInvestments} />

            {hasInvestments && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 4
                }}
              >
                <div style={{ fontSize: 13, color: "var(--subtext)" }}>
                  Which platform(s)? Pick as many as apply.
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap"
                  }}
                >
                  {INVESTMENT_PLATFORMS.map((p) => (
                    <OptionChip
                      key={p}
                      selected={investmentPlatforms.includes(p)}
                      onClick={() => togglePlatform(p)}
                    >
                      {p}
                    </OptionChip>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Kids' savings</h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Are you saving for any children?
              </p>
            </div>
            <YesNo value={hasChildren} onChange={setHasChildren} />

            {hasChildren && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4
                }}
              >
                <span style={{ fontSize: 13, color: "var(--subtext)" }}>
                  How many?
                </span>
                <input
                  type="number"
                  min="1"
                  value={childCount}
                  onChange={(e) => setChildCount(e.target.value)}
                  style={{
                    width: 70,
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)"
                  }}
                />
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Debt</h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Any debts you want to track and pay down?
              </p>
            </div>
            <YesNo value={hasDebt} onChange={setHasDebt} />
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>Anything else? 🤔</h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Did we miss anything? Tell us about any other goals,
                accounts, or plans — in your own words. Totally optional.
              </p>
            </div>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g. I'm also saving up for a new kitchen, and I've got a Moneybox LISA I forgot to mention..."
              rows={5}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                fontSize: 14,
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </>
        )}

        {step === 5 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>
                Let's get your figures in 💷
              </h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Link your main spending account, and upload statements for
                anything else — credit cards, PayPal, Klarna, a LISA,
                investments. All optional, and you can always do this later
                from the Bank page instead.
              </p>
            </div>

            {linkedAccounts.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }}
              >
                {linkedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13
                    }}
                  >
                    <span>{acc.name}</span>
                    <span style={{ fontWeight: 700 }}>
                      £{Number(acc.balance).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleConnectBank}
              disabled={connecting}
              style={{
                background: "var(--accent)",
                border: "none",
                padding: "12px",
                borderRadius: 12,
                color: "white",
                fontWeight: 700,
                cursor: connecting ? "default" : "pointer",
                opacity: connecting ? 0.6 : 1
              }}
            >
              {connecting ? "Redirecting…" : "🔗 Connect your bank"}
            </button>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                Or upload a statement
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)"
                  }}
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="klarna">Klarna</option>
                  <option value="paypal">PayPal</option>
                  <option value="lisa">LISA</option>
                  <option value="investment">Investment</option>
                </select>

                <input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="Optional name"
                  style={{
                    flex: "1 1 120px",
                    padding: "8px 10px",
                    borderRadius: 10,
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
                  borderRadius: 12,
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
          </>
        )}

        {step === 6 && (
          <>
            <div>
              <h2 style={{ margin: 0, fontSize: 22 }}>All set 🎉</h2>
              <p
                style={{
                  color: "var(--subtext)",
                  marginTop: 8,
                  fontSize: 14
                }}
              >
                Here's what we'll set up for you:
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontSize: 14
              }}
            >
              <div>
                <strong>Goals:</strong>{" "}
                {selectedGoals.length > 0
                  ? selectedGoals
                      .map(
                        (k) => GOAL_OPTIONS.find((g) => g.key === k)?.label
                      )
                      .join(", ")
                  : "None picked"}
              </div>
              <div>
                <strong>Investments:</strong>{" "}
                {hasInvestments
                  ? investmentPlatforms.join(", ") || "Yes"
                  : "Not tracking"}
              </div>
              <div>
                <strong>Kids' savings:</strong>{" "}
                {hasChildren ? `${childCount} child(ren)` : "Not tracking"}
              </div>
              <div>
                <strong>Debt tracking:</strong>{" "}
                {hasDebt ? "Yes" : "Not tracking"}
              </div>
              <div>
                <strong>Linked accounts:</strong>{" "}
                {linkedAccounts.length > 0
                  ? `${linkedAccounts.length} account(s) connected`
                  : "None yet — you can add these anytime from the Bank page"}
              </div>
            </div>

            {extracting && (
              <div style={{ fontSize: 13, color: "var(--subtext)" }}>
                Reading through what you told us…
              </div>
            )}

            {extractError && (
              <div style={{ fontSize: 12, color: "#EF4444" }}>
                {extractError}
              </div>
            )}

            {!extracting && extractedGoals.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 4,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border)"
                }}
              >
                <div style={{ fontSize: 13, color: "var(--subtext)" }}>
                  We also spotted these from what you wrote — untick
                  anything that's not right:
                </div>
                {extractedGoals.map((g, i) => (
                  <label
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      cursor: "pointer"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={g.included}
                      onChange={() => toggleExtractedGoal(i)}
                    />
                    {g.icon} {g.name}
                  </label>
                ))}
              </div>
            )}

            <p style={{ fontSize: 12, color: "var(--subtext)" }}>
              Don't worry — you can change any of this later in Settings.
            </p>
          </>
        )}

        {navRow}
      </div>
    </div>
  )
}
