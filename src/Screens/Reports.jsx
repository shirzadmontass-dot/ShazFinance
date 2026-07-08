import Card from "../components/Card.jsx"

export default function Reports({ store, debtFreeDate, savingsGoalForecast }) {
  const incomeTotal = store.income.reduce((sum, i) => sum + i.amount, 0)
  const commitmentsTotal = store.commitments.reduce((sum, c) => sum + c.amount, 0)
  const leftover = incomeTotal - commitmentsTotal

  const wasted = store.commitments
    .filter(c => ["Wants", "Shopping", "Misc"].includes(c.category))
    .reduce((sum, c) => sum + c.amount, 0)

  const netWorth =
    store.savings.reduce((sum, s) => sum + s.balance, 0) +
    store.investments.reduce((sum, i) => sum + i.balance, 0) +
    leftover -
    store.debts.reduce((sum, d) => sum + d.balance, 0)

  const report = {
    incomeTotal,
    commitmentsTotal,
    leftover,
    wasted,
    netWorth,
    debtFreeDate: debtFreeDate(),
    depositForecast: savingsGoalForecast(20000),
    history: store.history
  }

  return (
    <div>
      <Card title="Monthly Report Preview">
        <pre style={{ whiteSpace: "pre-wrap", color: "white" }}>
{JSON.stringify(report, null, 2)}
        </pre>
      </Card>
    </div>
  )
}
