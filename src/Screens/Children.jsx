import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Children({ store, update }) {
  const children = store.children || []

  return (
    <Page title="Children Savings">
      <Card title="Junior ISA Balances" icon="🧒">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {children.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>No children added yet.</div>
          )}

          {children.map((child, index) => (
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
                <div style={{ fontSize: "16px", fontWeight: "600" }}>{child.name}</div>
                <div style={{ color: "var(--subtext)" }}>
                  £{child.balance}
                </div>
              </div>

              <button
                onClick={() => update("childrenRemove", index)}
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

      <Card title="Add Child" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const name = e.target.name.value
            const balance = Number(e.target.balance.value)
            if (!name || !balance) return
            update("childrenAdd", { name, balance })
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
            placeholder="Child name"
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
            placeholder="Junior ISA balance"
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
            Add Child
          </button>
        </form>
      </Card>
    </Page>
  )
}