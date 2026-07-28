import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Leftover({ store }) {
  if (!store) return null

  const income = store.income || []
  const commitments = store.commitments || []

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
          .filter((c) =>
            ["Wants", "Shopping", "Misc"].includes(c.category)
          )
          .reduce((sum, c) => sum + (c.amount || 0), 0)
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
          subtitle="Wants, shopping, misc"
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
