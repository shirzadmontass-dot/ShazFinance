import Card from "./Card.jsx"
import { computeMonthlyFigures } from "../utils/monthlyFigures.js"
import { resolveCategory } from "../utils/categorize.js"
import MaskedValue from "./MaskedValue.jsx"

function computeFigures(store) {
  const savings = (store.savings || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )
  const investments = (store.investments || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )
  const deposit = Number(store.deposit?.current || 0)
  const manualDebts = (store.debts || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )

  const bankAccounts = store.bankAccounts || []

  // Real money sitting in linked bank/investment accounts counts as an
  // asset too, on top of anything entered manually — except credit cards
  // and Klarna/BNPL, which represent money owed, not money you have.
  const linkedAssetTotal = bankAccounts
    .filter((a) => a.type !== "CREDIT_CARD")
    .reduce((sum, item) => sum + Number(item.balance || 0), 0)

  const linkedCreditOwed = bankAccounts
    .filter((a) => a.type === "CREDIT_CARD")
    .reduce((sum, item) => sum + Number(item.balance || 0), 0)

  const debts = manualDebts + linkedCreditOwed

  const assets = savings + investments + deposit + linkedAssetTotal
  const netWorth = assets - debts

  // Component 1: debt-to-assets — how much of what you own is actually
  // yours, rather than owed to someone else.
  const debtScore =
    assets > 0
      ? Math.max(0, Math.min(100, Math.round((netWorth / assets) * 100)))
      : 0

  const bankTransactions = store.bankTransactions || []
  const categoryOverrides = store.categoryOverrides || {}
  const hasBankData = bankTransactions.length > 0

  const monthly = hasBankData
    ? computeMonthlyFigures(bankTransactions, store.accountRoles || {})
    : { income: 0, commitments: 0, expenses: 0 }

  const wasted = bankTransactions
    .filter((t) => t.amount < 0)
    .filter(
      (t) => resolveCategory(t, categoryOverrides) === "discretionary"
    )
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  // Component 2: savings rate — this month's income left over after
  // commitments and spending, as a percentage of income.
  const savingsRateScore =
    monthly.income > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((monthly.income - monthly.commitments - monthly.expenses) /
                monthly.income) *
                100
            )
          )
        )
      : 0

  // Component 3: spending discipline — what share of your outgoings this
  // month went to non-essential "wasted" spending vs everything else.
  const totalOutflow = monthly.commitments + monthly.expenses
  const disciplineScore =
    totalOutflow > 0
      ? Math.max(
          0,
          Math.min(100, Math.round(100 - (wasted / totalOutflow) * 100))
        )
      : 100

  // Overall health blends all three. Without any bank data yet, fall back
  // to the debt ratio alone rather than averaging in zeros.
  const health = hasBankData
    ? Math.round((debtScore + savingsRateScore + disciplineScore) / 3)
    : debtScore

  return { netWorth, health }
}

function Gauge({ health, size = 100 }) {
  const radius = size * 0.42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * health) / 100

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={{
          width: "100%",
          height: "100%",
          transform: "rotate(-90deg)"
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.08)"
          strokeWidth={size * 0.09}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={size * 0.09}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div style={{ fontSize: size * 0.2, fontWeight: 800, color: "#fff" }}>
          {health}%
        </div>
        <div
          style={{
            fontSize: size * 0.09,
            textTransform: "uppercase",
            letterSpacing: 0.05,
            color: "var(--subtext)"
          }}
        >
          Health
        </div>
      </div>
    </div>
  )
}

// split = true -> two side-by-side cards (desktop mockup)
// split = false -> one combined card (mobile mockup)
export default function NetWorthCard({ store, split = false }) {
  if (!store) return null

  const { netWorth, health } = computeFigures(store)

  if (split) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}
      >
        <Card title="Net Worth" compact>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: netWorth >= 0 ? "#fff" : "#EF4444"
            }}
          >
            <MaskedValue value={`£${netWorth.toLocaleString()}`} />
          </div>
        </Card>

        <Card title="Financial Health" compact>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Gauge health={health} size={110} />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card title="Net Worth" icon="💎">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap"
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              color: "var(--subtext)"
            }}
          >
            Current Net Worth
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: netWorth >= 0 ? "#fff" : "#EF4444",
              marginTop: 6
            }}
          >
            <MaskedValue value={`£${netWorth.toLocaleString()}`} />
          </div>
        </div>

        <Gauge health={health} size={90} />
      </div>
    </Card>
  )
}
