import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Children({ store, update }) {
  if (!store) return null

  const children = store.children || []

  const totalSavings = children.reduce(
    (sum, child) => sum + Number(child.balance || 0),
    0
  )

  const averageSavings =
    children.length > 0
      ? Math.round(totalSavings / children.length)
      : 0

  const largestSavings =
    children.length > 0
      ? Math.max(...children.map((c) => Number(c.balance || 0)))
      : 0

  return (
    <Page title="Children's Savings">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 24
        }}
      >
        <Card title="Children" icon="👨‍👧‍👦">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            {children.length}
          </div>
        </Card>

        <Card title="Total Savings" icon="💰">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#4ADE80"
            }}
          >
            £{totalSavings.toLocaleString()}
          </div>
        </Card>

        <Card title="Average Balance" icon="📊">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{averageSavings.toLocaleString()}
          </div>
        </Card>

        <Card title="Largest Balance" icon="🏆">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800
            }}
          >
            £{largestSavings.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card title="Junior ISA Accounts" icon="🧒">
        {children.length === 0 ? (
          <div style={{ color: "var(--subtext)" }}>
            No children have been added.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {children.map((child, index) => {
              const percentage =
                totalSavings > 0
                  ? (Number(child.balance) / totalSavings) * 100
                  : 0

              return (
                <div
                  key={index}
                  style={{
                    background: "#162032",
                    border: "1px solid var(--border)",
                    borderRadius: 16,
                    padding: 18
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 18
                        }}
                      >
                        {child.name}
                      </div>

                      <div
                        style={{
                          color: "var(--subtext)",
                          marginTop: 4
                        }}
                      >
                        £{Number(child.balance).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const updated = [...children]
                        updated.splice(index, 1)
                        update("children", updated)
                      }}
                      style={{
                        border: "none",
                        background: "#d32f2f",
                        color: "white",
                        borderRadius: 10,
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: "#243244",
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background:
                          "linear-gradient(135deg,#4ADE80,#22C55E)"
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Card title="Add Child" icon="➕">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value.trim()
            const balance = Number(e.target.balance.value)

            if (!name) return
            if (isNaN(balance)) return

            update("children", [
              ...children,
              {
                name,
                balance
              }
            ])

            e.target.reset()
          }}
          style={{
            display: "grid",
            gap: 16
          }}
        >
          <input
            name="name"
            placeholder="Child's Name"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            name="balance"
            type="number"
            placeholder="Junior ISA Balance"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: 12,
              padding: 14,
              cursor: "pointer",
              fontWeight: 700,
              color: "white",
              background:
                "linear-gradient(135deg,#4ADE80,#22C55E)"
            }}
          >
            Add Child
          </button>
        </form>
      </Card>
    </Page>
  )
}