import { useState } from "react"
import { useIsMobile } from "./hooks/useIsMobile.js"
import { computeMonthlyFigures } from "./utils/monthlyFigures.js"
import { resolveCategory } from "./utils/categorize.js"
import AICoach from "./components/AICoach.jsx"
import { usePrivacy } from "./PrivacyContext.jsx"

function buildFinancialSummary(store) {
  if (!store) return {}

  const bankAccounts = store.bankAccounts || []
  const bankTransactions = store.bankTransactions || []
  const accountRoles = store.accountRoles || {}
  const categoryOverrides = store.categoryOverrides || {}
  const hasBankData = bankTransactions.length > 0

  const monthly = hasBankData
    ? computeMonthlyFigures(bankTransactions, accountRoles)
    : { income: 0, commitments: 0, expenses: 0 }

  const wastedOnNonEssentials = bankTransactions
    .filter((t) => t.amount < 0)
    .filter((t) => resolveCategory(t, categoryOverrides) === "discretionary")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const savingsTotal = (store.savings || []).reduce(
    (sum, s) => sum + Number(s.balance || 0),
    0
  )
  const linkedSavingsBalance = bankAccounts
    .filter((a) => a.type === "SAVINGS")
    .filter((a) => {
      const role = accountRoles[a.id]
      return role !== "house" && role !== "kids"
    })
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)
  const cashCushion = savingsTotal + linkedSavingsBalance

  const transactionAccountsBalance = bankAccounts
    .filter((a) => a.type !== "SAVINGS")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)
  const moneyLeft = hasBankData
    ? transactionAccountsBalance
    : monthly.income - monthly.commitments - monthly.expenses

  const debtTotal = (store.debts || []).reduce(
    (sum, d) => sum + Number(d.balance || 0),
    0
  )
  const investmentsTotal = (store.investments || []).reduce(
    (sum, i) => sum + Number(i.balance || 0),
    0
  )
  const linkedHouseBalance = bankAccounts
    .filter((a) => accountRoles[a.id] === "house")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  return {
    monthlyIncome: monthly.income,
    monthlyCommitments: monthly.commitments,
    monthlyExpenses: monthly.expenses,
    moneyLeft,
    cashCushion,
    wastedOnNonEssentials,
    debtTotal,
    investmentsTotal,
    houseDepositSaved: Number(store.deposit?.current || 0) + linkedHouseBalance,
    houseDepositTarget: Number(store.deposit?.target || 25000)
  }
}

export default function Header({ screen, user, onSignOut, onMenuClick, store, setScreen }) {
  const isMobile = useIsMobile()
  const [aiOpen, setAiOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { hideAll, toggleHideAll } = usePrivacy()
  const today = new Date()
  const initial = user?.email ? user.email[0].toUpperCase() : "S"

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  const privacyButton = (small) => (
    <button
      onClick={toggleHideAll}
      title={hideAll ? "Show figures" : "Hide figures"}
      style={{
        width: small ? 38 : 40,
        height: small ? 38 : 40,
        borderRadius: 12,
        border: hideAll ? "1px solid var(--accent)" : "1px solid transparent",
        background: hideAll ? "rgba(255,138,0,0.18)" : "#1B263B",
        color: "white",
        fontSize: small ? 16 : 18,
        cursor: "pointer"
      }}
    >
      {hideAll ? "🙈" : "👁️"}
    </button>
  )

  const aiButton = (small) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setAiOpen((v) => !v)}
        title="AI Savings Coach"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: small ? 38 : 40,
          padding: small ? "0 10px" : "0 14px",
          borderRadius: 999,
          border: aiOpen ? "1px solid var(--accent)" : "1px solid transparent",
          background: aiOpen
            ? "rgba(255,138,0,0.18)"
            : "linear-gradient(135deg, rgba(255,138,0,0.25), rgba(255,61,127,0.18))",
          color: "white",
          fontSize: small ? 13 : 14,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap"
        }}
      >
        <span style={{ fontSize: small ? 15 : 16 }}>🤖</span>
        {!small && <span>Ask AI</span>}
      </button>

      {aiOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 340,
            maxWidth: "calc(100vw - 24px)",
            background: "#131A2B",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 16,
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            zIndex: 60
          }}
        >
          <AICoach
            summary={buildFinancialSummary(store)}
            onClose={() => setAiOpen(false)}
          />
        </div>
      )}
    </div>
  )

  const accountButton = (small) => (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setAccountOpen((v) => !v)}
        title={user?.email ? `Signed in as ${user.email}` : "Account"}
        style={{
          width: small ? 38 : 42,
          height: small ? 38 : 42,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg,#FF8A00,#FF3D7F)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          fontSize: small ? 15 : 16,
          flexShrink: 0
        }}
      >
        {user?.email ? user.email[0].toUpperCase() : "S"}
      </button>

      {accountOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 240,
            maxWidth: "calc(100vw - 24px)",
            background: "#131A2B",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 10,
            boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            gap: 4
          }}
        >
          {user?.email && (
            <div
              style={{
                padding: "8px 10px",
                fontSize: 12,
                color: "var(--subtext)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                borderBottom: "1px solid var(--border)",
                marginBottom: 4
              }}
            >
              {user.email}
            </div>
          )}

          <button
            onClick={() => {
              setAccountOpen(false)
              if (typeof setScreen === "function") setScreen("Profile")
            }}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: "10px 10px",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            👤 My Profile
          </button>

          <button
            onClick={() => {
              setAccountOpen(false)
              if (typeof setScreen === "function") setScreen("Settings")
            }}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: "10px 10px",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            ⚙️ Settings
          </button>

          <button
            onClick={() => {
              setAccountOpen(false)
              if (typeof onSignOut === "function") onSignOut()
            }}
            style={{
              textAlign: "left",
              background: "transparent",
              border: "none",
              padding: "10px 10px",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              cursor: "pointer"
            }}
          >
            🚪 Sign out
          </button>
        </div>
      )}
    </div>
  )

  // MOBILE: hamburger + centered title + AI coach + avatar.
  if (isMobile) {
    return (
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto 44px",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: "#111827",
          borderBottom: "1px solid rgba(255,255,255,.08)",
          position: "sticky",
          top: 0,
          zIndex: 50
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <button
            onClick={onMenuClick}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: "none",
              background: "#1B263B",
              color: "white",
              fontSize: 20,
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            ⋮
          </button>

          <img
            src="/logo-icon.png"
            alt="Mula"
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              flexShrink: 0,
              objectFit: "contain"
            }}
          />
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {screen}
        </div>

        {privacyButton(true)}
        {aiButton(true)}

        <div style={{ justifySelf: "end" }}>{accountButton(true)}</div>
      </header>
    )
  }

  // DESKTOP: full bar with logo, name, date, centered title, icons.
  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "16px 26px",
        background: "#111827",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 8px 25px rgba(0,0,0,.25)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          minWidth: 0
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <img
            src="/logo-icon.png"
            alt="Mula"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              flexShrink: 0,
              objectFit: "contain"
            }}
          />
          <span
            style={{
              fontFamily: "'Pacifico', cursive",
              fontSize: 22,
              fontWeight: 400,
              color: "#fff",
              whiteSpace: "nowrap",
              lineHeight: 1
            }}
          >
            Mula
          </span>
        </div>

        <span
          style={{
            fontSize: 13,
            color: "var(--subtext)",
            whiteSpace: "nowrap"
          }}
        >
          {date}
        </span>
      </div>

      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.3px",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}
      >
        {screen}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px"
        }}
      >
        {privacyButton(false)}
        {aiButton(false)}

        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          🔔
        </button>

        <button
          onClick={() => typeof setScreen === "function" && setScreen("Settings")}
          title="Settings"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ⚙️
        </button>

        {accountButton(false)}
      </div>
    </header>
  )
}
