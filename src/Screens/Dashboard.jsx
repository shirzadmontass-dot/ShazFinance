import NumberCard from "../components/NumberCard.jsx"
import ChartCard from "../components/ChartCard.jsx"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

export default function Dashboard({ store }) {
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

  const lastMonthIncome = store.incomeLastMonth || 0
  const lastMonthDebt = store.debtLastMonth || debtTotal

  const incomeColor = () =>
    incomeTotal < lastMonthIncome ? "#f44336" :
    incomeTotal === lastMonthIncome ? "#ff9800" : "#4caf50"

  const commitmentsColor = () =>
    commitmentsTotal / incomeTotal > 0.6 ? "#f44336" :
    commitmentsTotal / incomeTotal > 0.4 ? "#ff9800" : "#4caf50"

  const leftoverColor = () =>
    leftover < 1000 ? "#f44336" :
    leftover < 2000 ? "#ff9800" : "#4caf50"

  const wastedColor = () =>
    wasted > 300 ? "#f44336" :
    wasted > 100 ? "#ff9800" : "#4caf50"

  const savingsColor = () =>
    savingsTotal < 10000 ? "#f44336" :
    savingsTotal < 20000 ? "#ff9800" : "#4caf50"

  const debtColor = () =>
    debtTotal > lastMonthDebt ? "#f44336" :
    debtTotal === lastMonthDebt ? "#ff9800" : "#4caf50"

  const depositColor = () =>
    depositTotal < 6000 ? "#f44336" :
    depositTotal < 18000 ? "#ff9800" : "#4caf50"

  const categoryPie = {
    labels: ["Income", "Commitments", "Leftover"],
    datasets: [
      {
        data: [incomeTotal, commitmentsTotal, leftover],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3"]
      }
    ]
  }

  const wastedPie = {
    labels: ["Wasted", "Actual Leftover"],
    datasets: [
      {
        data: [wasted, actualLeftover],
        backgroundColor: ["#ff9800", "#4caf50"]
      }
    ]
  }

  const savingsPie = {
    labels: ["Savings", "Debt"],
    datasets: [
      {
        data: [savingsTotal, debtTotal],
        backgroundColor: ["#00bcd4", "#e91e63"]
      }
    ]
  }

  const incomeTrend = {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Income",
        data: [500, 600, 550, 700],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76,175,80,0.3)"
      }
    ]
  }

  return (
    <div
      style={{
        flex: 1,
        padding: "30px",
        overflowY: "auto",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(8px)",
        borderRadius: "18px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
        margin: "20px"
      }}
    >

      {/* TOP 2x2 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px"
        }}
      >
        <NumberCard title="Income" value={incomeTotal} color={incomeColor()} />
        <NumberCard title="Commitments" value={commitmentsTotal} color={commitmentsColor()} />

        <NumberCard title="Leftover" value={leftover} color={leftoverColor()} />
        <NumberCard title="Wasted Money" value={wasted} color={wastedColor()} />
      </div>

      {/* SECOND 2x2 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <NumberCard title="Savings" value={savingsTotal} color={savingsColor()} />
        <NumberCard title="Debt" value={debtTotal} color={debtColor()} />

        <NumberCard title="Deposit" value={depositTotal} color={depositColor()} />
        <NumberCard title="Actual Leftover" value={actualLeftover} color={leftoverColor()} />
      </div>

      {/* CHARTS 2x2 GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <ChartCard title="Income vs Commitments Pie">
          <Pie data={categoryPie} />
        </ChartCard>

        <ChartCard title="Wasted vs Actual Leftover Pie">
          <Pie data={wastedPie} />
        </ChartCard>

        <ChartCard title="Savings vs Debt Pie">
          <Pie data={savingsPie} />
        </ChartCard>

        <ChartCard title="Income Trend">
          <Line data={incomeTrend} />
        </ChartCard>
      </div>

    </div>
  )
}
