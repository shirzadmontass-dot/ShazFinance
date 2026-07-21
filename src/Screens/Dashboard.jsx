import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Dashboard({ store }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Safe totals (store fields may be missing)
  const incomeTotal =
    store.income?.reduce((t, i) => t + (i.amount || 0), 0) || 0

  const commitmentsTotal =
    store.commitments?.reduce((t, c) => t + (c.amount || 0), 0) || 0

  const leftover = incomeTotal - commitmentsTotal

  const savingsTotal =
    store.savings?.reduce((t, s) => t + (s.balance || 0), 0) || 0

  const debtTotal =
    store.debts?.reduce((t, d) => t + (d.balance || 0), 0) || 0

  return (
    <Page>

      {/* HERO HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF8A00, #FF3D7F)",
          padding: "24px",
          borderRadius: "20px",
          color: "white",
          marginBottom: "var(--space-4)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
        }}
      >
        <div style={{ fontSize: "26px", fontWeight: "700" }}>
          Welcome back, Shirzad
        </div>
        <div style={{ opacity: 0.9, marginTop: "6px" }}>
          Here's your financial overview for this month
        </div>
      </div>

      {/* KPI GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-4)"
        }}
      >
        <Card title="Income" icon="💼">
          <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--accent)" }}>
            £{incomeTotal}
          </div>
          <div style={{ color: "var(--subtext)" }}>Total monthly income</div>
        </Card>

        <Card title="Commitments" icon="📄">
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#FF3D7F" }}>
            £{commitmentsTotal}
          </div>
          <div style={{ color: "var(--subtext)" }}>Bills & expenses</div>
        </Card>

        <Card title="Leftover" icon="💰">
          <div
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: leftover >= 0 ? "#00C853" : "#D50000"
            }}
          >
            £{leftover}
          </div>
          <div style={{ color: "var(--subtext)" }}>
            Remaining after commitments
          </div>
        </Card>

        <Card title="Savings" icon="🏦">
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#2962FF" }}>
            £{savingsTotal}
          </div>
          <div style={{ color: "var(--subtext)" }}>Total saved</div>
        </Card>

        <Card title="Debt" icon="📉">
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#D50000" }}>
            £{debtTotal}
          </div>
          <div style={{ color: "var(--subtext)" }}>Outstanding debt</div>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card title="Quick Actions" icon="⚡" style={{ marginTop: "var(--space-4)" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Add Income", icon: "➕" },
            { label: "Add Commitment", icon: "📄" },
            { label: "Add Savings", icon: "💰" },
            { label: "View Tools", icon: "🛠️" },
            { label: "Planner", icon: "📅" }
          ].map((btn, i) => (
            <button
              key={i}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                background: "var(--accent)",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>
      </Card>

      {/* TREND SECTION */}
      <Card title="Monthly Trend" icon="📊" style={{ marginTop: "var(--space-4)" }}>
        <div
          style={{
            height: "140px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--subtext)"
          }}
        >
          Trend graph coming soon…
        </div>
      </Card>

    </Page>
  )
}