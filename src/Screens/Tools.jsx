import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Tools({ store, add, update }) {
  const history = store.history || []
  const commitments = store.commitments || []
  const leftover = store.leftover || 0

  // Loan Calculator
  const calculateLoan = (amount, rate, years) => {
    const monthlyRate = rate / 100 / 12
    const months = years * 12
    const payment =
      (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    return Math.round(payment)
  }

  // Savings Growth Calculator
  const calculateSavings = (initial, monthly, rate, years) => {
    const months = years * 12
    const monthlyRate = rate / 100 / 12
    let total = initial
    for (let i = 0; i < months; i++) {
      total += monthly
      total += total * monthlyRate
    }
    return Math.round(total)
  }

  // Debt Payoff Calculator
  const calculateDebtMonths = (balance, monthlyPayment, rate) => {
    const monthlyRate = rate / 100 / 12
    let months = 0
    let remaining = balance

    while (remaining > 0 && months < 600) {
      remaining += remaining * monthlyRate
      remaining -= monthlyPayment
      months++
    }

    return remaining <= 0 ? months : "Too low payment"
  }

  // Monthly Rollover
  const rolloverMonth = () => {
    const newMonth = {
      month: `Month ${history.length + 1}`,
      leftover: leftover,
      debtPaid: 0
    }

    add("history", newMonth)
    update("leftover", 0)
  }

  return (
    <Page title="Tools">
      {/* Loan Calculator */}
      <Card title="Loan Calculator" icon="💳">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const amount = Number(e.target.amount.value)
            const rate = Number(e.target.rate.value)
            const years = Number(e.target.years.value)
            const result = calculateLoan(amount, rate, years)
            alert(`Monthly Payment: £${result}`)
          }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
        >
          <input name="amount" type="number" placeholder="Loan amount" />
          <input name="rate" type="number" placeholder="Interest rate (%)" />
          <input name="years" type="number" placeholder="Years" />
          <button type="submit" style={{ padding: "10px", borderRadius: "var(--radius)" }}>
            Calculate
          </button>
        </form>
      </Card>

      {/* Savings Calculator */}
      <Card title="Savings Growth" icon="💰">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const initial = Number(e.target.initial.value)
            const monthly = Number(e.target.monthly.value)
            const rate = Number(e.target.rate.value)
            const years = Number(e.target.years.value)
            const result = calculateSavings(initial, monthly, rate, years)
            alert(`Future Value: £${result}`)
          }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
        >
          <input name="initial" type="number" placeholder="Initial amount" />
          <input name="monthly" type="number" placeholder="Monthly deposit" />
          <input name="rate" type="number" placeholder="Interest rate (%)" />
          <input name="years" type="number" placeholder="Years" />
          <button type="submit" style={{ padding: "10px", borderRadius: "var(--radius)" }}>
            Calculate
          </button>
        </form>
      </Card>

      {/* Debt Payoff Calculator */}
      <Card title="Debt Payoff" icon="📉">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const balance = Number(e.target.balance.value)
            const monthly = Number(e.target.monthly.value)
            const rate = Number(e.target.rate.value)
            const result = calculateDebtMonths(balance, monthly, rate)
            alert(`Months to Payoff: ${result}`)
          }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
        >
          <input name="balance" type="number" placeholder="Debt balance" />
          <input name="monthly" type="number" placeholder="Monthly payment" />
          <input name="rate" type="number" placeholder="Interest rate (%)" />
          <button type="submit" style={{ padding: "10px", borderRadius: "var(--radius)" }}>
            Calculate
          </button>
        </form>
      </Card>

      {/* Monthly Rollover */}
      <Card title="Monthly Rollover" icon="🔄">
        <div style={{ marginBottom: "10px", color: "var(--subtext)" }}>
          This will create a new month in History and move your leftover.
        </div>

        <button
          onClick={rolloverMonth}
          style={{
            background: "var(--accent)",
            padding: "12px",
            borderRadius: "var(--radius)",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Roll Over to New Month
        </button>
      </Card>
    </Page>
  )
}