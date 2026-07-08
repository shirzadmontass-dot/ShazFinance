import Card from "../components/Card.jsx"

export default function Tools({ store }) {
  const totalDebt = store.debts.reduce((sum, d) => sum + d.balance, 0)
  const monthlyPayment = store.debts.reduce((sum, d) => sum + d.minPayment, 0)

  const snowballMonths =
    monthlyPayment > 0 ? Math.ceil(totalDebt / monthlyPayment) : "No payments set"

  const leftover =
    store.income.reduce((sum, i) => sum + i.amount, 0) -
    store.commitments.reduce((sum, c) => sum + c.amount, 0)

  const savingsBoost = leftover > 0 ? leftover * 12 : 0

  return (
    <div>
      <Card title="Debt Snowball Calculator">
        Total Debt: £{totalDebt}<br />
        Monthly Payments: £{monthlyPayment}<br />
        Estimated Months: {snowballMonths}
      </Card>

      <Card title="Savings Boost Calculator">
        Monthly Leftover: £{leftover}<br />
        Yearly Boost: £{savingsBoost}
      </Card>
    </div>
  )
}
