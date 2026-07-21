import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Leftover({ store }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Safe arrays
  const income = store.income || []
  const commitments = store.commitments || []

  // ⭐ Safe totals
  const incomeTotal =
    income.length > 0
      ? income.reduce((sum, i) => sum + (i.amount || 0), 0)
      : 0

  const commitmentsTotal =
    commitments.length > 0
      ? commitments.reduce((sum, c) => sum + (c.amount || 0), 0)
      : 0

  const leftover = incomeTotal - commitmentsTotal

  // ⭐ Safe wasted calculation
  const wasted =
    commitments.length > 0
      ? commitments
          .filter(c =>
            ["Wants", "Shopping", "Misc"].includes(c.category)
          )
          .reduce((sum, c) => sum + (c.amount || 0), 0)
      : 0

  const actualLeftover = leftover - wasted

  return (
    <Page title="Leftover">

      <Card title="Total Leftover" icon="💰">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{leftover}
        </div>
      </Card>

      <Card title="Wasted Money" icon="⚠️">
        <div
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--accent)"
          }}
        >
          £{wasted}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          (Wants, Shopping, Misc)
        </div>
      </Card>

      <Card title="Actual Leftover" icon="📊">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{actualLeftover}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          After removing wasted money
        </div>
      </Card>

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
            <span>£{incomeTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Commitments</span>
            <span>£{commitmentsTotal}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Leftover</span>
            <span>£{leftover}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Wasted</span>
            <span>£{wasted}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "700"
            }}
          >
            <span>Actual Leftover</span>
            <span>£{actualLeftover}</span>
          </div>
        </div>
      </Card>

    </Page>
  )
}