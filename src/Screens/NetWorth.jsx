import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function NetWorth({ store }) {
  const savingsTotal = store.savings.reduce((sum, s) => sum + s.balance, 0)
  const investmentsTotal = store.investments.reduce((sum, i) => sum + i.balance, 0)
  const childrenTotal = store.children.reduce((sum, c) => sum + c.balance, 0)
  const depositTotal = store.deposit || 0
  const debtTotal = store.debts.reduce((sum, d) => sum + d.balance, 0)

  const netWorth =
    savingsTotal +
    investmentsTotal +
    childrenTotal +
    depositTotal -
    debtTotal

  return (
    <Page title="Net Worth">
      <Card title="Total Net Worth" icon="💷">
        <div style={{ fontSize: "28px", fontWeight: "700" }}>
          £{netWorth}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Combined value of all assets minus debts
        </div>
      </Card>

      <Card title="Assets Breakdown" icon="📈">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Savings</span>
            <span>£{savingsTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Investments</span>
            <span>£{investmentsTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Children ISA</span>
            <span>£{childrenTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Deposit</span>
            <span>£{depositTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700" }}>
            <span>Total Assets</span>
            <span>£{savingsTotal + investmentsTotal + childrenTotal + depositTotal}</span>
          </div>
        </div>
      </Card>

      <Card title="Debt Overview" icon="💳">
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px" }}>
          <span>Total Debt</span>
          <span>£{debtTotal}</span>
        </div>
      </Card>

      <Card title="Summary" icon="📘">
        <div style={{ color: "var(--text)" }}>
          Your net worth represents your financial position by subtracting all debts from your total assets.
        </div>
      </Card>
    </Page>
  )
}