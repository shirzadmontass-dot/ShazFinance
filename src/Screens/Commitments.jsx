import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

import { computeMonthlyFigures } from "../utils/monthlyFigures.js"

export default function Commitments({ store, add, remove }) {
  if (!store) return null

  const commitments = store.commitments || []

  const manualTotalCommitments = commitments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const bankTransactions = store.bankTransactions || []
  const accountRoles = store.accountRoles || {}
  const hasBankData = bankTransactions.length > 0

  const monthly = hasBankData
    ? computeMonthlyFigures(bankTransactions, accountRoles)
    : null

  // Once a bank is linked, this reflects real recurring bills detected
  // from your transactions (or your tagged "Bills" account) rather than
  // a manually typed figure.
  const totalCommitments = hasBankData
    ? monthly.commitments
    : manualTotalCommitments

  const bankCommitmentTx = hasBankData
    ? monthly.commitmentTransactions || []
    : []

  // These now reflect real detected bills once a bank is linked, not just
  // manually added ones — falls back to manual-only when no bank data.
  const commitmentCount = hasBankData
    ? bankCommitmentTx.length
    : commitments.length

  const averageCommitment =
    commitmentCount > 0
      ? Math.round(totalCommitments / commitmentCount)
      : 0

  const highestCommitment = hasBankData
    ? bankCommitmentTx.length > 0
      ? Math.max(...bankCommitmentTx.map((t) => Math.abs(t.amount)))
      : 0
    : commitments.length > 0
    ? Math.max(...commitments.map((c) => Number(c.amount || 0)))
    : 0

  return (
    <Page title="Monthly Commitments">
      <HeroBanner
        title="Commitments"
        subtitle="Every recurring bill you're on the hook for each month."
      />

      <Grid>
        <StatCard
          title="Monthly Total"
          icon="💸"
          value={`£${totalCommitments.toLocaleString()}`}
          colour="var(--accent)"
          subtitle={
            hasBankData ? "Live from your bank this month" : "All commitments"
          }
        />

        <StatCard
          title="Commitments"
          icon="📋"
          value={commitmentCount}
          colour="var(--accent)"
          subtitle={hasBankData ? "Detected + manual" : "Manually added"}
        />

        <StatCard
          title="Average"
          icon="📊"
          value={`£${averageCommitment.toLocaleString()}`}
          colour="var(--accent)"
          subtitle="Per bill"
        />

        <StatCard
          title="Largest Bill"
          icon="🏆"
          value={`£${highestCommitment.toLocaleString()}`}
          colour="#EF4444"
          subtitle="Biggest commitment"
        />
      </Grid>

      <Card title="Your Commitments" icon="🧾">
        {commitments.length === 0 ? (
          <div style={{ color: "var(--subtext)" }}>
            No manual commitments have been added
            {hasBankData
              ? " — bills detected from your bank are already counted in the total above."
              : "."}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {commitments.map((item, index) => {
              const percentage =
                manualTotalCommitments > 0
                  ? (Number(item.amount) / manualTotalCommitments) * 100
                  : 0

              return (
                <div
                  key={index}
                  style={{
                    background: "#162032",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: 18
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 18
                        }}
                      >
                        {item.name}
                      </div>

                      <div
                        style={{
                          color: "var(--subtext)",
                          marginTop: 4
                        }}
                      >
                        £{Number(item.amount).toLocaleString()} / month
                      </div>
                    </div>

                    <button
                      onClick={() => remove("commitments", index)}
                      style={{
                        border: "none",
                        background: "#d32f2f",
                        color: "white",
                        borderRadius: 10,
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: "#243244",
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background:
                          "linear-gradient(135deg,#FF8A00,#FF3D7F)"
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {hasBankData && bankCommitmentTx.length > 0 && (
        <Card title="Detected from your bank" icon="🏦">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10
            }}
          >
            {bankCommitmentTx.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: "var(--subtext)" }}>
                    {t.date}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#EF4444" }}>
                  -£{Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Add Commitment" icon="➕">
        <div
          style={{ color: "var(--subtext)", fontSize: 13, marginBottom: 12 }}
        >
          {hasBankData
            ? "Use this for bills that don't go through your linked bank (cash, another account, etc.) — bills from your bank are already tracked automatically above."
            : "Add your bills manually until a bank is linked."}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value.trim()
            const amount = Number(e.target.amount.value)

            if (!name) return
            if (isNaN(amount)) return

            add("commitments", {
              name,
              amount
            })

            e.target.reset()
          }}
          style={{
            display: "grid",
            gap: 16
          }}
        >
          <input
            name="name"
            placeholder="Commitment Name"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="amount"
            type="number"
            placeholder="Monthly Amount"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: 12,
              padding: 15,
              cursor: "pointer",
              fontWeight: 700,
              color: "white",
              background:
                "linear-gradient(135deg,#FF8A00,#FF3D7F)"
            }}
          >
            Add Commitment
          </button>
        </form>
      </Card>
    </Page>
  )
}
