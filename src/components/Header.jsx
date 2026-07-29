import { useState } from "react"
import { computeMonthlyFigures } from "./utils/monthlyFigures.js"
import { resolveCategory } from "./utils/categorize.js"
import AICoach from "./AICoach.jsx"

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

export default function Header({ screen, user, onSignOut, onMenuClick, store }) {
  const [aiOpen, setAiOpen] = useState(false)

  const today = new Date()
  const initial = user?.email ? user.email[0].toUpperCase() : "S"

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <header
      className="header-bar"
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
      {/* Left: logo + name + date */}
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
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background:
                "linear-gradient(135deg,var(--accent),var(--accent2))"
            }}
          />
          <span
            className="header-brand-name"
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap"
            }}
          >
            ShazPlan
          </span>
        </div>

        <span
          className="header-date"
          style={{
            fontSize: 13,
            color: "var(--subtext)",
            whiteSpace: "nowrap"
          }}
        >
          {date}
        </span>
      </div>

      {/* Center: page title */}
      <div
        className="header-title"
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

      {/* Right: AI coach, bell, settings, avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px",
          position: "relative"
        }}
      >
        <button
          className="header-icon-btn"
          onClick={() => setAiOpen((v) => !v)}
          title="AI Savings Coach"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: aiOpen
              ? "1px solid var(--accent)"
              : "1px solid transparent",
            background: aiOpen ? "rgba(255,138,0,0.15)" : "#1B263B",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          🤖
        </button>

        {aiOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 340,
              maxWidth: "calc(100vw - 32px)",
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

        <button
          className="header-icon-btn"
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
          className="header-icon-btn"
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

        <button
          onClick={onSignOut}
          title={
            user?.email
              ? `Signed in as ${user.email} — click to sign out`
              : "Sign out"
          }
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(135deg,#FF8A00,#FF3D7F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "16px",
            flexShrink: 0
          }}
        >
          {initial}
        </button>
      </div>
    </header>
  )
}
