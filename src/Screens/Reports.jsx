import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Reports({ store }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Safe arrays
  const income = store.income || []
  const commitments = store.commitments || []
  const savings = store.savings || []
  const debts = store.debts || []
  const depositTotal = typeof store.deposit === "number" ? store.deposit : 0

  // ⭐ Safe totals
  const incomeTotal =
    income.length > 0
      ? income.reduce((sum, i) => sum + (i.amount || 0), 0)
      : 0

  const commitmentsTotal =
    commitments.length > 0
      ? commitments.reduce((sum, c) => sum + (c.amount || 0), 0)
      : 0

  const leftover = incomeTotal - commitmentsTotal

  const wasted =
    commitments.length > 0
      ? commitments
          .filter(c =>
            ["Wants", "Shopping", "Misc"].includes(c.category)
          )
          .reduce((sum, c) => sum + (c.amount || 0), 0)
      : 0

  const actualLeftover = leftover - wasted

  const savingsTotal =
    savings.length > 0
      ? savings.reduce((sum, s) => sum + (s.balance || 0), 0)
      : 0

  const debtTotal =
    debts.length > 0
      ? debts.reduce((sum, d) => sum + (d.balance || 0), 0)
      : 0

  return (
    <Page title="Reports">

      {/* MONTHLY SUMMARY */}
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

      {/* SAVINGS & DEBT */}
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

      {/* DEPOSIT */}
      <Card title="Deposit Overview" icon="🏦">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{depositTotal}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Your current deposit amount
        </div>
      </Card>

      {/* SPENDING BREAKDOWN */}
      <Card title="Spending Breakdown" icon="📄">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {commitments.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No commitments added yet.
            </div>
          )}

          {commitments.map((c, index) => (
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
              <span>
                {c.name} ({c.category || "Uncategorised"})
              </span>
              <span>£{c.amount || 0}</span>
            </div>
          ))}
        </div>
      </Card>

    </Page>
  )
}