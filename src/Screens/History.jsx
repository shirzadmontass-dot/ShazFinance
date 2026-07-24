import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function History({ store, update, add, remove }) {
  if (!store) return null

  const history = store.history || []

  const totalLeftover = history.reduce(
    (sum, item) => sum + Number(item.leftover || 0),
    0
  )

  const totalDebtPaid = history.reduce(
    (sum, item) => sum + Number(item.debtPaid || 0),
    0
  )

  const averageLeftover =
    history.length > 0
      ? Math.round(totalLeftover / history.length)
      : 0

  return (
    <Page title="Financial History">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 24
        }}
      >
        <Card title="Months Recorded" icon="📅">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            {history.length}
          </div>
        </Card>

        <Card title="Total Left Over" icon="💰">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#4ADE80"
            }}
          >
            £{totalLeftover.toLocaleString()}
          </div>
        </Card>

        <Card title="Debt Paid" icon="💳">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#FF8A00"
            }}
          >
            £{totalDebtPaid.toLocaleString()}
          </div>
        </Card>

        <Card title="Average Left Over" icon="📊">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{averageLeftover.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card title="Monthly History" icon="🗓️">
        {history.length === 0 ? (
          <div style={{ color: "var(--subtext)" }}>
            No history has been recorded yet.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >
            {history.map((item, index) => (
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
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 16
                  }}
                >
                  {item.month}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 16
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        color: "var(--subtext)"
                      }}
                    >
                      Money Left Over
                    </label>

                    <input
                      type="number"
                      value={item.leftover}
                      onChange={(e) => {
                        const updated = [...history]
                        updated[index].leftover =
                          Number(e.target.value) || 0
                        update("history", updated)
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: 6,
                        color: "var(--subtext)"
                      }}
                    >
                      Debt Paid
                    </label>

                    <input
                      type="number"
                      value={item.debtPaid}
                      onChange={(e) => {
                        const updated = [...history]
                        updated[index].debtPaid =
                          Number(e.target.value) || 0
                        update("history", updated)
                      }}
                      style={{
                        width: "100%",
                        padding: 12,
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)"
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => remove("history", index)}
                  style={{
                    marginTop: 18,
                    border: "none",
                    background: "#d32f2f",
                    color: "white",
                    borderRadius: 10,
                    padding: "10px 18px",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  Remove Entry
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() =>
            add("history", {
              month: new Date().toLocaleString("default", {
                month: "long",
                year: "numeric"
              }),
              leftover: 0,
              debtPaid: 0
            })
          }
          style={{
            marginTop: 24,
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
          + Add History Entry
        </button>
      </Card>
    </Page>
  )
}