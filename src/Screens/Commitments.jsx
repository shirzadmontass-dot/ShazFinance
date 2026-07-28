import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Commitments({ store, add, remove }) {
  if (!store) return null

  const commitments = store.commitments || []

  const totalCommitments = commitments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const averageCommitment =
    commitments.length > 0
      ? Math.round(totalCommitments / commitments.length)
      : 0

  const highestCommitment =
    commitments.length > 0
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
          subtitle="All commitments"
        />

        <StatCard
          title="Commitments"
          icon="📋"
          value={commitments.length}
          colour="var(--accent)"
          subtitle="Active bills"
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
            No commitments have been added.
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
                totalCommitments > 0
                  ? (Number(item.amount) / totalCommitments) * 100
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

      <Card title="Add Commitment" icon="➕">
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
              padding: 14,
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