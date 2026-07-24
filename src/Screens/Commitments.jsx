import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 24
        }}
      >
        <Card title="Monthly Total" icon="💸">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#FF8A00"
            }}
          >
            £{totalCommitments.toLocaleString()}
          </div>
        </Card>

        <Card title="Commitments" icon="📋">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            {commitments.length}
          </div>
        </Card>

        <Card title="Average" icon="📊">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{averageCommitment.toLocaleString()}
          </div>
        </Card>

        <Card title="Largest Bill" icon="🏆">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{highestCommitment.toLocaleString()}
          </div>
        </Card>
      </div>

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