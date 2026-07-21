import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Planner({ store, add, remove, update }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if planner array is missing
  const planner = store.planner || []

  return (
    <Page title="Planner">

      <Card title="Monthly Planner" icon="📝">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          {planner.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No planner items yet.
            </div>
          )}

          {planner.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "var(--space-2)",
                background: "var(--bg)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)"
              }}
            >
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const updated = [...planner]
                  updated[index].text = e.target.value
                  update("planner", updated)
                }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  color: "var(--text)",
                  marginBottom: "10px"
                }}
              />

              <button
                onClick={() => remove("planner", index)}
                style={{
                  padding: "8px 14px",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => add("planner", { text: "New planner item" })}
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
          + Add Planner Item
        </button>
      </Card>

    </Page>
  )
}