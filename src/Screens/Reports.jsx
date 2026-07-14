import Card from "../components/Card.jsx"

export default function Reports({ store, debtFreeDate, savingsGoalForecast }) {
  const income = store.income || []
  const commitments = store.commitments || []
  const savings = store.savings || []
  const investments = store.investments || []
  const debts = store.debts || []
  const history = store.history || []

  const incomeTotal = income.reduce((sum, i) => sum + (i.amount || 0), 0)
  const commitmentsTotal = commitments.reduce((sum, c) => sum + (c.amount || 0), 0)
  const leftover = incomeTotal - commitmentsTotal

  const wasted = commitments
    .filter(c => ["Wants", "Shopping", "Misc"].includes(c.category))
    .reduce((sum, c) => sum + (c.amount || 0), 0)

  const netWorth =
    savings.reduce((sum, s) => sum + (s.balance || 0), 0) +
    investments.reduce((sum, i) => sum + (i.balance || 0), 0) +
    leftover -
    debts.reduce((sum, d) => sum + (d.balance || 0), 0)

  const report = {
    incomeTotal,
    commitmentsTotal,
    leftover,
    wasted,
    netWorth,
    debtFreeDate: debtFreeDate ? debtFreeDate() : "N/A",
    depositForecast: savingsGoalForecast ? savingsGoalForecast(20000) : "N/A",
    history
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