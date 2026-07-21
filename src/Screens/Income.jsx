import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Income({ store, add, remove, update }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if income array is missing
  const income = store.income || []

  // ⭐ Safe total
  const totalIncome =
    income.length > 0
      ? income.reduce((sum, item) => sum + (item.amount || 0), 0)
      : 0

  return (
    <Page title="Income">

      <Card title="Total Monthly Income" icon="💼">
        <div style={{ fontSize: "28px", fontWeight: "700", color: "var(--accent)" }}>
          £{totalIncome}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Combined income from all sources
        </div>
      </Card>

      <Card title="Income Sources" icon="📄">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>

          {income.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No income sources added yet.
            </div>
          )}

          {income.map((item, index) => (
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
                onClick={() => remove("income", index)}
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

      <Card title="Add Income Source" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const amount = Number(e.target.amount.value)

            if (!name || isNaN(amount)) return

            add("income", { name, amount })
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
            placeholder="Income name"
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
            Add Income
          </button>
        </form>
      </Card>

    </Page>
  )
}