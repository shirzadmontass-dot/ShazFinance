import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Investments({ store, add, remove }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if investments array is missing
  const investments = store.investments || []

  // ⭐ Safe total
  const total =
    investments.length > 0
      ? investments.reduce((sum, inv) => sum + (inv.balance || 0), 0)
      : 0

  return (
    <Page title="Investments">

      <Card title="Total Investments" icon="📈">
        <div style={{ fontSize: "22px", fontWeight: "700" }}>
          £{total}
        </div>
      </Card>

      <Card title="Investment Accounts" icon="💼">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>

          {investments.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No investments added yet.
            </div>
          )}

          {investments.map((item, index) => (
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
                  £{item.balance} — {item.type}
                </div>
              </div>

              <button
                onClick={() => remove("investments", index)}
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

      <Card title="Add Investment" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const balance = Number(e.target.balance.value)
            const type = e.target.type.value

            // ⭐ Safe validation (allows balance = 0)
            if (!name || isNaN(balance) || !type) return

            add("investments", { name, balance, type })
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
            placeholder="Investment name"
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
            <option value="Stocks">Stocks</option>
            <option value="Crypto">Crypto</option>
            <option value="ISA">ISA</option>
            <option value="Pension">Pension</option>
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
            Add Investment
          </button>
        </form>
      </Card>

    </Page>
  )
}