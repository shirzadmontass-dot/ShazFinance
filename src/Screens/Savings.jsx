import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Savings({ store, add, remove }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if savings array is missing
  const savings = store.savings || []

  // ⭐ Safe total
  const total =
    savings.length > 0
      ? savings.reduce((sum, s) => sum + (s.balance || 0), 0)
      : 0

  return (
    <Page title="Savings">

      <Card title="Total Savings" icon="💰">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{total}
        </div>
      </Card>

      <Card title="Savings Accounts" icon="🏦">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>

          {savings.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No savings added yet.
            </div>
          )}

          {savings.map((item, index) => (
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
                <div style={{ fontSize: "16px", fontWeight: "600" }}>
                  {item.name}
                </div>
                <div style={{ color: "var(--subtext)" }}>
                  £{item.balance}
                </div>
              </div>

              <button
                onClick={() => remove("savings", index)}
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

      <Card title="Add Savings" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const balance = Number(e.target.balance.value)

            // ⭐ Safe validation (allows balance = 0)
            if (!name || isNaN(balance)) return

            add("savings", { name, balance })
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
            placeholder="Savings name"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="balance"
            type="number"
            placeholder="Balance"
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
            Add Savings
          </button>
        </form>
      </Card>

    </Page>
  )
}