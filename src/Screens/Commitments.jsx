import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Commitments({ store, add, remove }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if commitments array is missing
  const commitments = store.commitments || []

  return (
    <Page title="Monthly Commitments">
      <Card title="Your Commitments" icon="📄">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          
          {commitments.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No commitments added yet.
            </div>
          )}

          {commitments.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                  {item.name}
                </div>
                <div style={{ color: "var(--subtext)" }}>
                  £{item.amount}
                </div>
              </div>

              <button
                onClick={() => remove("commitments", index)}
                style={{
                  background: "var(--primary)",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "var(--radius)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Add Commitment" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const name = e.target.name.value
            const amount = Number(e.target.amount.value)

            if (!name || isNaN(amount)) return

            add("commitments", { name, amount })
            e.target.reset()
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <input
            name="name"
            placeholder="Commitment name"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="amount"
            type="number"
            placeholder="Monthly amount"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <button
            type="submit"
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "10px",
              borderRadius: "var(--radius)",
              color: "black",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Add Commitment
          </button>
        </form>
      </Card>
    </Page>
  )
}