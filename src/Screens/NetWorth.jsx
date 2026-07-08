import Card from "../components/Card.jsx"

export default function NetWorth({ store }) {
  // Safety checks to prevent white screen crashes
  if (!store) {
    return <div style={{ color: "white" }}>Store not loaded</div>
  }

  const savingsTotal = Array.isArray(store.savings)
    ? store.savings.reduce((sum, s) => sum + (s.balance || 0), 0)
    : 0

  const investmentsTotal = Array.isArray(store.investments)
    ? store.investments.reduce((sum, i) => sum + (i.balance || 0), 0)
    : 0

  const debtTotal = Array.isArray(store.debts)
    ? store.debts.reduce((sum, d) => sum + (d.balance || 0), 0)
    : 0

  const incomeTotal = Array.isArray(store.income)
    ? store.income.reduce((sum, i) => sum + (i.amount || 0), 0)
    : 0

  const commitmentsTotal = Array.isArray(store.commitments)
    ? store.commitments.reduce((sum, c) => sum + (c.amount || 0), 0)
    : 0

  const netWorth =
    savingsTotal +
    investmentsTotal +
    incomeTotal -
    commitmentsTotal -
    debtTotal

  return (
    <div>
      <Card title="Net Worth Overview">
        £{netWorth}
      </Card>

      <Card title="Savings Total">
        £{savingsTotal}
      </Card>

      <Card title="Investments Total">
        £{investmentsTotal}
      </Card>

      <Card title="Debt Total">
        £{debtTotal}
      </Card>
    </div>
  )
}
