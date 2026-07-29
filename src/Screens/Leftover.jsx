import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

import { computeMonthlyFigures } from "../utils/monthlyFigures.js"
import { resolveCategory } from "../utils/categorize.js"

export default function Leftover({ store }) {
  if (!store) return null

  const manualIncome = store.income || []
  const manualCommitments = store.commitments || []

  const manualIncomeTotal = manualIncome.reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  )
  const manualCommitmentsTotal = manualCommitments.reduce(
    (sum, c) => sum + (c.amount || 0),
    0
  )

  const bankTransactions = store.bankTransactions || []
  const accountRoles = store.accountRoles || {}
  const categoryOverrides = store.categoryOverrides || {}
  const hasBankData = bankTransactions.length > 0

  const monthly = hasBankData
    ? computeMonthlyFigures(bankTransactions, accountRoles)
    : null

  const incomeTotal = hasBankData ? monthly.income : manualIncomeTotal
  const commitmentsTotal = hasBankData
    ? monthly.commitments
    : manualCommitmentsTotal

  const leftover = incomeTotal - commitmentsTotal

  // Wasted: real discretionary spend from your bank transactions (takeaways,
  // shopping, subscriptions etc.), same categorisation used across the app —
  // rather than a manual commitment-category guess.
  const wasted = hasBankData
    ? bankTransactions
        .filter((t) => t.amount < 0)
        .filter(
          (t) => resolveCategory(t, categoryOverrides) === "discretionary"
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    : 0

  const actualLeftover = leftover - wasted

  return (
    <Page title="Leftover">
      <HeroBanner
        title="Leftover"
        subtitle="What's actually left once the essentials are covered."
      />

      <Grid>
        <StatCard
          title="Total Leftover"
          icon="💰"
          value={`£${leftover.toLocaleString()}`}
          colour="var(--accent)"
          subtitle="Income minus commitments"
        />

        <StatCard
          title="Wasted Money"
          icon="⚠️"
          value={`£${wasted.toLocaleString()}`}
          colour="#F59E0B"
          subtitle="Non-essential spending"
        />

        <StatCard
          title="Actual Leftover"
          icon="📊"
          value={`£${actualLeftover.toLocaleString()}`}
          colour="#22C55E"
          subtitle="After removing wasted money"
        />
      </Grid>

      <Card title="Breakdown" icon="📄">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Income</span>
            <span>£{incomeTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Commitments</span>
            <span>£{commitmentsTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Leftover</span>
            <span>£{leftover.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Wasted</span>
            <span>£{wasted.toLocaleString()}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "700"
            }}
          >
            <span>Actual Leftover</span>
            <span>£{actualLeftover.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </Page>
  )
}
