import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Debt({ store, add, remove }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if debts array is missing
  const debts = store.debts || []

  // ⭐ Safe total
  const totalDebt = debts.length > 0
    ? debts.reduce((sum, d) => sum + (d.balance || 0), 0)
    : 0

  return (
    <Page title="Debt Overview">

      <Card title="Total Debt" icon="📉">
        <div style={{ fontSize: "28px", fontWeight: "700", color: "#D50000" }}>
          £{totalDebt}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Total outstanding debt across all accounts
        </div>
      </Card>

      <Card title="Debt Accounts" icon="💳">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          
          {debts.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No debt accounts added yet.
            </div>
          )}

          {debts.map((debt, index) => (
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
                  {debt.name}
                </div>
                <div style={{ color: "var(--subtext)" }}>
                  Balance: £{debt.balance}
                </div>
                <div style={{ color: "var(--subtext)" }}>
                  Min Payment: £{debt.minPayment}
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

      <Card title="Add Debt Account" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const balance = Number(e.target.balance.value)
            const minPayment = Number(e.target.minPayment.value)

            if (!name || isNaN(balance) || isNaN(minPayment)) return

            add("debts", { name, balance, minPayment })
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

          <input
            name="minPayment"
            type="number"
            placeholder="Minimum payment"
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
            Add Debt
          </button>
        </form>
      </Card>

    </Page>
  )
}