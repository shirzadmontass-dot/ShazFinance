import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Deposit({ store, update }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if deposit is missing
  const deposit = typeof store.deposit === "number" ? store.deposit : 0

  return (
    <Page title="Deposit">

      <Card title="Current Deposit" icon="🏦">
        <div style={{ fontSize: "26px", fontWeight: "700" }}>
          £{deposit}
        </div>
        <div style={{ color: "var(--subtext)" }}>
          Your saved deposit amount
        </div>
      </Card>

      <Card title="Update Deposit" icon="✏️">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const value = Number(e.target.deposit.value)

            // ⭐ Safe validation
            if (isNaN(value)) return

            update("deposit", value)
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <input
            name="deposit"
            type="number"
            defaultValue={deposit}
            placeholder="Enter deposit amount"
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
            Save Deposit
          </button>
        </form>
      </Card>

    </Page>
  )
}