import Card from "../components/Card.jsx"

export default function Goals({ store, debtFreeDate, savingsGoalForecast }) {
  const netWorth =
    store.savings.reduce((sum, s) => sum + s.balance, 0) +
    store.investments.reduce((sum, i) => sum + i.balance, 0) +
    store.income.reduce((sum, i) => sum + i.amount, 0) -
    store.commitments.reduce((sum, c) => sum + c.amount, 0) -
    store.debts.reduce((sum, d) => sum + d.balance, 0)

  return (
    <div>
      <Card title="Debt-Free Date">
        {debtFreeDate()}
      </Card>

      <Card title="Deposit Goal Forecast (£20,000)">
        {savingsGoalForecast(20000)}
      </Card>

      <Card title="Net Worth">
        £{netWorth}
      </Card>

      <Card title="Savings Total">
        £{store.savings.reduce((sum, s) => sum + s.balance, 0)}
      </Card>

      <Card title="Investment Total">
        £{store.investments.reduce((sum, i) => sum + i.balance, 0)}
      </Card>
    </div>
  )
}
