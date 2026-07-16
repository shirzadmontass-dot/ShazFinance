import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Reports({ store }) {
  const incomeTotal = store.income.reduce((sum, i) => sum + i.amount, 0)
  const commitmentsTotal = store.commitments.reduce((sum, c) => sum + c.amount, 0)
  const leftover = incomeTotal - commitmentsTotal

  const wasted = store.commitments
    .filter(c => ["Wants", "Shopping", "Misc"].includes(c.category))
    .reduce((sum, c) => sum + c.amount, 0)

  const savingsTotal = store.savings.reduce((sum, s) => sum + s.balance, 0)
  const debtTotal = store.debts.reduce((sum, d) => sum + d.balance, 0)
  const depositTotal = store.deposit || 0

  const actualLeftover = leftover - wasted

  return (
    <Page title="Reports">
      <Card title="Monthly Summary" icon="📊">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Income</span>
            <span>£{incomeTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Commitments</span>
            <span>£{commitmentsTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Leftover</span>
            <span>£{leftover}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Wasted</span>
            <span>£{wasted}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
            <span>Actual Leftover</span>
            <span>£{actualLeftover}</span>
          </div>
        </div>
      </Card>

      <Card title="Savings & Debt" icon="💷">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Savings</span>
            <span>£{savingsTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Debt</span>
            <span>£{debtTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
            <span>Net Position</span>
            <span>£{savingsTotal - debtTotal}</span>
          </div>
        </div>
      </Card>

      <Card title="Deposit Overview" icon="🏦">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{depositTotal}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Your current deposit amount
        </div>
      </Card>

      <Card title="Spending Breakdown" icon="📄">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {store.commitments.map((c, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)"
              }}
            >
              <span>{c.name} ({c.category})</span>
              <span>£{c.amount}</span>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  )
}