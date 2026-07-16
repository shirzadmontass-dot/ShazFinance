import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Commitments({ store, add, remove }) {
  const commitments = store.commitments || []
  const total = commitments.reduce((sum, c) => sum + c.amount, 0)

  return (
    <Page title="Commitments">
      <Card title="Total Commitments" icon="📄">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{total}
        </div>
      </Card>

      <Card title="Monthly Bills & Expenses" icon="💸">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {commitments.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>No commitments added yet.</div>
          )}

          {commitments.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)"
              }}
            >
              <div>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>{item.name}</div>
                <div style={{ color: "var(--subtext)" }}>
                  £{item.amount} — {item.category}
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
            const category = e.target.category.value
            if (!name || !amount || !category) return
            add("commitments", { name, amount, category })
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
            placeholder="Amount"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <select
            name="category"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          >
            <option value="">Select category</option>
            <option value="Needs">Needs</option>
            <option value="Wants">Wants</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Misc">Misc</option>
          </select>

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