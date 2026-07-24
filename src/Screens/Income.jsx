import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Income({ store, add, remove }) {
  if (!store) return null

  const income = store.income || []

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const averageIncome =
    income.length > 0
      ? Math.round(totalIncome / income.length)
      : 0

  const highestIncome =
    income.length > 0
      ? Math.max(...income.map((i) => Number(i.amount || 0)))
      : 0

  return (
    <Page title="Income Manager">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 24
        }}
      >
        <Card title="Monthly Income" icon="💷">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#4ADE80"
            }}
          >
            £{totalIncome.toLocaleString()}
          </div>
        </Card>

        <Card title="Income Sources" icon="📋">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            {income.length}
          </div>
        </Card>

        <Card title="Average Source" icon="📊">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{averageIncome.toLocaleString()}
          </div>
        </Card>

        <Card title="Highest Income" icon="🏆">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{highestIncome.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card title="Income Sources" icon="💼">
        {income.length === 0 ? (
          <div style={{ color: "var(--subtext)" }}>
            No income sources have been added.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {income.map((item, index) => {
              const percentage =
                totalIncome > 0
                  ? (Number(item.amount) / totalIncome) * 100
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
                      onClick={() => remove("income", index)}
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
                          "linear-gradient(135deg,#4ADE80,#22C55E)"
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="Add Income Source" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value.trim()
            const amount = Number(e.target.amount.value)

            if (!name) return
            if (isNaN(amount)) return

            add("income", {
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
            placeholder="Income Source"
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
                "linear-gradient(135deg,#4ADE80,#22C55E)"
            }}
          >
            Add Income
          </button>
        </form>
      </Card>
    </Page>
  )
}