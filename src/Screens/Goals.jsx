import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Goals({ store, add, remove, update }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Prevent crash if goals array is missing
  const goals = store.goals || []

  return (
    <Page title="Goals">

      <Card title="Your Goals" icon="🎯">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          {goals.length === 0 && (
            <div style={{ color: "var(--subtext)" }}>
              No goals added yet.
            </div>
          )}

          {goals.map((goal, index) => {
            const progress = Math.min(
              Math.round((goal.current / goal.target) * 100),
              100
            )

            return (
              <div
                key={index}
                style={{
                  padding: "var(--space-2)",
                  background: "var(--bg)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)"
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: "700" }}>
                  {goal.name}
                </div>

                <div style={{ color: "var(--subtext)", marginBottom: "10px" }}>
                  £{goal.current} / £{goal.target}
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "var(--border)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "10px"
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "var(--accent)"
                    }}
                  />
                </div>

                {/* Update Current Amount */}
                <label style={{ display: "block", marginBottom: "10px" }}>
                  Update Progress:
                  <input
                    type="number"
                    value={goal.current}
                    onChange={(e) => {
                      const newValue = Number(e.target.value)
                      if (isNaN(newValue)) return

                      // ⭐ Correct update pattern (your store does NOT support nested paths)
                      const updatedGoals = [...goals]
                      updatedGoals[index].current = newValue
                      update("goals", updatedGoals)
                    }}
                    style={{
                      marginLeft: "10px",
                      padding: "6px",
                      width: "150px",
                      borderRadius: "6px",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--text)"
                    }}
                  />
                </label>

                <button
                  onClick={() => remove("goals", index)}
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
                  Remove Goal
                </button>
              </div>
            )
          })}
        </div>
      </Card>

      <Card title="Add New Goal" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const target = Number(e.target.target.value)

            if (!name || isNaN(target)) return

            add("goals", { name, target, current: 0 })
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
            placeholder="Goal name"
            style={{
              padding: "var(--space-2)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="target"
            type="number"
            placeholder="Target amount"
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
            Add Goal
          </button>
        </form>
      </Card>

    </Page>
  )
}