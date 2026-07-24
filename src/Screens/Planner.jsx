import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Planner({ store, add, remove, update }) {
  if (!store) return null

  const planner = store.planner || []
  const income = store.income || []
  const commitments = store.commitments || []
  const debts = store.debts || []
  const savings = store.savings || []

  const totalIncome = income.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const totalCommitments = commitments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )

  const totalDebtPayments = debts.reduce(
    (sum, item) => sum + Number(item.minPayment || 0),
    0
  )

  const totalSavings = savings.reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )

  const disposable =
    totalIncome - totalCommitments - totalDebtPayments

  const status =
    disposable > 500
      ? "On Track"
      : disposable >= 0
      ? "Needs Attention"
      : "Over Budget"

  const statusColour =
    disposable > 500
      ? "#22C55E"
      : disposable >= 0
      ? "#F59E0B"
      : "#EF4444"

  return (
    <Page title="Monthly Planner">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
          marginBottom: 24
        }}
      >
        <Card title="Income" icon="💷">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#4ADE80"
            }}
          >
            £{totalIncome.toLocaleString()}
          </div>
        </Card>

        <Card title="Bills" icon="💸">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#FF8A00"
            }}
          >
            £{(
              totalCommitments + totalDebtPayments
            ).toLocaleString()}
          </div>
        </Card>

        <Card title="Disposable" icon="💰">
          <div
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: disposable >= 0 ? "#4ADE80" : "#EF4444"
            }}
          >
            £{disposable.toLocaleString()}
          </div>
        </Card>

        <Card title="Status" icon="🚦">
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: statusColour
            }}
          >
            {status}
          </div>
        </Card>
      </div>

      <Card title="Financial Summary" icon="📊">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18
          }}
        >
          <div>
            <div
              style={{
                color: "var(--subtext)"
              }}
            >
              Monthly Income
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700
              }}
            >
              £{totalIncome.toLocaleString()}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "var(--subtext)"
              }}
            >
              Monthly Bills
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700
              }}
            >
              £{(
                totalCommitments + totalDebtPayments
              ).toLocaleString()}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "var(--subtext)"
              }}
            >
              Total Savings
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700
              }}
            >
              £{totalSavings.toLocaleString()}
            </div>
          </div>

          <div>
            <div
              style={{
                color: "var(--subtext)"
              }}
            >
              Money Left
            </div>

            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: disposable >= 0 ? "#4ADE80" : "#EF4444"
              }}
            >
              £{disposable.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      <Card title="Monthly Tasks" icon="📝">
        {planner.length === 0 ? (
          <div style={{ color: "var(--subtext)" }}>
            No planner items yet.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}
          >
            {planner.map((item, index) => (
              <div
                key={index}
                style={{
                  background: "#162032",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 16
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
                    padding: 14,
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--text)",
                    marginBottom: 12
                  }}
                />

                <button
                  onClick={() => remove("planner", index)}
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
            ))}
          </div>
        )}

        <button
          onClick={() =>
            add("planner", {
              text: "New planner task"
            })
          }
          style={{
            marginTop: 20,
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
          + Add Planner Task
        </button>
      </Card>
    </Page>
  )
}