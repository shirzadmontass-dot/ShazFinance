import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Debt({ store, add, remove }) {
  const debts = store.debts || []
  const total = debts.reduce((sum, d) => sum + d.balance, 0)

  return (
    <Page title="Debt">
      <Card title="Total Debt" icon="💳">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{total}
        </div>
      </Card>

      <Card title="Debt Accounts" icon="📄">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {debts.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>No debt added yet.</div>
          )}

          {debts.map((item, index) => (
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
                  £{item.balance} — {item.type}
                </div>
              </div>

              <button
                onClick={() => remove("debts", index)}
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

      <Card title="Add Debt" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const name = e.target.name.value
            const balance = Number(e.target.balance.value)
            const type = e.target.type.value
            if (!name || !balance || !type) return
            add("debts", { name, balance, type })
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
            placeholder="Debt name"
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

          <select
            name="type"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          >
            <option value="">Select type</option>
            <option value="Loan">Loan</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Car Finance">Car Finance</option>
            <option value="Mortgage">Mortgage</option>
            <option value="Other">Other</option>
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
            Add Debt
          </button>
        </form>
      </Card>
    </Page>
  )
}