import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function History({ store, update, add, remove }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if history array is missing
  const history = store.history || []

  return (
    <Page title="History">

      <Card title="Monthly History" icon="📅">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          {history.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No history entries yet.
            </div>
          )}

          {history.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)"
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "10px"
                }}
              >
                {item.month}
              </div>

              {/* Update Leftover */}
              <label style={{ display: "block", marginBottom: "10px" }}>
                Leftover:
                <input
                  type="number"
                  value={item.leftover}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    if (isNaN(newValue)) return

                    // ⭐ Correct update pattern (no nested paths)
                    const updated = [...history]
                    updated[index].leftover = newValue
                    update("history", updated)
                  }}
                  style={{
                    marginLeft: "10px",
                    padding: "6px",
                    width: "150px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)"
                  }}
                />
              </label>

              {/* Update Debt Paid */}
              <label style={{ display: "block", marginBottom: "10px" }}>
                Debt Paid:
                <input
                  type="number"
                  value={item.debtPaid}
                  onChange={(e) => {
                    const newValue = Number(e.target.value)
                    if (isNaN(newValue)) return

                    const updated = [...history]
                    updated[index].debtPaid = newValue
                    update("history", updated)
                  }}
                  style={{
                    marginLeft: "10px",
                    padding: "6px",
                    width: "150px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)"
                  }}
                />
              </label>

              <button
                onClick={() => remove("history", index)}
                style={{
                  marginTop: "10px",
                  padding: "8px 14px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Remove Entry
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            add("history", {
              month: "New Month",
              leftover: 0,
              debtPaid: 0
            })
          }
          style={{
            marginTop: "20px",
            padding: "10px 16px",
            background: "var(--accent)",
            color: "black",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "700"
          }}
        >
          + Add History Entry
        </button>
      </Card>

    </Page>
  )
}